import { Ionicons } from '@expo/vector-icons';
import { Redirect, Tabs } from 'expo-router';
import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { type AppTheme, useAppTheme } from '../../utils/themeContext';
import { useAppData } from '../../utils/appState';

export default function TabsLayout() {
  const { currentUser, hasAccess } = useAppData();
  const { theme } = useAppTheme();
  const insets = useSafeAreaInsets();

  if (!currentUser) {
    return <Redirect href="/login" />;
  }

  const tabBarHeight = 66 + insets.bottom;
  const tabBarBottom = insets.bottom > 0 ? 12 : 16;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.isDark ? theme.colors.primaryLight : theme.colors.primary,
        tabBarInactiveTintColor: theme.isDark ? theme.colors.textMuted : theme.colors.textLight,
        tabBarShowLabel: true,
        tabBarStyle: {
          position: 'absolute',
          left: theme.spacing.md,
          right: theme.spacing.md,
          bottom: tabBarBottom,
          height: tabBarHeight,
          paddingBottom: insets.bottom > 0 ? insets.bottom : 10,
          paddingTop: 8,
          paddingHorizontal: 4,
          backgroundColor: theme.colors.tabBar,
          borderTopWidth: 0,
          borderRadius: theme.radius.xl,
          overflow: 'hidden',
          borderWidth: 1.5,
          borderColor: theme.colors.tabBarBorder,
          ...theme.shadow.lg,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '800',
          letterSpacing: 0.3,
          marginBottom: 1,
        },
        tabBarIconStyle: {
          marginTop: 1,
        },
        tabBarItemStyle: {
          borderRadius: theme.radius.md,
          marginHorizontal: 2,
        },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon color={color} focused={focused} name="grid" theme={theme} />
          ),
        }}
      />
      <Tabs.Screen
        name="lands"
        options={{
          title: 'Lands',
          href: hasAccess('lands') ? undefined : null,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon color={color} focused={focused} name="map" theme={theme} />
          ),
        }}
      />
      <Tabs.Screen
        name="buildings"
        options={{
          title: 'Buildings',
          href: hasAccess('buildings') ? undefined : null,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon color={color} focused={focused} name="business" theme={theme} />
          ),
        }}
      />
      <Tabs.Screen
        name="employees"
        options={{
          title: 'People',
          href: hasAccess('employees') ? undefined : null,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon color={color} focused={focused} name="people" theme={theme} />
          ),
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: 'More',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon color={color} focused={focused} name="ellipsis-horizontal-circle" theme={theme} />
          ),
        }}
      />
    </Tabs>
  );
}

function TabIcon({ name, color, focused, theme }: { name: string; color: string; focused: boolean; theme: AppTheme }) {
  const styles = useMemo(() => makeStyles(theme), [theme]);
  return (
    <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
      <Ionicons
        color={color}
        name={name as keyof typeof Ionicons.glyphMap}
        size={22}
      />
    </View>
  );
}

function makeStyles(theme: AppTheme) { return StyleSheet.create({
  iconWrap: {
    width: 40,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.sm,
  },
  iconWrapActive: {
    backgroundColor: theme.isDark ? 'rgba(122,170,255,0.18)' : theme.colors.primarySoft,
    borderRadius: theme.radius.sm,
  },
}); }


