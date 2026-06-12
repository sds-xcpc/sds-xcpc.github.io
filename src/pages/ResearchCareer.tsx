import { Building2, GraduationCap } from 'lucide-react';
import { PublicationCard } from '../components/Cards';
import { SectionHeading } from '../components/SectionHeading';
import { alumni, companies, publications } from '../data/site';

export function ResearchCareer() {
  return (
    <main className="slide-bg ppt-track">
      <section className="wide-shell section-y">
        <SectionHeading
          eyebrow="Development"
          title="发展与深造"
        />

        <div className="mt-8 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="grid gap-4">
            {publications.map((publication) => (
              <PublicationCard key={publication.title} publication={publication} />
            ))}
          </div>
          <aside className="rounded border border-purple/10 bg-white p-6 shadow-sm">
            <Building2 className="text-orange" size={30} />
            <h2 className="mt-4 text-3xl font-black text-purple">企业实习合作</h2>
            <p className="mt-4 text-base leading-8 text-slatecopy">
              与多家知名企业建立了友好合作关系，绝大多数竞赛队员成功获得顶尖企业实习机会。
            </p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              {companies.map((company) => (
                <div key={company.name} className="grid min-h-36 place-items-center rounded border border-purple/10 bg-lavender2 p-3">
                  <img
                    src={`${import.meta.env.BASE_URL}${company.logo}`}
                    alt={company.name}
                    className={`${company.name === '华为云' ? 'max-h-32 max-w-[98%]' : 'max-h-28 max-w-[94%]'} object-contain`}
                  />
                </div>
              ))}
            </div>
          </aside>
        </div>

        <section className="mt-12">
          <h2 className="orange-marker text-3xl font-black text-purple">升学与职业发展案例</h2>
          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {alumni.slice(0, 6).map((item) => (
              <article key={item.name} className="rounded border border-purple/10 bg-white p-5 shadow-sm">
                <GraduationCap className="text-orange" size={26} />
                <h3 className="mt-3 text-2xl font-black text-purple">{item.name}</h3>
                <p className="mt-2 text-base font-bold text-ink">{item.contest}</p>
                <p className="mt-3 text-base leading-8 text-slatecopy">{item.research}</p>
                <p className="mt-4 rounded bg-lavender2 px-3 py-2 text-base font-bold text-purple">{item.destination}</p>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
