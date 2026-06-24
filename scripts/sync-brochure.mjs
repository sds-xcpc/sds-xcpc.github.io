import { createRequire } from 'node:module';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const require = createRequire(import.meta.url);
const ts = require('typescript');

const root = fileURLToPath(new URL('..', import.meta.url));
const dataPath = path.join(root, 'src', 'data', 'site.ts');
const templatePath = path.join(root, 'resources', 'brochure-template.pptx');
const outputPath = path.join(root, 'public', 'downloads', 'xcpc-team-brochure.pptx');
const planPath = path.join(root, '.tmp', 'brochure-sync-plan.json');
const teamWebsite = 'https://sds-xcpc.github.io/';
const bundledPython = 'C:\\Users\\chenj\\.cache\\codex-runtimes\\codex-primary-runtime\\dependencies\\python\\python.exe';
const pythonPath =
  process.env.PYTHON ||
  (process.platform === 'win32' && fs.existsSync(bundledPython) ? bundledPython : 'python3');

function loadSiteData() {
  const source = fs.readFileSync(dataPath, 'utf-8');
  const compiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      esModuleInterop: true,
    },
  }).outputText;

  const module = { exports: {} };
  const sandbox = {
    module,
    exports: module.exports,
    require() {
      throw new Error('site.ts should not require runtime modules');
    },
  };

  vm.runInNewContext(compiled, sandbox, { filename: dataPath });
  return module.exports;
}

function statByLabel(stats, labelPart) {
  const stat = stats.find((item) => item.label.includes(labelPart));
  if (!stat) {
    throw new Error(`Missing stat containing: ${labelPart}`);
  }
  return stat;
}

function medalParts(stats) {
  const medalStat = statByLabel(stats, '金');
  const [gold, silver, bronze] = medalStat.value.split('/').map((item) => item.trim());
  return { gold, silver, bronze, caption: medalStat.caption };
}

function dateCn(date) {
  const [year, month] = date.split('.');
  return `${year}年${month.padStart(2, '0')}月`;
}

function compactTimelineTitle(title) {
  return title
    .replace('承办 ICPC 全国邀请赛（深圳）', '承办ICPC全国邀请赛')
    .replace('第三次锁定 World Final 名额', '第三次锁定WF名额');
}

function chunk(items, size) {
  const chunks = [];
  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }
  return chunks;
}

const timelineCardIds = [7, 8, 9, 10, 11, 12, 14, 21];
const timelinePageSize = timelineCardIds.length;

function cleanSpacing(text) {
  return text.replace(/\s+/g, ' ').replace(/\s+，/g, '，').trim();
}

function assetPath(asset) {
  return path.join(root, 'public', asset);
}

function mediaName(prefix, asset, index) {
  const extension = path.extname(asset) || '.jpg';
  const stem = path
    .basename(asset, extension)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return `${prefix}-${index}-${stem}${extension.toLowerCase()}`;
}

function shortHighlights(highlights = [], limit = 2) {
  return highlights.slice(0, limit).join('，');
}

function formatCaptain(captain) {
  const highlights = shortHighlights(captain.highlights, 2);
  return [
    captain.name,
    '',
    captain.affiliation,
    highlights ? `代表成绩：${highlights}` : cleanSpacing(captain.bio),
    `任期：${captain.period}`,
  ].join('\n');
}

function formatCurrentCaptains(captains) {
  return captains
    .map((captain) => {
      const highlights = shortHighlights(captain.highlights, 2);
      return `${captain.name}：${captain.affiliation}；任期 ${captain.period}；${highlights}`;
    })
    .join('\n');
}

function chineseParagraphs(lines) {
  return lines.map((line) => `　　${cleanSpacing(line)}`);
}

