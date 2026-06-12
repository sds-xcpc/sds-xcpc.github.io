export type Stat = {
  value: string;
  label: string;
  caption: string;
};

export type HonorCounter = {
  value: string;
  label: string;
  caption: string;
  tone: 'purple' | 'gold' | 'silver' | 'bronze';
};

export type HonorItem = {
  title: string;
  detail: string;
};

export type Competition = {
  name: string;
  englishName: string;
  image: string;
  summary: string;
  facts: string[];
  system: string[];
};

export type RoadmapStage = {
  stage: string;
  title: string;
  body: string;
  tag: string;
};

export type TimelineItem = {
  date: string;
  title: string;
  detail: string;
  featured?: boolean;
};

export type Person = {
  name: string;
  role: string;
  affiliation?: string;
  image?: string;
  period?: string;
  highlights: string[];
  bio: string;
};

export type FeaturedTeam = {
  name: string;
  englishName?: string;
  image: string;
  members: string[];
  honors: string[];
};

export type Publication = {
  title: string;
  authors: string;
  venue: string;
  description: string;
};

export type Company = {
  name: string;
  logo: string;
};

export type EventItem = {
  title: string;
  type: string;
  date: string;
  location: string;
  image?: string;
  images: string[];
  metrics: string[];
  body: string;
};

export type Awardee = {
  name: string;
  year: string;
  school: string;
  achievement: string;
};

export type Alumni = {
  name: string;
  cohort: string;
  contest: string;
  research: string;
  career?: string;
  destination: string;
};

export const site = {
  name: '香港中文大学（深圳）程序设计竞赛队',
  englishName: 'CUHK-Shenzhen Programming Contest Team',
  shortName: 'CUHK-SZ XCPC Team',
  tagline: '香港中文大学（深圳）程序设计竞赛队是代表香港中文大学（深圳）参加国际/国内大学生程序设计竞赛的组织。',
  email: 'admissions@cuhk.edu.cn',
  website: 'http://sds.cuhk.edu.cn',
  address: '中国广东省深圳市龙岗区龙翔大道 2001 号道远楼',
  qqGroup: '293037862',
};

export const hero = {
  title: '香港中文大学（深圳）程序设计竞赛队',
  subtitle:
    '香港中文大学（深圳）程序设计竞赛队是代表香港中文大学（深圳）参加国际/国内大学生程序设计竞赛的组织。',
  image: 'images/hero-team.jpg',
  images: [
    'images/hero-team.jpg',
    'images/home/gba-2026-group.jpg',
    'images/home/gba-2026-advisors.jpg',
    'images/home/icpc-2026-arena.jpg',
    'images/home/icpc-2026-advisors.jpg',
  ],
};

const missionText =
  '核心目标通过一系列校内外编程活动，像“全民乒乓球运动”一样吸引全校大学生积极参与编程，“以赛促学”、“以赛促研”，以竞赛促进计算机本科教育水平的提高，最终全面提升我校学生的算法设计、逻辑推理、编程动手、科学研究等方面的能力。';

export const teamMission = {
  name: '查宏远教授',
  role: '数据科学学院副院长',
  image: 'images/people-cha-hongyuan.png',
  headline: '以赛促学，以赛促研',
  quote: missionText,
};

export const teamIntro = [
  '香港中文大学（深圳）程序设计竞赛队（以下简称“竞赛队”）是代表香港中文大学（深圳）参加国际/国内大学生程序设计竞赛的组织，由数据科学学院方一向教授、马晨昊教授、陈靖邦教授任指导老师，本科生何润元、周莫非任学生队长，共29位学生队员。竞赛队向全校同学开放加入的机会。本年度，代表大学参赛的队员来自多个学院，横跨四个年级。',
  '竞赛队所参加的大学生程序设计竞赛是培养高端人才的重要途径。国际大学生程序设计竞赛（International Collegiate Programming Contest）是全球最具影响力的大学生计算机竞赛，被誉为计算机软件领域的奥林匹克。竞赛队还积极参加中国大学生程序设计竞赛（China Collegiate Programming Contest）等知名赛事。自成立以来，竞赛队目前累计获得37枚金奖、34枚银奖、20枚铜奖。',
  '参加国内外各类程序设计竞赛之余，竞赛队还成功举办了2023-2024年香港中文大学（深圳）程序设计竞赛、2025-2026年粤港澳大湾区国际编程大赛，吸引了全校、大湾区、乃至世界各地学生的参赛。于2026年4月11日，竞赛队成功举办了2026年国际大学生程序设计竞赛全国邀请赛（深圳），这是我校历史上首次承办ICPC系列赛事，标志着我校在计算机学科竞赛组织能力及学术影响力方面再上新台阶。此外，竞赛队还积极参与了大学本科生招生，协助附属学校信息学竞赛培训，举办各类编程相关的课程复习讲座，与大湾区其它高校、企业、中小学进行友好互动等。',
  '竞赛队始终秉持着全栈式培养理念，积极搭建发展平台，为全体队员在校四年期间提供全面成长的机会。在队员大一、大二阶段，竞赛队精心规划，助力队员踊跃参与国内外各类编程赛事，在实战中锤炼技能、积累经验；待队员步入大三大四，竞赛队充分发挥资源优势，将队员推荐至专业课题组以及知名企业，让他们在科研探索与实习实践中深化专业认知、提升综合能力，为未来的职业发展筑牢坚实根基。目前，已毕业的多名队员在加州大学伯克利分校、滑铁卢大学、南洋理工大学等世界顶尖学府攻读博士学位。',
];

