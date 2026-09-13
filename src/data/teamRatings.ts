import type { TrainingTeam } from './trainingTeams';

type RatingContest = {
  standings: { teamId: string; rating: number }[];
};

export function averageTeamRating(teamId: string, contests: readonly RatingContest[]) {
  const ratings = contests.flatMap((contest) => {
    const entry = contest.standings.find((result) => result.teamId === teamId);
    return entry ? [entry.rating] : [];
  });
  return ratings.length > 0 ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length : null;
}

export function rankTeamRatings(teams: readonly TrainingTeam[], contests: readonly RatingContest[]) {
  return teams
    .map((team) => ({ team, averageRating: averageTeamRating(team.id, contests) }))
    .sort((a, b) => (b.averageRating ?? -1) - (a.averageRating ?? -1));
}