function timelinePagePlan(items, title = '团队发展') {
  const cardIds = timelineCardIds;
  const unusedShapeIds = [22, 59, 13, 58, 6];
  const lineGroupIds = [15, 18, 28, 31, 34, 37, 40, 43, 46, 49, 52, 55];
  const cards = cardIds.map((shapeId, index) => {
    const item = items[index];
    const row = Math.floor(index / 2);
    const col = index % 2;
    return {
      shapeId,
      fontSize: 1360,
      lines: item ? [`${dateCn(item.date)}`, compactTimelineTitle(item.title)] : [''],
      x: item ? 610000 + col * 3350000 : -10000000,
      y: item ? 2200000 + row * 1320000 : -10000000,
      cx: item ? 3000000 : 0,
      cy: item ? 1050000 : 0,
      resetTransform: true,
    };
  });
  const unusedCards = unusedShapeIds.map((shapeId) => ({
    shapeId,
    fontSize: 100,
    lines: [''],
    x: -10000000,
    y: -10000000,
    cx: 0,
    cy: 0,
    resetTransform: true,
  }));
  const allCards = [...cards, ...unusedCards];

  return {
    shapeText: [
      {
        shapeId: 23,
        fontSize: 3600,
        lines: [title],
        textStyle: {
          bold: true,
          color: '4B2A88',
          fontFace: 'Microsoft YaHei',
        },
      },
      ...allCards.map(({ shapeId, fontSize, lines }) => ({
        shapeId,
        fontSize,
        lines,
        textStyle: {
          align: 'ctr',
          anchor: 'ctr',
          bold: true,
          color: '4B2A88',
          fontFace: 'Microsoft YaHei',
        },
      })),
    ],
    shapeGeometry: allCards.map(({ shapeId, x, y, cx, cy, resetTransform }) => ({
      shapeId,
      x,
      y,
      cx,
      cy,
      resetTransform,
    })),
    shapeStyle: allCards.map(({ shapeId, cx }) => ({
      shapeId,
      fill: cx ? 'FFFFFF' : undefined,
      line: cx ? 'D8CFF1' : undefined,
      lineWidth: 9525,
    })),
    groupGeometry: lineGroupIds.map((groupId) => ({ groupId, x: -10000000, y: -10000000, cx: 0, cy: 0 })),
  };
}

function captainPagePlan(captains, title, pageNumber) {
  const slots = [
    { text: 31, pic: 32, group: 29, aspect: 0.7143744623568834 },
    { text: 36, pic: 37, group: 34, aspect: 0.6874222313666705 },
    { text: 22, pic: 13, group: 10, aspect: 0.7076518045982421 },
  ];
  const hiddenSlots = [
    { text: 27, pic: 26, group: 24 },
    { text: 7, pic: 8, group: 5 },
  ];

  return {
    shapeText: [
      { shapeId: 3, fontSize: 3600, lines: [title] },
      ...slots.map((slot, index) => ({
        shapeId: slot.text,
        fontSize: 1280,
        lines: [captains[index] ? formatCaptain(captains[index]) : ''],
      })),
      ...hiddenSlots.map((slot) => ({ shapeId: slot.text, fontSize: 1280, lines: [''] })),
      { shapeId: 39, fontSize: 1500, lines: [String(pageNumber)] },
    ],
    groupGeometry: [
      ...hiddenSlots.map((slot) => ({ groupId: slot.group, x: -10000000, y: -10000000, cx: 0, cy: 0 })),
    ],
    pictureImages: captains.map((captain, index) => ({
      picId: slots[index].pic,
      imagePath: assetPath(captain.image),
      mediaName: mediaName('synced-captain', captain.image, pageNumber * 10 + index),
      clearCrop: true,
      cropAspect: slots[index].aspect,
      cropFocusY: 0.35,
    })),
  };
}

function formatTeam(team) {
  const english = team.englishName ? `（${team.englishName}）` : '';
  return [
    `队伍名称：${team.name}${english}`,
    `队伍成员：${team.members.join('、')}`,
    `所获荣誉：${team.honors.join('；')}`,
  ].join('\n');
}

function awardRows(awardees) {
  return [
    ['姓名', '年级', '学院', '代表性成绩'],
    ...awardees.map((item) => [
      item.name,
      item.year.endsWith('级') ? item.year : `${item.year}级`,
      item.school,
      item.achievement,
    ]),
  ];
}