export const stats: Stat[] = [
  { value: '2020.09', label: '团队成立', caption: '香港中文大学（深圳）程序设计竞赛队成立于2020年9月。' },
  { value: '37 / 34 / 20', label: '金 / 银 / 铜', caption: '截止2026年，累计获得37枚金奖、34枚银奖、20枚铜奖。' },
  { value: '2', label: 'World Final 出线', caption: '获得第46届、48届ICPC World Final出线资格。' },
  { value: '29', label: '学生队员', caption: '共29位学生队员。本年度，代表大学参赛的队员来自多个学院，横跨四个年级。' },
];

export const honorCounters: HonorCounter[] = [
  {
    value: '2',
    label: 'ICPC World Final 出线',
    caption: '获得第46届、48届ICPC World Final出线资格',
    tone: 'purple',
  },
  {
    value: '37',
    label: '金奖',
    caption: '截止2026年，累计获得',
    tone: 'gold',
  },
  {
    value: '34',
    label: '银奖',
    caption: '截止2026年，累计获得',
    tone: 'silver',
  },
  {
    value: '20',
    label: '铜奖',
    caption: '截止2026年，累计获得',
    tone: 'bronze',
  },
];

export const headlineHonors: HonorItem[] = [
  {
    title: '2025 年 CCPC 女生专场冠军',
    detail: 'WTYTO队获2025年中国大学生程序设计竞赛女生专场冠军。',
  },
  {
    title: '2026 年广东省赛冠军',
    detail: 'Mynoghra队获得2026年广东大学生程序设计竞赛冠军。',
  },
  {
    title: '承办2026 年 ICPC 全国邀请赛（深圳）',
    detail: '这是我校历史上首次承办ICPC系列赛事，标志着我校在计算机学科竞赛组织能力及学术影响力方面再上新台阶。',
  },
];

export const competitions: Competition[] = [
  {
    name: 'ICPC 国际大学生程序设计竞赛',
    englishName: 'International Collegiate Programming Contest',
    image: 'images/logos/icpc-logo.png',
    summary:
      '以团队的形式代表学校参赛，每队由三名队员组成；使用一台电脑在5小时内用编程解决7-13道程序设计问题；旨在展示大学生创新能力、团队精神、和在压力下编写程序、分析和解决问题的能力；由美国计算机协会ACM主办，AWS、华为和Jetbrains赞助。',
    facts: ['以团队的形式代表学校参赛', '每队由三名队员组成', '使用一台电脑在5小时内用编程解决7-13道程序设计问题'],
    system: ['亚洲区域赛(6场)', '亚洲区域赛总决赛(1场)', '全球总决赛(1场)'],
  },
  {
    name: 'CCPC 中国大学生程序设计竞赛',
    englishName: 'China Collegiate Programming Contest',
    image: 'images/logos/ccpc-logo.png',
    summary:
      '由教育部高等学校计算机类专业教学指导委员会主办，由红旗、腾讯等赞助。',
    facts: ['女生赛', '省赛', '区域赛', '总决赛'],
    system: ['女生赛(1场)', '省赛(1场)', '区域赛(4场)', '总决赛(1场)'],
  },
];

export const whyContest = [
  {
    title: '能力提升',
    body: '提升编程能力、强化算法思维、拓展专业知识。',
  },
  {
    title: '升学优势',
    body: '导师优先录取有编程竞赛经历的学生。',
  },
  {
    title: '就业优势',
    body: '企业优先招聘有编程竞赛经历的学生。',
  },
  {
    title: '其它',
    body: '去世界/全国各地免费旅行；结识志同道合的队友。',
  },
];

export const mission = missionText;

export const roadmap: RoadmapStage[] = [
  {
    stage: '新生入学',
    title: '暑期集训',
    body: '竞赛队秉持全栈式培养理念，为全体队员在校四年期间提供全面成长的机会。',
    tag: '新生入学',
  },
  {
    stage: '大一期间',
    title: '组织队员集训，参加编程大赛',
    body: '锤炼技能，初入赛场。',
    tag: '锤炼技能',
  },
  {
    stage: '大二期间',
    title: '组织队员集训，参加编程大赛',
    body: '深化技能，收获奖牌。',
    tag: '收获奖牌',
  },
  {
    stage: '大三期间',
    title: '推荐企业实习，参与科研活动，提供升学指导',
    body: '发表论文，企业实战。',
    tag: '发表论文',
  },
  {
    stage: '大四期间',
    title: '推荐企业实习，参与科研活动，提供升学指导',
    body: '发表论文，企业实战。',
    tag: '企业实战',
  },
];

