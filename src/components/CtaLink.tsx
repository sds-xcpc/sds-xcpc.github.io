import { ArrowRight, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';

export function CtaLink({
  to,
  children,
  variant = 'primary',
}: {
  to: string;
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
}) {
  const className = `inline-flex min-h-11 items-center justify-center gap-2 rounded px-4 py-2.5 text-sm font-semibold transition hover:-translate-y-0.5 ${
    variant === 'primary'
      ? 'bg-orange text-white shadow-lg shadow-orange/25 hover:bg-purple'
      : variant === 'secondary'
        ? 'bg-purple text-white shadow-lg shadow-purple/20 hover:bg-violet'
        : 'border border-purple/20 bg-white/80 text-purple hover:border-orange hover:text-orange'
  }`;

  if (to.startsWith('http')) {
    return (
      <a href={to} target="_blank" rel="noreferrer" className={className}>
        {children}
        <ExternalLink size={16} />
      </a>
    );
  }

  if (to.startsWith('#')) {
    return (
      <a href={to} className={className}>
        {children}
        <ArrowRight size={16} />
      </a>
    );
  }

  return (
    <Link to={to} className={className}>
      {children}
      <ArrowRight size={16} />
    </Link>
  );
}
