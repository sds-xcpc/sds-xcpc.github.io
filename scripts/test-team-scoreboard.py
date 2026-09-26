import importlib.util
import json
from copy import deepcopy
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
        cls.pku_html = (PROJECT / 'resources/training-scoreboards/qoj4129-20260920.html').read_text(encoding='utf-8')
        cls.pku_supplement = json.loads((PROJECT / 'resources/training-scoreboards/qoj4129-supplement.json').read_text(encoding='utf-8'))
        cls.hong_kong_html = (PROJECT / 'resources/training-scoreboards/qoj4535-20260926.html').read_text(encoding='utf-8')

    def parse(self, html=None, slug='xix-gp-of-korea', date='2026-09-13'):
        return importer.parse_scoreboard(
            self.html if html is None else html, self.roster,
            'XIX Open Cup named after E.V. Pankratiev, Grand Prix of Korea',
            date, slug, 'qoj4114-20260913.html', 'XIX Gp of Korea',
            excluded_team_ids=['beyond-the-equation'],
        )

    def parse_pku(self, supplement=None):
        return importer.parse_scoreboard(
            self.pku_html, self.roster, 'The 2026 Peking University Team Selection Day 1',
            '2026-09-20', 'pku-team-selection-day-1', 'qoj4129-20260920.html',
            'PKU Selection D1', self.pku_supplement if supplement is None else supplement,
            ['beyond-the-equation'],
        )

    def parse_hong_kong(self):
        return importer.parse_scoreboard(
            self.hong_kong_html, self.roster, '2016 ICPC Hong Kong',
            '2026-09-26', '2016-icpc-hong-kong', 'qoj4535-20260926.html',
            '2016 ICPC Hong Kong',
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
        self.assertFalse(next(row for row in contest['standings'] if row['teamId'] == 'beyond-the-equation')['countsForRating'])
        self.assertEqual(next(team for team in self.roster if team['id'] == 'beyond-the-equation')['members'][0], '叶嘉弘')
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
        with self.assertRaisesRegex(ValueError, 'Unknown excluded team ids'):
            importer.parse_scoreboard(
                self.html, self.roster, 'Contest', '2026-09-13', 'contest',
                'snapshot.html', excluded_team_ids=['missing-team'],
            )

    def test_pku_snapshot_and_supplement_match_generated_file(self):
        saved = json.loads((PROJECT / 'src/data/team-contests/pku-team-selection-day-1.json').read_text(encoding='utf-8'))
        contest = self.parse_pku()
        self.assertEqual(contest, saved)
        self.assertEqual((contest['topSolved'], contest['totalTeams'], len(contest['standings'])), (9, 47, 10))
        self.assertEqual([(row['teamId'], row['rank'], row['rating']) for row in contest['standings']], [
            ('thoughts-everyone', 21, 76.6), ('mynoghra', 24, 56.7),
            ('slay-the-judge', 29, 44.9), ('easons-milk-dragon', 35, 30.7),
            ('gather-and-scatter', 38, 18.9), ('beyond-the-equation', 39, 17.0),
            ('team-accept', 40, 11.3), ('human-verification', 41, 9.9),
            ('pear-money-team', 42, 8.5), ('meowfia', 43, 7.1),
        ])

    def test_pku_supplemental_totals_and_problem_statistics(self):
        contest = self.parse_pku()
        easons = contest['standings'][3]
        self.assertEqual((easons['solved'], easons['penalty'], easons['dirt']), (5, 908, '64%'))
        self.assertEqual(easons['problems'][1], {'status': 'accepted', 'result': '+2', 'time': '2:45'})
        self.assertEqual(easons['problems'][9], {'status': 'accepted', 'result': '+2', 'time': '4:08'})
        self.assertEqual((contest['problems'][1]['accepted'], contest['problems'][1]['submissions']), (45, 75))
        self.assertEqual((contest['problems'][9]['accepted'], contest['problems'][9]['submissions']), (40, 108))

    def test_pku_invalid_supplement_is_rejected(self):
        wrong_population = deepcopy(self.pku_supplement)
        wrong_population['sourceTotalTeams'] = 45
        with self.assertRaisesRegex(ValueError, 'source population'):
            self.parse_pku(wrong_population)
        wrong_penalty = deepcopy(self.pku_supplement)
        wrong_penalty['extraRows'][0]['penalty'] = 907
        with self.assertRaisesRegex(ValueError, 'Supplemental totals'):
            self.parse_pku(wrong_penalty)

    def test_hong_kong_snapshot_matches_generated_file(self):
        saved = json.loads((PROJECT / 'src/data/team-contests/2016-icpc-hong-kong.json').read_text(encoding='utf-8'))
        contest = self.parse_hong_kong()
        self.assertEqual(contest, saved)
        self.assertEqual((contest['topSolved'], contest['totalTeams'], len(contest['problems'])), (11, 70, 11))
        self.assertEqual([(row['teamId'], row['rank'], row['rating']) for row in contest['standings']], [
            ('thoughts-everyone', 1, 200.0), ('mynoghra', 4, 104.4),
            ('easons-milk-dragon', 5, 85.7), ('gather-and-scatter', 7, 83.1),
            ('pear-money-team', 14, 59.2), ('slay-the-judge', 20, 39.7),
            ('human-verification', 34, 19.2), ('meowfia', 37, 8.8),
            ('team-accept', 42, 7.5), ('beyond-the-equation', 50, 5.5),
        ])


if __name__ == '__main__':
    unittest.main()