export const timeline: TimelineItem[] = [
  { date: '2020.09', title: '团队成立', detail: '团队成立。', featured: true },
  { date: '2020.11', title: '第一次参赛', detail: '第一次参加程序设计竞赛。' },
  { date: '2020.12', title: 'ICPC 济南站首获银牌', detail: 'ICPC济南站首获银牌。' },
  { date: '2021.10', title: '首次参加 CCPC 女生赛', detail: '首次参加CCPC女生赛。' },
  { date: '2021.11', title: 'CCPC 桂林站首获金牌', detail: 'CCPC桂林站首获金牌。', featured: true },
  { date: '2021.11', title: 'ICPC 桂林站首获奖杯', detail: 'ICPC桂林站首获奖杯。' },
  { date: '2021.12', title: '锁定 World Final 名额', detail: '锁定World Final名额。', featured: true },
  { date: '2022.07', title: 'ICPC 亚洲区决赛金牌', detail: 'ICPC亚洲区决赛金牌。' },
  { date: '2023.10', title: 'CCPC 女生赛首获金牌', detail: 'CCPC女生赛首获金牌。' },
  { date: '2023.11', title: '第二次锁定 World Final 名额', detail: '第二次锁定World Final名额。', featured: true },
  { date: '2024.11', title: 'CCPC 郑州站首获奖杯', detail: 'CCPC郑州站首获奖杯。' },
  { date: '2026.04', title: '承办 ICPC 全国邀请赛（深圳）', detail: '举办2026年ICPC全国邀请赛（深圳）。', featured: true },
];

export const teachers: Person[] = [
  {
    name: '方一向教授',
    role: '指导教师',
    affiliation: '数据科学学院',
    image: 'images/people-fang-yixiang.jpg',
    highlights: ['大数据管理', '数据挖掘', '人工智能', 'SIGMOD Research Highlight Award'],
    bio:
      '主要研究大数据管理、挖掘、人工智能等相关课题，累计发表论文100余篇。其中一项代表性研究成果的论文被评为SIGMOD 2020会议四篇最佳论文之一，并荣获2021 ACM SIGMOD Research Highlight Award。目前担任国际知名期刊IPM（CCF-B类期刊）的编委、多个顶级会议和期刊的审稿人、以及中国计算机学会数据库专业委员会的执行委员。',
  },
  {
    name: '马晨昊教授',
    role: '指导教师',
    affiliation: '数据科学学院',
    image: 'images/people-ma-chenhao.jpg',
    highlights: ['大规模数据管理', 'SIGMOD', 'VLDB', 'ICDE', 'KDD'],
    bio:
      '主要研究兴趣是大规模数据管理与挖掘，于2021年博士毕业于香港大学，研究工作主要发表在SIGMOD、VLDB、ICDE、KDD、WWW、NeurIPS等顶级会议，包括一篇Best of SIGMOD 2020，并获得次年ACM SIGMOD Research Highlight Award，并担任多个顶级会议和期刊的审稿人。',
  },
  {
    name: '陈靖邦教授',
    role: '指导教师',
    affiliation: '数据科学学院',
    image: 'images/people-chen-jingbang.jpg',
    highlights: ['图论算法', '数据结构', '两次 ICPC World Final', 'Universal Cup'],
    bio:
      '主要研究方向是设计、分析、实现有理论保证的高效图论算法和数据结构。研究工作主要发表在ICML，KDD，VLDB上。他曾两次参加ICPC世界总决赛，曾获得两次ICPC区域赛冠军和十二次金奖。他曾担任包含中国区决赛在内多场ICPC亚洲区域赛的命题负责人、裁判长；曾担任佐治亚理工学院校队教练及北美程序设计训练营(NAPC)等训练营教练。他是Universal Cup的创始人和联合主席。',
  },
];

