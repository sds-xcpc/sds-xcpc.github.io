import { EventCard } from '../components/Cards';
import { SectionHeading } from '../components/SectionHeading';
import { events } from '../data/site';

export function Events() {
  return (
    <main className="slide-bg ppt-track">
      <section className="wide-shell section-y">
        <SectionHeading
          eyebrow="Events"
          title="活动风采"
        />
        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          {events.map((event) => (
            <EventCard key={event.title} event={event} />
          ))}
        </div>
      </section>
    </main>
  );
}