const pageNumberShapes = {
  4: [46, 1],
  5: [595, 2],
  6: [21, 3],
  7: [5, 4],
  8: [39, 5],
  9: [70, 6],
  10: [27, 7],
  11: [22, 8],
  12: [178, 9],
  13: [92, 10],
  14: [2, 11],
  15: [259, 12],
  16: [2, 13],
  17: [2, 14],
  18: [2, 14],
  19: [32, 15],
  20: [2, 16],
  21: [2, 16],
  22: [460, 17],
  23: [128, 18],
  24: [140, 19],
  25: [152, 20],
  26: [21, 21],
  27: [6, 22],
};

function addPageNumber(parts, slideNo, shapeId, pageNo) {
  const key = `ppt/slides/slide${slideNo}.xml`;
  parts[key] ??= {};
  parts[key].shapeText ??= [];
  parts[key].shapeText.push({ shapeId, fontSize: 1500, lines: [String(pageNo)] });
}

function addShiftedPageNumbers(parts, captainExtraPages, timelineExtraPages, teamExtraPages, awardeeExtraPages) {
  for (const [slide, [shapeId, basePage]] of Object.entries(pageNumberShapes)) {
    const slideNo = Number(slide);
    const shift =
      (slideNo > 8 ? captainExtraPages : 0) +
      (slideNo > 10 ? timelineExtraPages : 0) +
      (slideNo > 12 ? teamExtraPages : 0) +
      (slideNo > 25 ? awardeeExtraPages : 0);
    addPageNumber(parts, slideNo, shapeId, basePage + shift);
  }
}

function tocItems(captainExtraPages, timelineExtraPages, teamExtraPages, awardeeExtraPages) {
  const shifted = (page, afterCaptains = true, afterTimeline = false, afterTeams = false, afterAwardees = false) =>
    page +
    (afterCaptains ? captainExtraPages : 0) +
    (afterTimeline ? timelineExtraPages : 0) +
    (afterTeams ? teamExtraPages : 0) +
    (afterAwardees ? awardeeExtraPages : 0);
  return [
    ['赛事简介', 1],
    ['为什么参加竞赛', 2],
    ['竞赛队宗旨', 3],
    ['指导教师', 4],
    ['历任队长', 5],
    ['全栈式培养', shifted(6)],
    ['团队发展', shifted(7)],
    ['竞赛队成果', shifted(8, true, true)],
    ['优秀队伍', shifted(9, true, true)],
    ['企业实习', shifted(10, true, true, true)],
    ['科研活动', shifted(11, true, true, true)],
    ['活动风采', shifted(13, true, true, true)],
    ['ICPC/CCPC 获奖队员', shifted(18, true, true, true)],
    ['优秀队员去向', shifted(21, true, true, true, true)],
  ];
}