export const captains: Person[] = [
  {
    name: '忙秋阳',
    role: '历任队长',
    affiliation: '数据科学学院，2021级学生',
    image: 'images/people-mang-qiuyang.jpg',
    period: '2021.07-2023.12',
    highlights: ['2022 ICPC 亚洲区决赛金奖', '2023 ICPC 全球总决赛资格'],
    bio: '曾获2022年ICPC亚洲区决赛金奖，获得2023年ICPC全球总决赛参赛资格。',
  },
  {
    name: '夏禹扬',
    role: '历任队长',
    affiliation: '数据科学学院，2021级学生',
    image: 'images/people-xia-yuyang.jpg',
    period: '2023.06-2024.05',
    highlights: ['2022 CCPC 广州站金奖', '2022 ICPC 亚洲区决赛银奖', '国家奖学金'],
    bio: '曾获2022年CCPC广州站金奖，2022年ICPC亚洲区决赛银奖、国家奖学金。',
  },
  {
    name: '蒋一歌',
    role: '历任队长',
    affiliation: '数据科学学院，2021级学生',
    image: 'images/people-jiang-yige.jpg',
    period: '2023.07-2024.05',
    highlights: ['2023 ICPC 南京站金奖', '2022 ICPC 亚洲区决赛银奖'],
    bio: '曾获2023年ICPC南京站金奖，2022年ICPC亚洲区决赛银奖。',
  },
  {
    name: '孙悠然',
    role: '历任队长',
    affiliation: '数据科学学院，2023级学生',
    image: 'images/people-sun-youran.jpg',
    period: '2024.05-2026.05',
    highlights: ['2024 CCPC 郑州站季军', '2024 ICPC 亚洲区决赛金奖'],
    bio: '曾获2024年CCPC郑州站季军，2024年ICPC亚洲区决赛金奖。',
  },
  {
    name: '何润元',
    role: '学生队长',
    affiliation: '数据科学学院，2023级学生',
    image: 'images/people-he-runyuan.jpg',
    period: '2025.01 至今',
    highlights: ['2023 ICPC 澳门站季军', '2024 ICPC 全球总决赛资格'],
    bio: '曾获2023年ICPC澳门站季军，获得2024年ICPC全球总决赛参赛资格。',
  },
  {
    name: '周莫非',
    role: '学生队长',
    affiliation: '数据科学学院，2025级学生',
    image: 'images/people-zhou-mofei.jpg',
    period: '2026.05 至今',
    highlights: ['2025 ICPC 南京站金牌', '2025 ICPC 香港站金牌', '2025 ICPC 亚洲区决赛金牌', '2025 CCPC 济南站金牌', '2026 广东省赛冠军'],
    bio: '曾获2025年ICPC南京站、香港站、亚洲区决赛金牌、CCPC济南站金牌、2026年广东省赛冠军。',
  },
];

export const featuredTeams: FeaturedTeam[] = [
  {
    name: '新手上路',
    englishName: 'Novices on the Road',
    image: 'images/teams/novices-on-the-road.jpg',
    members: ['徐源', '郭青硕', '忙秋阳'],
    honors: ['ICPC亚洲区决赛金牌', 'ICPC沈阳站亚军', 'ICPC World Final参赛资格'],
  },
  {
    name: '香港中文大学-深圳（待定）',
    englishName: 'CUHK-SZ: (TBD)',
    image: 'images/teams/cuhksz-tbd.jpg',
    members: ['曾子荣', '何润元', '陈翰飞'],
    honors: ['ICPC港澳站季军', 'CCPC深圳站金牌', 'ICPC World Final参赛资格'],
  },
  {
    name: 'WTYTO',
    englishName: 'WTYTO',
    image: 'images/teams/wtyto.jpg',
    members: ['孙悠然', '杨久知', '涂宵箫'],
    honors: ['CCPC女生专场冠军'],
  },
  {
    name: 'Mynoghra',
    englishName: 'Mynoghra',
    image: 'images/teams/mynoghra.jpg',
    members: ['周莫非', '陈嘉年', '王泽诚'],
    honors: ['广东省赛冠军', 'ICPC亚洲区决赛金牌', 'ICPC南京站金牌', 'ICPC香港站金牌', 'CCPC济南站金牌'],
  },
];

export const companies: Company[] = [
  { name: '华为云', logo: 'images/logos/huawei-cloud.jpg' },
  { name: '英伟达', logo: 'images/logos/nvidia.png' },
  { name: '腾讯', logo: 'images/logos/tencent.png' },
  { name: '乾象', logo: 'images/logos/metabit.png' },
  { name: '博普科技', logo: 'images/logos/bopu-tech.png' },
];

export const publications: Publication[] = [
  {
    title: 'On Querying Connected Components in Large Temporal Graphs',
    authors: 'Haoxuan Xie, Yixiang Fang†, Yuyang Xia, Wensheng Luo, Chenhao Ma',
    venue: 'SIGMOD 2023',
    description: 'SIGMOD是数据库系统领域历史最为悠久也是最为权威的学术会议，被中国计算机学会（CCF）列为A类会议。',
  },
  {
    title: 'Testing Graph Database Systems via Equivalent Query Rewriting',
    authors: 'Qiuyang Mang*, Aoyang Fang*, Boxi Yu, Hanfei Chen, Pinjia He（*为共同一作）',
    venue: 'ICSE 2024',
    description: 'ICSE是国际公认的软件工程领域顶级会议，被中国计算机学会（CCF）列为A类会议。',
  },
  {
    title: 'A Counting-based Approach for Efficient k-clique Densest Subgraph Discovery',
    authors: 'Yingli Zhou, Qingshuo Guo, Yixiang Fang†, Chenhao Ma',
    venue: 'SIGMOD 2024',
    description: 'SIGMOD是数据库系统领域历史最为悠久也是最为权威的学术会议，被中国计算机学会（CCF）列为A类会议。',
  },
  {
    title: 'Scalable Algorithm for Finding Balanced Subgraphs with Tolerance in Signed Networks',
    authors: 'Jingbang Chen*, Qiuyang Mang*, Hangrui Zhou*, Richard Peng, Yu Gao, Chenhao Ma†（*为共同一作）',
    venue: 'KDD 2024',
    description: 'KDD是数据挖掘领域历史最悠久、规模最大的学术会议，被中国计算机学会（CCF）列为A类会议。',
  },
];

