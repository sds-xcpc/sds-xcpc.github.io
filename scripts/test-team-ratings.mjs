import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import ts from 'typescript';

const source = await readFile(new URL('../src/data/teamRatings.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 },
}).outputText;
const { averageTeamRating, rankTeamRatings } = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`);
const teams = JSON.parse(await readFile(new URL('../src/data/training-teams.json', import.meta.url), 'utf8'));
const schoolTeams = teams.filter((team) => team.status !== 'ZJU');
const zjuTeams = teams.filter((team) => team.status === 'ZJU');
const contest = JSON.parse(await readFile(new URL('../src/data/team-contests/xix-gp-of-korea.json', import.meta.url), 'utf8'));
const ccpcContest = JSON.parse(await readFile(new URL('../src/data/team-contests/ccpc-online-20260919.json', import.meta.url), 'utf8'));
const pkuContest = JSON.parse(await readFile(new URL('../src/data/team-contests/pku-team-selection-day-1.json', import.meta.url), 'utf8'));
const hongKongContest = JSON.parse(await readFile(new URL('../src/data/team-contests/2016-icpc-hong-kong.json', import.meta.url), 'utf8'));
const pkuDay2Contest = JSON.parse(await readFile(new URL('../src/data/team-contests/pku-team-selection-day-2.json', import.meta.url), 'utf8'));
const swercContest = JSON.parse(await readFile(new URL('../src/data/team-contests/swerc-2024.json', import.meta.url), 'utf8'));
const hongoContest = JSON.parse(await readFile(new URL('../src/data/team-contests/ucup-4-stage-18-hongo.json', import.meta.url), 'utf8'));
const nowcoderContest = JSON.parse(await readFile(new URL('../src/data/team-contests/nowcoder-training-zju.json', import.meta.url), 'utf8'));
const historicalContests = [contest, ccpcContest, pkuContest, hongKongContest, pkuDay2Contest];
const afterSwercContests = [...historicalContests, swercContest];
const currentContests = [...afterSwercContests, hongoContest];
const finalContests = [...currentContests, nowcoderContest];

test('averages published results, excluding pending contests and missing entries', () => {
  const contests = [
    { standings: [{ teamId: 'a', rating: 100 }] },
    { standings: [] },
    { standings: [{ teamId: 'a', rating: 200 }] },
  ];
  assert.equal(averageTeamRating('a', contests), 150);
  assert.equal(averageTeamRating('absent', contests), null);
  assert.equal(averageTeamRating('a', []), null);
});

test('a published zero rating counts in the average', () => {
  assert.equal(averageTeamRating('a', [
    { standings: [{ teamId: 'a', rating: 100 }] },
    { standings: [{ teamId: 'a', rating: 0 }] },
  ]), 50);
});

test('drops exactly one lowest published rating after a team has more than five results', () => {
  const ratings = [100, 120, 80, 60, 90, 140];
  const contests = ratings.map((rating) => ({ standings: [{ teamId: 'a', rating }] }));
  assert.equal(averageTeamRating('a', contests.slice(0, 5)), 90);
  assert.equal(averageTeamRating('a', contests), 106);
  assert.equal(averageTeamRating('a', [...contests, { standings: [] }]), 106);
});

test('sorts by average rather than latest rating, preserving ties and placing unscored teams last', () => {
  const roster = ['a', 'b', 'c', 'd'].map((id) => ({ id }));
  const ranked = rankTeamRatings(roster, [
    { standings: [{ teamId: 'a', rating: 200 }, { teamId: 'b', rating: 50 }, { teamId: 'c', rating: 50 }] },
    { standings: [{ teamId: 'a', rating: 0 }, { teamId: 'b', rating: 50 }, { teamId: 'c', rating: 50 }] },
  ]);
  assert.deepEqual(ranked.map(({ team }) => team.id), ['a', 'b', 'c', 'd']);
  assert.deepEqual(ranked.map(({ averageRating }) => averageRating), [100, 50, 50, null]);
});

test('a non-counting imported result is shown as absent from the average ranking', () => {
  const ranked = rankTeamRatings(schoolTeams, [contest]);
  const counted = contest.standings.filter((entry) => entry.countsForRating !== false);
  assert.deepEqual(ranked.map(({ team }) => team.id), [...counted.map((entry) => entry.teamId), 'beyond-the-equation']);
  assert.deepEqual(ranked.map(({ averageRating }) => averageRating), [...counted.map((entry) => entry.rating), null]);
});

test('two published contests sort by their exact arithmetic average', () => {
  const ranked = rankTeamRatings(schoolTeams, [contest, ccpcContest]);
  assert.deepEqual(ranked.map(({ team }) => team.id), [
    'thoughts-everyone', 'mynoghra', 'easons-milk-dragon', 'beyond-the-equation',
    'gather-and-scatter', 'human-verification', 'slay-the-judge', 'team-accept',
    'pear-money-team', 'meowfia',
  ]);
  assert.ok(Math.abs(ranked[0].averageRating - 170.95) < 1e-9);
  assert.ok(Math.abs(ranked[5].averageRating - 60.45) < 1e-9);
});

test('third contest ratings update the overall average and team order', () => {
  const ranked = rankTeamRatings(schoolTeams, [contest, ccpcContest, pkuContest]);
  assert.deepEqual(ranked.map(({ team }) => team.id), [
    'thoughts-everyone', 'mynoghra', 'beyond-the-equation', 'easons-milk-dragon',
    'gather-and-scatter', 'slay-the-judge', 'human-verification', 'team-accept',
    'pear-money-team', 'meowfia',
  ]);
  assert.ok(Math.abs(ranked[0].averageRating - 139.5) < 1e-9);
  assert.equal(ranked[2].averageRating, 107.1);
  assert.ok(Math.abs(ranked[3].averageRating - (145.1 + 130.9 + 30.7) / 3) < 1e-9);
});

test('Day 4 Hong Kong results update the overall average and team order', () => {
  const ranked = rankTeamRatings(schoolTeams, [contest, ccpcContest, pkuContest, hongKongContest]);
  assert.deepEqual(ranked.map(({ team }) => team.id), [
    'thoughts-everyone', 'mynoghra', 'easons-milk-dragon', 'gather-and-scatter',
    'beyond-the-equation', 'slay-the-judge', 'pear-money-team', 'human-verification',
    'team-accept', 'meowfia',
  ]);
  assert.ok(Math.abs(ranked[0].averageRating - (190.5 + 151.4 + 76.6 + 200.0) / 4) < 1e-9);
  assert.equal(ranked[4].averageRating, (107.1 + 5.5) / 2);
});

test('PKU Selection Day 2 updates the five-contest average and team order', () => {
  const ranked = rankTeamRatings(schoolTeams, historicalContests);
  assert.deepEqual(ranked.map(({ team }) => team.id), [
    'thoughts-everyone', 'mynoghra', 'easons-milk-dragon', 'gather-and-scatter',
    'beyond-the-equation', 'slay-the-judge', 'human-verification', 'pear-money-team',
    'team-accept', 'meowfia',
  ]);
  assert.ok(Math.abs(ranked[0].averageRating - 154.08) < 1e-9);
  assert.ok(Math.abs(ranked[4].averageRating - (107.1 + 5.5 + 28.6) / 3) < 1e-9);
});

test('all three independent contests retain all 19 teams without adding historical ZJU results', () => {
  assert.equal(schoolTeams.length, 10);
  assert.equal(zjuTeams.length, 9);
  for (const item of [swercContest, hongoContest, nowcoderContest]) {
    assert.equal(item.ratingScope, 'tracked');
    assert.equal(item.totalTeams, 19);
    assert.equal(item.standings.length, 19);
    assert.deepEqual(new Set(item.standings.map((entry) => entry.teamId)), new Set(teams.map((team) => team.id)));
    assert.deepEqual(item.standings.map((entry) => entry.rank), Array.from({ length: 19 }, (_, index) => index + 1));
  }
  assert.equal(swercContest.topSolved, 12);
  assert.equal(hongoContest.topSolved, 8);
  assert.equal(nowcoderContest.topSolved, 10);

  for (const team of zjuTeams) {
    assert.ok(historicalContests.every((pastContest) => !pastContest.standings.some((entry) => entry.teamId === team.id)));
    assert.equal(averageTeamRating(team.id, historicalContests), null);
    assert.ok([swercContest, hongoContest, nowcoderContest].every((item) => item.standings.some((entry) => entry.teamId === team.id)));
  }
});

test('SWERC uses the sixth counted result to drop exactly one minimum and keeps excluded results excluded', () => {
  const thoughtsRatings = [190.5, 151.4, 76.6, 200.0, 151.9, 200.0];
  assert.deepEqual(afterSwercContests.map((item) => item.standings.find((entry) => entry.teamId === 'thoughts-everyone').rating), thoughtsRatings);
  assert.ok(Math.abs(averageTeamRating('thoughts-everyone', historicalContests) - 154.08) < 1e-9);
  assert.ok(Math.abs(averageTeamRating('thoughts-everyone', afterSwercContests) - 178.76) < 1e-9);

  // Six contest files do not imply six eligible results: Korea and PKU Day 1 are excluded for this team.
  assert.equal(contest.standings.find((entry) => entry.teamId === 'beyond-the-equation').countsForRating, false);
  assert.equal(pkuContest.standings.find((entry) => entry.teamId === 'beyond-the-equation').countsForRating, false);
  assert.equal(averageTeamRating('beyond-the-equation', afterSwercContests), (107.1 + 5.5 + 28.6 + 43.0) / 4);
});

test('seven contests drop only one minimum while five eligible results retain every score', () => {
  assert.ok(Math.abs(averageTeamRating('thoughts-everyone', currentContests) - 182.3) < 1e-9);
  assert.equal(averageTeamRating('beyond-the-equation', currentContests), (107.1 + 5.5 + 28.6 + 43.0 + 15.8) / 5);
  // The newly added Hongō score is now the minimum for these two teams.
  assert.equal(hongoContest.standings.find((entry) => entry.teamId === 'slay-the-judge').rating, 19.7);
  assert.equal(hongoContest.standings.find((entry) => entry.teamId === 'meowfia').rating, 3.9);
  assert.ok(Math.abs(averageTeamRating('slay-the-judge', currentContests) - 330.8 / 6) < 1e-9);
  assert.ok(Math.abs(averageTeamRating('meowfia', currentContests) - 90.2 / 6) < 1e-9);
});

test('independent October ratings update the ten school teams using audited exact averages', () => {
  const expected = [
    ['thoughts-everyone', 1093.8 / 6],
    ['mynoghra', 701.3 / 6],
    ['easons-milk-dragon', 479.3 / 6],
    ['gather-and-scatter', 369.0 / 6],
    ['slay-the-judge', 330.8 / 6],
    ['human-verification', 278.4 / 6],
    ['beyond-the-equation', 200.0 / 5],
    ['pear-money-team', 212.8 / 6],
    ['team-accept', 146.8 / 6],
    ['meowfia', 90.2 / 6],
  ];
  const ranked = rankTeamRatings(schoolTeams, currentContests);
  assert.deepEqual(ranked.map(({ team }) => team.id), expected.map(([id]) => id));
  for (const [index, [id, average]] of expected.entries()) {
    assert.ok(Math.abs(ranked[index].averageRating - average) < 1e-9, `${id} averages ${average}`);
  }
});

test('the final contest gives Equation six eligible results and drops exactly one minimum', () => {
  const eligibleRatings = finalContests.flatMap((item) => item.standings
    .filter((entry) => entry.teamId === 'beyond-the-equation' && entry.countsForRating !== false)
    .map((entry) => entry.rating));
  assert.deepEqual(eligibleRatings, [107.1, 5.5, 28.6, 43.0, 15.8, 21.1]);
  assert.equal(averageTeamRating('beyond-the-equation', currentContests), 40);
  assert.ok(Math.abs(averageTeamRating('beyond-the-equation', finalContests) - 43.12) < 1e-9);
  for (const team of schoolTeams.filter((item) => item.id !== 'beyond-the-equation')) {
    assert.equal(finalContests.filter((item) => item.standings.some((entry) =>
      entry.teamId === team.id && entry.countsForRating !== false)).length, 8);
  }
});

test('the final independent contest updates all ten school averages without adding ZJU to the overall ranking', () => {
  const expected = [
    ['thoughts-everyone', 1254.9 / 7],
    ['mynoghra', 789.7 / 7],
    ['easons-milk-dragon', 560.4 / 7],
    ['gather-and-scatter', 427.9 / 7],
    ['slay-the-judge', 404.5 / 7],
    ['human-verification', 310.0 / 7],
    ['beyond-the-equation', 215.6 / 5],
    ['pear-money-team', 228.6 / 7],
    ['team-accept', 155.2 / 7],
    ['meowfia', 94.4 / 7],
  ];
  const ranked = rankTeamRatings(schoolTeams, finalContests);
  assert.deepEqual(ranked.map(({ team }) => team.id), expected.map(([id]) => id));
  for (const [index, [id, average]] of expected.entries()) {
    assert.ok(Math.abs(ranked[index].averageRating - average) < 1e-9, `${id} averages ${average}`);
  }
});
