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
const contest = JSON.parse(await readFile(new URL('../src/data/team-contests/xix-gp-of-korea.json', import.meta.url), 'utf8'));
const ccpcContest = JSON.parse(await readFile(new URL('../src/data/team-contests/ccpc-online-20260919.json', import.meta.url), 'utf8'));
const pkuContest = JSON.parse(await readFile(new URL('../src/data/team-contests/pku-team-selection-day-1.json', import.meta.url), 'utf8'));

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

test('the imported ten-team contest produces the expected average ranking', () => {
  const ranked = rankTeamRatings(teams, [contest]);
  assert.deepEqual(ranked.map(({ team }) => team.id), contest.standings.map((entry) => entry.teamId));
  assert.deepEqual(ranked.map(({ averageRating }) => averageRating), contest.standings.map((entry) => entry.rating));
});

test('two published contests sort by their exact arithmetic average', () => {
  const ranked = rankTeamRatings(teams, [contest, ccpcContest]);
  assert.deepEqual(ranked.map(({ team }) => team.id), [
    'thoughts-everyone', 'mynoghra', 'easons-milk-dragon', 'beyond-the-equation',
    'gather-and-scatter', 'human-verification', 'slay-the-judge', 'team-accept',
    'pear-money-team', 'meowfia',
  ]);
  assert.ok(Math.abs(ranked[0].averageRating - 170.95) < 1e-9);
  assert.ok(Math.abs(ranked[5].averageRating - 60.45) < 1e-9);
});

test('third contest ratings update the overall average and team order', () => {
  const ranked = rankTeamRatings(teams, [contest, ccpcContest, pkuContest]);
  assert.deepEqual(ranked.map(({ team }) => team.id), [
    'thoughts-everyone', 'mynoghra', 'easons-milk-dragon', 'beyond-the-equation',
    'gather-and-scatter', 'slay-the-judge', 'human-verification', 'team-accept',
    'pear-money-team', 'meowfia',
  ]);
  assert.ok(Math.abs(ranked[0].averageRating - 139.5) < 1e-9);
  assert.ok(Math.abs(ranked[2].averageRating - (145.1 + 130.9 + 30.7) / 3) < 1e-9);
});
