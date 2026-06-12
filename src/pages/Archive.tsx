import { AwardeeDirectory } from '../components/AwardeeDirectory';
import { EventCard, PublicationCard } from '../components/Cards';
import { SectionHeading } from '../components/SectionHeading';
import { events, mission, publications, teamIntro } from '../data/site';

export function Archive() {
  return (
    <main className="slide-bg ppt-track">
      <section className="wide-shell section-y">
        <SectionHeading
          eyebrow="Archive"
          title="完整资料库"
        />

        <section className="mt-8 rounded border border-purple/10 bg-white p-6 shadow-sm">
          <h2 className="text-3xl font-black text-purple">团队简介</h2>
          {teamIntro.map((paragraph) => (
            <p key={paragraph} className="mt-4 text-base leading-8 text-slatecopy">
              {paragraph}
            </p>
          ))}
          <p className="mt-4 text-base leading-8 text-slatecopy">{mission}</p>
        </section>

        <section className="mt-10">
          <AwardeeDirectory />
        </section>

        <section className="mt-10">
          <h2 className="orange-marker text-3xl font-black text-purple">科研活动与论文</h2>
          <div className="mt-6 grid gap-4">
            {publications.map((publication) => (
              <PublicationCard key={publication.title} publication={publication} />
            ))}
          </div>
        </section>

        <section className="mt-10">
          <h2 className="orange-marker text-3xl font-black text-purple">全部活动记录</h2>
          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            {events.map((event) => (
              <EventCard key={event.title} event={event} />
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
