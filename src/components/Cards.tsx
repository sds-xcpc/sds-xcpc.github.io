import { useEffect, useState } from 'react';
import type { EventItem, FeaturedTeam, Person, Publication } from '../data/site';

const fitMediaStyle = {
  position: 'absolute',
  inset: '0.75rem',
  width: 'calc(100% - 1.5rem)',
  height: 'calc(100% - 1.5rem)',
  objectFit: 'contain',
} as const;

export function PersonCard({ person }: { person: Person }) {
  return (
    <article className="lift flex h-full flex-col overflow-hidden rounded border border-purple/10 bg-white shadow-sm">
      {person.image && (
        <div className="relative h-60 bg-lavender2">
          <img src={`${import.meta.env.BASE_URL}${person.image}`} alt={person.name} style={fitMediaStyle} />
        </div>
      )}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-2xl font-black text-purple">{person.name}</h3>
        <p className="mt-2 text-sm font-semibold text-slatecopy">
          {[person.role, person.affiliation].filter(Boolean).join(' / ')}
        </p>
        {person.period && <p className="mt-1 text-sm text-slatecopy">任期：{person.period}</p>}
        <p className="mt-4 text-sm leading-7 text-slatecopy">{person.bio}</p>
      </div>
    </article>
  );
}

export function TeamCard({ team }: { team: FeaturedTeam }) {
  return (
    <article className="lift overflow-hidden rounded border border-purple/10 bg-white shadow-sm">
      <div className="relative h-60 bg-lavender2">
        <img src={`${import.meta.env.BASE_URL}${team.image}`} alt={`${team.name} 队伍照片`} style={fitMediaStyle} />
      </div>
      <div className="p-5">
        <h3 className="text-2xl font-black text-purple">{team.name}</h3>
        {team.englishName && <p className="mt-1 font-mono text-sm text-slatecopy">{team.englishName}</p>}
        <p className="mt-4 text-sm font-semibold text-ink">成员：{team.members.join('、')}</p>
        <div className="mt-4 grid gap-2">
          {team.honors.map((honor) => (
            <span key={honor} className="rounded bg-orange/10 px-3 py-2 text-sm font-semibold text-purple">
              {honor}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

export function PublicationCard({ publication }: { publication: Publication }) {
  return (
    <article className="lift rounded border border-purple/10 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-xl font-black leading-7 text-purple">{publication.title}</h3>
        <span className="shrink-0 rounded bg-purple px-3 py-1 text-sm font-bold text-white">{publication.venue}</span>
      </div>
      <p className="mt-3 text-sm font-semibold text-ink">{publication.authors}</p>
      <p className="mt-3 text-sm leading-7 text-slatecopy">{publication.description}</p>
    </article>
  );
}

export function EventCard({ event }: { event: EventItem }) {
  const images = event.images.length > 0 ? event.images : event.image ? [event.image] : [];
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    setActiveImage(0);

    if (images.length <= 1) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setActiveImage((value) => (value + 1) % images.length);
    }, 5200);

    return () => window.clearInterval(intervalId);
  }, [event.title, images.length]);

  const image = images[activeImage % images.length];

  return (
    <article className="lift overflow-hidden rounded border border-purple/10 bg-white shadow-sm">
      <div className="relative aspect-[16/9] overflow-hidden bg-lavender2">
        {image && (
          <img
            src={`${import.meta.env.BASE_URL}${image}`}
            alt={event.title}
            className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700"
          />
        )}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
            {images.map((item, index) => (
              <span
                key={item}
                className={`h-1.5 rounded-full transition-all ${
                  index === activeImage ? 'w-7 bg-orange' : 'w-1.5 bg-white/80'
                }`}
              />
            ))}
          </div>
        )}
      </div>
      <div className="p-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="bg-orange/15 px-3 py-1 text-xs font-bold text-purple">{event.type}</span>
          <span className="bg-lavender px-3 py-1 text-xs font-bold text-purple">{event.date}</span>
        </div>
        <h3 className="mt-3 text-2xl font-black text-purple">{event.title}</h3>
        <p className="mt-1 text-sm font-semibold text-slatecopy">{event.location}</p>
        <p className="mt-3 text-sm leading-7 text-slatecopy">{event.body}</p>
        <div className="mt-4 grid gap-2 border-t border-purple/10 pt-4">
          {event.metrics.map((metric) => (
            <div key={metric} className="border-l-2 border-orange/70 pl-3 text-sm font-semibold leading-6 text-purple">
              {metric}
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}
