import argparse
import gzip
import json
import math
from pathlib import Path
from urllib.request import urlopen


PROJECT = Path(__file__).resolve().parent.parent
COMPETITION_ID = '2099750481526394880'
SOURCE_URL = f'https://pintia.cn/rankings/{COMPETITION_ID}'
API_URL = f'https://pintia.cn/api/competitions/{COMPETITION_ID}/xcpc-rankings/public'
SNAPSHOT = PROJECT / 'resources/training-scoreboards/pintia-ccpc-online-20260919.json.gz'
OUTPUT = PROJECT / 'src/data/team-contests/ccpc-online-20260919.json'
FIRST_CONTEST = PROJECT / 'src/data/team-contests/xix-gp-of-korea.json'

TEAM_IDS_BY_FID = {
    '42': 'thoughts-everyone',
    '43': 'mynoghra',
    '40': 'easons-milk-dragon',
    '37': 'gather-and-scatter',
    '41': 'beyond-the-equation',
    '39': 'human-verification',
    '16': 'team-accept',
    '13': 'slay-the-judge',
    '17': 'pear-money-team',
    '2': 'meowfia',
}


def minute_time(minutes):
    return f'{minutes // 60}:{minutes % 60:02d}'


def compact_payload(payload):
    competition = payload['competitionBasicInfo']
    source = payload['xcpcRankings']
    rankings = []
    for entry in source['rankings']:
        fid = entry.get('teamFid')
        reduced = {
            'solvedCount': entry['solvedCount'],
            'teamInfo': {'excluded': entry['teamInfo']['excluded']},
        }
        if fid in TEAM_IDS_BY_FID:
            reduced.update({
                'teamFid': fid,
                'rank': entry['rank'],
                'solvingTime': entry['solvingTime'],
                'detailsByProblemSetProblemId': entry['detailsByProblemSetProblemId'],
            })
            reduced['teamInfo']['schoolName'] = entry['teamInfo']['schoolName']
        rankings.append(reduced)
    return {
        'competitionBasicInfo': {
            key: competition[key] for key in ('id', 'name', 'publicRanking', 'endAt')
        },
        'xcpcRankings': {
            'rankings': rankings,
            'problemInfoByProblemSetProblemId': {
                problem_id: {key: info[key] for key in ('label', 'acceptCount', 'submitCount')}
                for problem_id, info in source['problemInfoByProblemSetProblemId'].items()
            },
        },
    }


