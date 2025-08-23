import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#FF6B35',
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle:{
       
            position: 'absolute',
          
            bottom: 24,
            height: 64,
            borderRadius: 28,
            borderTopWidth: 0,
            
            paddingBottom: 8,
            paddingTop: 8,
            // Android elevation
            elevation: 12,
            width: '95%',
            marginLeft: 8,
            
            
        
        },
      }}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => <IconSymbol size={25} name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="games"
        options={{
          title: 'Games',
          tabBarIcon: ({ color }) => <IconSymbol size={25} name="game-controller" color={color} />,
        }}
      />
      <Tabs.Screen
        name="create-game"
        options={{
          title: 'Create',
          tabBarIcon: ({ color }) => <IconSymbol size={25} name="add-circle" color={color} />,
        }}
      />
      <Tabs.Screen
        name="withdrawals"
        options={{
          title: 'Withdrawals',
          tabBarIcon: ({ color }) => <IconSymbol size={25} name="cash-outline" color={color} />,
        }}
      />
      <Tabs.Screen
        name="game-declaration"
        options={{
          title: 'Declare',
          tabBarIcon: ({ color }) => <IconSymbol size={25} name="trophy" color={color} />,
        }}
      />
      <Tabs.Screen
        name="users"
        options={{
          title: 'Users',
          tabBarIcon: ({ color }) => <IconSymbol size={25} name="people" color={color} />,
        }}
      />
    </Tabs>
  );
} 