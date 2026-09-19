import copy
import gzip
import importlib.util
import json
from pathlib import Path
import unittest


PROJECT = Path(__file__).resolve().parent.parent
spec = importlib.util.spec_from_file_location('pintia_import', PROJECT / 'scripts/import-pintia-scoreboard.py')
importer = importlib.util.module_from_spec(spec)
spec.loader.exec_module(importer)


class PintiaScoreboardTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        with gzip.open(importer.SNAPSHOT, 'rt', encoding='utf-8') as snapshot:
            cls.source = json.load(snapshot)
        cls.roster = json.loads((PROJECT / 'src/data/training-teams.json').read_text(encoding='utf-8'))
        cls.first = json.loads(importer.FIRST_CONTEST.read_text(encoding='utf-8'))

    def parse(self, payload=None):
        return importer.parse_scoreboard(payload or self.source, self.roster, self.first)

    def test_generated_file_matches_public_snapshot(self):
        saved = json.loads(importer.OUTPUT.read_text(encoding='utf-8'))
        self.assertEqual(self.parse(), saved)

    def test_official_population_and_all_team_ratings(self):
        contest = self.parse()
        self.assertEqual((contest['totalTeams'], contest['topSolved']), (2169, 13))
        self.assertEqual((len(contest['problems']), len(contest['standings'])), (14, 10))
        self.assertEqual({row['teamId']: row['rating'] for row in contest['standings']}, {
            'thoughts-everyone': 151.4, 'mynoghra': 150.9, 'easons-milk-dragon': 130.9,
            'gather-and-scatter': 109.9, 'beyond-the-equation': 107.1,
            'human-verification': 87.5, 'team-accept': 79.0, 'slay-the-judge': 65.0,
            'pear-money-team': 63.7, 'meowfia': 54.2,
        })
        self.assertEqual(contest['problems'][0], {'label': 'A', 'accepted': 33, 'submissions': 304})

    def test_only_canonical_identity_and_problem_cells_are_published(self):
        contest = self.parse()
        rows = {row['teamId']: row for row in contest['standings']}
        self.assertEqual(rows['mynoghra']['username'], 'Mynoghra')
        self.assertEqual(rows['meowfia']['username'], 'Meowfia')
        self.assertTrue(all('sourceTeamName' not in row and 'sourceMembers' not in row for row in rows.values()))
        self.assertEqual(rows['thoughts-everyone']['problems'][1], {'status': 'accepted', 'result': '+0', 'time': '0:23'})
        self.assertEqual(rows['thoughts-everyone']['problems'][0], {'status': 'rejected', 'result': '+8', 'time': '4:59'})

    def test_snapshot_has_no_source_names_or_member_lists(self):
        serialized = json.dumps(self.source, ensure_ascii=False)
        self.assertNotIn('teamName', serialized)
        self.assertNotIn('memberNames', serialized)
        self.assertNotIn('sourceMembers', serialized)

    def test_total_time_matches_all_ten_public_rows_without_double_counting(self):
        contest = self.parse()
        self.assertEqual({row['teamId']: row['penalty'] for row in contest['standings']}, {
            'thoughts-everyone': 874, 'mynoghra': 1008, 'easons-milk-dragon': 954,
            'gather-and-scatter': 797, 'beyond-the-equation': 985,
            'human-verification': 668, 'team-accept': 1024, 'slay-the-judge': 409,
            'pear-money-team': 453, 'meowfia': 726,
        })

    def test_dirt_matches_the_first_contest_and_is_derived_for_ccpc(self):
        for row in self.first['standings']:
            accepted = [problem for problem in row['problems'] if problem['status'] == 'accepted']
            wrong = sum(int(problem['result'][1:] or '0') for problem in accepted)
            self.assertEqual(row['dirt'], f'{100 * wrong // (wrong + len(accepted))}%', row['teamId'])

        contest = self.parse()
        self.assertEqual({row['teamId']: row['dirt'] for row in contest['standings']}, {
            'thoughts-everyone': '33%', 'mynoghra': '52%', 'easons-milk-dragon': '30%',
            'gather-and-scatter': '46%', 'beyond-the-equation': '42%',
            'human-verification': '30%', 'team-accept': '63%', 'slay-the-judge': '25%',
            'pear-money-team': '33%', 'meowfia': '45%',
        })

    def test_special_result_is_included_only_when_it_does_not_lower_average(self):
        contest = self.parse()
        special = next(row for row in contest['standings'] if row['teamId'] == 'human-verification')
        previous = next(row for row in self.first['standings'] if row['teamId'] == 'human-verification')
        self.assertGreaterEqual(special['rating'], previous['rating'])
        self.assertEqual((special['rating'] + previous['rating']) / 2, 60.45)

        changed = copy.deepcopy(self.source)
        source_special = next(row for row in changed['xcpcRankings']['rankings'] if row.get('teamFid') == '39')
        source_special['rank'] = 2000
        updated = self.parse(changed)
        self.assertNotIn('human-verification', [row['teamId'] for row in updated['standings']])

    def test_unexpected_identity_is_rejected(self):
        changed = copy.deepcopy(self.source)
        source_meowfia = next(row for row in changed['xcpcRankings']['rankings'] if row.get('teamFid') == '2')
        source_meowfia['teamInfo']['schoolName'] = 'Another school'
        with self.assertRaisesRegex(ValueError, 'Unexpected identity'):
            self.parse(changed)


if __name__ == '__main__':
    unittest.main()