export const events: EventItem[] = [
  {
    title: '2026 年国际大学生程序设计竞赛（ICPC）全国邀请赛（深圳）',
    type: '承办赛事',
    date: '2026.04.11',
    location: '礼文堂',
    images: [
      'images/events/icpc-invitational-hall.jpg',
      'images/events/icpc-invitational-arena.jpg',
      'images/events/icpc-invitational-stage.jpg',
      'images/events/icpc-invitational-speech.jpg',
      'images/events/icpc-invitational-trophy.jpg',
    ],
    metrics: ['地点：礼文堂', '时间：2026年4月11日', '选手：326支参赛队伍，总人数达977人，来自全国202所高校及25所知名中学。', '题量：13道题目', '赛制：团队赛'],
    body: '校史上首次承办ICPC系列赛事。',
  },
  {
    title: '2026 年粤港澳大湾区国际编程大赛',
    type: '区域赛事',
    date: '2026.04.12',
    location: 'TA、TD、TXC、TXA 计算机教室',
    images: [
      'images/events/gba-2026-group.jpg',
      'images/events/gba-2026-stage.jpg',
      'images/events/gba-2026-room.jpg',
      'images/events/gba-2026-problem-explaining.jpg',
      'images/events/gba-2025-official.jpg',
    ],
    metrics: ['地点：TA、TD、TXC、TXA计算机教室', '时间：2026年4月12日', '选手：468余名包括本科生、研究生、博士生以及中小学生在内的选手，覆盖76余所海内外高校', '主办方：深圳河套学院、香港中文大学（深圳）联合主办', '题量：12道题目', '报名规则：Track A赛道、Track B赛道、Track C、Track D赛道', '赛制：单人赛，增设人工智能协同编程赛道（Track D）'],
    body: '题目讲解、正式赛、颁奖典礼、比赛合影。2026年粤港澳大湾区国际编程大赛。',
  },
  {
    title: '2025 年粤港澳大湾区国际编程大赛',
    type: '区域赛事',
    date: '2025.04.19',
    location: 'TA、TD、TXC、TXA 计算机教室',
    images: [
      'images/events/gba-2025-room.jpg',
      'images/events/gba-2025-lab.jpg',
      'images/events/gba-2025-awards-audience.jpg',
      'images/events/gba-2025-hotup.jpg',
      'images/events/gba-2025-official.jpg',
    ],
    metrics: ['地点：TA、TD、TXC、TXA计算机教室', '时间：2025年4月19日', '选手：610余名包括本科生、研究生、博士生以及中小学生在内的选手，覆盖118余所海内外高校', '主办方：深圳河套学院、香港中文大学（深圳）联合主办', '题量：12道题目', '报名规则：Track A赛道、Track B赛道、Track C赛道', '赛制：单人赛'],
    body: '热身赛、正式赛、颁奖典礼、深圳河套学院宣讲会。2025年粤港澳大湾区国际编程大赛。',
  },
  {
    title: '2024 年香港中文大学（深圳）程序设计竞赛',
    type: '校内赛',
    date: '2024.04.13',
    location: 'TC、TD、TXC 计算机教室',
    images: [
      'images/events/cuhksz-contest-2024-room.jpg',
      'images/events/cuhksz-contest-2024-contest-room.jpg',
      'images/events/cuhksz-contest-2024-competing.jpg',
      'images/events/cuhksz-contest-2024-lab.jpg',
      'images/events/cuhksz-contest-2024-mobilization.jpg',
      'images/events/cuhksz-contest-2024-volunteers.jpg',
      'images/events/cuhksz-contest-2024-auditorium.jpg',
      'images/events/cuhksz-contest-2024-champion.jpg',
    ],
    metrics: ['地点：TC、TD、TXC计算机教室', '时间：2024年4月13日', '选手：380名包括本科生、研究生、以及中小学生在内的选手。除本校学生外，此届竞赛还覆盖4所香港高校、1所广州高校、5所深圳高校和7所深圳市中小学校', '题量：10道题目', '报名规则：DIV-1赛道、DIV-2赛道', '赛制：单人赛'],
    body: '热身赛、正式赛、颁奖典礼、赛前动员。香港中文大学（深圳）2024年程序设计竞赛。',
  },
  {
    title: '2023 年香港中文大学（深圳）程序设计竞赛',
    type: '校内赛',
    date: '2023.04.02',
    location: 'TD、TA 计算机教室',
    images: [
      'images/events/cuhksz-contest-2023-lab.jpg',
      'images/events/cuhksz-contest-2023-grade-breakdown.png',
      'images/events/cuhksz-contest-2023-award.jpg',
      'images/events/cuhksz-contest-2023-speech.jpg',
      'images/events/cuhksz-contest-2023-guests.jpg',
      'images/events/cuhksz-contest-2023-group.jpg',
    ],
    metrics: ['地点：TD、TA计算机教室', '时间：2023年4月2日', '选手：235名学生报名参赛，选手来自数据科学学院(67.78%)、理工学院(20.92%)、经管学院(10.04%)、医学院(0.84%)和人文社科学院(0.42%)', '题量：12道题目', '报名规则：Observer赛道、Participant赛道', '赛制：单人赛'],
    body: '香港中文大学（深圳）2023年程序设计竞赛。',
  },
  {
    title: '高水平交流与校园服务',
    type: '交流培训',
    date: '持续进行',
    location: '校园内外',
    images: [
      'images/events/president-xu-1-upright.jpg',
      'images/events/president-xu-2-upright.jpg',
      'images/events/hopcroft-seminar.jpg',
      'images/events/bopu-talk.jpg',
      'images/events/bopu-dialogue.jpg',
      'images/events/huawei-talk.jpg',
      'images/events/review-lecture.jpg',
      'images/events/academic-salon.jpg',
      'images/events/affiliated-school-training.jpg',
      'images/events/academic-salon-russia-title.jpg',
      'images/events/academic-salon-russia-results.jpg',
      'images/events/problem-discussion.jpg',
      'images/events/stage-awards.jpg',
    ],
    metrics: ['与徐扬生校长座谈', '与图灵奖得主John Edward Hopcroft座谈', '与博普科技副总孙林春女士座谈', '与华为高管座谈', '计算机专业课复习讲座', '学术沙龙与研讨会', '香港中文大学(深圳)附属学校编程辅导'],
    body: '与徐扬生校长座谈；与图灵奖得主John Edward Hopcroft座谈；与博普科技副总孙林春女士座谈；与华为高管座谈；计算机专业课复习讲座；学术沙龙与研讨会；香港中文大学（深圳）附属学校编程辅导。',
  },
];

