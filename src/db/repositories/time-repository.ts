import type { TimeSession } from '@/src/domain';

export type TimeRepository = {
  getRunning(): Promise<TimeSession | null>;
  listRecent(limit?: number): Promise<TimeSession[]>;
  start(input: { label: string; tagId?: string; habitId?: string }): Promise<TimeSession>;
  stop(id: string): Promise<TimeSession>;
};
