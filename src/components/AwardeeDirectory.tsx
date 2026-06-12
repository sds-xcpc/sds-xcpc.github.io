import { Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { awardees } from '../data/site';

const years = ['全部年级', ...Array.from(new Set(awardees.map((item) => `${item.year} 级`)))];
const medalTypes = ['全部奖项', 'World Final', '金奖', '银奖', '铜奖'];

const matchesMedal = (achievement: string, medal: string) => {
  if (medal === 'World Final') {
    return achievement.includes('World Final') || achievement.includes('世界总决赛');
  }

  return achievement.includes(medal);
};

export function AwardeeDirectory() {
  const [query, setQuery] = useState('');
  const [year, setYear] = useState(years[0]);
  const [medal, setMedal] = useState(medalTypes[0]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return awardees.filter((item) => {
      const matchQuery =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.school.toLowerCase().includes(q) ||
        item.achievement.toLowerCase().includes(q);
      const matchYear = year === '全部年级' || `${item.year} 级` === year;
      const matchMedal = medal === medalTypes[0] || matchesMedal(item.achievement, medal);
      return matchQuery && matchYear && matchMedal;
    });
  }, [query, year, medal]);

  return (
    <section id="awardees" className="rounded border border-purple/10 bg-white p-4 shadow-sm sm:p-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-2xl font-black text-purple">曾获 ICPC / CCPC 奖项队员</h2>
          <p className="mt-1 text-sm text-slatecopy">共 {filtered.length} 条记录</p>
        </div>
        <div className="grid gap-2 sm:grid-cols-[1fr_auto_auto]">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-purple/55" size={17} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="搜索姓名、学院或奖项"
              className="h-11 w-full rounded border border-purple/15 bg-lavender2 pl-10 pr-3 text-sm outline-none transition focus:border-orange focus:bg-white"
            />
          </label>
          <select
            value={year}
            onChange={(event) => setYear(event.target.value)}
            className="h-11 rounded border border-purple/15 bg-white px-3 text-sm font-semibold text-purple outline-none focus:border-orange"
          >
            {years.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
          <select
            value={medal}
            onChange={(event) => setMedal(event.target.value)}
            className="h-11 rounded border border-purple/15 bg-white px-3 text-sm font-semibold text-purple outline-none focus:border-orange"
          >
            {medalTypes.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-5 hidden overflow-hidden rounded border border-purple/10 lg:block">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-purple text-white">
            <tr>
              <th className="px-4 py-3 font-bold">姓名</th>
              <th className="px-4 py-3 font-bold">年级</th>
              <th className="px-4 py-3 font-bold">学院</th>
              <th className="px-4 py-3 font-bold">代表性成绩</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => (
              <tr key={`${item.name}-${item.year}`} className="border-t border-purple/10 odd:bg-lavender2/45">
                <td className="px-4 py-3 font-bold text-purple">{item.name}</td>
                <td className="px-4 py-3">{item.year} 级</td>
                <td className="px-4 py-3">{item.school}</td>
                <td className="px-4 py-3">{item.achievement}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-5 grid gap-3 lg:hidden">
        {filtered.map((item) => (
          <article key={`${item.name}-${item.year}`} className="rounded border border-purple/10 bg-lavender2 p-4">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-lg font-black text-purple">{item.name}</h3>
              <span className="rounded bg-white px-2.5 py-1 text-xs font-bold text-purple">{item.year} 级</span>
            </div>
            <p className="mt-1 text-sm font-semibold text-slatecopy">{item.school}</p>
            <p className="mt-3 text-sm leading-6 text-ink">{item.achievement}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