export const awardees: Awardee[] = [
  { name: '周莫非', year: '2025', school: '数据科学学院', achievement: 'ICPC EC Final 金奖、CCPC 金奖、广东省赛冠军' },
  { name: '陈嘉年', year: '2025', school: '数据科学学院', achievement: 'ICPC EC Final 金奖、CCPC 金奖、广东省赛冠军' },
  { name: '涂宵箫', year: '2024', school: '数据科学学院', achievement: 'ICPC 金奖、CCPC 金奖、CCPC 女生赛冠军' },
  { name: '杨久知', year: '2024', school: '经管学院', achievement: 'ICPC 金奖、CCPC 金奖、CCPC 女生赛冠军' },
  { name: '王泽诚', year: '2024', school: '数据科学学院', achievement: 'ICPC EC Final 金奖、CCPC 金奖、广东省赛冠军' },
  { name: '江璘鋆', year: '2024', school: '理工学院', achievement: 'ICPC 铜奖' },
  { name: '张力文', year: '2024', school: '数据科学学院', achievement: 'ICPC 铜奖' },
  { name: '林宇凡', year: '2024', school: '数据科学学院', achievement: 'ICPC 铜奖' },
  { name: '周天', year: '2024', school: '数据科学学院', achievement: 'ICPC 铜奖' },
  { name: '郭雨昂', year: '2024', school: '数据科学学院', achievement: 'ICPC 铜奖' },
  { name: '孙超逸', year: '2024', school: '数据科学学院', achievement: 'ICPC 铜奖' },
  { name: '张恒', year: '2024', school: '数据科学学院', achievement: 'ICPC 铜奖' },
  { name: '梁皓', year: '2024', school: '数据科学学院', achievement: 'ICPC 铜奖' },
  { name: '何润元', year: '2023', school: '数据科学学院', achievement: '进入 ICPC 世界总决赛' },
  { name: '孙悠然', year: '2023', school: '数据科学学院', achievement: 'ICPC EC Final 金奖、CCPC 季军、CCPC 女生赛冠军' },
  { name: '张王美誉', year: '2023', school: '数据科学学院', achievement: 'ICPC 金奖、CCPC 银奖' },
  { name: '莫骄阳', year: '2023', school: '理工学院', achievement: 'ICPC 金奖、CCPC 银奖' },
  { name: '周信言', year: '2023', school: '数据科学学院', achievement: 'ICPC 金奖、CCPC 银奖' },
  { name: 'Dang Huu Quyen', year: '2023', school: '数据科学学院', achievement: 'ICPC 金奖、CCPC 银奖' },
  { name: '叶嘉泓', year: '2023', school: '数据科学学院', achievement: 'ICPC 铜奖' },
  { name: '曾子荣', year: '2022', school: '数据科学学院', achievement: '进入 ICPC 世界总决赛' },
  { name: '陈翰飞', year: '2022', school: '数据科学学院', achievement: '进入 ICPC 世界总决赛' },
  { name: '周宸宇', year: '2022', school: '数据科学学院', achievement: 'ICPC 金奖' },
  { name: '刘戴乐', year: '2022', school: '数据科学学院', achievement: 'ICPC 铜奖、CCPC 铜奖' },
  { name: '梁骆城', year: '2022', school: '数据科学学院', achievement: 'ICPC 铜奖、CCPC 铜奖' },
  { name: '邵辰航', year: '2022', school: '数据科学学院', achievement: 'ICPC 铜奖、CCPC 铜奖' },
  { name: '胡瑞李蓁', year: '2022', school: '数据科学学院', achievement: 'CCPC 银奖' },
  { name: '忙秋阳', year: '2021', school: '数据科学学院', achievement: '进入 ICPC 世界总决赛' },
  { name: '李冬旭', year: '2021', school: '数据科学学院', achievement: '进入 ICPC 世界总决赛' },
  { name: '徐源', year: '2021', school: '数据科学学院', achievement: '进入 ICPC 世界总决赛' },
  { name: '蒋一歌', year: '2021', school: '数据科学学院', achievement: 'ICPC 金奖、ICPC EC Final 银奖' },
  { name: '郭青硕', year: '2021', school: '数据科学学院', achievement: 'ICPC EC Final 金奖、CCPC 季军' },
  { name: '侯天赐', year: '2021', school: '数据科学学院', achievement: 'CCPC 金奖、ICPC 银奖' },
  { name: '夏禹扬', year: '2021', school: '数据科学学院', achievement: 'CCPC 金奖、ICPC 银奖' },
  { name: '赵子逸', year: '2021', school: '数据科学学院', achievement: 'CCPC 金奖、ICPC 银奖' },
  { name: '潘婕', year: '2021', school: '数据科学学院', achievement: 'ICPC 铜奖' },
  { name: '曲恒毅', year: '2020', school: '数据科学学院', achievement: 'CCPC 金奖、ICPC 银奖' },
  { name: '程思浩', year: '2020', school: '数据科学学院', achievement: 'ICPC 银奖' },
  { name: '陈建文', year: '2020', school: '数据科学学院', achievement: 'ICPC 银奖' },
  { name: '金德容', year: '2020', school: '数据科学学院', achievement: 'ICPC 银奖' },
  { name: '俞晨阳', year: '2020', school: '数据科学学院', achievement: 'ICPC 铜奖' },
  { name: '吴东昊', year: '2020', school: '数据科学学院', achievement: 'ICPC 铜奖' },
  { name: '邓毅轩', year: '2020', school: '数据科学学院', achievement: 'ICPC 铜奖' },
  { name: '胡海川', year: '2019', school: '数据科学学院', achievement: 'CCPC 铜奖、ICPC 银奖' },
  { name: '成就', year: '2019', school: '数据科学学院', achievement: 'ICPC 铜奖' },
  { name: '谢昊轩', year: '2019', school: '数据科学学院', achievement: 'ICPC 银奖' },
];

