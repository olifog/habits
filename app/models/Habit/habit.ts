export interface Habit {
  githubid: string,
  habitid: string,
  name: string,
  emoji: string,
  status: boolean,
  history: boolean[],
  streak: number,
  longestStreak: number,
  lastChecked: number
}
