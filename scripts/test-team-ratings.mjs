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
const historicalContests = [contest, ccpcContest, pkuContest, hongKongContest, pkuDay2Contest];
const currentContests = [...historicalContests, swercContest];

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

test('SWERC retains all 19 teams including nine ZJU visitors without adding historical results', () => {
  assert.equal(schoolTeams.length, 10);
  assert.equal(zjuTeams.length, 9);
  assert.equal(swercContest.standings.length, 19);
  assert.deepEqual(new Set(swercContest.standings.map((entry) => entry.teamId)), new Set(teams.map((team) => team.id)));

  for (const team of zjuTeams) {
    assert.ok(historicalContests.every((pastContest) => !pastContest.standings.some((entry) => entry.teamId === team.id)));
    assert.equal(averageTeamRating(team.id, historicalContests), null);
    const result = swercContest.standings.find((entry) => entry.teamId === team.id);
    assert.ok(result, `${team.id} has a SWERC result`);
    assert.equal(result.rating, Number((result.solved / 12 * (199 - result.rank + 1) / 199 * 200).toFixed(1)));
  }
});

test('SWERC uses the sixth counted result to drop exactly one minimum and keeps excluded results excluded', () => {
  const thoughtsRatings = [190.5, 151.4, 76.6, 200.0, 151.9, 200.0];
  assert.deepEqual(currentContests.map((item) => item.standings.find((entry) => entry.teamId === 'thoughts-everyone').rating), thoughtsRatings);
  assert.ok(Math.abs(averageTeamRating('thoughts-everyone', historicalContests) - 154.08) < 1e-9);
  assert.ok(Math.abs(averageTeamRating('thoughts-everyone', currentContests) - 178.76) < 1e-9);

  // Six contest files do not imply six eligible results: Korea and PKU Day 1 are excluded for this team.
  assert.equal(contest.standings.find((entry) => entry.teamId === 'beyond-the-equation').countsForRating, false);
  assert.equal(pkuContest.standings.find((entry) => entry.teamId === 'beyond-the-equation').countsForRating, false);
  assert.equal(averageTeamRating('beyond-the-equation', currentContests), (107.1 + 5.5 + 28.6 + 100.8) / 4);
});

test('SWERC updates the ten school teams in the overall ranking using exact averages', () => {
  const expected = [
    ['thoughts-everyone', 178.76],
    ['mynoghra', 127.86],
    ['easons-milk-dragon', 103.0],
    ['gather-and-scatter', 73.54],
    ['slay-the-judge', 66.14],
    ['beyond-the-equation', 60.5],
    ['human-verification', 58.02],
    ['pear-money-team', 52.78],
    ['team-accept', 40.98],
    ['meowfia', 30.46],
  ];
  const ranked = rankTeamRatings(schoolTeams, currentContests);
  assert.deepEqual(ranked.map(({ team }) => team.id), expected.map(([id]) => id));
  for (const [index, [id, average]] of expected.entries()) {
    assert.ok(Math.abs(ranked[index].averageRating - average) < 1e-9, `${id} averages ${average}`);
  }
});