function tocCardPlan(captainExtraPages, timelineExtraPages, teamExtraPages, awardeeExtraPages) {
  const items = tocItems(captainExtraPages, timelineExtraPages, teamExtraPages, awardeeExtraPages);
  const cardIds = items.map((_, index) => 529 + index);
  const numberIds = items.map((_, index) => 560 + index);
  const labelIds = items.map((_, index) => 580 + index);
  const leftX = 940000;
  const rightX = 4040000;
  const startY = 2470000;
  const cardW = 2920000;
  const cardH = 610000;
  const rowGap = 190000;
  const itemBox = (index) => {
    const col = index < 7 ? 0 : 1;
    const row = index % 7;
    return {
      x: col ? rightX : leftX,
      y: startY + row * (cardH + rowGap),
    };
  };

  return {
    shapeClones: [
      ...numberIds.map((targetShapeId) => ({
        sourceShapeId: 529,
        targetShapeId,
        name: `目录条目序号 ${targetShapeId}`,
      })),
      ...labelIds.map((targetShapeId) => ({
        sourceShapeId: 529,
        targetShapeId,
        name: `目录条目标题 ${targetShapeId}`,
      })),
      ...cardIds.slice(1).map((targetShapeId) => ({
        sourceShapeId: 529,
        targetShapeId,
        name: `目录条目背景 ${targetShapeId}`,
      })),
    ],
    shapeText: [
      ...cardIds.map((shapeId) => ({
        shapeId,
        fontSize: 100,
        lines: [''],
      })),
      ...numberIds.map((shapeId, index) => ({
        shapeId,
        fontSize: 1200,
        lines: [String(index + 1).padStart(2, '0')],
        textStyle: {
          align: 'ctr',
          anchor: 'ctr',
          bold: true,
          color: 'F59A23',
          fontFace: 'Microsoft YaHei',
        },
      })),
      ...labelIds.map((shapeId, index) => {
        const [label, page] = items[index];
        return {
          shapeId,
          fontSize: 1060,
          lines: [`${label}  /  P.${String(page).padStart(2, '0')}`],
          textStyle: {
            align: 'l',
            anchor: 'ctr',
            bold: true,
            color: '4B2A88',
            fontFace: 'Microsoft YaHei',
          },
        };
      }),
    ],
    shapeGeometry: [
      ...cardIds.map((shapeId, index) => {
        const box = itemBox(index);
        return {
          shapeId,
          x: box.x,
          y: box.y,
          cx: cardW,
          cy: cardH,
          resetTransform: true,
        };
      }),
      ...numberIds.map((shapeId, index) => {
        const box = itemBox(index);
        return {
          shapeId,
          x: box.x + 150000,
          y: box.y,
          cx: 430000,
          cy: cardH,
          resetTransform: true,
        };
      }),
      ...labelIds.map((shapeId, index) => {
        const box = itemBox(index);
        return {
          shapeId,
          x: box.x + 670000,
          y: box.y,
          cx: cardW - 790000,
          cy: cardH,
          resetTransform: true,
        };
      }),
    ],
    shapeStyle: cardIds.map((shapeId) => ({
        shapeId,
        fill: 'FFFFFF',
        line: 'E1D7F5',
        lineWidth: 9525,
      })),
  };
}

