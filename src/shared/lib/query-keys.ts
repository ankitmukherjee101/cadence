export const queryKeys = {
  habits: ['habits'] as const,
  habit: (id: string) => ['habits', id] as const,
  habitLogsToday: (date: string) => ['habit-logs', date] as const,
  runningSession: ['sessions', 'running'] as const,
  session: (id: string) => ['sessions', id] as const,
  day: (date: string) => ['day', date] as const,
  journal: (date: string) => ['journal', date] as const,
  journalEntry: (id: string) => ['journal', 'entry', id] as const,
  habitAnalytics: (id: string) => ['analytics', id] as const,
};
