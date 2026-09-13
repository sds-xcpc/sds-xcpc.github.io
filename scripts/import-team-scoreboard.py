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

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
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
        if self.cell is not None:
            self.cell['fragments'].append(data)
            if self.in_members:
                self.cell['members'].append(data)

    def handle_endtag(self, tag):
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


def parse_scoreboard(html, roster, title, date, slug, source_name, short_title=None):
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
    formula = rows[0][2]['attrs'].get('title', '')
    match = re.search(r'\d+\s*/\s*(\d+)\s*\u00d7\s*\((\d+)\s*[\u2212-]', formula)
    if not match:
        raise ValueError('Missing original scoreboard population in the rating formula.')
    top_solved, total_teams = map(int, match.groups())
    if top_solved <= 0 or total_teams <= 0:
        raise ValueError('Rating denominator must be positive.')

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
        rank = int(row[0]['text'])
        rating = float(row[2]['text'])
        solved = int(row[-3]['text'])
        if not 1 <= rank <= total_teams or not 0 <= solved <= min(top_solved, len(problems)):
            raise ValueError(f'Invalid rank or solved count for {username}.')
        expected = round(solved / top_solved * (total_teams - rank + 1) / total_teams * 200, 1)
        if not math.isfinite(rating) or not math.isclose(rating, expected, abs_tol=1e-8):
            raise ValueError(f'Rating mismatch for {username}: {rating} vs {expected}.')
        cells = []
        for cell in row[3:-3]:
            status = next((item for item in cell['attrs'].get('class', '').split() if item in ('accepted', 'rejected', 'pending')), 'empty')
            lines = [line.strip() for line in cell['text'].splitlines() if line.strip()]
            cells.append({'status': status, 'result': lines[0], 'time': lines[1] if len(lines) > 1 else ''})
        if sum(cell['status'] == 'accepted' for cell in cells) != solved:
            raise ValueError(f'Solved total disagrees with problem cells for {username}.')
        standings.append({
            'teamId': team['id'], 'username': username, 'sourceMembers': source_members,
            'rank': rank, 'rating': rating, 'ratingFormula': row[2]['attrs'].get('title', ''),
            'problems': cells, 'solved': solved, 'penalty': int(row[-2]['text']), 'dirt': row[-1]['text'],
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
    args = arguments.parse_args()
    roster = json.loads((PROJECT / 'src/data/training-teams.json').read_text(encoding='utf-8'))
    contest = parse_scoreboard(args.source.read_text(encoding='utf-8-sig'), roster, args.title, args.date, args.id, args.source.name, args.short_title)
    output = PROJECT / 'src/data/team-contests' / f'{args.id}.json'
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(contest, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(f"Imported {len(contest['standings'])} teams and {len(contest['problems'])} problems -> {output}")


if __name__ == '__main__':
    main()
