import { Ionicons } from '@expo/vector-icons';
import { Redirect, Tabs } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '../../styles/theme';
import { useAppData } from '../../utils/appState';

export default function TabsLayout() {
  const { currentUser, hasAccess } = useAppData();
  const insets = useSafeAreaInsets();

  if (!currentUser) {
    return <Redirect href="/login" />;
  }

  const tabBarHeight = 64 + insets.bottom;
  const tabBarBottom = insets.bottom > 0 ? 10 : 14;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.brand.navy,
        tabBarInactiveTintColor: theme.colors.textLight,
        tabBarShowLabel: true,
        tabBarStyle: {
          position: 'absolute',
          left: theme.spacing.md,
          right: theme.spacing.md,
          bottom: tabBarBottom,
          height: tabBarHeight,
          paddingBottom: insets.bottom > 0 ? insets.bottom : 10,
          paddingTop: 8,
          paddingHorizontal: 6,
          backgroundColor: theme.colors.tabBar,
          borderTopWidth: 0,
          borderRadius: theme.radius.xl,
          overflow: 'hidden',
          borderWidth: 1,
          borderColor: theme.colors.tabBarBorder,
          ...theme.shadow.md,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '800',
          letterSpacing: 0.2,
          marginBottom: 2,
        },
        tabBarIconStyle: {
          marginTop: 1,
        },
        tabBarItemStyle: {
          borderRadius: theme.radius.md,
          marginHorizontal: 1,
        },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon color={color} focused={focused} name="grid" />
          ),
        }}
      />
      <Tabs.Screen
        name="lands"
        options={{
          title: 'Lands',
          href: hasAccess('lands') ? undefined : null,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon color={color} focused={focused} name="map" />
          ),
        }}
      />
      <Tabs.Screen
        name="buildings"
        options={{
          title: 'Buildings',
          href: hasAccess('buildings') ? undefined : null,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon color={color} focused={focused} name="business" />
          ),
        }}
      />
      <Tabs.Screen
        name="employees"
        options={{
          title: 'People',
          href: hasAccess('employees') ? undefined : null,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon color={color} focused={focused} name="people" />
          ),
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: 'More',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon color={color} focused={focused} name="ellipsis-horizontal-circle" />
          ),
        }}
      />
    </Tabs>
  );
}

function TabIcon({ name, color, focused }: { name: string; color: string; focused: boolean }) {
  return (
    <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
      <Ionicons
        color={color}
        name={name as keyof typeof Ionicons.glyphMap}
        size={21}
      />
      {focused ? <View style={styles.activeDot} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  iconWrap: {
    width: 38,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.sm,
    gap: 1,
  },
  iconWrapActive: {
    backgroundColor: theme.colors.primarySoft,
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.brand.gold,
    position: 'absolute',
    bottom: 0,
  },
});


