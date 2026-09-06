import { ArrowLeft, CalendarDays, Check, Medal, Trophy, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  selectionStanding,
  selectionStandingMeta,
  type SelectionStandingEntry,
} from '../data/standing';

type RankedStandingEntry = SelectionStandingEntry & {
  rank: number;
};

const scoreFormatter = new Intl.NumberFormat('zh-CN', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const stages = [
  { name: 'ZJU 七月集训', date: '7月6日 - 7月20日', weight: 20 },
  { name: '个人选拔赛 Day 1', date: '9月2日', weight: 40 },
  { name: '个人选拔赛 Day 2', date: '9月3日', weight: 40 },
] as const;

const rankedStanding: RankedStandingEntry[] = [...selectionStanding]
  .sort(
    (a, b) =>
      b.totalScore - a.totalScore ||
      b.day2Score - a.day2Score ||
      b.day1Score - a.day1Score ||
      a.name.localeCompare(b.name, 'zh-CN'),
  )
  .map((entry, index) => ({ ...entry, rank: index + 1 }));

const rankStyles = [
  'border-purple bg-purple text-white shadow-[0_16px_40px_rgba(74,37,139,0.18)]',
  'border-slate-300 bg-white text-purple',
  'border-orange/30 bg-[#fff8ed] text-purple',
];

function ScoreValue({ score, maximum }: { score: number; maximum: number }) {
  return (
    <div className="text-center">
      <span className="font-mono text-lg font-black text-purple">{scoreFormatter.format(score)}</span>
      <span className="ml-1 text-xs font-bold text-slatecopy/55">/ {maximum}</span>
    </div>
  );
}

function RankBadge({ rank }: { rank: number }) {
  return (
    <span
      className={`grid h-9 w-9 shrink-0 place-items-center rounded-full font-mono text-sm font-black ${
        rank <= 3 ? 'bg-orange text-white' : 'bg-lavender2 text-purple'
      }`}
    >
      {String(rank).padStart(2, '0')}
    </span>
  );
}

export function TrainingStanding() {
  const publishedWeight = selectionStandingMeta.publishedWeight;

  return (
    <main className="slide-bg ppt-track">
      <section className="wide-shell section-y">
        <Link
          to="/training"
          className="inline-flex items-center gap-2 text-sm font-black text-purple transition hover:text-orange"
        >
          <ArrowLeft size={17} />
          返回竞赛队组建规则
        </Link>

        <header className="mt-7 grid items-end gap-7 lg:grid-cols-[1fr_auto]">
          <div>
            <p className="orange-marker text-sm font-black uppercase tracking-normal text-purple">Selection Standing</p>
            <h1 className="mt-4 text-4xl font-black leading-tight text-purple sm:text-5xl">个人选拔成绩榜</h1>
            <p className="mt-4 max-w-3xl text-base leading-8 text-slatecopy sm:text-lg">
              三项成绩均已发布。ZJU 七月集训成绩为已换算的 20 分项，两场个人选拔赛成绩各占 40 分。
            </p>
          </div>
          <div className="rounded border border-orange/25 bg-orange/10 px-5 py-4 text-right">
            <p className="text-xs font-black text-orange">成绩已发布</p>
            <p className="mt-1 font-mono text-3xl font-black text-purple">{publishedWeight} / 100</p>
          </div>
        </header>

        <section className="mt-9 overflow-hidden rounded border border-purple/10 bg-white shadow-sm">
          <div className="flex h-2 w-full bg-lavender2" aria-label={`已发布 ${publishedWeight}%`}>
            <span className="bg-purple" style={{ width: `${publishedWeight}%` }} />
          </div>
          <div className="grid md:grid-cols-3">
            {stages.map((stage, index) => (
              <article
                key={stage.name}
                className={`p-5 ${index > 0 ? 'border-t border-purple/10 md:border-l md:border-t-0' : ''}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-black text-orange">已计入总分</p>
                    <h2 className="mt-2 text-lg font-black text-purple">{stage.name}</h2>
                  </div>
                  <span className="grid h-10 min-w-12 place-items-center rounded bg-purple px-2 font-mono text-sm font-black text-white">
                    {stage.weight}%
                  </span>
                </div>
                <p className="mt-3 flex items-center gap-2 text-sm text-slatecopy/70">
                  <Check size={15} className="text-orange" />
                  {stage.date}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            [Users, '参评人数', `${selectionStandingMeta.participantCount} 人`],
            [Check, '已发布项目', `${stages.length} 项`],
            [Trophy, '综合分满分', '100 分'],
            [CalendarDays, '数据截至', selectionStandingMeta.updatedThrough],
          ].map(([Icon, label, value]) => {
            const MetricIcon = Icon as typeof Users;
            return (
              <article key={label as string} className="rounded border border-purple/10 bg-white px-5 py-4 shadow-sm">
                <MetricIcon size={20} className="text-orange" />
                <p className="mt-3 text-xs font-black text-slatecopy/55">{label as string}</p>
                <p className="mt-1 text-xl font-black text-purple">{value as string}</p>
              </article>
            );
          })}
        </section>

        <section className="mt-10">
          <div className="flex items-end justify-between gap-5">
            <div>
              <p className="text-sm font-black text-orange">FINAL TOP 3</p>
              <h2 className="mt-2 text-3xl font-black text-purple">总分前三名</h2>
            </div>
            <p className="hidden text-sm text-slatecopy/60 sm:block">按公布总分排序</p>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {rankedStanding.slice(0, 3).map((entry, index) => (
              <article key={entry.name} className={`rounded border p-5 ${rankStyles[index]}`}>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Medal size={22} className={index === 0 ? 'text-gold' : index === 1 ? 'text-slate-400' : 'text-orange'} />
                    <span className={`font-mono text-sm font-black ${index === 0 ? 'text-white/65' : 'text-slatecopy/55'}`}>
                      NO.{String(entry.rank).padStart(2, '0')}
                    </span>
                  </div>
                  <span className={`text-xs font-black ${index === 0 ? 'text-white/60' : 'text-slatecopy/50'}`}>
                    最终成绩
                  </span>
                </div>
                <h3 className="mt-7 text-2xl font-black">{entry.name}</h3>
                <div className="mt-5 flex items-end justify-between gap-4">
                  <div>
                    <p className={`text-xs font-black ${index === 0 ? 'text-white/60' : 'text-slatecopy/55'}`}>综合总分</p>
                    <p className="mt-1 font-mono text-3xl font-black">{scoreFormatter.format(entry.totalScore)}</p>
                  </div>
                  <p className={`text-right text-xs leading-5 ${index === 0 ? 'text-white/60' : 'text-slatecopy/55'}`}>
                    ZJU 集训
                    <br />
                    {scoreFormatter.format(entry.zjuScore)} / 20
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-black text-orange">FINAL STANDING</p>
              <h2 className="mt-2 text-3xl font-black text-purple">完整排名</h2>
            </div>
            <p className="rounded border border-purple/10 bg-white px-4 py-2 text-sm text-slatecopy shadow-sm">
              按最终总分由高到低排列
            </p>
          </div>

          <div className="mt-5 hidden overflow-hidden rounded border border-purple/10 bg-white shadow-sm md:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] border-collapse">
                <thead>
                  <tr className="bg-purple text-left text-xs font-black text-white">
                    <th className="w-24 px-5 py-4 text-center">排名</th>
                    <th className="px-5 py-4">选手</th>
                    <th className="w-48 px-5 py-4 text-center">ZJU 集训 · 20%</th>
                    <th className="w-40 px-5 py-4 text-center">Day 1 · 40%</th>
                    <th className="w-40 px-5 py-4 text-center">Day 2 · 40%</th>
                    <th className="w-40 px-5 py-4 text-right">总分</th>
                  </tr>
                </thead>
                <tbody>
                  {rankedStanding.map((entry) => (
                    <tr key={entry.name} className="border-t border-purple/10 transition hover:bg-lavender2/70">
                      <td className="px-5 py-4"><div className="flex justify-center"><RankBadge rank={entry.rank} /></div></td>
                      <td className="px-5 py-4 font-black text-ink">{entry.name}</td>
                      <td className="px-5 py-4"><ScoreValue score={entry.zjuScore} maximum={20} /></td>
                      <td className="px-5 py-4"><ScoreValue score={entry.day1Score} maximum={40} /></td>
                      <td className="px-5 py-4"><ScoreValue score={entry.day2Score} maximum={40} /></td>
                      <td className="px-5 py-4 text-right">
                        <span className="font-mono text-xl font-black text-purple">{scoreFormatter.format(entry.totalScore)}</span>
                        <span className="ml-1 text-xs font-bold text-slatecopy/45">/ 100</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-5 grid gap-3 md:hidden">
            {rankedStanding.map((entry) => (
              <article key={entry.name} className="rounded border border-purple/10 bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between gap-4">
                  <span className="flex min-w-0 items-center gap-3">
                    <RankBadge rank={entry.rank} />
                    <span className="truncate font-black text-ink">{entry.name}</span>
                  </span>
                  <span className="text-right">
                    <span className="block text-[11px] font-black text-slatecopy/45">总分</span>
                    <span className="block font-mono text-xl font-black text-purple">{scoreFormatter.format(entry.totalScore)}</span>
                  </span>
                </div>
                <div className="mt-4 grid grid-cols-3 divide-x divide-purple/10 rounded bg-lavender2 py-3">
                  <div className="px-2">
                    <p className="mb-2 text-center text-[10px] font-black text-slatecopy/50">ZJU · 20%</p>
                    <ScoreValue score={entry.zjuScore} maximum={20} />
                  </div>
                  <div className="px-2">
                    <p className="mb-2 text-center text-[10px] font-black text-slatecopy/50">Day 1 · 40%</p>
                    <ScoreValue score={entry.day1Score} maximum={40} />
                  </div>
                  <div className="px-2">
                    <p className="mb-2 text-center text-[10px] font-black text-slatecopy/50">Day 2 · 40%</p>
                    <ScoreValue score={entry.day2Score} maximum={40} />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <p className="mt-6 text-sm leading-7 text-slatecopy/60">
          说明：ZJU 七月集训成绩采用成绩表中已完成的 20 分折算结果，不再二次换算。各分项按两位小数展示，总分以公布结果为准。
        </p>
      </section>
    </main>
  );
}
