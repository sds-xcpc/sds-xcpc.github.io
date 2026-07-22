export type SelectionStandingEntry = {
  code: string;
  name: string;
  trainingScores: number[];
  day1Score: number | null;
  day2Score: number | null;
};

export const trainingSessionDates = ['7月6日', '7月7日', '7月8日', '7月10日', '7月13日', '7月14日', '7月15日', '7月16日'];

export const selectionStandingMeta = {
  season: '2026-2027',
  updatedThrough: '2026年7月16日',
  participantCount: 24,
  trainingSessions: trainingSessionDates.length,
  countedSessions: 6,
};

// Populate day1Score and day2Score with their weighted scores (out of 40)
// when released. The page derives the July top-six total, weighted score,
// cumulative score, and ranking directly from these source fields.
export const selectionStanding: SelectionStandingEntry[] = [
  { code: '0001', name: '周莫非', trainingScores: [100, 71.59090909, 100, 100, 100, 100, 100, 0], day1Score: null, day2Score: null },
  { code: '0016', name: '王泽诚', trainingScores: [71.59090909, 100, 76.19047619, 54, 0, 0, 0, 42.35294118], day1Score: null, day2Score: null },
  { code: '0014', name: '司梓翰', trainingScores: [34.09090909, 45.45454545, 28.57142857, 36, 71.25, 71.05263158, 59.25925926, 21.17647059], day1Score: null, day2Score: null },
  { code: '0004', name: '孙超逸', trainingScores: [43.18181818, 38.63636364, 54.28571429, 18, 63.75, 28.94736842, 25.92592593, 75.29411765], day1Score: null, day2Score: null },
  { code: '0008', name: '邓沣庭', trainingScores: [40.90909091, 36.36363636, 51.42857143, 51, 56.25, 67.10526316, 27.77777778, 18.82352941], day1Score: null, day2Score: null },
  { code: '0007', name: '张力文', trainingScores: [36.36363636, 43.18181818, 48.57142857, 45, 0, 0, 62.96296296, 52.94117647], day1Score: null, day2Score: null },
  { code: '0005', name: '潘彦', trainingScores: [14.77272727, 40.90909091, 45.71428571, 39, 67.5, 31.57894737, 24.07407407, 45.88235294], day1Score: null, day2Score: null },
  { code: '0009', name: '陈嘉年', trainingScores: [38.63636364, 34.09090909, 24.76190476, 0, 12.5, 34.21052632, 0, 100], day1Score: null, day2Score: null },
  { code: '0025', name: '孙海纳', trainingScores: [0, 27.27272727, 20.95238095, 76, 60, 39.47368421, 0, 0], day1Score: null, day2Score: null },
  { code: '0015', name: 'Adam Tejasukmana', trainingScores: [0, 29.54545455, 22.85714286, 48, 32.5, 42.10526316, 0, 25.88235294], day1Score: null, day2Score: null },
  { code: '0029', name: '韩靖颢', trainingScores: [45.45454545, 31.81818182, 17.14285714, 22, 52.5, 13.15789474, 11.11111111, 16.47058824], day1Score: null, day2Score: null },
  { code: '0012', name: '许可捷', trainingScores: [11.36363636, 7.954545455, 26.66666667, 42, 30, 36.84210526, 12.96296296, 23.52941176], day1Score: null, day2Score: null },
  { code: '0013', name: '邵辰航', trainingScores: [0, 5.681818182, 1.904761905, 12, 25, 15.78947368, 18.51851852, 49.41176471], day1Score: null, day2Score: null },
  { code: '0028', name: '刘翀', trainingScores: [15.90909091, 9.090909091, 6.666666667, 5, 27.5, 21.05263158, 14.81481481, 0], day1Score: null, day2Score: null },
  { code: '0017', name: '余哲伟', trainingScores: [0, 11.36363636, 2.857142857, 20, 20, 18.42105263, 7.407407407, 14.11764706], day1Score: null, day2Score: null },
  { code: '0024', name: '史佳航', trainingScores: [0, 6.818181818, 19.04761905, 5, 22.5, 23.68421053, 9.259259259, 7.058823529], day1Score: null, day2Score: null },
  { code: '0011', name: '欧奕阳', trainingScores: [0, 3.409090909, 15.23809524, 14, 7.5, 3.947368421, 16.66666667, 4.705882353], day1Score: null, day2Score: null },
  { code: '0006', name: '田佳畅', trainingScores: [0, 1.136363636, 4.761904762, 3, 15, 5.263157895, 20.37037037, 11.76470588], day1Score: null, day2Score: null },
  { code: '0030', name: '俞卓群', trainingScores: [0, 12.5, 5.714285714, 16, 17.5, 0, 0, 0], day1Score: null, day2Score: null },
  { code: '0003', name: '张翔', trainingScores: [0, 2.272727273, 3.80952381, 2, 10, 2.631578947, 22.22222222, 9.411764706], day1Score: null, day2Score: null },
  { code: '0002', name: '王中天', trainingScores: [0, 10.22727273, 0, 0, 5, 26.31578947, 0, 0], day1Score: null, day2Score: null },
  { code: '0018', name: '庞天一', trainingScores: [12.5, 0, 0, 0, 0, 0, 0, 2.352941176], day1Score: null, day2Score: null },
  { code: '0019', name: '梁博文', trainingScores: [13.63636364, 0, 0, 0, 0, 0, 0, 0], day1Score: null, day2Score: null },
  { code: '0022', name: '蒋溢轩', trainingScores: [0, 4.545454545, 0.952380952, 1, 1.25, 1.315789474, 0, 0], day1Score: null, day2Score: null },
];
