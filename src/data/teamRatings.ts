import type { TrainingTeam } from './trainingTeams';

type RatingContest = {
  standings: { teamId: string; rating: number; countsForRating?: boolean }[];
};

export function averageTeamRating(teamId: string, contests: readonly RatingContest[]) {
  const ratings = contests.flatMap((contest) => {
    const entry = contest.standings.find((result) => result.teamId === teamId);
    return entry && entry.countsForRating !== false ? [entry.rating] : [];
  });
  if (ratings.length === 0) return null;
  const total = ratings.reduce((sum, rating) => sum + rating, 0);
  return ratings.length > 5 ? (total - Math.min(...ratings)) / (ratings.length - 1) : total / ratings.length;
}

export function rankTeamRatings(teams: readonly TrainingTeam[], contests: readonly RatingContest[]) {
  return teams
    .map((team) => ({ team, averageRating: averageTeamRating(team.id, contests) }))
    .sort((a, b) => (b.averageRating ?? -1) - (a.averageRating ?? -1));
}
