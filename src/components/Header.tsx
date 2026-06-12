import { Menu, MonitorPlay, X } from 'lucide-react';
import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { site } from '../data/site';

const navItems = [
  { to: '/', label: '首页' },
  { to: '/contests', label: '竞赛与训练' },
  { to: '/research-career', label: '科研与实习' },
  { to: '/achievements', label: '荣誉墙' },
  { to: '/people', label: '赛队成员' },
  { to: '/events', label: '活动风采' },
  { to: '/join', label: '加入我们' },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `rounded px-3 py-2 text-sm font-semibold transition ${
      isActive ? 'bg-purple text-white' : 'text-ink/80 hover:bg-lavender hover:text-purple'
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-purple/10 bg-white shadow-sm">
      <div className="wide-shell flex min-h-20 items-center justify-between gap-5 py-3">
        <div className="flex min-w-0 items-center gap-5">
          <a
            href={site.website}
            className="flex shrink-0 items-center"
            aria-label="数据科学学院官网"
            target="_blank"
            rel="noreferrer"
          >
            <img
              src={`${import.meta.env.BASE_URL}images/logos/cuhksz-sds-lockup.png`}
              alt="香港中文大学（深圳）与数据科学学院"
              className="h-8 w-auto max-w-[190px] shrink-0 object-contain sm:h-10 sm:max-w-[330px] lg:max-w-[390px]"
            />
          </a>

          <Link to="/" className="hidden min-w-0 border-l border-purple/15 pl-5 md:block" aria-label={site.name}>
            <span className="block truncate text-lg font-black text-purple">{site.name}</span>
            <span className="block truncate text-xs font-semibold text-slatecopy">{site.englishName}</span>
          </Link>
        </div>

        <div className="hidden shrink-0 items-center gap-2 lg:flex">
          <NavLink
            to="/present"
            className="inline-flex h-10 items-center gap-2 rounded bg-orange px-3 text-sm font-bold text-white shadow-sm transition hover:bg-purple"
          >
            <MonitorPlay size={17} />
            宣讲模式
          </NavLink>
        </div>

        <button
          type="button"
          className="grid h-10 w-10 place-items-center rounded border border-purple/20 text-purple lg:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label={open ? '关闭导航' : '打开导航'}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <div className="hidden border-t border-purple/10 bg-white lg:block">
        <nav className="wide-shell flex h-12 items-center justify-center gap-3" aria-label="Primary navigation">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={linkClass}>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>

      {open && (
        <div className="border-t border-purple/10 bg-white px-4 pb-4 lg:hidden">
          <nav className="grid gap-1 py-3" aria-label="Mobile navigation">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} className={linkClass} onClick={() => setOpen(false)}>
                {item.label}
              </NavLink>
            ))}
            <NavLink to="/present" className={linkClass} onClick={() => setOpen(false)}>
              宣讲模式
            </NavLink>
          </nav>
        </div>
      )}
    </header>
  );
}
