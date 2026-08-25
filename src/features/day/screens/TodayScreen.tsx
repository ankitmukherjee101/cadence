import { ScreenPlaceholder } from '@/src/shared/ui/ScreenPlaceholder';
import { todayLocalDate } from '@/src/domain';

export function TodayScreen() {
  const today = todayLocalDate();

  return (
    <ScreenPlaceholder
      title="Today"
      subtitle={`Day timeline for ${today}. Habits, time sessions, and journal entries will compose here.`}
    />
  );
}