function makePlan(data) {
  const medals = medalParts(data.stats);
  const worldFinal = statByLabel(data.stats, 'World Final');
  const introLines = chineseParagraphs([data.teamIntro[0].replace('（以下简称“竞赛队”）', ''), ...data.teamIntro.slice(1)]);
  const recentCaptains = data.captains.slice(3).reverse();
  const formerCaptains = data.captains.slice(0, 3).reverse();
  const timelinePages = chunk(data.timeline, timelinePageSize);
  const teamPages = chunk(data.featuredTeams, 3);
  const awardeeChunks = chunk(data.awardees, 18);
  const captainExtraPages = formerCaptains.length ? 1 : 0;
  const timelineExtraPages = Math.max(0, timelinePages.length - 1);
  const teamExtraPages = Math.max(0, teamPages.length - 1);
  const awardeeExtraPages = Math.max(0, awardeeChunks.length - 3);

  const parts = {
    'ppt/slides/slide2.xml': {
      shapeText: [
        {
          shapeId: 515,
          fontSize: 1220,
          lines: introLines,
          textStyle: {
            align: 'just',
            lineSpacingPct: 125000,
            spaceAfterPts: 8,
          },
        },
      ],
      shapeGeometry: [{ shapeId: 515, x: 540000, y: 2130000, cx: 6480000, cy: 8210000 }],
    },
    'ppt/slides/slide3.xml': tocCardPlan(captainExtraPages, timelineExtraPages, teamExtraPages, awardeeExtraPages),
    'ppt/slides/slide8.xml': captainPagePlan(recentCaptains, '历任队长', 5),
    'ppt/slides/slide10.xml': timelinePagePlan(timelinePages[0] ?? []),
    'ppt/slides/slide11.xml': {
      shapeText: [
        {
          shapeId: 6,
          fontSize: 1280,
          lines: [
            `截止2026年，累计获得${medals.gold}枚金奖、${medals.silver}枚银奖、${medals.bronze}枚铜奖`,
            '曾获得ICPC亚洲区域赛亚军、季军等奖项',
            data.headlineHonors[0]?.detail ?? '',
            data.headlineHonors[1]?.detail ?? '',
          ],
        },
        {
          shapeId: 36,
          fontSize: 1650,
          lines: [worldFinal.caption],
        },
        {
          shapeId: 48,
          fontSize: 1220,
          lines: [data.headlineHonors[2]?.title ?? '', data.headlineHonors[2]?.detail ?? ''],
        },
      ],
      shapeGeometry: [
        { shapeId: 6, x: 690000, y: 2180000, cx: 6650000, cy: 1430000 },
        { shapeId: 36, x: 710000, y: 3450000, cx: 6450000, cy: 600000 },
        { shapeId: 48, x: 710000, y: 5250000, cx: 6500000, cy: 1050000 },
      ],
      groupGeometry: [{ groupId: 18, x: -10000000, y: -10000000, cx: 0, cy: 0 }],
    },
    'ppt/slides/slide12.xml': teamPagePlan(teamPages[0] ?? []),
    'ppt/slides/slide28.xml': {
      shapeText: [
        { shapeId: 492, fontSize: 1600, lines: [`QQ群号：${data.site.qqGroup}`] },
        { shapeId: 493, fontSize: 1300, lines: [''] },
        { shapeId: 494, fontSize: 1300, lines: [''] },
        { shapeId: 495, fontSize: 1300, lines: [`学院官网：${data.site.website}`, `竞赛队官网：${teamWebsite}`] },
        { shapeId: 496, fontSize: 1600, lines: [`招生咨询邮箱 Email：${data.site.email}`] },
        { shapeId: 506, fontSize: 1300, lines: [''] },
        { shapeId: 3, fontSize: 1300, lines: [''] },
      ],
      shapeGeometry: [
        { shapeId: 493, x: -10000000, y: -10000000, cx: 0, cy: 0 },
        { shapeId: 494, x: -10000000, y: -10000000, cx: 0, cy: 0 },
        { shapeId: 495, x: 2250000, y: 8820000, cx: 4450000, cy: 610000 },
        { shapeId: 506, x: -10000000, y: -10000000, cx: 0, cy: 0 },
      ],
    },
  };

  for (const [index, rows] of awardeeChunks.entries()) {
    const slideNo = index < 3 ? 23 + index : 110 + index - 3;
    parts[`ppt/slides/slide${slideNo}.xml`] = {
      tables: [
        {
          tableIndex: 0,
          fontSize: 1220,
          rows: awardRows(rows),
        },
      ],
    };
  }

  const clones = [];
  if (captainExtraPages) {
    clones.push({
      sourceSlide: 8,
      insertAfterSlide: 8,
      targetSlide: 98,
      part: captainPagePlan(formerCaptains, '历任队长（续）', 6),
    });
  }

  for (let index = 1; index < timelinePages.length; index += 1) {
    const targetSlide = 90 + index;
    const part = timelinePagePlan(timelinePages[index], '团队发展（续）');
    clones.push({
      sourceSlide: 10,
      insertAfterSlide: index === 1 ? 10 : 90 + index - 1,
      targetSlide,
      part: {
        ...part,
        shapeText: [
          ...part.shapeText,
          { shapeId: 27, fontSize: 1500, lines: [String(7 + captainExtraPages + index)] },
        ],
      },
    });
  }

  for (let index = 1; index < teamPages.length; index += 1) {
    const targetSlide = 100 + index;
    const part = teamPagePlan(teamPages[index]);
    clones.push({
      sourceSlide: 12,
      insertAfterSlide: index === 1 ? 12 : 100 + index - 1,
      targetSlide,
      part: {
        ...part,
        shapeText: [
          ...part.shapeText,
          { shapeId: 178, fontSize: 1500, lines: [String(9 + captainExtraPages + timelineExtraPages + index)] },
        ],
      },
    });
  }

  for (let index = 3; index < awardeeChunks.length; index += 1) {
    const targetSlide = 110 + index - 3;
    clones.push({
      sourceSlide: 25,
      insertAfterSlide: index === 3 ? 25 : 110 + index - 4,
      targetSlide,
      part: {
        tables: [
          {
            tableIndex: 0,
            fontSize: 1220,
            rows: awardRows(awardeeChunks[index]),
          },
        ],
        shapeText: [
          {
            shapeId: 152,
            fontSize: 1500,
            lines: [String(20 + captainExtraPages + timelineExtraPages + teamExtraPages + index - 2)],
          },
        ],
      },
    });
  }

  addShiftedPageNumbers(parts, captainExtraPages, timelineExtraPages, teamExtraPages, awardeeExtraPages);

  return {
    meta: {
      generatedFrom: path.relative(root, dataPath),
      downloadablePath: `/downloads/${path.basename(outputPath)}`,
      syncedSections: [
        '简介',
        '历任队长',
        '团队发展',
        '竞赛队成果',
        '优秀队伍',
        '曾获ICPC/CCPC奖项队员',
        '联系方式',
      ],
    },
    clones,
    parts,
  };
}

