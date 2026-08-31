import { SymbolView } from 'expo-symbols';
import { Tabs } from 'expo-router';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Colors from '@/constants/Colors';
import { useRunningSession } from '@/src/features/habits/hooks';
import { ActiveSessionBar } from '@/src/shared/ui/ActiveSessionBar';
import { JournalPromptSheet } from '@/src/shared/ui/JournalPromptSheet';
import { colors } from '@/src/shared/ui/tokens';

const TAB_BAR_BASE = 49;

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const { data: running } = useRunningSession();
  const sessionBarHeight = running ? 44 : 0;
  const tabBarHeight = TAB_BAR_BASE + insets.bottom;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors.dark.tint,
          tabBarInactiveTintColor: Colors.dark.tabIconDefault,
          headerShown: false,
          tabBarStyle: {
            height: tabBarHeight,
            paddingBottom: insets.bottom,
            backgroundColor: colors.background,
            borderTopColor: colors.border,
            borderTopWidth: 1,
          },
          tabBarLabelStyle: {
            fontFamily: 'InstrumentSans_500Medium',
            fontSize: 11,
            letterSpacing: 0.2,
          },
          sceneStyle: {
            paddingBottom: sessionBarHeight,
            backgroundColor: colors.background,
          },
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Habits',
            tabBarIcon: ({ color }) => (
              <SymbolView
                name={{ ios: 'checkmark.circle', android: 'check_circle', web: 'check_circle' }}
                tintColor={color}
                size={26}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="analytics"
          options={{
            title: 'Analytics',
            tabBarIcon: ({ color }) => (
              <SymbolView
                name={{ ios: 'chart.bar', android: 'bar_chart', web: 'bar_chart' }}
                tintColor={color}
                size={26}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="journal"
          options={{
            title: 'Journal',
            tabBarIcon: ({ color }) => (
              <SymbolView
                name={{ ios: 'book', android: 'menu_book', web: 'menu_book' }}
                tintColor={color}
                size={26}
              />
            ),
          }}
        />
      </Tabs>
      {running ? (
        <View style={{ position: 'absolute', left: 0, right: 0, bottom: tabBarHeight }}>
          <ActiveSessionBar />
        </View>
      ) : null}
      <JournalPromptSheet />
    </View>
  );
}
