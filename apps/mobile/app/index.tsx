import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Redirect } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { supabase } from '../lib/supabase';
import { colors } from '../lib/theme';

type CheckState =
  | { status: 'loading' }
  | { status: 'ok'; detail: string }
  | { status: 'error'; message: string };

export default function HomeScreen() {
  const [sessionReady, setSessionReady] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [check, setCheck] = useState<CheckState>({ status: 'loading' });

  useEffect(() => {
    let cancelled = false;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (cancelled) return;
      setSignedIn(!!session);
      setSessionReady(true);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (cancelled) return;
      setSignedIn(!!session);
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!sessionReady || !signedIn) return;

    let cancelled = false;

    async function run() {
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
          'Client reached your project and the `profiles` table responded. (RLS may hide rows until your profile exists.)',
      });
    }

    void run();
    return () => {
      cancelled = true;
    };
  }, [sessionReady, signedIn]);

  if (!sessionReady) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.onSurface} />
        <Text style={styles.sub}>Loading…</Text>
        <StatusBar style="dark" />
      </View>
    );
  }

  if (!signedIn) {
    return <Redirect href="/sign-up" />;
  }

  return (
    <View style={styles.container}>
      {check.status === 'loading' && (
        <>
          <ActivityIndicator size="large" color={colors.onSurface} />
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
      <StatusBar style="dark" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  centered: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
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
    color: colors.error,
  },
  sub: {
    fontSize: 15,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 22,
  },
});
