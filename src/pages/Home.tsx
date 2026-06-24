import { Award, Play, X } from 'lucide-react';
import { type CSSProperties, useEffect, useRef, useState } from 'react';
import { CtaLink } from '../components/CtaLink';
import { PersonCard } from '../components/Cards';
import { Timeline } from '../components/Roadmap';
import { SectionHeading } from '../components/SectionHeading';
import {
  headlineHonors,
  hero,
  honorCounters,
  site,
  teamIntro,
  teamMission,
  teachers,
} from '../data/site';

const counterTone = {
  purple: 'bg-purple text-white border-purple',
  gold: 'bg-[#fff4d6] text-purple border-orange/35',
  silver: 'bg-[#f4f1ff] text-purple border-violet/25',
  bronze: 'bg-[#fff0e2] text-purple border-orange/25',
};
const homeShell = 'mx-auto w-full max-w-[1180px]';
const fitMediaStyle = {
  position: 'absolute',
  inset: '0.75rem',
  width: 'calc(100% - 1.5rem)',
  height: 'calc(100% - 1.5rem)',
  objectFit: 'contain',
} as const;

const entranceDelay = (delay: number) => ({ '--enter-delay': `${delay}ms` }) as CSSProperties;
const heroImagePositions: Record<string, string> = {
  'images/home/gba-2026-group.jpg': 'center 40%',
  'images/home/gba-2026-advisors.jpg': 'center 28%',
  'images/home/icpc-2026-arena.jpg': 'center 70%',
};

type AnimatedCounterProps = {
  value: string;
  delay: number;
};

