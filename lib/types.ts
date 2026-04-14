
export type UserProfile = {
  overall: number;
  skillScore: number;
  communication: number;
  problemSolving: number;
  topSkills: string[];
  areasForImprovement: { name: string; score: number }[];
  testTaken: boolean;
  history: { date: string; score: number }[];
};
