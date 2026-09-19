import { ArrowDown, ArrowLeft, ArrowUpRight, CalendarDays } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { rankTeamRatings } from '../data/teamRatings';
import { formatTrainingDate, trainingContests, trainingScoreboardColumns } from '../data/trainingScoreboard';
import { trainingTeams, type TrainingTeam } from '../data/trainingTeams';

const ratingFormatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});
const averageFormatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 2,
});

const problemStyles: Record<string, string> = {
  accepted: 'bg-[#e4f4eb] text-[#16633d]',
  rejected: 'bg-[#fcebed] text-[#a33448]',
  pending: 'bg-[#fff3d4] text-[#875d08]',
  empty: 'text-slatecopy/40',
};

function TeamIdentity({ team, rank, sourceName, sourceMembers }: {
  team: TrainingTeam;
  rank?: number;
  sourceName?: string;
  sourceMembers?: string[];
}) {
  const differentMembers = sourceMembers && sourceMembers.join(',') !== team.members.join(',');
  return (
    <div className="min-w-0 text-left">
      <p className="mb-2 flex items-center gap-2 text-xs font-bold text-slatecopy">
        <span aria-hidden="true" className={`h-1.5 w-1.5 shrink-0 rounded-full ${team.status === '正式队伍' ? 'bg-purple' : 'bg-orange'}`} />
        {team.status}
        {rank !== undefined && <span className="ml-auto font-mono text-slatecopy/60">原榜 #{rank}</span>}
      </p>
      <p className="text-base font-black leading-6 text-purple">{team.name}</p>
      {team.englishName !== team.name && <p className="mt-1 text-xs leading-5 text-slatecopy/70">{team.englishName}</p>}
      {sourceName && sourceName !== team.name && <p className="mt-1 text-xs leading-5 text-slatecopy/70">本场队名：{sourceName}</p>}
      <p className="mt-2 text-sm font-medium leading-6 text-slatecopy">{team.members.join('、')}</p>
      {differentMembers && <p className="mt-1 text-xs leading-5 text-slatecopy/70">本场队员：{sourceMembers.join('、')}</p>}
    </div>
  );
}

function RatingValue({ value, average = false }: { value: number | null | undefined; average?: boolean }) {
  return <>{value == null ? <span className="text-slatecopy/30">-</span> : (average ? averageFormatter : ratingFormatter).format(value)}</>;
}

export function TrainingTeamScoreboard() {
  const rankedTeams = rankTeamRatings(trainingTeams, trainingContests);

  return (
    <main className="bg-white">
      <section className="w-full px-4 py-8 sm:px-6 lg:px-8">
        <Link to="/training" className="inline-flex items-center gap-2 text-sm font-black text-purple transition hover:text-orange">
          <ArrowLeft size={17} />
          返回组建规则
        </Link>
        <header className="mb-7 mt-5">
          <h1 className="text-2xl font-black leading-snug text-purple sm:text-3xl">组队训练 Scoreboard</h1>
        </header>

        <div className="hidden xl:block">
          <table className="w-full table-fixed border-collapse text-center text-sm tabular-nums">
            <caption className="sr-only">队伍平均 Rating、各场比赛 Rating 和比赛日期，按平均 Rating 降序排序</caption>
            <colgroup>
              <col className="w-64" />
              <col className="w-28" />
              {trainingScoreboardColumns.map((column) => <col key={column.id} />)}
            </colgroup>
            <thead>
              <tr className="border-y border-purple/15 bg-lavender2 text-purple">
                <th scope="col" className="px-4 py-4 text-left font-black">队伍</th>
                <th scope="col" aria-sort="descending" className="px-2 py-4 font-black">
                  <span className="inline-flex items-center justify-center gap-1">Average<ArrowDown size={14} /></span>
                  <span className="block">Rating</span>
                </th>
                {trainingScoreboardColumns.map((column) => (
                  <th key={column.id} scope="col" className="px-2 py-4 align-bottom">
                    {column.contest ? (
                      <Link to={`/training/scoreboard/${column.contest.id}`} title={column.contest.title} className="font-black leading-5 text-purple underline decoration-orange/50 underline-offset-4 transition hover:text-orange">
                        {column.contest.shortTitle}
                      </Link>
                    ) : <span className="font-medium text-slatecopy/40">TBD</span>}
                    <time dateTime={column.date} className="mt-2 block whitespace-nowrap text-xs font-medium text-slatecopy">{formatTrainingDate(column.date)}</time>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rankedTeams.map(({ team, averageRating }) => (
                <tr key={team.id} className="border-b border-purple/10 even:bg-[#fcfbfe] hover:bg-lavender2/60">
                  <th scope="row" className="px-4 py-4 font-normal"><TeamIdentity team={team} /></th>
                  <td className="bg-purple/5 px-2 py-4 font-mono text-lg font-black text-purple"><RatingValue value={averageRating} average /></td>
                  {trainingScoreboardColumns.map((column) => (
                    <td key={column.id} className="px-2 py-4 font-mono text-base font-bold text-purple">
                      <RatingValue value={column.contest?.standings.find((entry) => entry.teamId === team.id)?.rating} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="xl:hidden">
          <div className="mb-5 flex flex-wrap gap-x-6 gap-y-3">
            {trainingContests.map((contest) => (
              <Link key={contest.id} to={`/training/scoreboard/${contest.id}`} title={contest.title} className="inline-flex items-center gap-2 text-base font-black text-purple underline decoration-orange/50 underline-offset-4">
                {contest.shortTitle}<ArrowUpRight size={16} />
              </Link>
            ))}
          </div>
          <div className="divide-y divide-purple/10 border-y border-purple/10">
            {rankedTeams.map(({ team, averageRating }) => (
              <article key={team.id} className="py-5">
                <div className="grid grid-cols-[minmax(0,1fr)_100px] gap-4">
                  <TeamIdentity team={team} />
                  <div className="text-right">
                    <p className="text-xs font-bold leading-5 text-slatecopy">Average Rating</p>
                    <p className="mt-2 font-mono text-2xl font-black tabular-nums text-purple"><RatingValue value={averageRating} average /></p>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2 min-[480px]:grid-cols-4 md:grid-cols-8">
                  {trainingScoreboardColumns.map((column) => (
                    <div key={column.id} className={`border-t border-purple/10 py-2 text-center ${column.contest ? 'bg-purple/5' : ''}`}>
                      <time dateTime={column.date} className="text-xs font-medium text-slatecopy">{formatTrainingDate(column.date)}</time>
                      <p className="mt-2 font-mono text-base font-bold tabular-nums text-purple">
                        <RatingValue value={column.contest?.standings.find((entry) => entry.teamId === team.id)?.rating} />
                      </p>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
        {trainingContests.length === 0 && <p className="py-10 text-center text-slatecopy">暂无训练赛成绩</p>}
      </section>
    </main>
  );
}

export function TrainingContestScoreboard() {
  const { contestId } = useParams();
  const contest = trainingContests.find((entry) => entry.id === contestId);

  return (
    <main className="bg-white">
      <section className="w-full px-4 py-8 sm:px-6 lg:px-8">
        <Link to="/training/scoreboard" className="inline-flex items-center gap-2 text-sm font-black text-purple transition hover:text-orange">
          <ArrowLeft size={17} />
          返回队伍 Rating
        </Link>
        {contest ? (
          <>
            <header className="mb-7 mt-5">
              <h1 className="text-2xl font-black leading-snug text-purple sm:text-3xl">{contest.title}</h1>
              <p className="mt-3 flex items-center gap-2 text-sm text-slatecopy">
                <CalendarDays size={16} className="text-orange" />
                <time dateTime={contest.date}>{formatTrainingDate(contest.date)}</time>
                <span className="mx-2 text-purple/20">|</span>
                {contest.standings.length} 支队伍
              </p>
              {contest.sourceUrl && (
                <a href={contest.sourceUrl} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-purple underline decoration-orange/50 underline-offset-4 hover:text-orange">
                  查看原榜 <ArrowUpRight size={15} />
                </a>
              )}
            </header>

            <div className="hidden xl:block">
              <table data-testid="contest-standings" className="w-full table-fixed border-collapse text-center text-sm tabular-nums">
                <caption className="sr-only">{contest.title} 完整成绩榜，排名和题目统计沿用原榜</caption>
                <colgroup>
                  <col className="w-10" />
                  <col className="w-64" />
                  <col className="w-[72px]" />
                  {contest.problems.map((problem) => <col key={problem.label} />)}
                  <col className="w-14" /><col className="w-16" /><col className="w-14" />
                </colgroup>
                <thead>
                  <tr className="border-y border-purple/15 bg-lavender2 text-purple">
                    <th scope="col" className="px-1 py-4 text-xs font-black">Rank.</th>
                    <th scope="col" className="px-4 py-4 text-left font-black">队伍</th>
                    <th scope="col" className="bg-purple px-1 py-4 font-black text-white">Rating</th>
                    {contest.problems.map((problem) => (
                      <th key={problem.label} scope="col" className="px-1 py-3">
                        <span className="block font-mono text-sm font-black">{problem.label}</span>
                        <span className="mt-1 block font-mono text-[10px] font-medium leading-3 text-slatecopy/60" title={`原榜统计 ${problem.accepted}/${problem.submissions}`}>
                          <span className="block">{problem.accepted}</span><span className="block">/{problem.submissions}</span>
                        </span>
                      </th>
                    ))}
                    {['Solved', contest.sourceUrl ? '总用时' : 'Penalty', 'Dirt'].map((label) => <th key={label} scope="col" className="px-1 py-4 text-xs font-black">{label}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {contest.standings.map((entry) => {
                    const team = trainingTeams.find((item) => item.id === entry.teamId);
                    return (
                      <tr key={entry.teamId} className="border-b border-purple/10 even:bg-[#fcfbfe]">
                        <td className="px-1 py-4 font-mono font-bold text-slatecopy">{entry.rank}</td>
                        <th scope="row" title={`原榜：${entry.username}`} className="px-4 py-4 font-normal">
                          {team ? <TeamIdentity team={team} sourceName={contest.showSourceIdentity ? entry.sourceTeamName : undefined} sourceMembers={contest.showSourceIdentity ? entry.sourceMembers : undefined} /> : entry.username}
                        </th>
                        <td title={entry.ratingFormula} className="bg-purple/5 px-1 py-4 font-mono text-lg font-black text-purple">{ratingFormatter.format(entry.rating)}</td>
                        {entry.problems.map((problem, index) => (
                          <td key={contest.problems[index].label} className={`border-l border-white/70 px-1 py-4 font-mono ${problemStyles[problem.status] ?? problemStyles.empty}`}>
                            <span className="block font-bold">{problem.result}</span>
                            {problem.time && <span className="mt-1 block text-xs">{problem.time}</span>}
                          </td>
                        ))}
                        <td className="px-1 py-4 font-mono font-black text-purple">{entry.solved}</td>
                        <td className="px-1 py-4 font-mono text-slatecopy">{entry.penalty}</td>
                        <td className="px-1 py-4 font-mono text-slatecopy">{entry.dirt}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div data-testid="expanded-team-standings" className="divide-y divide-purple/10 border-y border-purple/10 xl:hidden">
              {contest.standings.map((entry) => {
                const team = trainingTeams.find((item) => item.id === entry.teamId);
                return (
                  <article key={entry.teamId} className="py-5">
                    <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto]">
                      {team ? <TeamIdentity team={team} rank={entry.rank} sourceName={contest.showSourceIdentity ? entry.sourceTeamName : undefined} sourceMembers={contest.showSourceIdentity ? entry.sourceMembers : undefined} /> : <p>{entry.username}</p>}
                      <dl className="grid grid-cols-4 gap-4 sm:text-right">
                        {[
                          ['Rating', ratingFormatter.format(entry.rating)],
                          ['Solved', entry.solved],
                          [contest.sourceUrl ? '总用时' : 'Penalty', entry.penalty],
                          ['Dirt', entry.dirt],
                        ].map(([label, value]) => (
                          <div key={label} title={label === 'Rating' ? entry.ratingFormula : undefined}>
                            <dt className="text-xs font-medium text-slatecopy/70">{label}</dt>
                            <dd className="mt-1 font-mono text-lg font-bold tabular-nums text-purple">{value}</dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                    <div className={`mt-4 grid grid-cols-5 gap-1.5 min-[480px]:grid-cols-7 ${contest.problems.length === 14 ? 'lg:grid-cols-[repeat(14,minmax(0,1fr))]' : 'lg:grid-cols-[repeat(13,minmax(0,1fr))]'}`}>
                      {entry.problems.map((problem, index) => {
                        const heading = contest.problems[index];
                        return (
                          <div key={heading.label} className={`min-h-[84px] px-1 py-2 text-center font-mono ${problemStyles[problem.status] ?? problemStyles.empty}`}>
                            <p className="flex items-center justify-center gap-1 text-purple">
                              <span className="text-xs font-black">{heading.label}</span>
                              <span className="text-[10px] text-slatecopy/60">{heading.accepted}/{heading.submissions}</span>
                            </p>
                            <p className="mt-2 text-sm font-bold">{problem.result}</p>
                            {problem.time && <p className="mt-1 text-xs">{problem.time}</p>}
                          </div>
                        );
                      })}
                    </div>
                  </article>
                );
              })}
            </div>
            <p className="mt-5 text-sm leading-7 text-slatecopy/70">
              Rating = y / x × (n − rk + 1) / n × 200；本场 x = {contest.topSolved}，n = {contest.totalTeams}。
              x 为原榜第一名题数，y 为本队题数，n 为原榜队伍数，rk 为原榜排名；保留一位小数。
              {' '}Dirt = 已通过题目的错误提交 / 这些题的总提交，向下取整。
              {contest.sourceUrl && ' 本场 n 不含打星队伍；总用时沿用 Pintia 原榜，已含错误提交罚时；Dirt 根据逐题提交记录计算。'}
            </p>
          </>
        ) : <h1 className="mt-8 border-y border-purple/10 py-12 text-center text-2xl font-black text-purple">未找到比赛榜单</h1>}
      </section>
    </main>
  );
}
