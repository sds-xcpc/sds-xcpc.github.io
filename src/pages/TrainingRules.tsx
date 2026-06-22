import { MapPin, Percent, Trophy, Users } from 'lucide-react';

const scoreParts = [
  {
    name: 'ZJU 七月集训',
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
    title: '面试范围',
    body: '个人综合排名前 15 名进入 9 月 3 日面试。教练组结合个人综合分、面试表现、组队适配度与赛季计划确定正选队伍。',
  },
  {
    title: '正选队伍',
    body: '通过面试确定 4 支正选队伍；如整体候选水平与赛事名额允许，可酌情扩展至 5 支。',
  },
  {
    title: '自由组队跟训',
    body: '未进入正选队伍的同学可以自由组队跟训；正选队伍与自由组队在后续训练和参赛选拔中一视同仁。',
  },
];

const teamNote = '除承担 World Final 备赛任务的队伍外，原有队伍原则上打散，按新赛季个人选拔结果重新组队。';

const contestAssignments = [
  ['ICPC 网络赛', '参加 2 场 ICPC 网络预选赛（9 月 6 日、9 月 12 日）。'],
  ['CCPC 网络赛', '参加 1 场 CCPC 网络预选赛（预计 9 月，具体日期 TBD）。'],
  ['集体训练', '参加国庆 3 天集训（日期 TBD），以及 9 月 5 日、9 月 13 日、9 月 20 日、9 月 21 日、9 月 27 日、9 月 28 日共 9 场集训。'],
  [
    '参赛名额',
    '以上所有比赛均计入队伍表现分（规则：TBD）。前 4-5 支队伍可参加正式比赛（教练组有权酌情增加或减少名额），并分配一定参赛名额。女生专场队伍独立处理，不与正选队伍名额机械绑定；是否组队依据当年队员情况与参赛意愿确定。',
  ],
  [
    '加训规则',
    '对于获得 k 场次参赛机会的队伍，在第 i 场比赛前需完成 3*i 场加训并提交总结，题目来源由教练组推荐；如未完成，则当场比赛的差旅费不予报销。',
  ],
];

const icpcSites = [
  ['ICPC 网络预选赛（一）', '线上', '9 月 6 日（周日）', ''],
  ['ICPC 网络预选赛（二）', '线上', '9 月 12 日（周六）', ''],
  ['武汉', '武汉大学', 'TBD', ''],
  ['香港', '香港大学', 'TBD', ''],
  ['南京', '南京航空航天大学', 'TBD', ''],
  ['沈阳', '东北大学', 'TBD', ''],
  ['上海', '上海大学', 'TBD', ''],
  ['成都', '电子科技大学', 'TBD', ''],
  ['南昌', '江西师范大学', 'TBD', ''],
  ['西安', '西北工业大学', 'TBD', ''],
  ['EC Final\n（杭州）', '杭州师范大学', 'TBD', ''],
];

const ccpcSites = [
  ['CCPC 网络预选赛', '线上', '预计 9 月，具体日期 TBD', ''],
  ['CCPC 区域赛（一）', 'TBD', 'TBD', ''],
  ['CCPC 区域赛（二）', 'TBD', 'TBD', ''],
  ['CCPC 区域赛（三）', 'TBD', 'TBD', ''],
  ['CCPC 区域赛（四）', 'TBD', 'TBD', ''],
  ['CCPC 女生专场', 'TBD', 'TBD', ''],
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
            2026-2027 赛季选拔规则
          </h1>
        </div>

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
              <div className="mt-auto pt-6">
                <p className="rounded border border-orange/20 bg-orange/10 px-4 py-3 text-base font-black leading-7 text-purple">
                  个人综合分 = ZJU 七月集训标准分 × 20% + 个人选拔赛 Day 1 标准分 × 40% + 个人选拔赛 Day 2 标准分 × 40%
                </p>
              </div>
            </article>

            <article className="flex flex-col rounded border border-purple/10 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <Users className="text-orange" size={30} />
                <h2 className="text-3xl font-black text-purple">进队面试</h2>
              </div>
              <div className="mt-5 grid gap-3">
                {teamRules.map((rule) => (
                  <div key={rule.title} className="rounded bg-lavender2 px-4 py-3">
                    <h3 className="text-lg font-black text-purple">{rule.title}</h3>
                    <p className="mt-1 text-base leading-7 text-slatecopy">{rule.body}</p>
                  </div>
                ))}
              </div>
              <div className="mt-auto pt-6">
                <p className="rounded border border-orange/20 bg-orange/10 px-4 py-3 text-base font-bold leading-7 text-purple">
                  {teamNote}
                </p>
              </div>
            </article>
          </div>
        </section>

        <section className="mt-12">
          <article className="rounded border border-purple/10 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <Trophy className="text-orange" size={30} />
              <h2 className="text-3xl font-black text-purple">组队训练及参赛规则</h2>
            </div>
            <div className="mt-5 grid gap-3">
              {contestAssignments.map(([title, body]) => (
                <div key={title} className="rounded bg-lavender2 px-4 py-3">
                  <h3 className="text-lg font-black text-purple">{title}</h3>
                  <p className="mt-1 text-base leading-7 text-slatecopy">{body}</p>
                </div>
              ))}
              <div className="rounded bg-lavender2 px-4 py-3">
                <h3 className="text-lg font-black text-purple">高级赛事</h3>
                <p className="mt-1 text-base leading-7 text-slatecopy">
                  根据队伍正式赛最好成绩，推荐不超过 3 支 ICPC EC-Final 队伍、不超过 1+1 支 CCPC Final 队伍（含女生名额），以及 0-1 支 ICPC World Final 队伍。
                </p>
              </div>
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
          {['集训队员', '正式队伍'].map((title) => (
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
