import { type ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { createHabitsRepository, getSqlite, migrate } from '@/src/db';
import { syncAllHabitReminders } from '@/src/shared/lib/notifications';
import { colors } from '@/src/shared/ui/tokens';

type DatabaseStatus = 'loading' | 'ready' | 'error';

type DatabaseContextValue = {
  status: DatabaseStatus;
  error: Error | null;
  retry: () => void;
};

const DatabaseContext = createContext<DatabaseContextValue | null>(null);

type Props = {
  children: ReactNode;
};

export function DatabaseProvider({ children }: Props) {
  const [status, setStatus] = useState<DatabaseStatus>('loading');
  const [error, setError] = useState<Error | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function boot() {
      setStatus('loading');
      setError(null);
      try {
        await migrate(getSqlite());
        const habits = await createHabitsRepository().listActive();
        await syncAllHabitReminders(habits);
        if (!cancelled) setStatus('ready');
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error(String(err)));
          setStatus('error');
        }
      }
    }

    void boot();
    return () => {
      cancelled = true;
    };
  }, [attempt]);

  if (status === 'loading') {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.message}>Preparing Cadence…</Text>
      </View>
    );
  }

  if (status === 'error') {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>Couldn’t open local database</Text>
        <Text style={styles.message}>{error?.message ?? 'Unknown error'}</Text>
        <Text style={styles.retry} onPress={() => setAttempt((n) => n + 1)}>
          Tap to retry
        </Text>
      </View>
    );
  }

  return (
    <DatabaseContext.Provider
      value={{
        status,
        error,
        retry: () => setAttempt((n) => n + 1),
      }}>
      {children}
    </DatabaseContext.Provider>
  );
}

export function useDatabase(): DatabaseContextValue {
  const value = useContext(DatabaseContext);
  if (!value) {
    throw new Error('useDatabase must be used within DatabaseProvider');
  }
  return value;
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 12,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    color: colors.text,
  },
  message: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
  },
  retry: {
    marginTop: 8,
    fontSize: 16,
    color: colors.accent,
    fontWeight: '600',
  },
});
