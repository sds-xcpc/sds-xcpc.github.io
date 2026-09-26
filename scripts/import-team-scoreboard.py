import argparse
import datetime
import json
import math
from html.parser import HTMLParser
from pathlib import Path
import re
import sys


PROJECT = Path(__file__).resolve().parent.parent


class ScoreboardParser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.in_table = False
        self.rows = []
        self.row = None
        self.cell = None
        self.in_members = False
        self.in_rating_info = False
        self.rating_info = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'p' and attrs.get('id') == 'rating-info':
            self.in_rating_info = True
        if tag == 'table' and attrs.get('id') == 'table':
            self.in_table = True
        if not self.in_table:
            return
        if tag == 'tr':
            self.row = []
        elif tag in ('th', 'td'):
            self.cell = {'attrs': attrs, 'fragments': [], 'members': []}
        elif tag == 'small' and self.cell is not None:
            self.in_members = True
        elif tag == 'br' and self.cell is not None:
            self.cell['fragments'].append('\n')

    def handle_data(self, data):
        if self.in_rating_info:
            self.rating_info.append(data)
        if self.cell is not None:
            self.cell['fragments'].append(data)
            if self.in_members:
                self.cell['members'].append(data)

    def handle_endtag(self, tag):
        if tag == 'p':
            self.in_rating_info = False
        if not self.in_table:
            return
        if tag == 'small':
            self.in_members = False
        elif tag in ('th', 'td') and self.cell is not None:
            self.cell['text'] = ''.join(self.cell['fragments']).strip()
            self.row.append(self.cell)
            self.cell = None
        elif tag == 'tr' and self.row is not None:
            self.rows.append(self.row)
            self.row = None
        elif tag == 'table':
            self.in_table = False


