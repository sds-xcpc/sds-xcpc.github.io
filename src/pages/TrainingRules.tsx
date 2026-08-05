import type { ReactNode } from 'react';
import { BarChart3, MapPin, Percent, Trophy, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const scoreParts = [
  {
    name: 'ZJU 七月集训（7月6日 - 7月20日）',
    weight: '20%',
    detail: '按集训总分折算标准分；标准分 = 个人得分 / 参评最高分 × 20。新生如无 ZJU 成绩，可按 OI 最好成绩折算：NOIP 一等奖取参训成绩中位数，NOI 铜牌取第 5，NOI 银牌取第 3。',
  },
  {
    name: '个人选拔赛 Day 1（9月2日）',
    weight: '40%',
    detail: '全体候选队员参加个人赛；标准分 = 个人得分 / 当场最高分 × 40。',
  },
  {
    name: '个人选拔赛 Day 2（9月3日）',
    weight: '40%',
    detail: '全体候选队员参加个人赛；标准分 = 个人得分 / 当场最高分 × 40。',
  },
];

const teamRules = [
  {
    title: '面试安排（9月5日）',
    body: '除承担 World Final 备赛任务的队伍外，原有队伍原则上打散，按新赛季个人选拔结果重新组队。教练组结合个人综合分、面试表现、组队适配度与赛季计划确定正选队伍。',
  },
  {
    title: '正选队伍',
    body: (
      <>
        通过面试确定不超过 6 支正选队伍。所有正选队伍的成员，视为正式队员；
        <strong className="font-black text-purple">保证至少一次参赛机会（含自费）</strong>
        。
      </>
    ),
  },
  {
    title: '候选队伍',
    body: (
      <>
        除正选队伍之外，剩余参训同学可自行组队，教练组会提供一定指导，经教练组同意后视作候选队伍；候选队伍在后续训练及参赛竞争中
        <strong className="font-black text-purple">一视同仁</strong>
        ，如获得参赛资格则增补为正选队伍 / 正式队员。
      </>
    ),
  },
];

const memberDuty = (
  <>
    除必须参与每年办赛筹备工作之外，正式队员至少参加两次竞赛队活动，包括且不限于参与开放日、招生活动、高中生夏令营、期末复习讲座、附属学校培训。
    <span className="mt-2 block font-black text-red-600">
      上一年度入选正选队伍但未履行服务义务者，本年度不具备正选入围资格；即使获得参赛资格，竞赛队也不承担任何参赛费用。
    </span>
  </>
);

const trainingAssignments = [
  ['ICPC 网络赛', '参加 2 场 ICPC 网络预选赛：9 月 6 日（北京大学命题）、9 月 12 日（杭州电子科技大学命题）。'],
  ['CCPC 网络赛', '参加 1 场 CCPC 网络预选赛（9 月 19 日）。'],
  ['集体训练', '参加国庆 3 天集训（日期 TBD），以及 9 月 13 日、9 月 19 日、9 月 20 日、9 月 26 日、9 月 27 日共 8 场集训。'],
];

const participationRules = [
  [
    '区域赛',
    (
      <>
        根据组队训练成绩（规则：TBD），选派成绩优异
        <strong className="font-black text-purple">或训练刻苦、提高明显</strong>
        的队伍参加 ICPC/CCPC 区域赛，同时酌情开放部分名额供自费差旅参赛。CCPC 女生专场队伍独立处理，是否组队依据当年队员情况与参赛意愿确定。非正式参赛需特殊申请说明理由，原则上竞赛队不负责任何费用。竞赛队将为所有选派队伍在满足加训规则的情况下承担所有费用。
      </>
    ),
  ],
  [
    '省赛/邀请赛',
    '训练积极、热心服务的队伍 / 个人将保证广东省赛参赛名额，邀请赛可在向教练申请后安排报名。竞赛队承担广东省赛所有费用，邀请赛可视具体情况，为贡献突出、成绩优秀的队伍承担部分费用。',
  ],
  [
    '加训规则',
    '对于获得任意场次参赛机会的队伍，在第 i 场比赛前需完成 3*i 场加训并提交书面总结至队长处，题目来源由教练组推荐；完成后按学校规定报销全部参赛队员交通、住宿。如未完成，则不予报销。',
  ],
  [
    '高级赛事',
    '根据队伍正式赛最好成绩，推荐不超过 3 支 ICPC EC-Final 队伍、不超过 1+1 支 CCPC Final 队伍（含女生名额），以及 0-1 支 ICPC World Final 队伍。',
  ],
];

const icpcSites = [
  ['ICPC 网络预选赛（一）', '北京大学（命题）', '9 月 6 日', ''],
  ['ICPC 网络预选赛（二）', '杭州电子科技大学（命题）', '9 月 12 日', ''],
  ['西安', '西北工业大学', '10 月 11 日', ''],
  ['沈阳', '东北大学', '10 月 18 日', ''],
  ['成都', '电子科技大学', '10 月 25 日', ''],
  ['武汉', '武汉大学', '11 月 1 日', ''],
  ['南京', '南京航空航天大学', '11 月 8 日', ''],
  ['南昌', '江西师范大学', '11 月 29 日', ''],
  ['上海', '上海大学', '12 月 7 日', ''],
  ['香港', '香港大学', '1 月 10 日', ''],
  ['EC Final\n（杭州）', '杭州师范大学', '1 月 28 日', ''],
];

const ccpcSites = [
  ['CCPC 网络预选赛', '线上', '9 月 19 日', ''],
  ['长春', '东北师范大学', '10 月 18 日', ''],
  ['CCPC 女生专场', 'TBD', '10 月 25 日', ''],
  ['武汉', '长江大学', '11 月 8 日', ''],
  ['乐山', '乐山师范大学', '11 月 15 日', ''],
  ['厦门', '厦门大学', '11 月 22 日', ''],
  ['广东省赛', 'TBD', '预计次年 5 月', ''],
];

function SiteTable({ rows }: { rows: string[][] }) {
  return (
    <div className="overflow-hidden rounded border border-purple/10 bg-white">
      <div className="grid grid-cols-[0.95fr_1.05fr_1.25fr_0.9fr] items-center gap-3 bg-purple px-5 py-3 text-center text-sm font-black text-white">
        <span className="px-2">赛站</span>
        <span className="px-2">承办高校</span>
        <span className="px-2">日程</span>
        <span className="px-2">参赛队伍</span>
      </div>
      {rows.map(([city, host, schedule, teams]) => (
        <div
          key={city}
          className="grid min-h-14 grid-cols-[0.95fr_1.05fr_1.25fr_0.9fr] items-center gap-3 border-t border-purple/10 px-5 py-3 text-base"
        >
          <span className="whitespace-pre-line px-2 text-center font-black text-purple">{city}</span>
          <span className="px-2 text-center text-slatecopy">{host}</span>
          <span className="px-2 text-center font-mono text-sm font-black leading-6 text-orange">{schedule}</span>
          <span className="px-2 text-center text-slatecopy">{teams}</span>
        </div>
      ))}
    </div>
  );
}

export function TrainingRules() {
  return (
    <main className="slide-bg ppt-track">
      <section className="wide-shell section-y">
        <div>
          <p className="orange-marker text-sm font-black uppercase tracking-normal text-purple">Training Rules</p>
          <h1 className="mt-4 text-4xl font-black leading-tight text-purple sm:text-5xl">
            2026-2027 赛季竞赛队组建规则
          </h1>
        </div>

        <section className="mt-10">
          <article className="flex flex-col rounded border border-purple/10 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <Users className="text-orange" size={30} />
              <h2 className="text-3xl font-black text-purple">队员资格</h2>
            </div>
            <div className="mt-5 rounded bg-lavender2 px-5 py-4">
              <ol className="grid gap-3 text-base leading-8 text-slatecopy">
                <li>
                  <span className="font-black text-purple">1. 具有正式参赛资格：</span>
                  请参照
                  <a
                    className="mx-1 font-bold text-purple underline decoration-orange/40 underline-offset-4 transition hover:text-orange"
                    href="https://icpc.global/regionals/rules"
                    target="_blank"
                    rel="noreferrer"
                  >
                    ICPC 官网 Regional Rule
                  </a>
                  。
                </li>
                <li>
                  <span className="font-black text-purple">2. 品德端正、勤奋刻苦、有团队合作精神：</span>
                  遵守学术诚信与竞赛纪律，严禁作弊、代打、抄袭等违规行为；综合参考个人选拔、集体训练成绩、训练态度与团队协作情况。对于基础相对薄弱但训练投入、进步明显的队伍，教练组将酌情提供比赛机会。
                </li>
                <li>
                  <span className="font-black text-purple">3. 热心服务、回报集体：</span>
                  积极投入到竞赛队相关活动，在训练和参赛之外保持责任感与参与度，愿意共同维护队伍氛围、传承经验并支持集体建设。
                </li>
              </ol>
            </div>
          </article>
        </section>

        <section className="mt-10">
          <div className="mt-6 grid gap-5 xl:grid-cols-2">
            <article className="flex flex-col rounded border border-purple/10 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <Percent className="text-orange" size={28} />
                <h2 className="text-3xl font-black text-purple">个人选拔</h2>
              </div>
              <div className="mt-5 grid gap-4">
                {scoreParts.map((part) => (
                  <div key={part.name} className="rounded bg-lavender2 px-4 py-3">
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="text-xl font-black leading-tight text-purple">{part.name}</h3>
                      <span className="rounded bg-orange/10 px-3 py-1 font-mono text-sm font-black text-orange">{part.weight}</span>
                    </div>
                    <p className="mt-2 text-base leading-7 text-slatecopy">{part.detail}</p>
                  </div>
                ))}
              </div>
              <div className="flex min-h-20 flex-1 items-center justify-center py-5">
                <Link
                  className="inline-flex items-center gap-2 rounded bg-purple px-5 py-2.5 text-sm font-black text-white shadow-sm transition hover:bg-orange"
                  to="/training/standing"
                >
                  <BarChart3 size={17} />
                  查看 Standing
                </Link>
              </div>
              <div>
                <p className="rounded border border-orange/20 bg-orange/10 px-4 py-3 text-base font-black leading-7 text-purple">
                  个人综合分 = ZJU 七月集训折算分（20 分）+ 个人选拔赛 Day 1 折算分（40 分）+ 个人选拔赛 Day 2 折算分（40 分）
                </p>
              </div>
            </article>

            <article className="flex flex-col rounded border border-purple/10 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <Users className="text-orange" size={30} />
                <h2 className="text-3xl font-black text-purple">队伍组成</h2>
              </div>
              <div className="mt-5 grid gap-3">
                {teamRules.map((rule) => (
                  <div key={rule.title} className="rounded bg-lavender2 px-4 py-3">
                    <h3 className="text-lg font-black text-purple">{rule.title}</h3>
                    <p className="mt-1 text-base leading-7 text-slatecopy">{rule.body as ReactNode}</p>
                  </div>
                ))}
              </div>
              <div className="mt-auto pt-6">
                <p className="rounded border border-orange/20 bg-orange/10 px-4 py-3 text-base font-bold leading-7 text-purple">
                  {memberDuty}
                </p>
              </div>
            </article>
          </div>
        </section>

        <section className="mt-12 grid gap-5">
          <article className="flex flex-col rounded border border-purple/10 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <Users className="text-orange" size={30} />
              <h2 className="text-3xl font-black text-purple">组队训练</h2>
            </div>
            <div className="mt-5 grid gap-3">
              {trainingAssignments.map(([title, body]) => (
                <div key={title} className="rounded bg-lavender2 px-4 py-3">
                  <h3 className="text-lg font-black text-purple">{title}</h3>
                  <p className="mt-1 text-base leading-7 text-slatecopy">{body as ReactNode}</p>
                </div>
              ))}
            </div>
            <div className="flex h-28 items-center justify-center">
              <button
                className="cursor-not-allowed rounded border border-orange/30 bg-orange/10 px-5 py-2 text-sm font-black text-orange/60"
                type="button"
                disabled
              >
                Scoreboard
              </button>
            </div>
          </article>

          <article className="rounded border border-purple/10 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <Trophy className="text-orange" size={30} />
              <h2 className="text-3xl font-black text-purple">参赛规则</h2>
            </div>
            <div className="mt-5 grid gap-3">
              {participationRules.map(([title, body]) => (
                <div key={title} className="rounded bg-lavender2 px-4 py-3">
                  <h3 className="text-lg font-black text-purple">{title}</h3>
                  <p className="mt-1 text-base leading-7 text-slatecopy">{body}</p>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="mt-12">
          <article className="rounded border border-purple/10 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <MapPin className="text-orange" size={28} />
              <h2 className="text-3xl font-black text-purple">本年度赛站</h2>
            </div>
            <p className="mt-4 text-base leading-8 text-slatecopy">
              以下为 2026-2027 赛季计划关注赛站；具体比赛日程以官方后续通知为准。
            </p>
            <div className="mt-5 grid gap-5 xl:grid-cols-2">
              <div>
                <h3 className="mb-3 text-xl font-black text-purple">ICPC</h3>
                <SiteTable rows={icpcSites} />
              </div>
              <div>
                <h3 className="mb-3 text-xl font-black text-purple">CCPC</h3>
                <SiteTable rows={ccpcSites} />
              </div>
            </div>
          </article>
        </section>

        <section className="mt-12 grid gap-5 lg:grid-cols-2">
          {['集训队员', '队伍名单'].map((title) => (
            <article key={title} className="rounded border border-purple/10 bg-white p-6 shadow-sm">
              <h2 className="text-3xl font-black text-purple">{title}</h2>
              <p className="mt-5 rounded bg-lavender2 px-4 py-6 text-center font-mono text-lg font-black text-orange">TBD</p>
            </article>
          ))}
        </section>

        <section className="mt-24 flex justify-center pb-4">
          <p className="training-calligraphy">向群星与荣耀进发！</p>
        </section>
      </section>
    </main>
  );
}
