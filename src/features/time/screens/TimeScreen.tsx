import { ScreenPlaceholder } from '@/src/shared/ui/ScreenPlaceholder';

export function TimeScreen() {
  return (
    <ScreenPlaceholder
      title="Time"
      subtitle="Start and stop sessions. Running timers persist in SQLite across app restarts."
    />
  );
}
