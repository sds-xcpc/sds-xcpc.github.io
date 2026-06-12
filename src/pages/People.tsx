import { PersonCard } from '../components/Cards';
import { SectionHeading } from '../components/SectionHeading';
import { alumni, captains, teachers } from '../data/site';

export function People() {
  return (
    <main className="slide-bg ppt-track">
      <section className="wide-shell section-y">
        <SectionHeading
          eyebrow="People"
          title="指导教师、队长与队员去向"
        />

        <section className="mt-10">
          <h2 className="orange-marker text-3xl font-black text-purple">指导教师</h2>
          <div className="mt-6 grid gap-5 lg:grid-cols-3">
            {teachers.map((teacher) => (
              <PersonCard key={teacher.name} person={teacher} />
            ))}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="orange-marker text-3xl font-black text-purple">历任队长</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
            {captains.map((captain) => (
              <PersonCard key={captain.name} person={captain} />
            ))}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="orange-marker text-3xl font-black text-purple">优秀队员去向</h2>
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {alumni.map((item) => (
              <article key={item.name} className="rounded border border-purple/10 bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="text-2xl font-black text-purple">{item.name}</h3>
                  <span className="rounded bg-orange px-3 py-1 text-xs font-bold text-white">{item.cohort}</span>
                </div>
                <p className="mt-3 text-sm font-bold text-ink">{item.contest}</p>
                <p className="mt-3 text-sm leading-7 text-slatecopy">{item.research}</p>
                {item.career && <p className="mt-2 text-sm leading-7 text-slatecopy">{item.career}</p>}
                <p className="mt-4 rounded bg-lavender2 px-4 py-3 text-sm font-bold text-purple">{item.destination}</p>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
