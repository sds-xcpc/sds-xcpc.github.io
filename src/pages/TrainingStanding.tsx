import { Fragment, useState } from 'react';
import { ArrowLeft, CalendarDays, Check, ChevronDown, Clock3, Medal, Trophy, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  selectionStanding,
  selectionStandingMeta,
  trainingSessionDates,
  type SelectionStandingEntry,
} from '../data/standing';

type RankedStandingEntry = SelectionStandingEntry & {
  rank: number;
  currentScore: number;
  zjuRawTotal: number;
  zjuScore: number;
  countedScoreIndexes: number[];
  countedTrainingScores: Array<{ index: number; score: number }>;
};

const scoreFormatter = new Intl.NumberFormat('zh-CN', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const stages = [
  { name: 'ZJU 七月集训', date: '7月6日 - 7月20日', weight: 20, status: 'published' },
  { name: '个人选拔赛 Day 1', date: '9月2日', weight: 40, status: 'pending' },
  { name: '个人选拔赛 Day 2', date: '9月3日', weight: 40, status: 'pending' },
] as const;

const rankedStanding: RankedStandingEntry[] = selectionStanding
  .map((entry) => {
    const countedTrainingScores = entry.trainingScores
      .map((score, index) => ({ index, score }))
      .sort((a, b) => b.score - a.score || a.index - b.index)
      .slice(0, selectionStandingMeta.countedSessions);
    const zjuRawTotal = countedTrainingScores.reduce((sum, item) => sum + item.score, 0);
    const zjuScore = zjuRawTotal / 30;

    return {
      ...entry,
      countedTrainingScores,
      countedScoreIndexes: countedTrainingScores.map((item) => item.index),
      zjuRawTotal,
      zjuScore,
      currentScore: zjuScore + (entry.day1Score ?? 0) + (entry.day2Score ?? 0),
    };
  })
  .sort((a, b) => b.currentScore - a.currentScore || b.zjuRawTotal - a.zjuRawTotal || a.name.localeCompare(b.name, 'zh-CN'))
  .map((entry, index) => ({ ...entry, rank: index + 1 }));

const rankStyles = [
  'border-purple bg-purple text-white shadow-[0_16px_40px_rgba(74,37,139,0.18)]',
  'border-slate-300 bg-white text-purple',
  'border-orange/30 bg-[#fff8ed] text-purple',
];

function ScoreValue({ score, maximum, pendingDate }: { score: number | null; maximum: number; pendingDate?: string }) {
  if (score === null) {
    return (
      <div className="text-center">
        <span className="block text-sm font-black text-slatecopy/45">待发布</span>
        {pendingDate && <span className="mt-1 block text-xs text-slatecopy/55">{pendingDate}</span>}
      </div>
    );
  }

  return (
    <div className="text-center">
      <span className="font-mono text-lg font-black text-purple">{scoreFormatter.format(score)}</span>
      <span className="ml-1 text-xs font-bold text-slatecopy/55">/ {maximum}</span>
    </div>
  );
}

function RankBadge({ rank }: { rank: number }) {
  const highlighted = rank <= 3;
  return (
    <span
      className={`grid h-9 w-9 shrink-0 place-items-center rounded-full font-mono text-sm font-black ${
        highlighted ? 'bg-orange text-white' : 'bg-lavender2 text-purple'
      }`}
    >
      {String(rank).padStart(2, '0')}
    </span>
  );
}

function ScoreBreakdown({ entry }: { entry: RankedStandingEntry }) {
  const countedIndexes = new Set(entry.countedScoreIndexes);
  const addition = entry.countedTrainingScores.map((item) => scoreFormatter.format(item.score)).join(' + ');

  return (
    <div className="border-t border-purple/10 bg-lavender2/70 px-4 py-5 sm:px-6" data-testid={`breakdown-${entry.code}`}>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-black text-orange">集训计分明细</p>
          <h4 className="mt-1 text-lg font-black text-purple">8 场取最高 6 场</h4>
        </div>
        <p className="text-xs leading-5 text-slatecopy/55">紫色为计入总分的场次，灰色为舍去场次</p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4 xl:grid-cols-8">
        {entry.trainingScores.map((score, index) => {
          const counted = countedIndexes.has(index);
          return (
            <div
              key={trainingSessionDates[index]}
              className={`rounded border px-3 py-3 text-center ${
                counted ? 'border-purple/20 bg-white shadow-sm' : 'border-slate-200 bg-slate-100/70 text-slatecopy/45'
              }`}
            >
              <p className={`text-xs font-black ${counted ? 'text-orange' : 'text-slatecopy/40'}`}>
                {trainingSessionDates[index]}
              </p>
              <p className={`mt-2 font-mono text-lg font-black ${counted ? 'text-purple' : 'text-slatecopy/45'}`}>
                {scoreFormatter.format(score)}
              </p>
              <p className={`mt-1 text-[10px] font-black ${counted ? 'text-purple/55' : 'text-slatecopy/35'}`}>
                {counted ? '计入' : '舍去'}
              </p>
            </div>
          );
        })}
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-[1fr_auto]">
        <div className="rounded border border-purple/10 bg-white px-4 py-3">
          <p className="text-xs font-black text-slatecopy/50">最高 6 场合计</p>
          <p className="mt-2 break-words font-mono text-sm font-black leading-6 text-purple">
            {addition} = {scoreFormatter.format(entry.zjuRawTotal)}
          </p>
        </div>
        <div className="rounded border border-orange/20 bg-orange/10 px-4 py-3 lg:min-w-60">
          <p className="text-xs font-black text-orange">20% 折算</p>
          <p className="mt-2 font-mono text-lg font-black text-purple">
            {scoreFormatter.format(entry.zjuRawTotal)} ÷ 30 = {scoreFormatter.format(entry.zjuScore)}
          </p>
        </div>
      </div>
    </div>
  );
}

export function TrainingStanding() {
  const [expandedCode, setExpandedCode] = useState<string | null>(null);
  const publishedWeight = stages.filter((stage) => stage.status === 'published').reduce((sum, stage) => sum + stage.weight, 0);
  const toggleBreakdown = (code: string) => setExpandedCode((current) => (current === code ? null : code));

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
              当前排名仅计入 ZJU 七月集训折算成绩。两场个人选拔赛成绩发布后，综合分与名次将在同一页面继续更新。
            </p>
          </div>
          <div className="rounded border border-orange/25 bg-orange/10 px-5 py-4 text-right">
            <p className="text-xs font-black text-orange">当前已发布</p>
            <p className="mt-1 font-mono text-3xl font-black text-purple">{publishedWeight} / 100</p>
          </div>
        </header>

        <section className="mt-9 overflow-hidden rounded border border-purple/10 bg-white shadow-sm">
          <div className="flex h-2 w-full bg-lavender2" aria-label={`已发布 ${publishedWeight}%`}>
            <span className="bg-purple" style={{ width: `${publishedWeight}%` }} />
          </div>
          <div className="grid md:grid-cols-3">
            {stages.map((stage, index) => {
              const published = stage.status === 'published';
              return (
                <article
                  key={stage.name}
                  className={`p-5 ${index > 0 ? 'border-t border-purple/10 md:border-l md:border-t-0' : ''}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className={`text-xs font-black ${published ? 'text-orange' : 'text-slatecopy/45'}`}>
                        {published ? '已计入综合分' : '待发布'}
                      </p>
                      <h2 className="mt-2 text-lg font-black text-purple">{stage.name}</h2>
                    </div>
                    <span
                      className={`grid h-10 min-w-12 place-items-center rounded px-2 font-mono text-sm font-black ${
                        published ? 'bg-purple text-white' : 'bg-lavender2 text-purple/55'
                      }`}
                    >
                      {stage.weight}%
                    </span>
                  </div>
                  <p className="mt-3 flex items-center gap-2 text-sm text-slatecopy/70">
                    {published ? <Check size={15} className="text-orange" /> : <Clock3 size={15} />}
                    {stage.date}
                  </p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            [Users, '参评人数', `${selectionStandingMeta.participantCount} 人`],
            [CalendarDays, '集训场次', `${selectionStandingMeta.trainingSessions} 场`],
            [Trophy, '计分口径', `最高 ${selectionStandingMeta.countedSessions} 场`],
            [Clock3, '数据截至', selectionStandingMeta.updatedThrough],
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
              <p className="text-sm font-black text-orange">CURRENT TOP 3</p>
              <h2 className="mt-2 text-3xl font-black text-purple">当前领先</h2>
            </div>
            <p className="hidden text-sm text-slatecopy/60 sm:block">以已发布的 20 分计</p>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {rankedStanding.slice(0, 3).map((entry, index) => (
              <article key={entry.code} className={`rounded border p-5 ${rankStyles[index]}`}>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Medal size={22} className={index === 0 ? 'text-gold' : index === 1 ? 'text-slate-400' : 'text-orange'} />
                    <span className={`font-mono text-sm font-black ${index === 0 ? 'text-white/65' : 'text-slatecopy/55'}`}>
                      NO.{String(entry.rank).padStart(2, '0')}
                    </span>
                  </div>
                  <span className={`font-mono text-sm font-black ${index === 0 ? 'text-white/65' : 'text-slatecopy/45'}`}>
                    #{entry.code}
                  </span>
                </div>
                <h3 className="mt-7 text-2xl font-black">{entry.name}</h3>
                <div className="mt-5 flex items-end justify-between gap-4">
                  <div>
                    <p className={`text-xs font-black ${index === 0 ? 'text-white/60' : 'text-slatecopy/55'}`}>当前累计</p>
                    <p className="mt-1 font-mono text-3xl font-black">{scoreFormatter.format(entry.currentScore)}</p>
                  </div>
                  <p className={`text-right text-xs leading-5 ${index === 0 ? 'text-white/60' : 'text-slatecopy/55'}`}>
                    集训总分
                    <br />
                    {scoreFormatter.format(entry.zjuRawTotal)} / 600
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-black text-orange">FULL STANDING</p>
              <h2 className="mt-2 text-3xl font-black text-purple">完整排名</h2>
            </div>
            <p className="rounded border border-purple/10 bg-white px-4 py-2 text-sm text-slatecopy shadow-sm">
              点击队员姓名查看 8 场取 6 场的计算明细
            </p>
          </div>

          <div className="mt-5 hidden overflow-hidden rounded border border-purple/10 bg-white shadow-sm md:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] border-collapse">
                <thead>
                  <tr className="bg-purple text-left text-xs font-black text-white">
                    <th className="w-24 px-5 py-4 text-center">排名</th>
                    <th className="px-5 py-4">队员</th>
                    <th className="w-48 px-5 py-4 text-center">七月集训 · 20%</th>
                    <th className="w-40 px-5 py-4 text-center">Day 1 · 40%</th>
                    <th className="w-40 px-5 py-4 text-center">Day 2 · 40%</th>
                    <th className="w-40 px-5 py-4 text-right">当前累计</th>
                  </tr>
                </thead>
                <tbody>
                  {rankedStanding.map((entry) => {
                    const expanded = expandedCode === entry.code;
                    return (
                      <Fragment key={entry.code}>
                        <tr className={`border-t border-purple/10 transition ${expanded ? 'bg-lavender2/70' : 'hover:bg-lavender2/70'}`}>
                          <td className="px-5 py-4"><div className="flex justify-center"><RankBadge rank={entry.rank} /></div></td>
                          <td className="px-5 py-4">
                            <button
                              type="button"
                              className="group flex w-full items-center justify-between gap-3 text-left"
                              aria-expanded={expanded}
                              aria-controls={`standing-detail-${entry.code}`}
                              onClick={() => toggleBreakdown(entry.code)}
                            >
                              <span>
                                <span className="block font-black text-ink transition group-hover:text-purple">{entry.name}</span>
                                <span className="mt-1 block font-mono text-xs text-slatecopy/45">#{entry.code}</span>
                              </span>
                              <ChevronDown
                                size={17}
                                className={`shrink-0 text-purple transition-transform ${expanded ? 'rotate-180' : ''}`}
                              />
                            </button>
                          </td>
                          <td className="px-5 py-4">
                            <ScoreValue score={entry.zjuScore} maximum={20} />
                            <p className="mt-1 text-center text-[11px] text-slatecopy/45">
                              最高6场 {scoreFormatter.format(entry.zjuRawTotal)}
                            </p>
                          </td>
                          <td className="px-5 py-4"><ScoreValue score={entry.day1Score} maximum={40} pendingDate="9月2日" /></td>
                          <td className="px-5 py-4"><ScoreValue score={entry.day2Score} maximum={40} pendingDate="9月3日" /></td>
                          <td className="px-5 py-4 text-right">
                            <span className="font-mono text-xl font-black text-purple">{scoreFormatter.format(entry.currentScore)}</span>
                            <span className="ml-1 text-xs font-bold text-slatecopy/45">/ 100</span>
                          </td>
                        </tr>
                        {expanded && (
                          <tr id={`standing-detail-${entry.code}`}>
                            <td colSpan={6} className="p-0"><ScoreBreakdown entry={entry} /></td>
                          </tr>
                        )}
                      </Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-5 grid gap-3 md:hidden">
            {rankedStanding.map((entry) => (
              <article key={entry.code} className="rounded border border-purple/10 bg-white p-4 shadow-sm">
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-4 text-left"
                  aria-expanded={expandedCode === entry.code}
                  aria-controls={`standing-mobile-detail-${entry.code}`}
                  onClick={() => toggleBreakdown(entry.code)}
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <RankBadge rank={entry.rank} />
                    <span className="min-w-0">
                      <span className="block truncate font-black text-ink">{entry.name}</span>
                      <span className="mt-0.5 block font-mono text-xs text-slatecopy/45">#{entry.code}</span>
                    </span>
                  </span>
                  <span className="flex items-center gap-3">
                    <span className="text-right">
                      <span className="block text-[11px] font-black text-slatecopy/45">当前累计</span>
                      <span className="block font-mono text-xl font-black text-purple">{scoreFormatter.format(entry.currentScore)}</span>
                    </span>
                    <ChevronDown
                      size={17}
                      className={`shrink-0 text-purple transition-transform ${expandedCode === entry.code ? 'rotate-180' : ''}`}
                    />
                  </span>
                </button>
                <div className="mt-4 grid grid-cols-3 divide-x divide-purple/10 rounded bg-lavender2 py-3">
                  <div className="px-2"><ScoreValue score={entry.zjuScore} maximum={20} /></div>
                  <div className="px-2"><ScoreValue score={entry.day1Score} maximum={40} /></div>
                  <div className="px-2"><ScoreValue score={entry.day2Score} maximum={40} /></div>
                </div>
                {expandedCode === entry.code && (
                  <div id={`standing-mobile-detail-${entry.code}`} className="-mx-4 -mb-4 mt-4 overflow-hidden rounded-b">
                    <ScoreBreakdown entry={entry} />
                  </div>
                )}
              </article>
            ))}
          </div>
        </section>

        <p className="mt-6 text-sm leading-7 text-slatecopy/60">
          说明：七月集训总分取 8 场成绩中的最高 6 场，折算分满分为 20 分。当前排名为阶段性结果，不代表最终入围名单。
        </p>
      </section>
    </main>
  );
}
