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
        cls.pku_day_2_html = (PROJECT / 'resources/training-scoreboards/qoj4537-20260927.html').read_text(encoding='utf-8')
        cls.swerc_html = (PROJECT / 'resources/training-scoreboards/qoj4568-20261005.html').read_text(encoding='utf-8')
        cls.swerc_supplement = json.loads((PROJECT / 'resources/training-scoreboards/qoj4568-supplement.json').read_text(encoding='utf-8'))
        cls.hongo_html = (PROJECT / 'resources/training-scoreboards/qoj4571-20261006.html').read_text(encoding='utf-8')
        cls.hongo_supplement = json.loads((PROJECT / 'resources/training-scoreboards/qoj4571-supplement.json').read_text(encoding='utf-8'))
        cls.nowcoder_html = (PROJECT / 'resources/training-scoreboards/qoj4573-20261007.html').read_text(encoding='utf-8')
        cls.nowcoder_supplement = json.loads((PROJECT / 'resources/training-scoreboards/qoj4573-supplement.json').read_text(encoding='utf-8'))

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

    def parse_pku_day_2(self):
        return importer.parse_scoreboard(
            self.pku_day_2_html, self.roster, 'The 2026 Peking University Team Selection Day 2',
            '2026-09-27', 'pku-team-selection-day-2', 'qoj4537-20260927.html',
            'PKU Selection D2',
        )

    def parse_swerc(self, html=None, supplement=None, rating_scope='source'):
        return importer.parse_scoreboard(
            self.swerc_html if html is None else html, self.roster, 'SWERC 2024',
            '2026-10-05', 'swerc-2024', 'qoj4568-20261005.html', 'SWERC 2024',
            self.swerc_supplement if supplement is None else supplement,
            rating_scope=rating_scope,
        )

    def parse_hongo(self, html=None, rating_scope='source'):
        return importer.parse_scoreboard(
            self.hongo_html if html is None else html, self.roster,
            'The 4th Universal Cup. Stage 18: Grand Prix of Hongō',
            '2026-10-06', 'ucup-4-stage-18-hongo', 'qoj4571-20261006.html',
            '4th UCup: Hongō', self.hongo_supplement, rating_scope=rating_scope,
        )

    def parse_nowcoder(self, rating_scope='tracked'):
        return importer.parse_scoreboard(
            self.nowcoder_html, self.roster, '2024 Nowcoder Training - ZJU Contest',
            '2026-10-07', 'nowcoder-training-zju', 'qoj4573-20261007.html',
            '2024 Nowcoder ZJU', self.nowcoder_supplement, rating_scope=rating_scope,
        )

    def parse_small_tracked(self, results):
        rows = []
        for index, (rank, solved) in enumerate(results):
            team = self.roster[index]
            cells = ''.join('<td class="accepted">+\n0:10</td>' if problem < solved else '<td>-</td>'
                            for problem in range(2))
            rows.append(f'<tr><td>{rank}</td><td>{team["qojUsername"]}<small>({", ".join(team["members"])})</small></td>'
                        f'<td>—</td>{cells}<td>{solved}</td><td>20</td><td>0%</td></tr>')
        html = ('<p id="rating-info">n = 100</p><table id="table"><tr><th>Rank.</th><th>Username</th><th>Rating</th>'
                '<th>A\n0/0</th><th>B\n0/0</th><th>Solved</th><th>Penalty</th><th>Dirt</th></tr>'
                + ''.join(rows) + '</table>')
        return importer.parse_scoreboard(
            html, self.roster, 'Example', '2026-10-06', 'example', 'example.html',
            supplement={'topSolved': 2, 'sourceTotalTeams': 100}, rating_scope='tracked',
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

    def test_pku_day_2_snapshot_matches_generated_file(self):
        saved = json.loads((PROJECT / 'src/data/team-contests/pku-team-selection-day-2.json').read_text(encoding='utf-8'))
        contest = self.parse_pku_day_2()
        self.assertEqual(contest, saved)
        self.assertEqual((contest['topSolved'], contest['totalTeams'], len(contest['problems'])), (7, 44, 13))
        self.assertEqual([(row['teamId'], row['rank'], row['rating']) for row in contest['standings']], [
            ('thoughts-everyone', 6, 151.9), ('mynoghra', 17, 90.9),
            ('slay-the-judge', 31, 36.4), ('beyond-the-equation', 34, 28.6),
            ('human-verification', 35, 26.0), ('pear-money-team', 37, 20.8),
            ('easons-milk-dragon', 38, 13.6), ('gather-and-scatter', 39, 11.7),
            ('team-accept', 40, 9.7), ('meowfia', 41, 7.8),
        ])

    def test_swerc_source_scope_preserves_original_results(self):
        contest = self.parse_swerc()
        self.assertNotIn('ratingScope', contest)
        self.assertEqual(contest['sourceUrl'], 'https://qoj.ac/results/QOJ4568')
        self.assertEqual((contest['topSolved'], contest['totalTeams'], len(contest['problems'])), (12, 199, 13))
        self.assertEqual([(row['username'], row['rank'], row['solved'], row['penalty'], row['rating'])
                          for row in contest['standings']], [
            ('Thoughts_everyone', 1, 12, 1142, 200.0),
            ('Brightest_Flame_Plus', 2, 11, 1348, 182.4),
            ('Yuyu-Yuyu-Yuyuko', 3, 10, 809, 165.0),
            ('Wait_What', 4, 10, 1182, 164.2),
            ('If-Chinese-130', 5, 10, 1206, 163.3),
            ('Slay_the_Judge', 8, 9, 879, 144.7),
            ('Mynoghra', 10, 9, 907, 143.2),
            ('no_more_time_penalty', 13, 9, 1480, 141.0),
            ('StarfruitSupernova', 14, 8, 627, 124.6),
            ('Verifying we are human.', 15, 8, 636, 124.0),
            ('Easons_MD_istheRealBOSS', 17, 8, 701, 122.6),
            ('Gather_and_Scatter', 20, 8, 822, 120.6),
            ('Equation32768', 28, 7, 487, 100.8),
            ('pear_money_team', 30, 7, 508, 99.7),
            ('TeamAccept', 35, 7, 589, 96.7),
            ('catcannotpassturingtest', 39, 7, 654, 94.4),
            ('_IAKIOI', 42, 7, 700, 92.6),
            ('tengZF', 50, 6, 203, 75.4),
            ('Meowfia', 52, 6, 288, 74.4),
        ])
        teams = {team['id']: team for team in self.roster}
        for row in contest['standings']:
            self.assertEqual(row['sourceMembers'], teams[row['teamId']]['members'])
        self.assertNotIn('wang_xun', [row['username'] for row in contest['standings']])

    def test_swerc_tracked_ratings_and_source_ranks(self):
        contest = self.parse_swerc(rating_scope='tracked')
        saved = json.loads((PROJECT / 'src/data/team-contests/swerc-2024.json').read_text(encoding='utf-8'))
        self.assertEqual(contest, saved)
        self.assertEqual(contest['ratingScope'], 'tracked')
        self.assertEqual((contest['topSolved'], contest['totalTeams']), (12, 19))
        self.assertEqual((contest['sourceTopSolved'], contest['sourceTotalTeams']), (12, 199))
        self.assertEqual([row['rank'] for row in contest['standings']], list(range(1, 20)))
        self.assertEqual([(row['username'], row['sourceRank'], row['rating']) for row in contest['standings']], [
            ('Thoughts_everyone', 1, 200.0), ('Brightest_Flame_Plus', 2, 173.7),
            ('Yuyu-Yuyu-Yuyuko', 3, 149.1), ('Wait_What', 4, 140.4), ('If-Chinese-130', 5, 131.6),
            ('Slay_the_Judge', 8, 110.5), ('Mynoghra', 10, 102.6), ('no_more_time_penalty', 13, 94.7),
            ('StarfruitSupernova', 14, 77.2), ('Verifying we are human.', 15, 70.2),
            ('Easons_MD_istheRealBOSS', 17, 63.2), ('Gather_and_Scatter', 20, 56.1),
            ('Equation32768', 28, 43.0), ('pear_money_team', 30, 36.8), ('TeamAccept', 35, 30.7),
            ('catcannotpassturingtest', 39, 24.6), ('_IAKIOI', 42, 18.4), ('tengZF', 50, 10.5),
            ('Meowfia', 52, 5.3),
        ])

    def test_hongo_tracked_ratings_and_first_blood(self):
        contest = self.parse_hongo(rating_scope='tracked')
        saved = json.loads((PROJECT / 'src/data/team-contests/ucup-4-stage-18-hongo.json').read_text(encoding='utf-8'))
        self.assertEqual(contest, saved)
        self.assertEqual(contest['ratingScope'], 'tracked')
        self.assertEqual((contest['topSolved'], contest['totalTeams'], len(contest['problems'])), (8, 19, 14))
        self.assertEqual((contest['sourceTopSolved'], contest['sourceTotalTeams']), (13, 135))
        self.assertEqual([row['rank'] for row in contest['standings']], list(range(1, 20)))
        self.assertEqual([(row['username'], row['sourceRank'], row['rating']) for row in contest['standings']], [
            ('Thoughts_everyone', 13, 200.0), ('Brightest_Flame_Plus', 17, 189.5),
            ('Yuyu-Yuyu-Yuyuko', 24, 156.6), ('If-Chinese-130', 25, 147.4),
            ('_IAKIOI', 39, 118.4), ('tengZF', 45, 110.5), ('Mynoghra', 48, 102.6),
            ('no_more_time_penalty', 51, 78.9), ('Wait_What', 52, 72.4), ('Gather_and_Scatter', 65, 65.8),
            ('catcannotpassturingtest', 68, 59.2), ('Verifying we are human.', 89, 42.1),
            ('StarfruitSupernova', 93, 27.6), ('Easons_MD_istheRealBOSS', 94, 23.7),
            ('Slay_the_Judge', 99, 19.7), ('Equation32768', 103, 15.8), ('pear_money_team', 106, 11.8),
            ('TeamAccept', 108, 7.9), ('Meowfia', 109, 3.9),
        ])
        chinese = next(row for row in contest['standings'] if row['username'] == 'If-Chinese-130')
        self.assertEqual(chinese['solved'], 7)
        self.assertEqual(chinese['problems'][10], {'status': 'accepted', 'result': '*+1', 'time': '2:10'})

    def test_nowcoder_snapshot_and_independent_ratings_match_generated_file(self):
        contest = self.parse_nowcoder()
        saved = json.loads((PROJECT / 'src/data/team-contests/nowcoder-training-zju.json').read_text(encoding='utf-8'))
        self.assertEqual(contest, saved)
        self.assertEqual(contest['sourceUrl'], 'https://qoj.ac/results/QOJ4573')
        self.assertEqual(contest['ratingScope'], 'tracked')
        self.assertEqual((contest['topSolved'], contest['totalTeams'], len(contest['problems'])), (10, 19, 11))
        self.assertEqual((contest['sourceTopSolved'], contest['sourceTotalTeams']), (10, 21))
        self.assertEqual([row['rank'] for row in contest['standings']], list(range(1, 20)))
        self.assertEqual([row['sourceRank'] for row in contest['standings']], list(range(1, 20)))
        self.assertEqual([(row['username'], row['solved'], row['penalty'], row['rating'])
                          for row in contest['standings']], [
            ('Brightest_Flame_Plus', 10, 1314, 200.0), ('Yuyu-Yuyu-Yuyuko', 9, 854, 170.5),
            ('Thoughts_everyone', 9, 860, 161.1), ('StarfruitSupernova', 9, 1052, 151.6),
            ('Wait_What', 9, 1248, 142.1), ('catcannotpassturingtest', 7, 560, 103.2),
            ('If-Chinese-130', 7, 653, 95.8), ('Mynoghra', 7, 721, 88.4),
            ('Easons_MD_istheRealBOSS', 7, 725, 81.1), ('Slay_the_Judge', 7, 777, 73.7),
            ('tengZF', 7, 867, 66.3), ('Gather_and_Scatter', 7, 1010, 58.9),
            ('no_more_time_penalty', 7, 1055, 51.6), ('_IAKIOI', 6, 588, 37.9),
            ('Verifying we are human.', 6, 629, 31.6), ('Equation32768', 5, 612, 21.1),
            ('pear_money_team', 5, 613, 15.8), ('TeamAccept', 4, 490, 8.4),
            ('Meowfia', 4, 555, 4.2),
        ])
        # Source ranks happen to be identical, but the independent population still changes ratings.
        source = self.parse_nowcoder(rating_scope='source')
        self.assertEqual((source['topSolved'], source['totalTeams']), (10, 21))
        self.assertEqual(source['standings'][2]['rating'], 162.9)
        self.assertEqual(source['standings'][-1]['rating'], 11.4)

    def test_tracked_mode_validates_source_rating_before_recomputing(self):
        source = self.parse_hongo()
        self.assertEqual((source['topSolved'], source['totalTeams']), (13, 135))
        self.assertEqual(source['standings'][0]['rating'], 112.1)
        self.assertEqual(source['standings'][0]['rank'], 13)
        # 200.0 is the correct independent rating, but is incorrect source evidence.
        with self.assertRaisesRegex(ValueError, 'Rating mismatch'):
            self.parse_hongo(self.hongo_html.replace('>112.1</td>', '>200.0</td>', 1), rating_scope='tracked')

    def test_tracked_rank_preserves_competition_ties(self):
        contest = self.parse_small_tracked([(40, 1), (20, 1), (10, 2), (20, 1)])
        self.assertEqual([row['sourceRank'] for row in contest['standings']], [10, 20, 20, 40])
        self.assertEqual([row['rank'] for row in contest['standings']], [1, 2, 2, 4])
        self.assertEqual([row['rating'] for row in contest['standings']], [200.0, 75.0, 75.0, 25.0])

    def test_tracked_invalid_scope_population_and_solved_are_rejected(self):
        with self.assertRaisesRegex(ValueError, 'Rating scope'):
            self.parse_swerc(rating_scope='all')
        with self.assertRaisesRegex(ValueError, 'No populated table'):
            self.parse_small_tracked([])
        with self.assertRaisesRegex(ValueError, 'denominator must be positive'):
            self.parse_small_tracked([(1, 0), (2, 0)])
        with self.assertRaisesRegex(ValueError, 'Invalid rank or solved count'):
            self.parse_small_tracked([(1, 3)])
        with self.assertRaisesRegex(ValueError, 'leader must have the highest solved count'):
            self.parse_small_tracked([(1, 1), (2, 2)])

    def test_swerc_explicit_account_takes_precedence_over_display_name(self):
        changed_display = self.swerc_html.replace('>Brightest Flame+</span>', '>Thoughts_everyone</span>', 1)
        self.assertEqual(self.parse_swerc(changed_display), self.parse_swerc())

    def test_swerc_unknown_or_duplicate_explicit_account_is_rejected(self):
        with self.assertRaisesRegex(ValueError, 'Unknown QOJ username: UnknownTeam'):
            self.parse_swerc(self.swerc_html.replace('QOJ 账号：Brightest_Flame_Plus', 'QOJ 账号：UnknownTeam', 1))
        with self.assertRaisesRegex(ValueError, 'Duplicate result for Yuyu-Yuyu-Yuyuko'):
            self.parse_swerc(self.swerc_html.replace('QOJ 账号：Brightest_Flame_Plus', 'QOJ 账号：Yuyu-Yuyu-Yuyuko', 1))
        with self.assertRaisesRegex(ValueError, 'Invalid or conflicting QOJ account metadata'):
            self.parse_swerc(self.swerc_html.replace('QOJ 账号：Brightest_Flame_Plus', 'QOJ 账号：', 1))
        with self.assertRaisesRegex(ValueError, 'Invalid or conflicting QOJ account metadata'):
            self.parse_swerc(self.swerc_html.replace(
                '>Brightest Flame+</span>', '>Brightest Flame+</span><span title="QOJ 账号：UnknownTeam"></span>', 1))

    def test_swerc_invalid_source_metadata_is_rejected(self):
        wrong_population = deepcopy(self.swerc_supplement)
        wrong_population['sourceTotalTeams'] = 198
        with self.assertRaisesRegex(ValueError, 'source population'):
            self.parse_swerc(supplement=wrong_population)
        wrong_top_solved = deepcopy(self.swerc_supplement)
        wrong_top_solved['topSolved'] = 11
        with self.assertRaisesRegex(ValueError, 'Invalid rank or solved count'):
            self.parse_swerc(supplement=wrong_top_solved)
        for source_url in ('javascript:alert(1)', '/results/QOJ4568', 'https://', 'https://user:pass@qoj.ac/', 4568):
            with self.subTest(source_url=source_url):
                invalid_url = deepcopy(self.swerc_supplement)
                invalid_url['sourceUrl'] = source_url
                with self.assertRaisesRegex(ValueError, 'Source URL must be an absolute HTTP'):
                    self.parse_swerc(supplement=invalid_url)


if __name__ == '__main__':
    unittest.main()
