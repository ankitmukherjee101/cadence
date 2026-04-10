import { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Link, useRouter } from 'expo-router';

import { supabase, assertSupabaseConfigured } from '../lib/supabase';
import { colors, spacing } from '../lib/theme';

export default function SignInScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.replace('/');
    });
  }, [router]);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit() {
    try {
      assertSupabaseConfigured();
    } catch (e) {
      Alert.alert('Configuration', e instanceof Error ? e.message : 'Missing Supabase env.');
      return;
    }

    const trimmed = email.trim();
    if (!trimmed || !trimmed.includes('@')) {
      Alert.alert('Check email', 'Enter a valid email address.');
      return;
    }
    if (password.length < 1) {
      Alert.alert('Check password', 'Enter your password.');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: trimmed,
      password,
    });
    setLoading(false);

    if (error) {
      Alert.alert('Sign in failed', error.message);
      return;
    }

    router.replace('/');
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.body}>Sign in with email and password.</Text>

        <View style={styles.field}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect={false}
            keyboardType="email-address"
            placeholder="you@example.com"
            placeholderTextColor={colors.onSurfaceVariant}
            value={email}
            onChangeText={setEmail}
            editable={!loading}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            secureTextEntry
            autoComplete="password"
            placeholder="Your password"
            placeholderTextColor={colors.onSurfaceVariant}
            value={password}
            onChangeText={setPassword}
            editable={!loading}
          />
        </View>

        <Pressable
          style={({ pressed }) => [styles.primaryBtn, pressed && styles.pressed, loading && styles.disabled]}
          onPress={onSubmit}
          disabled={loading}
        >
          <Text style={styles.primaryLabel}>{loading ? 'Signing in…' : 'Sign in'}</Text>
        </Pressable>

        <View style={styles.footer}>
          <Text style={styles.footerText}>New here? </Text>
          <Link href="/sign-up" asChild>
            <Pressable hitSlop={8}>
              <Text style={styles.link}>Create an account</Text>
            </Pressable>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  scroll: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
    color: colors.onSurface,
    marginBottom: spacing.sm,
  },
  body: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.onSurfaceVariant,
    marginBottom: spacing.lg,
  },
  field: { marginBottom: spacing.md },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.onSurfaceVariant,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'ios' ? 14 : 10,
    fontSize: 16,
    color: colors.onSurface,
    backgroundColor: colors.surface,
  },
  primaryBtn: {
    marginTop: spacing.md,
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  pressed: { opacity: 0.85 },
  disabled: { opacity: 0.6 },
  primaryLabel: {
    color: colors.onPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.lg,
    flexWrap: 'wrap',
  },
  footerText: { fontSize: 15, color: colors.onSurfaceVariant },
  link: { fontSize: 15, fontWeight: '600', color: colors.onSurface, textDecorationLine: 'underline' },
});