export const alumni: Alumni[] = [
  {
    name: '谢昊轩',
    cohort: '2019 级',
    contest: 'ICPC 银牌',
    research: '本科期间以第一作者身份在 SIGMOD 2023 发表论文',
    destination: '南洋理工大学计算机科学直博',
  },
  {
    name: '忙秋阳',
    cohort: '2021 级',
    contest: '进入 ICPC 世界总决赛',
    research: '本科期间以第一作者或共同一作身份在 SIGMOD、VLDB、ICSE、KDD 等顶级会议发表四篇论文',
    destination: '加州大学伯克利分校计算机科学直博',
  },
  {
    name: '郭青硕',
    cohort: '2021 级',
    contest: 'CCPC 季军、ICPC 金牌',
    research: '本科期间在 SIGMOD、VLDB 等顶级会议发表多篇论文',
    destination: '滑铁卢大学计算机科学直博',
  },
  {
    name: '夏禹扬',
    cohort: '2021 级',
    contest: 'CCPC 金牌、ICPC 银牌',
    research: '本科期间以第一作者身份在 SIGMOD 2025 发表论文，获得 2024 年本科生国家奖学金',
    destination: '埃默里大学计算机科学硕士（硕博连读）',
  },
  {
    name: '侯天赐',
    cohort: '2021 级',
    contest: 'CCPC 金牌、ICPC 银牌',
    research: '本科期间在 VLDB 顶级会议发表论文',
    career: 'NVIDIA（上海）实习',
    destination: '加利福尼亚大学圣迭戈分校计算机科学硕士',
  },
  {
    name: '赵子逸',
    cohort: '2021 级',
    contest: 'CCPC 金牌、ICPC 银牌',
    research: '本科期间完成一篇第一作者论文（论文在投）',
    career: '华为云（深圳）实习',
    destination: '伊利诺伊大学厄巴纳-香槟分校科研助理',
  },
  {
    name: '蒋一歌',
    cohort: '2021 级',
    contest: 'ICPC 金牌、ICPC EC Final 银牌',
    research: '本科期间完成一篇共同第一作者论文（论文在投）',
    career: '华为云（深圳）实习',
    destination: '南洋理工大学计算机科学直博',
  },
];

