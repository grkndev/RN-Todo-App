import { useTheme } from '@/hooks/useTheme'
import { Ionicons } from '@expo/vector-icons'
import { Tabs } from 'expo-router'
import React from 'react'

export default function TabLayout() {

    const { colors } = useTheme()

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.textMuted,
                tabBarStyle: {
                    backgroundColor: colors.surface,
                    borderTopWidth: 1,
                    borderTopColor: colors.border,
                    height: 90,
                    paddingBottom: 30,
                    paddingTop: 10,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '600',
                },
                headerShown: false,
            }}
        >
            <Tabs.Screen name="index" options={{
                title: "Home",
                tabBarIcon: ({ color, size }) => (
                    <Ionicons name="home" color={color} size={size} />
                ),
            }} />
            <Tabs.Screen name="settings" options={{
                title: "Settings",
                tabBarIcon: ({ color, size }) => (
                    <Ionicons name="settings" color={color} size={size} />
                ),
            }} />
        </Tabs>
    )
}