export type TrainingContest = {
  id: string;
  title: string;
  shortTitle: string;
  date: string;
  sourceUrl?: string;
  sourceSnapshot: string;
  topSolved: number;
  totalTeams: number;
  problems: { label: string; accepted: number; submissions: number }[];
  standings: {
    teamId: string;
    username: string;
    sourceMembers?: string[];
    rank: number;
    rating: number;
    ratingFormula: string;
    problems: { status: string; result: string; time: string }[];
    solved: number;
    penalty: number;
    dirt: string;
  }[];
};

export const trainingContests = Object.values(
  import.meta.glob<TrainingContest>('./team-contests/*.json', { eager: true, import: 'default' }),
).sort((a, b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id));

const plannedTrainingDates = [
  '2026-09-13',
  '2026-09-19',
  '2026-09-20',
  '2026-09-26',
  '2026-09-27',
  '2026-10-05',
  '2026-10-06',
  '2026-10-07',
];

export type TrainingScoreboardColumn = {
  id: string;
  date: string;
  contest?: TrainingContest;
};

export const trainingScoreboardColumns: TrainingScoreboardColumn[] = [
  ...trainingContests.map((contest) => ({ id: contest.id, date: contest.date, contest })),
  ...plannedTrainingDates
    .filter((date) => !trainingContests.some((contest) => contest.date === date))
    .map((date) => ({ id: `planned-${date}`, date })),
].sort((a, b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id));

export function formatTrainingDate(date: string) {
  const [, month, day] = date.split('-');
  return `${Number(month)} 月 ${Number(day)} 日`;
}