function AnimatedCounter({ value, delay }: AnimatedCounterProps) {
  const target = Number(value);
  const hasNumericValue = Number.isFinite(target);
  const [displayValue, setDisplayValue] = useState(hasNumericValue ? '0' : value);

  useEffect(() => {
    if (!hasNumericValue) {
      setDisplayValue(value);
      return;
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplayValue(value);
      return;
    }

    setDisplayValue('0');
    let frameId = 0;
    const timeoutId = window.setTimeout(() => {
      const startTime = performance.now();
      const duration = 1600 + Math.min(target * 14, 620);

      const tick = (now: number) => {
        const progress = Math.min((now - startTime) / duration, 1);
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        setDisplayValue(String(Math.round(target * easedProgress)));

        if (progress < 1) {
          frameId = window.requestAnimationFrame(tick);
          return;
        }

        setDisplayValue(value);
      };

      frameId = window.requestAnimationFrame(tick);
    }, delay);

    return () => {
      window.clearTimeout(timeoutId);
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, [delay, hasNumericValue, target, value]);

  return <>{displayValue}</>;
}

export function Home() {
  const [introOpen, setIntroOpen] = useState(false);
  const [heroImageIndex, setHeroImageIndex] = useState(0);
  const [videoActive, setVideoActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const heroImages = hero.images.length > 0 ? hero.images : [hero.image];

  useEffect(() => {
    if (videoActive) {
      void videoRef.current?.play();
    }
  }, [videoActive]);

  useEffect(() => {
    if (heroImages.length <= 1) {
      return;
    }

    const nextImageIndex = (heroImageIndex + 1) % heroImages.length;
    const timeoutId = window.setTimeout(() => {
      setHeroImageIndex(nextImageIndex);
    }, 9000);

    return () => window.clearTimeout(timeoutId);
  }, [heroImageIndex, heroImages.length]);

  useEffect(() => {
    if (!introOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIntroOpen(false);
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [introOpen]);

  return (
    <main>
      <section className="slide-bg ppt-track relative isolate overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-1.5 bg-orange" />
        <div className="wide-shell pb-6 pt-8 lg:pb-8 lg:pt-10">
          <div className={`${homeShell} grid gap-4 lg:grid-cols-4 lg:items-stretch`}>
          <div className="home-hero-stage relative min-h-[280px] overflow-hidden rounded border border-white/80 bg-purple/10 shadow-2xl shadow-purple/18 sm:min-h-[340px] lg:col-span-4 lg:aspect-[16/6] lg:min-h-0">
            {heroImages.map((image, index) => (
              <img
                key={image}
                src={`${import.meta.env.BASE_URL}${image}`}
                alt="香港中文大学（深圳）程序设计竞赛队合影"
                className="absolute inset-0 h-full w-full object-cover transition-opacity duration-[1200ms] ease-out"
                style={{
                  opacity: index === heroImageIndex ? 1 : 0,
                  objectPosition: heroImagePositions[image] ?? 'center center',
                }}
              />
            ))}
            <div className="absolute inset-0 bg-gradient-to-r from-white/18 via-transparent to-white/18" />
            <div className="absolute inset-0 bg-gradient-to-b from-white/18 via-transparent to-white/34" />
            <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#fbf9ff]/82 to-transparent" />
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
              {heroImages.map((image, index) => (
                <button
                  key={image}
                  type="button"
                  aria-label={`切换到第 ${index + 1} 张首页照片`}
                  aria-current={index === heroImageIndex ? 'true' : undefined}
                  onClick={() => setHeroImageIndex(index)}
                  className="grid h-6 place-items-center rounded-full px-1.5 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-orange/70"
                >
                  <span
                    className={`h-1.5 rounded-full transition-all ${
                      index === heroImageIndex ? 'w-8 bg-orange' : 'w-2 bg-white/75'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="quiet-card home-float-card rounded p-5 lg:col-span-2" style={entranceDelay(220)}>
            <p className="orange-marker text-sm font-black tracking-normal text-purple">
              {site.englishName}
            </p>
            <h1 className="mt-4 max-w-4xl text-[clamp(1.65rem,3.4vw,3rem)] font-black leading-tight text-purple">
              <span className="block whitespace-nowrap">香港中文大学（深圳）</span>
              <span className="block whitespace-nowrap">程序设计竞赛队</span>
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-slatecopy">
              {hero.subtitle}
              <button
                type="button"
                onClick={() => setIntroOpen(true)}
                className="ml-2 font-bold text-purple underline decoration-orange/60 underline-offset-4 transition hover:text-orange focus:outline-none focus:ring-2 focus:ring-orange focus:ring-offset-2"
              >
                完整简介
              </button>
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <CtaLink to="/achievements" variant="secondary">
                过往荣誉
              </CtaLink>
              <CtaLink to="/join" variant="ghost">
                加入我们
              </CtaLink>
            </div>
          </div>

          <aside className="quiet-card home-float-card rounded p-5 lg:col-span-2" style={entranceDelay(340)}>
            <p className="orange-marker text-sm font-black uppercase tracking-normal text-purple">
              竞赛队宗旨
            </p>
            <div className="mt-4 grid gap-4 sm:grid-cols-[150px_1fr] sm:items-start lg:grid-cols-1 xl:grid-cols-[150px_1fr]">
              <div className="relative h-52 rounded bg-lavender2 lg:h-40 xl:h-48">
                <img
                  src={`${import.meta.env.BASE_URL}${teamMission.image}`}
                  alt={teamMission.name}
                  style={fitMediaStyle}
                />
              </div>
              <div>
                <p className="text-sm font-bold text-slatecopy">{teamMission.role}</p>
                <h2 className="mt-1 text-2xl font-black text-purple">{teamMission.name}</h2>
                <blockquote className="mt-3 border-l-4 border-orange pl-4 text-xl font-black leading-relaxed text-purple">
                  {teamMission.headline}
                </blockquote>
                <p className="mt-3 text-sm leading-7 text-slatecopy">{teamMission.quote}</p>
              </div>
            </div>
          </aside>

          <div className="home-float-card grid gap-4 lg:col-span-4" style={entranceDelay(480)}>
            <div className="grid gap-4 lg:grid-cols-4">
              {honorCounters.map((counter, index) => {
                const longValue = counter.value.includes('/');

                return (
                  <article
                    key={counter.label}
                    className={`home-counter-card rounded border p-4 shadow-sm ${counterTone[counter.tone]}`}
                    style={entranceDelay(620 + index * 120)}
                  >
                    <p
                      className={`font-mono font-black leading-none ${
                        longValue ? 'whitespace-nowrap text-[clamp(2.2rem,5vw,4rem)]' : 'text-5xl sm:text-6xl'
                      }`}
                    >
                      <AnimatedCounter value={counter.value} delay={760 + index * 120} />
                    </p>
                    <h2 className="mt-3 text-lg font-black">{counter.label}</h2>
                    <p className={`mt-2 text-xs leading-5 ${counter.tone === 'purple' ? 'text-white/78' : 'text-slatecopy'}`}>
                      {counter.caption}
                    </p>
                  </article>
                );
              })}
            </div>

            <div className="home-float-card rounded border border-purple/10 bg-lavender2/90 p-4" style={entranceDelay(1080)}>
              <div className="flex items-center gap-3">
                <Award className="text-orange" size={24} />
                <h2 className="text-xl font-black text-purple">代表性荣誉</h2>
              </div>
              <div className="mt-3 grid gap-3 lg:grid-cols-3">
                {headlineHonors.map((honor) => (
                  <article key={honor.title} className="rounded bg-white px-4 py-3 shadow-sm">
                    <h3 className="text-sm font-black leading-6 text-purple">{honor.title}</h3>
                    <p className="mt-2 text-xs leading-5 text-slatecopy">{honor.detail}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
          </div>
        </div>
      </section>

      <section id="advisors" className="bg-white pb-10 pt-6 lg:pb-14 lg:pt-8">
        <div className={homeShell}>
          <SectionHeading
            eyebrow="Faculty Advisors"
            title="指导教师"
          />
          <div className="mt-5 grid gap-4 lg:grid-cols-3">
            {teachers.map((teacher) => (
              <PersonCard key={teacher.name} person={teacher} />
            ))}
          </div>
        </div>
      </section>

      <section className="slide-bg py-6 lg:py-8">
        <div className={homeShell}>
          <SectionHeading
            eyebrow="Event"
            title="举办大赛"
          />
          <p className="mt-2 text-lg font-bold text-slatecopy">2026年ICPC全国邀请赛（深圳）</p>
          <div className="mt-5 overflow-hidden rounded border border-purple/10 bg-white shadow-xl shadow-purple/10">
            <div className="relative aspect-video bg-purple/10">
              {videoActive ? (
                <video
                  ref={videoRef}
                  className="absolute inset-0 h-full w-full object-cover"
                  autoPlay
                  controls
                  preload="none"
                  playsInline
                  src={`${import.meta.env.BASE_URL}videos/icpc-invitational-2026.mp4`}
                >
                  您的浏览器不支持视频播放。
                </video>
              ) : (
                <button
                  type="button"
                  className="group absolute inset-0 block h-full w-full overflow-hidden text-left focus:outline-none focus:ring-2 focus:ring-orange focus:ring-offset-2"
                  onClick={() => setVideoActive(true)}
                  aria-label="播放2026年ICPC全国邀请赛（深圳）视频"
                >
                  <img
                    src={`${import.meta.env.BASE_URL}images/home/icpc-2026-arena.jpg`}
                    alt="2026年ICPC全国邀请赛（深圳）"
                    className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                  />
                  <span className="absolute inset-0 bg-purple/28" />
                  <span className="absolute inset-0 grid place-items-center">
                    <span className="grid h-20 w-20 place-items-center rounded-full bg-orange text-white shadow-2xl shadow-purple/30 transition group-hover:bg-purple">
                      <Play size={34} fill="currentColor" />
                    </span>
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-6 lg:py-8">
        <div className={homeShell}>
          <SectionHeading
            eyebrow="Achievements"
            title="历史成就"
          />
          <div className="mt-4 flex flex-wrap gap-3">
            <CtaLink to="/achievements">完整荣誉档案</CtaLink>
            <CtaLink to="/events" variant="ghost">
              活动风采
            </CtaLink>
          </div>
          <div className="mt-4">
            <Timeline compact />
          </div>
        </div>
      </section>

      {introOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-purple/60 px-4 py-6 backdrop-blur-sm">
          <button
            type="button"
            className="absolute inset-0 cursor-default"
            aria-label="关闭竞赛队简介"
            onClick={() => setIntroOpen(false)}
          />
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="team-intro-title"
            className="relative w-full max-w-4xl rounded border border-white/70 bg-white p-5 shadow-2xl shadow-purple/30 sm:p-7"
          >
            <div className="flex items-start justify-between gap-5 border-b border-purple/10 pb-4">
              <div>
                <h2 id="team-intro-title" className="text-3xl font-black text-purple">
                  竞赛队简介
                </h2>
                <p className="mt-2 text-sm font-semibold text-slatecopy">{site.name}</p>
              </div>
              <button
                type="button"
                className="grid h-10 w-10 shrink-0 place-items-center rounded border border-purple/15 text-purple transition hover:bg-lavender"
                aria-label="关闭竞赛队简介"
                onClick={() => setIntroOpen(false)}
              >
                <X size={20} />
              </button>
            </div>
            <div className="mt-5 max-h-[min(68vh,720px)] overflow-y-auto pr-2">
              {teamIntro.map((paragraph) => (
                <p key={paragraph} className="mt-4 text-base leading-8 text-slatecopy first:mt-0">
                  {paragraph}
                </p>
              ))}
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
