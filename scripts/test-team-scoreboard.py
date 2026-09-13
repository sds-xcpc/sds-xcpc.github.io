import importlib.util
import json
from pathlib import Path
import unittest


PROJECT = Path(__file__).resolve().parent.parent
spec = importlib.util.spec_from_file_location('scoreboard_import', PROJECT / 'scripts/import-team-scoreboard.py')
importer = importlib.util.module_from_spec(spec)
spec.loader.exec_module(importer)


class TeamScoreboardTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.html = (PROJECT / 'resources/training-scoreboards/qoj4114-20260913.html').read_text(encoding='utf-8')
        cls.roster = json.loads((PROJECT / 'src/data/training-teams.json').read_text(encoding='utf-8'))

    def parse(self, html=None, slug='xix-gp-of-korea', date='2026-09-13'):
        return importer.parse_scoreboard(
            self.html if html is None else html, self.roster,
            'XIX Open Cup named after E.V. Pankratiev, Grand Prix of Korea',
            date, slug, 'qoj4114-20260913.html', 'XIX Gp of Korea',
        )

    def test_generated_file_matches_source(self):
        saved = json.loads((PROJECT / 'src/data/team-contests/xix-gp-of-korea.json').read_text(encoding='utf-8'))
        self.assertEqual(self.parse(), saved)

    def test_all_ratings_and_memberships(self):
        contest = self.parse()
        self.assertEqual(len(contest['standings']), 10)
        self.assertEqual(len(contest['problems']), 13)
        self.assertEqual((contest['topSolved'], contest['totalTeams']), (13, 105))
        self.assertEqual({row['teamId']: row['rating'] for row in contest['standings']}, {
            'thoughts-everyone': 190.5, 'mynoghra': 149.9, 'easons-milk-dragon': 145.1,
            'beyond-the-equation': 97.6, 'gather-and-scatter': 35.2, 'slay-the-judge': 34.3,
            'human-verification': 33.4, 'pear-money-team': 20.5, 'team-accept': 8.2, 'meowfia': 7.0,
        })
        self.assertEqual(sum(team['status'] == '正式队伍' for team in self.roster), 6)
        self.assertEqual(sum(team['status'] == '候选队伍' for team in self.roster), 4)
        accept = next(team for team in self.roster if team['id'] == 'team-accept')
        self.assertEqual(accept['members'][0], '刘翀')

    def test_problem_results_and_original_rank(self):
        contest = self.parse()
        thoughts = contest['standings'][0]
        self.assertEqual((thoughts['rank'], thoughts['solved'], thoughts['penalty']), (6, 13, 1996))
        self.assertEqual(thoughts['problems'][9], {'status': 'accepted', 'result': '+5', 'time': '3:46'})
        slay = next(row for row in contest['standings'] if row['teamId'] == 'slay-the-judge')
        self.assertEqual(slay['problems'][4], {'status': 'rejected', 'result': '-6', 'time': '4:59'})

    def test_invalid_rating_is_rejected(self):
        with self.assertRaisesRegex(ValueError, 'Rating mismatch'):
            self.parse(self.html.replace('>190.5</td>', '>999.0</td>', 1))

    def test_unknown_team_is_rejected(self):
        with self.assertRaisesRegex(ValueError, 'Unknown QOJ username'):
            self.parse(self.html.replace('>Thoughts_everyone</span>', '>UnknownTeam</span>', 1))

    def test_invalid_contest_metadata_is_rejected(self):
        with self.assertRaises(ValueError):
            self.parse(slug='../outside')
        with self.assertRaises(ValueError):
            self.parse(date='2026-09-31')


if __name__ == '__main__':
    unittest.main()
