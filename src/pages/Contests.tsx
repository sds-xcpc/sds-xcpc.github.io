import { Code2, Timer, Users } from 'lucide-react';
import { CtaLink } from '../components/CtaLink';
import { GrowthRoadmap } from '../components/Roadmap';
import { SectionHeading } from '../components/SectionHeading';
import { competitions, whyContest } from '../data/site';

export function Contests() {
  return (
    <main className="slide-bg ppt-track">
      <section className="wide-shell section-y">
        <SectionHeading
          eyebrow="Contests"
          title="竞赛与训练"
        />
        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {[
            [Users, '三名队员', '以团队的形式代表学校参赛，每队由三名队员组成。'],
            [Timer, '5小时', '使用一台电脑在5小时内用编程解决7-13道程序设计问题。'],
            [Code2, '竞赛目标', '旨在展示大学生创新能力、团队精神、和在压力下编写程序、分析和解决问题的能力。'],
          ].map(([Icon, title, body]) => (
            <article key={String(title)} className="rounded border border-purple/10 bg-white p-5 shadow-sm">
              <Icon className="text-orange" size={26} />
              <h3 className="mt-4 text-2xl font-black text-purple">{String(title)}</h3>
              <p className="mt-3 text-sm leading-7 text-slatecopy">{String(body)}</p>
            </article>
          ))}
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          {competitions.map((competition) => (
            <article key={competition.name} className="rounded border border-purple/10 bg-white/90 p-6 shadow-sm">
              <div className="flex h-44 items-center justify-center rounded bg-white sm:h-52">
                <img
                  src={`${import.meta.env.BASE_URL}${competition.image}`}
                  alt={competition.name}
                  className="h-full w-auto max-w-full object-contain"
                />
              </div>
              <p className="mt-5 text-center font-mono text-xs font-bold text-orange">{competition.englishName}</p>
              <h2 className="mt-2 text-center text-3xl font-black text-purple">{competition.name}</h2>
              <p className="mt-4 text-base leading-8 text-slatecopy">{competition.summary}</p>
              <div className="mt-5 grid gap-2">
                {competition.system.map((item) => (
                  <span key={item} className="rounded bg-lavender2 px-4 py-3 text-sm font-bold text-purple">
                    {item}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-4">
          {whyContest.map((item) => (
            <article key={item.title} className="rounded border border-purple/10 bg-white p-5 shadow-sm">
              <h3 className="text-xl font-black text-purple">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slatecopy">{item.body}</p>
            </article>
          ))}
        </div>

        <div className="mt-12">
          <h2 className="orange-marker text-3xl font-black text-purple">训练路径</h2>
          <div className="mt-6">
            <GrowthRoadmap />
          </div>
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <CtaLink to="/join">了解加入方式</CtaLink>
        </div>
      </section>
    </main>
  );
}
