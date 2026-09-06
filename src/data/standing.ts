export type SelectionStandingEntry = {
  name: string;
  zjuScore: number;
  day1Score: number;
  day2Score: number;
  totalScore: number;
};

export const selectionStandingMeta = {
  season: '2026-2027',
  updatedThrough: '2026年9月3日',
  participantCount: 33,
  publishedWeight: 100,
};

// ZJU scores are already converted to the 20-point component in the source sheet.
// Totals follow the published values so source-level rounding is preserved.
export const selectionStanding: SelectionStandingEntry[] = [
  { name: '吴彦儒', zjuScore: 10.57, day1Score: 40, day2Score: 38.75, totalScore: 89.32 },
  { name: '罗辰骏', zjuScore: 10.57, day1Score: 33.21, day2Score: 40, totalScore: 83.78 },
  { name: '林毅', zjuScore: 10.57, day1Score: 32.14, day2Score: 13.39, totalScore: 56.11 },
  { name: '司梓翰', zjuScore: 10.57, day1Score: 25, day2Score: 15.54, totalScore: 51.11 },
  { name: '张力文', zjuScore: 9.63, day1Score: 25.89, day2Score: 7.14, totalScore: 42.67 },
  { name: '孙海纳', zjuScore: 10.1, day1Score: 19.29, day2Score: 12.86, totalScore: 42.24 },
  { name: '梁书源', zjuScore: 4.97, day1Score: 17.14, day2Score: 14.46, totalScore: 36.58 },
  { name: '陈嘉年', zjuScore: 8.14, day1Score: 10.71, day2Score: 15, totalScore: 33.85 },
  { name: '余哲伟', zjuScore: 3.04, day1Score: 16.43, day2Score: 13.93, totalScore: 33.4 },
  { name: '王泽诚', zjuScore: 11.47, day1Score: 17.86, day2Score: 2.86, totalScore: 32.18 },
  { name: '谭文礼', zjuScore: 4.97, day1Score: 18.57, day2Score: 6.43, totalScore: 29.97 },
  { name: '欧奕阳', zjuScore: 2.07, day1Score: 5.71, day2Score: 21.43, totalScore: 29.21 },
  { name: '张佳艺', zjuScore: 10.57, day1Score: 11.25, day2Score: 2.32, totalScore: 24.14 },
  { name: '韩靖颢', zjuScore: 6.18, day1Score: 9.64, day2Score: 7.5, totalScore: 23.32 },
  { name: '孙超逸', zjuScore: 10.14, day1Score: 10.18, day2Score: 2.14, totalScore: 22.46 },
  { name: '叶梓弘', zjuScore: 10.1, day1Score: 2.86, day2Score: 8.21, totalScore: 21.17 },
  { name: '邓沣庭', zjuScore: 10.1, day1Score: 6.07, day2Score: 1.79, totalScore: 17.96 },
  { name: '刘梓涵', zjuScore: 0, day1Score: 11.79, day2Score: 6.07, totalScore: 17.86 },
  { name: '许可捷', zjuScore: 5.73, day1Score: 3.21, day2Score: 6.79, totalScore: 15.73 },
  { name: '刘翀', zjuScore: 3.17, day1Score: 2.5, day2Score: 7.86, totalScore: 13.53 },
  { name: 'Adam Tejasukmana', zjuScore: 6.7, day1Score: 4.64, day2Score: 1.43, totalScore: 12.77 },
  { name: '潘彦', zjuScore: 9.02, day1Score: 0.71, day2Score: 1.25, totalScore: 10.98 },
  { name: '俞卓群', zjuScore: 1.72, day1Score: 5.36, day2Score: 2.5, totalScore: 9.58 },
  { name: '张宸略', zjuScore: 4.97, day1Score: 1.07, day2Score: 1.96, totalScore: 8.01 },
  { name: '谷旭涵', zjuScore: 0, day1Score: 5, day2Score: 2.68, totalScore: 7.68 },
  { name: '史佳航', zjuScore: 2.95, day1Score: 3.57, day2Score: 0, totalScore: 6.52 },
  { name: '何隽哲', zjuScore: 4.97, day1Score: 0.89, day2Score: 0, totalScore: 5.86 },
  { name: '鲁天一', zjuScore: 0, day1Score: 4.29, day2Score: 0, totalScore: 4.29 },
  { name: '陆珏行', zjuScore: 0, day1Score: 3.93, day2Score: 0, totalScore: 3.93 },
  { name: '李衍硕', zjuScore: 0, day1Score: 0.36, day2Score: 1.61, totalScore: 1.96 },
  { name: '张翔', zjuScore: 1.68, day1Score: 0, day2Score: 0, totalScore: 1.68 },
  { name: '郑烨彬', zjuScore: 0, day1Score: 0.54, day2Score: 0, totalScore: 0.54 },
  { name: '庞天一', zjuScore: 0.5, day1Score: 0, day2Score: 0, totalScore: 0.5 },
];
