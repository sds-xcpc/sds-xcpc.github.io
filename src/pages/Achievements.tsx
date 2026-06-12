import { AwardeeDirectory } from '../components/AwardeeDirectory';
import { TeamCard } from '../components/Cards';
import { Timeline } from '../components/Roadmap';
import { SectionHeading } from '../components/SectionHeading';
import { featuredTeams, stats } from '../data/site';

export function Achievements() {
  return (
    <main className="slide-bg ppt-track">
      <section className="wide-shell section-y">
        <SectionHeading
          eyebrow="Achievements"
          title="成果与完整获奖名单"
        />
        <div className="mt-8 grid gap-4 md:grid-cols-4">
          {stats.map((stat) => {
            const longValue = stat.value.includes('/');

            return (
              <article key={stat.label} className="rounded border border-purple/10 bg-white p-5 shadow-sm">
                <p className={`font-mono font-black text-orange ${longValue ? 'whitespace-nowrap text-[2rem]' : 'text-3xl'}`}>
                  {stat.value}
                </p>
                <h3 className="mt-2 text-xl font-black text-purple">{stat.label}</h3>
                <p className="mt-3 text-sm leading-6 text-slatecopy">{stat.caption}</p>
              </article>
            );
          })}
        </div>

        <div className="mt-10">
          <h2 className="orange-marker text-3xl font-black text-purple">团队发展时间线</h2>
          <div className="mt-6">
            <Timeline />
          </div>
        </div>

        <div className="mt-12">
          <h2 className="orange-marker text-3xl font-black text-purple">优秀队伍</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {featuredTeams.map((team) => (
              <TeamCard key={team.name} team={team} />
            ))}
          </div>
        </div>

        <div className="mt-12">
          <AwardeeDirectory />
        </div>
      </section>
    </main>
  );
}
