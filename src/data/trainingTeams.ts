import roster from './training-teams.json';

export const trainingTeams = roster;
export type TrainingTeam = (typeof trainingTeams)[number];
