import { roadmap, timeline } from '../data/site';

export function GrowthRoadmap() {
  return (
    <div className="relative grid gap-4 lg:grid-cols-5">
      {roadmap.map((stage, index) => (
        <article key={stage.stage} className="relative rounded border border-purple/15 bg-white/86 p-5 shadow-sm">
          {index < roadmap.length - 1 && (
            <span className="absolute left-[calc(100%-0.5rem)] top-12 hidden h-2 w-8 bg-gradient-to-r from-purple to-orange lg:block" />
          )}
          <span className="inline-flex h-9 min-w-9 items-center justify-center rounded-full bg-orange px-3 text-sm font-black text-white">
            {index + 1}
          </span>
          <p className="mt-4 text-xs font-bold uppercase text-orange">{stage.stage}</p>
          <h3 className="mt-1 text-xl font-black text-purple">{stage.title}</h3>
          <p className="mt-3 text-sm leading-7 text-slatecopy">{stage.body}</p>
          <p className="mt-4 font-mono text-xs font-bold text-cyan">{stage.tag}</p>
        </article>
      ))}
    </div>
  );
}

export function Timeline({ compact = false }: { compact?: boolean }) {
  const items = compact ? timeline.filter((item) => item.featured).slice(0, 6) : timeline;
  const cardWidth = compact ? 'w-80' : 'w-96';
  const itemHeight = compact ? 'h-80' : 'h-[24rem]';
  const trackPadding = compact ? 'py-8' : 'py-10';
  const cardUpperOffset = compact ? '-translate-y-4' : '-translate-y-6';
  const cardLowerOffset = compact ? 'translate-y-4' : 'translate-y-6';
  const renderItems = (copy: number) =>
    items.map((item, index) => {
      const upper = index % 2 === 0;

      return (
        <article
          key={`${copy}-${item.date}-${item.title}`}
          aria-hidden={copy > 0}
          className={`relative flex ${itemHeight} shrink-0 ${cardWidth} ${upper ? 'items-start' : 'items-end'}`}
        >
          <div className="absolute left-1/2 top-1/2 z-10 grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-4 border-white bg-purple text-sm font-black text-white shadow-lg shadow-purple/20">
            {String(index + 1).padStart(2, '0')}
          </div>
          <div
            className={`absolute left-1/2 z-0 w-px -translate-x-1/2 bg-purple/20 ${
              upper ? 'top-[calc(50%-4.5rem)] h-16' : 'top-1/2 h-16'
            }`}
          />
          <div
            className={`w-full rounded border border-purple/10 bg-white p-5 shadow-sm ${
              item.featured ? 'ring-2 ring-orange/25' : ''
            } ${upper ? cardUpperOffset : cardLowerOffset}`}
          >
            <p className="font-mono text-base font-black text-orange">{item.date}</p>
            <h3 className="mt-2 text-xl font-black leading-7 text-purple">{item.title}</h3>
            <p className="mt-3 text-base leading-7 text-slatecopy">{item.detail}</p>
          </div>
        </article>
      );
    });

  return (
    <div className="timeline-marquee overflow-hidden pb-4">
      <div className={`timeline-marquee-track flex w-max ${compact ? 'timeline-marquee-track-compact' : ''}`}>
        {[0, 1].map((copy) => (
          <div key={copy} className={`relative flex gap-8 px-2 ${trackPadding} pr-10`}>
            <div className="absolute left-10 right-10 top-1/2 h-1 -translate-y-1/2 rounded-full bg-gradient-to-r from-orange via-purple to-cyan shadow-sm" />
            {renderItems(copy)}
          </div>
        ))}
      </div>
    </div>
  );
}