function teamPagePlan(teams) {
  const teamLines = teams.map(formatTeam);
  const plan = {
    shapeText: [
      { shapeId: 175, fontSize: 1160, lines: [teamLines[0] ?? ''] },
      { shapeId: 176, fontSize: 1160, lines: [teamLines[1] ?? ''] },
      { shapeId: 3, fontSize: 1160, lines: [teamLines[2] ?? ''] },
    ],
    shapeGeometry: [
      { shapeId: 175, x: 4680000, cx: 2760000 },
      { shapeId: 176, x: 4680000, cx: 2760000 },
      { shapeId: 3, x: 4680000, cx: 2760000 },
    ],
    pictureImages: teams.map((team, index) => ({
      picId: [169, 165, 1027][index],
      imagePath: assetPath(team.image),
      mediaName: mediaName('synced-team', team.image, index + 1),
    })),
  };

  if (teams.length === 1) {
    plan.pictureImages = [
      {
        picId: 169,
        imagePath: assetPath(teams[0].image),
        mediaName: mediaName('synced-team', teams[0].image, 1),
        clearCrop: true,
        cropAspect: 4550 / 3650,
      },
    ];
    plan.shapeText = [
      { shapeId: 175, fontSize: 1120, lines: [teamLines[0] ?? ''] },
      { shapeId: 176, fontSize: 1000, lines: [''] },
      { shapeId: 3, fontSize: 1000, lines: [''] },
    ];
    plan.shapeGeometry = [
      { shapeId: 175, x: 820000, y: 7180000, cx: 6000000, cy: 1320000 },
      { shapeId: 176, x: -10000000, y: -10000000, cx: 0, cy: 0 },
      { shapeId: 3, x: -10000000, y: -10000000, cx: 0, cy: 0 },
      { shapeId: 159, x: -10000000, y: -10000000, cx: 0, cy: 0 },
      { shapeId: 160, x: -10000000, y: -10000000, cx: 0, cy: 0 },
      { shapeId: 6, x: -10000000, y: -10000000, cx: 0, cy: 0 },
    ];
    plan.pictureGeometry = [
      { picId: 169, x: 820000, y: 2250000, cx: 6000000, cy: 4813200 },
      { picId: 165, x: -10000000, y: -10000000, cx: 0, cy: 0 },
      { picId: 1027, x: -10000000, y: -10000000, cx: 0, cy: 0 },
    ];
  }

  return plan;
}

function main() {
  if (!fs.existsSync(templatePath)) {
    throw new Error(`Missing brochure template: ${templatePath}`);
  }

  const data = loadSiteData();
  const plan = makePlan(data);

  fs.mkdirSync(path.dirname(planPath), { recursive: true });
  fs.writeFileSync(planPath, JSON.stringify(plan, null, 2), 'utf-8');

  const result = spawnSync(
    pythonPath,
    [
      path.join(root, 'scripts', 'patch-brochure.py'),
      '--template',
      templatePath,
      '--output',
      outputPath,
      '--plan',
      planPath,
    ],
    { stdio: 'inherit' },
  );

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }

  console.log(`Brochure URL path: ${plan.meta.downloadablePath}`);
}

main();
