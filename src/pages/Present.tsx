import { ArrowLeft, ArrowRight, Home as HomeIcon, Maximize2 } from 'lucide-react';
import { type ReactNode, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  alumni,
  captains,
  companies,
  competitions,
  events,
  featuredTeams,
  headlineHonors,
  hero,
  honorCounters,
  publications,
  roadmap,
  site,
  stats,
  teachers,
  teamIntro,
  teamMission,
  timeline,
  whyContest,
} from '../data/site';
import type { EventItem, FeaturedTeam, Person, Publication } from '../data/site';

type Slide = {
  section: string;
  title: string;
  content: ReactNode;
};

const containedImages = new Set(['images/events/president-xu-1-upright.jpg', 'images/events/president-xu-2-upright.jpg']);
const highlightedAuthorNames = ['Yixiang Fang', 'Yuyang Xia', 'Chenhao Ma', 'Qiuyang Mang', 'Qingshuo Guo', 'Jingbang Chen'];
const highlightedAuthorPattern = new RegExp(`(${highlightedAuthorNames.join('|')})`, 'gi');
const slideWidth = 1600;
const slideHeight = 900;

const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`;

function getPresentationScale() {
  if (typeof window === 'undefined') {
    return 1;
  }

  const availableWidth = Math.max(window.innerWidth - 32, 320);
  const availableHeight = Math.max(window.innerHeight - 96, 240);
  return Math.min(availableWidth / slideWidth, availableHeight / slideHeight);
}

function chunks<T>(items: T[], size: number) {
  const result: T[][] = [];
  for (let index = 0; index < items.length; index += size) {
    result.push(items.slice(index, index + size));
  }
  return result;
}

function highlightedAuthors(authors: string) {
  return authors.split(highlightedAuthorPattern).map((part, index) => {
    if (highlightedAuthorNames.some((name) => name.toLowerCase() === part.toLowerCase())) {
      return (
        <span key={`${part}-${index}`} className="font-black text-orange">
          {part}
        </span>
      );
    }

    return part;
  });
}

function bioWithUniversalCupLink(person: Person) {
  if (person.name !== '陈靖邦教授' || !person.bio.includes('Universal Cup')) {
    return person.bio;
  }

  const [before, after] = person.bio.split('Universal Cup');

  return (
    <>
      {before}
      <a
        href="https://ucup.ac/"
        target="_blank"
        rel="noreferrer"
        className="font-semibold text-purple/80 underline decoration-purple/25 underline-offset-2"
      >
        Universal Cup
      </a>
      {after}
    </>
  );
}

function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <article className={`rounded border border-purple/10 bg-white/92 p-6 shadow-sm ${className}`}>{children}</article>;
}

function ImageBox({
  src,
  alt,
  className = '',
  fit = 'cover',
  objectPosition = 'center center',
}: {
  src: string;
  alt: string;
  className?: string;
  fit?: 'cover' | 'contain';
  objectPosition?: string;
}) {
  return (
    <div className={`overflow-hidden rounded border border-purple/10 bg-lavender2 shadow-sm ${className}`}>
      <img
        src={asset(src)}
        alt={alt}
        className={`h-full w-full ${fit === 'contain' ? 'object-contain p-2' : 'object-cover'}`}
        style={{ objectPosition }}
      />
    </div>
  );
}

function TeacherGrid({ people }: { people: Person[] }) {
  return (
    <div className="grid h-full min-h-0 grid-cols-3 gap-4">
      {people.map((person) => (
        <Card key={person.name} className="flex min-h-0 flex-col">
          <ImageBox src={person.image ?? 'images/cover-pattern.png'} alt={person.name} className="h-56 shrink-0" fit="contain" />
          <p className="mt-4 text-sm font-bold text-orange">{person.affiliation}</p>
          <h3 className="mt-1 text-3xl font-black text-purple">{person.name}</h3>
          <p className="mt-4 text-sm leading-7 text-slatecopy">{bioWithUniversalCupLink(person)}</p>
        </Card>
      ))}
    </div>
  );
}

function CaptainGrid({ people }: { people: Person[] }) {
  return (
    <div className="grid h-full min-h-0 grid-cols-3 grid-rows-2 gap-3">
      {people.map((person) => (
        <Card key={person.name} className="grid min-h-0 grid-cols-[0.43fr_0.57fr] gap-4 p-4">
          <ImageBox src={person.image ?? 'images/cover-pattern.png'} alt={person.name} className="h-full min-h-0" fit="contain" />
          <div className="min-h-0">
            <h3 className="text-2xl font-black text-purple">{person.name}</h3>
            <p className="mt-1 text-sm font-bold text-orange">{person.period}</p>
            <p className="mt-1 text-sm font-semibold text-slatecopy">{person.affiliation}</p>
            <p className="mt-3 text-sm leading-6 text-slatecopy">{person.bio}</p>
          </div>
        </Card>
      ))}
    </div>
  );
}

function CompetitionsSlide() {
  return (
    <div className="grid h-full min-h-0 grid-cols-2 gap-5">
      {competitions.map((competition) => (
        <Card key={competition.name} className="flex min-h-0 flex-col">
          <div className="grid h-52 shrink-0 place-items-center rounded bg-white">
            <img src={asset(competition.image)} alt={competition.name} className="max-h-44 max-w-[90%] object-contain" />
          </div>
          <p className="mt-5 text-center font-mono text-sm font-black text-orange">{competition.englishName}</p>
          <h2 className="mt-2 text-center text-3xl font-black leading-tight text-purple">{competition.name}</h2>
          <p className="mt-4 text-base leading-8 text-slatecopy">{competition.summary}</p>
          <div className="mt-4 grid gap-2">
            {competition.system.map((item) => (
              <div key={item} className="rounded bg-lavender2 px-4 py-2 text-base font-black text-purple">
                {item}
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}

function StairRoadmapSlide() {
  const stepHeights = [360, 410, 460, 510, 560];

  return (
    <div className="relative h-full min-h-0 overflow-hidden rounded border border-purple/10 bg-white/72 p-7 shadow-sm">
      <div className="absolute bottom-10 left-8 right-8 h-1 rounded-full bg-gradient-to-r from-orange via-purple to-cyan" />
      <div className="grid h-full min-h-0 grid-cols-5 items-end gap-3">
        {roadmap.map((stage, index) => (
          <article
            key={stage.stage}
            className="relative flex flex-col justify-between rounded-t border border-purple/10 bg-white p-5 shadow-sm"
            style={{ height: stepHeights[index] }}
          >
            <div>
              <span className="inline-flex h-12 min-w-12 items-center justify-center rounded-full bg-purple px-3 font-mono text-lg font-black text-white shadow-lg shadow-purple/20">
                {String(index + 1).padStart(2, '0')}
              </span>
              <p className="mt-4 text-base font-black text-orange">{stage.stage}</p>
              <h3 className="mt-2 text-2xl font-black leading-tight text-purple">{stage.title}</h3>
            </div>
            <div>
              <p className="text-base leading-8 text-slatecopy">{stage.body}</p>
              <p className="mt-4 font-mono text-sm font-black text-cyan">{stage.tag}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function TeamCard({ team }: { team: FeaturedTeam }) {
  const compact = team.honors.length > 4;

  return (
    <Card className="flex min-h-0 flex-col">
      <ImageBox src={team.image} alt={team.name} className="h-72 shrink-0" fit="contain" />
      <h3 className={`${compact ? 'mt-4 text-3xl' : 'mt-5 text-3xl'} font-black text-purple`}>{team.name}</h3>
      {team.englishName && <p className="mt-1 font-mono text-base text-slatecopy">{team.englishName}</p>}
      <p className={`${compact ? 'mt-3' : 'mt-4'} text-base font-bold text-ink`}>成员：{team.members.join('、')}</p>
      <div className={`${compact ? 'mt-3 grid-cols-2 gap-2' : 'mt-4 gap-2'} grid`}>
        {team.honors.map((honor) => (
          <span key={honor} className={`rounded bg-orange/10 font-bold text-purple ${compact ? 'px-3 py-1.5 text-sm leading-6' : 'px-3 py-2 text-base'}`}>
            {honor}
          </span>
        ))}
      </div>
    </Card>
  );
}

function PublicationSlide({ publication }: { publication: Publication }) {
  return (
    <Card>
      <div className="flex items-start justify-between gap-5">
        <h3 className="text-2xl font-black leading-tight text-purple">{publication.title}</h3>
        <span className="shrink-0 rounded bg-purple px-4 py-2 text-sm font-black text-white">{publication.venue}</span>
      </div>
      <p className="mt-4 text-base font-bold leading-7 text-ink">{highlightedAuthors(publication.authors)}</p>
      <p className="mt-4 text-base leading-8 text-slatecopy">{publication.description}</p>
    </Card>
  );
}

function EventSlide({ event }: { event: EventItem }) {
  const images = event.images.length > 0 ? event.images : event.image ? [event.image] : [];
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    setActiveImageIndex(0);
  }, [event.title, images.length]);

  const activeImage = images[activeImageIndex % Math.max(images.length, 1)] ?? 'images/campus-hero.jpg';

  return (
    <div className="grid h-full min-h-0 grid-cols-[1.08fr_0.92fr] gap-6">
      <div className="grid min-h-0 grid-rows-[1fr_auto] gap-3">
        <ImageBox
          src={activeImage}
          alt={event.title}
          className="min-h-0"
          fit={containedImages.has(activeImage) ? 'contain' : 'cover'}
        />
        <div className="grid h-28 grid-cols-7 auto-rows-fr gap-2">
          {images.map((image, index) => (
            <button
              key={image}
              type="button"
              aria-label={`切换到第 ${index + 1} 张活动照片`}
              aria-current={index === activeImageIndex ? 'true' : undefined}
              onClick={() => setActiveImageIndex(index)}
              className={`overflow-hidden rounded border bg-lavender2 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-orange/70 ${
                index === activeImageIndex ? 'border-orange shadow-sm shadow-orange/20' : 'border-purple/10 opacity-78 hover:opacity-100'
              }`}
            >
              <img
                src={asset(image)}
                alt={`${event.title} ${index + 1}`}
                className={`h-full w-full ${containedImages.has(image) ? 'object-contain p-1' : 'object-cover'}`}
              />
            </button>
          ))}
        </div>
      </div>
      <div className="min-h-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="bg-orange/15 px-3 py-1 text-sm font-bold text-purple">{event.type}</span>
          <span className="bg-lavender px-3 py-1 text-sm font-bold text-purple">{event.date}</span>
        </div>
        <h2 className="mt-4 text-3xl font-black leading-tight text-purple">{event.title}</h2>
        <p className="mt-2 text-lg font-bold text-orange">{event.location}</p>
        <p className="mt-4 text-base leading-8 text-slatecopy">{event.body}</p>
        <div className="mt-4 grid gap-1.5">
          {event.metrics.map((metric) => (
            <p key={metric} className="border-l-2 border-orange pl-3 text-sm font-semibold leading-6 text-purple">
              {metric}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Present() {
  const slides: Slide[] = [
    {
      section: '首页简介',
      title: site.name,
      content: (
        <div className="grid h-full min-h-0 grid-cols-[1fr_1.05fr] gap-7">
          <div className="flex min-h-0 flex-col justify-center">
            <p className="orange-marker text-sm font-black uppercase text-purple">{site.englishName}</p>
            <h1 className="mt-4 text-5xl font-black leading-tight text-purple">
              <span className="block">香港中文大学（深圳）</span>
              <span className="block">程序设计竞赛队</span>
            </h1>
            <p className="mt-6 text-lg leading-9 text-slatecopy">{hero.subtitle}</p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              {honorCounters.map((counter) => (
                <Card key={counter.label} className={counter.tone === 'purple' ? 'bg-purple text-white' : ''}>
                  <p className="font-mono text-4xl font-black">{counter.value}</p>
                  <h3 className="mt-2 text-lg font-black">{counter.label}</h3>
                  <p className={`mt-1 text-xs leading-5 ${counter.tone === 'purple' ? 'text-white/75' : 'text-slatecopy'}`}>{counter.caption}</p>
                </Card>
              ))}
            </div>
          </div>
          <ImageBox src={hero.image} alt={site.name} className="h-full" />
        </div>
      ),
    },
    {
      section: '首页简介',
      title: '竞赛队简介',
      content: (
        <div className="grid h-full min-h-0 grid-cols-2 gap-5">
          {teamIntro.map((paragraph, index) => (
            <Card key={paragraph} className="flex flex-col justify-center">
              <p className="font-mono text-sm font-black text-orange">{String(index + 1).padStart(2, '0')}</p>
              <p className="mt-3 text-base leading-8 text-slatecopy">{paragraph}</p>
            </Card>
          ))}
        </div>
      ),
    },
    {
      section: '竞赛队宗旨',
      title: '竞赛队宗旨',
      content: (
        <div className="grid h-full min-h-0 grid-cols-[0.78fr_1.22fr] gap-7">
          <ImageBox src={teamMission.image} alt={teamMission.name} className="h-full" />
          <div className="flex min-h-0 flex-col justify-center">
            <p className="font-bold text-orange">{teamMission.role}</p>
            <h2 className="mt-2 text-4xl font-black text-purple">{teamMission.name}</h2>
            <blockquote className="mt-7 border-l-4 border-orange pl-5 text-3xl font-black leading-tight text-purple">
              {teamMission.headline}
            </blockquote>
            <p className="mt-6 text-xl leading-10 text-slatecopy">{teamMission.quote}</p>
          </div>
        </div>
      ),
    },
    {
      section: '指导教师',
      title: '指导教师',
      content: <TeacherGrid people={teachers} />,
    },
    {
      section: '竞赛与训练',
      title: '赛事基本规则',
      content: (
        <div className="grid h-full min-h-0 grid-cols-3 gap-5">
          {[
            ['三名队员', '以团队的形式代表学校参赛，每队由三名队员组成。'],
            ['5小时', '使用一台电脑在5小时内用编程解决7-13道程序设计问题。'],
            ['竞赛目标', '旨在展示大学生创新能力、团队精神、和在压力下编写程序、分析和解决问题的能力。'],
          ].map(([title, body]) => (
            <Card key={title} className="flex flex-col justify-center">
              <h2 className="text-4xl font-black text-purple">{title}</h2>
              <p className="mt-5 text-lg leading-9 text-slatecopy">{body}</p>
            </Card>
          ))}
        </div>
      ),
    },
    {
      section: '竞赛与训练',
      title: 'ICPC / CCPC 赛事简介',
      content: <CompetitionsSlide />,
    },
    {
      section: '竞赛与训练',
      title: '为什么参加竞赛',
      content: (
        <div className="grid h-full min-h-0 grid-cols-2 gap-5">
          {whyContest.map((item) => (
            <Card key={item.title} className="flex flex-col justify-center">
              <h2 className="text-3xl font-black text-purple">{item.title}</h2>
              <p className="mt-5 text-xl leading-9 text-slatecopy">{item.body}</p>
            </Card>
          ))}
        </div>
      ),
    },
    {
      section: '竞赛与训练',
      title: '训练路径',
      content: <StairRoadmapSlide />,
    },
    {
      section: '荣誉墙',
      title: '历史成就',
      content: (
        <div className="grid h-full min-h-0 grid-cols-[0.9fr_1.1fr] gap-6">
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat) => {
              const longValue = stat.value.includes('/');

              return (
                <Card key={stat.label} className="flex flex-col justify-center">
                  <p className={`font-mono font-black text-orange ${longValue ? 'whitespace-nowrap text-[2.65rem] tracking-tight' : 'text-6xl'}`}>
                    {stat.value}
                  </p>
                  <h3 className="mt-3 text-2xl font-black text-purple">{stat.label}</h3>
                  <p className="mt-4 text-base leading-7 text-slatecopy">{stat.caption}</p>
                </Card>
              );
            })}
          </div>
          <div className="grid gap-4">
            {headlineHonors.map((honor) => (
              <Card key={honor.title} className="flex flex-col justify-center">
                <h3 className="text-3xl font-black text-purple">{honor.title}</h3>
                <p className="mt-4 text-xl leading-9 text-slatecopy">{honor.detail}</p>
              </Card>
            ))}
          </div>
        </div>
      ),
    },
    ...chunks(timeline, 9).map((items, groupIndex) => ({
      section: '荣誉墙',
      title: groupIndex === 0 ? '团队发展时间线' : '团队发展时间线（续）',
      content: (
        <div className="grid h-full min-h-0 grid-cols-3 auto-rows-fr gap-4">
          {items.map((item, itemIndex) => {
            const index = groupIndex * 7 + itemIndex;

            return (
              <Card key={`${item.date}-${item.title}`} className={item.featured ? 'ring-2 ring-orange/30' : ''}>
                <p className="font-mono text-base font-black text-orange">{String(index + 1).padStart(2, '0')} / {item.date}</p>
                <h3 className="mt-3 text-2xl font-black leading-8 text-purple">{item.title}</h3>
                <p className="mt-3 text-base leading-7 text-slatecopy">{item.detail}</p>
              </Card>
            );
          })}
        </div>
      ),
    })),
    ...chunks(featuredTeams, 2).map((teams, index) => ({
      section: '荣誉墙',
      title: index === 0 ? '优秀队伍' : '优秀队伍（续）',
      content: (
        <div className="grid h-full min-h-0 grid-cols-2 gap-5">
          {teams.map((team) => (
            <TeamCard key={team.name} team={team} />
          ))}
        </div>
      ),
    })),
    {
      section: '赛队成员',
      title: '历任队长',
      content: <CaptainGrid people={captains} />,
    },
    {
      section: '发展与深造',
      title: '科研活动',
      content: (
        <div className="grid h-full min-h-0 grid-cols-2 gap-4">
          {publications.map((publication) => (
            <PublicationSlide key={publication.title} publication={publication} />
          ))}
        </div>
      ),
    },
    {
      section: '发展与深造',
      title: '企业实习合作',
      content: (
        <div className="grid h-full min-h-0 grid-cols-[0.85fr_1.15fr] gap-7">
          <div className="flex flex-col justify-center">
            <h2 className="text-4xl font-black text-purple">企业实习合作</h2>
            <p className="mt-6 text-xl leading-10 text-slatecopy">
              与多家知名企业建立了友好合作关系，绝大多数竞赛队员成功获得顶尖企业实习机会。
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {companies.map((company) => (
              <Card key={company.name} className="grid min-h-36 place-items-center p-4">
                <img
                  src={asset(company.logo)}
                  alt={company.name}
                  className={`${company.name === '华为云' ? 'max-h-40 max-w-[98%]' : 'max-h-36 max-w-[96%]'} object-contain`}
                />
              </Card>
            ))}
          </div>
        </div>
      ),
    },
    {
      section: '发展与深造',
      title: '升学与职业发展案例',
      content: (
        <div className="grid h-full min-h-0 grid-cols-3 gap-4">
          {alumni.slice(0, 6).map((item) => (
            <Card key={item.name}>
              <h3 className="text-2xl font-black text-purple">{item.name}</h3>
              <p className="mt-2 text-base font-bold text-orange">{item.contest}</p>
              <p className="mt-3 text-base leading-7 text-slatecopy">{item.research}</p>
              <p className="mt-4 rounded bg-lavender2 px-3 py-2 text-base font-bold leading-7 text-purple">{item.destination}</p>
            </Card>
          ))}
        </div>
      ),
    },
    ...events.map((event) => ({
      section: '活动风采',
      title: event.title,
      content: <EventSlide event={event} />,
    })),
    {
      section: '加入我们',
      title: '欢迎加入香港中文大学（深圳）程序设计竞赛队！',
      content: (
        <div className="grid h-full min-h-0 grid-cols-[0.72fr_0.78fr_1fr] gap-5">
          <div className="grid gap-4">
            {[
              ['开放加入', '竞赛队向全校同学开放加入的机会。'],
              ['本年度队员', '本年度，代表大学参赛的队员来自多个学院，横跨四个年级。'],
            ].map(([title, body]) => (
              <Card key={title} className="flex flex-col justify-center">
                <h2 className="text-3xl font-black text-purple">{title}</h2>
                <p className="mt-4 text-xl leading-9 text-slatecopy">{body}</p>
              </Card>
            ))}
          </div>
          <Card className="flex flex-col justify-center">
            <h2 className="text-3xl font-black text-purple">联系方式</h2>
            <div className="mt-6 grid gap-4 text-xl leading-10 text-slatecopy">
              <p>招生咨询邮箱：{site.email}</p>
              <p>学院招生交流 QQ 群：{site.qqGroup}</p>
              <p>{site.address}</p>
              <p>学院官网：{site.website}</p>
            </div>
          </Card>
          <div className="grid grid-cols-2 gap-4">
            {[
              ['学院微信公众号', 'images/contact/wechat-public-qr.png'],
              ['学院刊物', 'images/contact/booklet-qr.png'],
              ['学院官网', 'images/contact/site-qr.png'],
              ['学院招生交流 QQ 群', 'images/contact/qq-group-qr.png'],
            ].map(([label, image]) => (
              <Card key={label} className="grid place-items-center p-4 text-center">
                <img src={asset(image)} alt={label} className="h-40 w-40 object-contain" />
                <p className="mt-4 text-lg font-black text-purple">{label}</p>
              </Card>
            ))}
          </div>
        </div>
      ),
    },
  ];

  const [index, setIndex] = useState(0);
  const [scale, setScale] = useState(getPresentationScale);
  const total = slides.length;
  const slide = slides[Math.min(index, total - 1)];
  const progress = ((Math.min(index, total - 1) + 1) / total) * 100;
  const titleIsLong = slide.title.length > 18;

  const go = (delta: number) => {
    setIndex((value) => Math.min(total - 1, Math.max(0, value + delta)));
  };

  useEffect(() => {
    setIndex((value) => Math.min(value, total - 1));
  }, [total]);

  useEffect(() => {
    const updateScale = () => setScale(getPresentationScale());

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight' || event.key === ' ') {
        event.preventDefault();
        setIndex((value) => Math.min(total - 1, value + 1));
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        setIndex((value) => Math.max(0, value - 1));
      }
      if (event.key === 'Home') {
        setIndex(0);
      }
      if (event.key === 'End') {
        setIndex(total - 1);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [total]);

  const enterFullscreen = () => {
    document.documentElement.requestFullscreen?.();
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#130d2c] text-white">
      <section className="grid min-h-screen place-items-center px-4 pb-20 pt-4">
        <div
          className="relative"
          style={{
            width: `${slideWidth * scale}px`,
            height: `${slideHeight * scale}px`,
          }}
        >
        <div
          className="absolute left-0 top-0 h-[900px] w-[1600px] origin-top-left overflow-hidden rounded border border-white/15 bg-[#f4efff] text-ink shadow-2xl shadow-black/40"
          style={{ transform: `scale(${scale})` }}
        >
          <div className="absolute inset-0 ppt-track opacity-100" />
          <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-orange via-purple to-cyan" />
          <div className="relative z-10 flex h-full min-h-0 flex-col p-9">
            <div className="flex shrink-0 items-center justify-between gap-4">
              <div>
                <p className="text-sm font-black uppercase text-orange">{slide.section}</p>
                <p className="mt-1 text-xs font-bold text-purple/70">{site.englishName}</p>
              </div>
              <div className="h-px flex-1 bg-purple/18" />
              <p className="font-mono text-sm font-black text-purple">{String(index + 1).padStart(2, '0')} / {total}</p>
            </div>

            <h1
              className={`mt-5 shrink-0 whitespace-nowrap font-black leading-tight text-purple ${
                titleIsLong ? 'text-[2rem]' : 'text-4xl'
              }`}
            >
              {slide.title}
            </h1>
            <div className="mt-5 min-h-0 flex-1">{slide.content}</div>

            <div className="mt-5 h-1.5 shrink-0 rounded-full bg-purple/10">
              <div className="h-full rounded-full bg-orange" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>
        </div>
      </section>

      <div className="fixed bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/15 bg-black/30 p-1.5 backdrop-blur">
        <Link to="/" className="grid h-10 w-10 place-items-center rounded-full text-white transition hover:bg-white/15" aria-label="返回首页">
          <HomeIcon size={18} />
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
