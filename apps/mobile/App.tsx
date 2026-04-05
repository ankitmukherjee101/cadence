import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { supabase } from './lib/supabase';

type CheckState =
  | { status: 'loading' }
  | { status: 'ok'; detail: string }
  | { status: 'error'; message: string };

export default function App() {
  const [check, setCheck] = useState<CheckState>({ status: 'loading' });

  useEffect(() => {
    let cancelled = false;

    async function run() {
      const { error: sessionError } = await supabase.auth.getSession();
      if (cancelled) return;
      if (sessionError) {
        setCheck({ status: 'error', message: `Auth/session: ${sessionError.message}` });
        return;
      }

      const { error: queryError } = await supabase.from('profiles').select('id').limit(1);
      if (cancelled) return;
      if (queryError) {
        const hint =
          /relation|does not exist/i.test(queryError.message)
            ? '\n\nIf you have not run the migration yet, run `supabase/migrations/20260404120000_initial_schema.sql` in the Supabase SQL editor.'
            : '';
        setCheck({ status: 'error', message: `${queryError.message}${hint}` });
        return;
      }

      setCheck({
        status: 'ok',
        detail:
          'Client reached your project and the `profiles` table responded. (No login yet is fine; RLS may hide rows.)',
      });
    }

    void run();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <View style={styles.container}>
      {check.status === 'loading' && (
        <>
          <ActivityIndicator size="large" />
          <Text style={styles.sub}>Checking Supabase…</Text>
        </>
      )}
      {check.status === 'ok' && (
        <>
          <Text style={styles.ok}>Supabase OK</Text>
          <Text style={styles.sub}>{check.detail}</Text>
        </>
      )}
      {check.status === 'error' && (
        <ScrollView contentContainerStyle={styles.scroll}>
          <Text style={styles.err}>Supabase check failed</Text>
          <Text style={styles.sub}>{check.message}</Text>
        </ScrollView>
      )}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    maxWidth: '100%',
  },
  ok: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
    color: '#0d9488',
  },
  err: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#b91c1c',
  },
  sub: {
    fontSize: 15,
    color: '#444',
    textAlign: 'center',
    lineHeight: 22,
  },
});
