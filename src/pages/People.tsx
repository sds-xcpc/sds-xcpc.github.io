import { PersonCard } from '../components/Cards';
import { SectionHeading } from '../components/SectionHeading';
import { captains, teachers } from '../data/site';

export function People() {
  return (
    <main className="slide-bg ppt-track">
      <section className="wide-shell section-y">
        <SectionHeading
          eyebrow="People"
          title="指导教师与历任队长"
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

      </section>
    </main>
  );
}