export const presentationSlides = [
  {
    kicker: '01 / 开场',
    title: '香港中文大学（深圳）程序设计竞赛队',
    takeaway: 'Programming contest team 2026',
    image: 'images/hero-team.jpg',
    bullets: ['代表香港中文大学（深圳）参加国际/国内大学生程序设计竞赛的组织', '共29位学生队员', '队员来自多个学院，横跨四个年级'],
  },
  {
    kicker: '02 / 赛事',
    title: '赛事简介',
    takeaway: 'ICPC国际大学生程序设计竞赛；CCPC中国大学生程序设计竞赛。',
    image: 'images/events/icpc-arena.jpg',
    bullets: ['每队由三名队员组成', '使用一台电脑在5小时内用编程解决7-13道程序设计问题', '旨在展示大学生创新能力、团队精神、和在压力下编写程序、分析和解决问题的能力'],
  },
  {
    kicker: '03 / 动机',
    title: '为什么参加竞赛',
    takeaway: '能力提升、升学优势、就业优势、其它。',
    image: 'images/awards-plaque.jpg',
    bullets: ['提升编程能力、强化算法思维、拓展专业知识', '导师优先录取有编程竞赛经历的学生', '企业优先招聘有编程竞赛经历的学生'],
  },
  {
    kicker: '04 / 理念',
    title: '竞赛队宗旨',
    takeaway: '数据科学学院副院长 查宏远教授',
    image: 'images/people-cha-hongyuan.png',
    bullets: ['核心目标通过一系列校内外编程活动', '像“全民乒乓球运动”一样吸引全校大学生积极参与编程', '“以赛促学”、“以赛促研”'],
  },
  {
    kicker: '05 / 培养',
    title: '全栈式培养',
    takeaway: '竞赛队秉持全栈式培养理念，为全体队员在校四年期间提供全面成长的机会。',
    image: 'images/cover-pattern.png',
    bullets: ['新生入学：暑期集训', '大一、大二期间：组织队员集训，参加编程大赛', '大三、大四期间：推荐企业实习，参与科研活动，提供升学指导'],
  },
  {
    kicker: '06 / 战绩',
    title: '竞赛队成果',
    takeaway: '截止2026年，累计获得37枚金奖、34枚银奖、20枚铜奖。',
    image: 'images/achievement-medals.jpg',
    bullets: ['曾获得ICPC亚洲区域赛亚军、季军等奖项', '2025年获中国大学生程序设计竞赛女生专场冠军', '获得第46届、48届ICPC World Final出线资格'],
  },
  {
    kicker: '07 / 队伍',
    title: '优秀队伍',
    takeaway: '新手上路（Novices on the Road）；香港中文大学-深圳（待定）（CUHK-SZ:(TBD)）；WTYTO。',
    image: 'images/teams/wtyto.jpg',
    bullets: ['ICPC亚洲区决赛金牌；ICPC沈阳站亚军；ICPC World Final参赛资格', 'ICPC港澳站季军；CCPC深圳站金牌；ICPC World Final参赛资格', 'CCPC女生专场冠军'],
  },
  {
    kicker: '08 / 出路',
    title: '企业实习与科研活动',
    takeaway: '与多家知名企业建立了友好合作关系；绝大多数竞赛队员成功获得顶尖企业实习机会。',
    image: 'images/events/academic-salon.jpg',
    bullets: ['华为云；英伟达；腾讯；乾象；博普科技', 'SIGMOD 2023；ICSE 2024；SIGMOD 2024；KDD 2024', '优秀队员去向'],
  },
  {
    kicker: '09 / 社区',
    title: '活动风采',
    takeaway: '与徐扬生校长座谈；与图灵奖得主John Edward Hopcroft座谈；与博普科技副总孙林春女士座谈；与华为高管座谈。',
    image: 'images/events/icpc-invitational-stage.jpg',
    bullets: ['2026年国际大学生程序设计竞赛（ICPC）全国邀请赛（深圳）', '2023年、2024年香港中文大学（深圳）程序设计竞赛', '2025年、2026年粤港澳大湾区国际编程大赛'],
  },
  {
    kicker: '10 / 加入',
    title: '联系我们',
    takeaway: '欢迎加入香港中文大学（深圳）程序设计竞赛队！',
    image: 'images/campus-hero.jpg',
    bullets: ['QQ群号：293037862', '学院官网：http://sds.cuhk.edu.cn', '招生咨询邮箱：admissions@cuhk.edu.cn'],
  },
];
