import { ArrowLeft, ArrowRight, Home, Maximize2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { presentationSlides, site } from '../data/site';

export function Present() {
  const [index, setIndex] = useState(0);
  const slide = presentationSlides[index];
  const progress = ((index + 1) / presentationSlides.length) * 100;

  const go = (delta: number) => {
    setIndex((value) => Math.min(presentationSlides.length - 1, Math.max(0, value + delta)));
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight' || event.key === ' ') {
        event.preventDefault();
        go(1);
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        go(-1);
      }
      if (event.key === 'Home') {
        setIndex(0);
      }
      if (event.key === 'End') {
        setIndex(presentationSlides.length - 1);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const enterFullscreen = () => {
    document.documentElement.requestFullscreen?.();
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#130d2c] text-white">
      <section className="grid min-h-screen place-items-center px-4 py-4">
        <div className="relative aspect-video w-full max-w-[min(96vw,170vh)] overflow-hidden rounded border border-white/15 bg-[#f4efff] text-ink shadow-2xl shadow-black/40">
          <div className="absolute inset-0 ppt-track opacity-100" />
          <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-orange via-purple to-cyan" />
          <div className="relative z-10 flex h-full flex-col p-[4.3%]">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[1.25vw] font-black uppercase text-orange">{slide.kicker}</p>
                <p className="mt-1 text-[1vw] font-bold text-purple/70">{site.englishName}</p>
              </div>
              <div className="h-px flex-1 bg-purple/18" />
              <p className="text-[1vw] font-black text-purple">{String(index + 1).padStart(2, '0')} / {presentationSlides.length}</p>
            </div>

            <div className="mt-[3.2%] grid min-h-0 flex-1 grid-cols-[1.05fr_0.95fr] gap-[4%]">
              <div className="flex min-h-0 flex-col justify-center">
                <h1 className="max-w-[13ch] text-[4.4vw] font-black leading-[1.05] tracking-normal text-purple">
                  {slide.title}
                </h1>
                <p className="mt-[4%] max-w-[42ch] text-[1.35vw] font-bold leading-snug text-ink">{slide.takeaway}</p>
                <div className="mt-[5%] grid gap-[1.6vh]">
                  {slide.bullets.map((bullet) => (
                    <div key={bullet} className="flex items-start gap-3 rounded bg-white/90 px-[2.2%] py-[1.1%] shadow-sm">
                      <span className="mt-[0.35vw] h-[0.9vw] w-[0.9vw] shrink-0 rounded-full bg-orange" />
                      <span className="min-w-0 text-[1.05vw] font-black leading-snug text-purple">{bullet}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative min-h-0">
                <img
                  src={`${import.meta.env.BASE_URL}${slide.image}`}
                  alt={slide.title}
                  className="h-full w-full rounded border border-white object-cover shadow-xl shadow-purple/20"
                />
              </div>
            </div>

            <div className="mt-[2%] h-1.5 rounded-full bg-purple/10">
              <div className="h-full rounded-full bg-orange" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>
      </section>

      <div className="fixed bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/15 bg-black/30 p-1.5 backdrop-blur">
        <Link to="/" className="grid h-10 w-10 place-items-center rounded-full text-white transition hover:bg-white/15" aria-label="返回首页">
          <Home size={18} />
        </Link>
        <button type="button" onClick={() => go(-1)} className="grid h-10 w-10 place-items-center rounded-full text-white transition hover:bg-white/15" aria-label="上一页">
          <ArrowLeft size={18} />
        </button>
        <button type="button" onClick={() => go(1)} className="grid h-10 w-10 place-items-center rounded-full text-white transition hover:bg-white/15" aria-label="下一页">
          <ArrowRight size={18} />
        </button>
        <button type="button" onClick={enterFullscreen} className="grid h-10 w-10 place-items-center rounded-full text-white transition hover:bg-white/15" aria-label="全屏">
          <Maximize2 size={18} />
        </button>
      </div>
    </main>
  );
}