def parse_scoreboard(html, roster, title, date, slug, source_name, short_title=None, supplement=None, excluded_team_ids=None):
    datetime.date.fromisoformat(date)
    if not re.fullmatch(r'[a-z0-9]+(?:-[a-z0-9]+)*', slug):
        raise ValueError('Contest id must be a lowercase URL slug.')
    parser = ScoreboardParser()
    parser.feed(html)
    if len(parser.rows) < 2:
        raise ValueError('No populated table with id="table" found.')
    header, *rows = parser.rows
    if [cell['text'] for cell in header[:3]] != ['Rank.', 'Username', 'Rating']:
        raise ValueError('Unexpected scoreboard columns.')
    if [cell['text'] for cell in header[-3:]] != ['Solved', 'Penalty', 'Dirt']:
        raise ValueError('Unexpected scoreboard totals.')
    problems = []
    for cell in header[3:-3]:
        match = re.fullmatch(r'([A-Z])\s+(\d+)/(\d+)', cell['text'])
        if not match:
            raise ValueError(f"Invalid problem heading: {cell['text']!r}")
        label, accepted, submissions = match.groups()
        problems.append({'label': label, 'accepted': int(accepted), 'submissions': int(submissions)})

    teams = {team['qojUsername'].casefold(): team for team in roster}
    if len(teams) != len(roster) or len({team['id'] for team in roster}) != len(roster):
        raise ValueError('Duplicate team id or QOJ username in the team roster.')
    excluded_team_ids = set(excluded_team_ids or [])
    unknown_exclusions = excluded_team_ids - {team['id'] for team in roster}
    if unknown_exclusions:
        raise ValueError(f'Unknown excluded team ids: {sorted(unknown_exclusions)}.')
    formula = rows[0][2]['attrs'].get('title', '')
    match = re.search(r'\d+\s*/\s*(\d+)\s*\u00d7\s*\((\d+)\s*[\u2212-]', formula)
    if match:
        top_solved, source_total_teams = map(int, match.groups())
        if supplement and (top_solved, source_total_teams) != (supplement['topSolved'], supplement['sourceTotalTeams']):
            raise ValueError('Supplement disagrees with source rating metadata.')
    elif supplement:
        top_solved = supplement['topSolved']
        source_total_teams = supplement['sourceTotalTeams']
        source_population = re.search(r'n\s*=\s*(\d+)', ''.join(parser.rating_info))
        if not source_population or int(source_population.group(1)) != source_total_teams:
            raise ValueError('Supplement disagrees with source population.')
    else:
        raise ValueError('Missing original scoreboard population in the rating formula.')
    extra_rows = supplement.get('extraRows', []) if supplement else []
    extra_ranks = [entry['rank'] for entry in extra_rows]
    total_teams = source_total_teams + len(extra_rows)
    if top_solved <= 0 or total_teams <= 0:
        raise ValueError('Rating denominator must be positive.')
    if len(set(extra_ranks)) != len(extra_ranks) or any(not 1 <= rank <= total_teams for rank in extra_ranks):
        raise ValueError('Invalid supplement ranks.')

    standings = []
    seen = set()
    for row in rows:
        if len(row) != len(header):
            raise ValueError('Scoreboard row does not match its column headings.')
        username = next(fragment.strip() for fragment in row[1]['fragments'] if fragment.strip())
        team = teams.get(username.casefold())
        if team is None:
            raise ValueError(f'Unknown QOJ username: {username}. Add it to training-teams.json first.')
        if team['id'] in seen:
            raise ValueError(f'Duplicate result for {username}.')
        seen.add(team['id'])
        source_members = [name.strip() for name in ''.join(row[1]['members']).strip('() ').split(',')]
        if source_members != team['members']:
            print(f"Member mismatch for {username}: {source_members}; displaying canonical roster {team['members']}.", file=sys.stderr)
        source_rank = int(row[0]['text'])
        rank = source_rank + sum(extra_rank <= source_rank for extra_rank in extra_ranks)
        solved = int(row[-3]['text'])
        if not 1 <= rank <= total_teams or not 0 <= solved <= min(top_solved, len(problems)):
            raise ValueError(f'Invalid rank or solved count for {username}.')
        expected = round(solved / top_solved * (total_teams - rank + 1) / total_teams * 200, 1)
        source_rating = row[2]['text']
        if source_rating not in ('-', '\u2014'):
            rating = float(source_rating)
            if not math.isfinite(rating) or not math.isclose(rating, expected, abs_tol=1e-8):
                raise ValueError(f'Rating mismatch for {username}: {rating} vs {expected}.')
        elif not supplement:
            raise ValueError(f'Missing rating for {username}.')
        cells = []
        for cell in row[3:-3]:
            status = next((item for item in cell['attrs'].get('class', '').split() if item in ('accepted', 'rejected', 'pending')), 'empty')
            lines = [line.strip() for line in cell['text'].splitlines() if line.strip()]
            cells.append({'status': status, 'result': lines[0], 'time': lines[1] if len(lines) > 1 else ''})
        if sum(cell['status'] == 'accepted' for cell in cells) != solved:
            raise ValueError(f'Solved total disagrees with problem cells for {username}.')
        standings.append({
            'teamId': team['id'], 'username': username, 'sourceMembers': source_members,
            'rank': rank, 'rating': expected,
            **({'countsForRating': False} if team['id'] in excluded_team_ids else {}),
            'ratingFormula': (f'{solved} / {top_solved} \u00d7 ({total_teams} \u2212 {rank} + 1) / {total_teams} \u00d7 200 = {expected}'
                              if supplement else row[2]['attrs'].get('title', '')),
            'problems': cells, 'solved': solved, 'penalty': int(row[-2]['text']), 'dirt': row[-1]['text'],
        })
    for extra in extra_rows:
        username = extra['username']
        team = teams.get(username.casefold())
        if team is None or team['id'] in seen:
            raise ValueError(f'Unknown or duplicate supplemental team: {username}.')
        if len(extra['problems']) != len(problems):
            raise ValueError(f'Supplemental problem count mismatch for {username}.')
        cells = []
        wrong_on_solved = 0
        penalty = 0
        for heading, problem in zip(problems, extra['problems']):
            result = problem['result']
            time = problem.get('time', '')
            if re.fullmatch(r'\+\d*', result) and re.fullmatch(r'\d+:[0-5]\d', time):
                status = 'accepted'
                wrong = int(result[1:] or 0)
                hours, minutes = map(int, time.split(':'))
                penalty += hours * 60 + minutes + wrong * 20
                wrong_on_solved += wrong
                heading['accepted'] += 1
                heading['submissions'] += wrong + 1
            elif result == '-' and not time:
                status = 'empty'
            else:
                raise ValueError(f'Invalid supplemental problem result for {username}: {result} {time}.')
            cells.append({'status': status, 'result': result, 'time': time})
        solved = sum(cell['status'] == 'accepted' for cell in cells)
        if solved != extra['solved'] or penalty != extra['penalty']:
            raise ValueError(f'Supplemental totals disagree with problem cells for {username}.')
        rank = extra['rank']
        rating = round(solved / top_solved * (total_teams - rank + 1) / total_teams * 200, 1)
        dirt = f'{math.floor(100 * wrong_on_solved / (solved + wrong_on_solved))}%'
        standings.append({
            'teamId': team['id'], 'username': username, 'sourceMembers': team['members'],
            'rank': rank, 'rating': rating,
            **({'countsForRating': False} if team['id'] in excluded_team_ids else {}),
            'ratingFormula': f'{solved} / {top_solved} \u00d7 ({total_teams} \u2212 {rank} + 1) / {total_teams} \u00d7 200 = {rating}',
            'problems': cells, 'solved': solved, 'penalty': penalty, 'dirt': dirt,
        })
    standings.sort(key=lambda entry: entry['rank'])
    return {
        'id': slug, 'title': title, 'shortTitle': short_title or title, 'date': date, 'sourceSnapshot': source_name,
        'topSolved': top_solved, 'totalTeams': total_teams,
        'problems': problems, 'standings': standings,
    }


def main():
    arguments = argparse.ArgumentParser(description='Import an offline QOJ training scoreboard without executing its HTML.')
    arguments.add_argument('source', type=Path)
    arguments.add_argument('--title', required=True)
    arguments.add_argument('--short-title')
    arguments.add_argument('--date', required=True)
    arguments.add_argument('--id', required=True)
    arguments.add_argument('--supplement', type=Path)
    arguments.add_argument('--exclude-team', action='append', default=[])
    args = arguments.parse_args()
    roster = json.loads((PROJECT / 'src/data/training-teams.json').read_text(encoding='utf-8'))
    supplement = json.loads(args.supplement.read_text(encoding='utf-8')) if args.supplement else None
    contest = parse_scoreboard(
        args.source.read_text(encoding='utf-8-sig'), roster, args.title, args.date, args.id,
        args.source.name, args.short_title, supplement, args.exclude_team,
    )
    output = PROJECT / 'src/data/team-contests' / f'{args.id}.json'
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(contest, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(f"Imported {len(contest['standings'])} teams and {len(contest['problems'])} problems -> {output}")


if __name__ == '__main__':
    main()