def parse_scoreboard(payload, roster, first_contest):
    competition = payload['competitionBasicInfo']
    if competition['id'] != COMPETITION_ID or competition['name'] != '2026年CCPC网络预选赛':
        raise ValueError('Unexpected Pintia competition.')
    if not competition['publicRanking'] or competition['endAt'] != '2026-09-19T10:00:00Z':
        raise ValueError('The public competition results are not final.')

    source = payload['xcpcRankings']
    rankings = source['rankings']
    official = [entry for entry in rankings if not entry['teamInfo']['excluded']]
    total_teams = len(official)
    top_solved = max(entry['solvedCount'] for entry in official)
    if total_teams == 0 or top_solved == 0:
        raise ValueError('Empty official rankings.')

    problem_pairs = sorted(
        source['problemInfoByProblemSetProblemId'].items(),
        key=lambda item: item[1]['label'],
    )
    problems = [
        {'label': info['label'], 'accepted': info['acceptCount'], 'submissions': info['submitCount']}
        for _, info in problem_pairs
    ]
    if [problem['label'] for problem in problems] != [chr(code) for code in range(ord('A'), ord('O'))]:
        raise ValueError('Unexpected Pintia problem set.')

    roster_by_id = {team['id']: team for team in roster}
    first_ratings = {entry['teamId']: entry['rating'] for entry in first_contest['standings']}
    if len(roster_by_id) != len(roster) or set(roster_by_id) != set(TEAM_IDS_BY_FID.values()):
        raise ValueError('Team roster does not match the expected ten teams.')

    standings = []
    seen = set()
    for entry in official:
        fid = entry.get('teamFid')
        if fid not in TEAM_IDS_BY_FID:
            continue
        team_id = TEAM_IDS_BY_FID[fid]
        info = entry['teamInfo']
        if fid in seen or info['schoolName'] != '香港中文大学（深圳）':
            raise ValueError(f'Unexpected identity for Pintia team {fid}.')
        seen.add(fid)
        rank = entry['rank']
        solved = entry['solvedCount']
        if not 1 <= rank <= total_teams or not 0 <= solved <= top_solved:
            raise ValueError(f'Invalid rank or solved count for Pintia team {fid}.')
        rating = round(solved / top_solved * (total_teams - rank + 1) / total_teams * 200, 1)
        if not math.isfinite(rating):
            raise ValueError(f'Invalid rating for Pintia team {fid}.')
        if team_id == 'human-verification' and rating < first_ratings[team_id]:
            continue

        cells = []
        accepted_submissions = []
        for problem_id, _ in problem_pairs:
            detail = entry['detailsByProblemSetProblemId'].get(problem_id)
            if detail is None:
                cells.append({'status': 'empty', 'result': '-', 'time': ''})
                continue
            submissions = detail['validSubmitCount']
            if detail['acceptTime'] >= 0:
                if submissions < 1:
                    raise ValueError(f'Accepted problem without a submission for Pintia team {fid}.')
                accepted_submissions.append(submissions)
                cells.append({
                    'status': 'accepted',
                    'result': f'+{submissions - 1}',
                    'time': minute_time(detail['acceptTime']),
                })
            else:
                cells.append({
                    'status': 'rejected' if submissions > 0 else 'empty',
                    'result': f'+{submissions}' if submissions > 0 else '-',
                    'time': minute_time(detail['lastSubmitAt']) if submissions > 0 else '',
                })
        if sum(cell['status'] == 'accepted' for cell in cells) != solved:
            raise ValueError(f'Problem results disagree with solved count for Pintia team {fid}.')
        total_accepted_submissions = sum(accepted_submissions)
        dirt = f'{100 * (total_accepted_submissions - solved) // total_accepted_submissions}%' if total_accepted_submissions else '-'
        standings.append({
            'teamId': team_id,
            'username': roster_by_id[team_id]['name'],
            'rank': rank,
            'rating': rating,
            'ratingFormula': f'{solved} / {top_solved} × ({total_teams} − {rank} + 1) / {total_teams} × 200',
            'problems': cells,
            'solved': solved,
            'penalty': entry['solvingTime'],
            'dirt': dirt,
        })
    if seen != set(TEAM_IDS_BY_FID):
        raise ValueError(f'Missing Pintia teams: {sorted(set(TEAM_IDS_BY_FID) - seen)}')
    standings.sort(key=lambda row: row['rank'])
    return {
        'id': 'ccpc-online-20260919',
        'title': competition['name'],
        'shortTitle': 'CCPC Online',
        'date': '2026-09-19',
        'sourceUrl': SOURCE_URL,
        'sourceSnapshot': SNAPSHOT.name,
        'topSolved': top_solved,
        'totalTeams': total_teams,
        'problems': problems,
        'standings': standings,
    }


def main():
    parser = argparse.ArgumentParser(description='Import the public 2026 CCPC Online Pintia results.')
    parser.add_argument('--refresh', action='store_true', help='Download a new source snapshot before importing.')
    args = parser.parse_args()
    if args.refresh or not SNAPSHOT.exists():
        with urlopen(API_URL, timeout=30) as response:
            raw = response.read()
        if raw.startswith(b'\x1f\x8b'):
            raw = gzip.decompress(raw)
        payload = json.loads(raw)
    else:
        with gzip.open(SNAPSHOT, 'rt', encoding='utf-8') as snapshot:
            payload = json.load(snapshot)
    payload = compact_payload(payload)
    SNAPSHOT.parent.mkdir(parents=True, exist_ok=True)
    with gzip.open(SNAPSHOT, 'wt', encoding='utf-8') as snapshot:
        json.dump(payload, snapshot, ensure_ascii=False, separators=(',', ':'))
    roster = json.loads((PROJECT / 'src/data/training-teams.json').read_text(encoding='utf-8'))
    first = json.loads(FIRST_CONTEST.read_text(encoding='utf-8'))
    contest = parse_scoreboard(payload, roster, first)
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(json.dumps(contest, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(f"Imported {len(contest['standings'])} teams, {len(contest['problems'])} problems, n={contest['totalTeams']} -> {OUTPUT}")


if __name__ == '__main__':
    main()
