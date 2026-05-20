import 'react-native-reanimated';
import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import DiscoverScreen from './src/screens/DiscoverScreen';
import IntakeScreen from './src/screens/IntakeScreen';
import PricingScreen from './src/screens/PricingScreen';
import TrackScreen from './src/screens/TrackScreen';
import { COLORS } from './src/styles/Theme';
import { TabType } from './src/types';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('discover');
  const [lastSubmissionId, setLastSubmissionId] = useState<string | null>(null);

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'discover':
        return <DiscoverScreen onStartSubmission={() => setActiveTab('submit')} />;
      case 'submit':
        return (
          <IntakeScreen 
            onSuccess={(id) => {
              setLastSubmissionId(id);
              // Proactively route user to tracking screen to view the progress pipeline
              setTimeout(() => {
                setActiveTab('track');
              }, 1800);
            }} 
          />
        );
      case 'pricing':
        return <PricingScreen />;
      case 'track':
        return <TrackScreen />;
      default:
        return <DiscoverScreen onStartSubmission={() => setActiveTab('submit')} />;
    }
  };

  const tabs = [
    { id: 'discover', label: 'Discover', icon: '✨' },
    { id: 'submit', label: 'Submit', icon: '📝' },
    { id: 'pricing', label: 'Pricing', icon: '💎' },
    { id: 'track', label: 'Track', icon: '🔍' },
  ];

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Global App Header */}
        <View style={styles.header}>
          <Text style={styles.headerLogo}>LIBERELO</Text>
          <View style={styles.headerBadge}>
            <View style={styles.badgePulse} />
            <Text style={styles.headerBadgeText}>Publishing Engine</Text>
          </View>
        </View>

        {/* Dynamic Screen Area */}
        <View style={styles.screenContainer}>
          {renderActiveScreen()}
        </View>

        {/* Custom Premium Tab Bar */}
        <View style={styles.tabBarContainer}>
          <View style={styles.tabBar}>
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <TouchableOpacity
                  key={tab.id}
                  style={styles.tabItem}
                  onPress={() => setActiveTab(tab.id as TabType)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.tabIcon, isActive && styles.tabIconActive]}>
                    {tab.icon}
                  </Text>
                  <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                    {tab.label}
                  </Text>
                  {isActive && <View style={styles.activeIndicator} />}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <StatusBar style="light" backgroundColor={COLORS.background} />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.background,
  },
  headerLogo: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.textLight,
    letterSpacing: 2,
  },
  headerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(56, 189, 248, 0.08)',
    borderColor: 'rgba(56, 189, 248, 0.25)',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgePulse: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.secondary,
    marginRight: 6,
  },
  headerBadgeText: {
    color: COLORS.secondary,
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  screenContainer: {
    flex: 1,
  },
  tabBarContainer: {
    backgroundColor: 'transparent',
    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
    paddingHorizontal: 16,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'rgba(17, 24, 39, 0.92)',
    borderColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1,
    borderRadius: 24,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 10,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    paddingVertical: 4,
  },
  tabIcon: {
    fontSize: 18,
    opacity: 0.4,
    marginBottom: 2,
  },
  tabIconActive: {
    opacity: 1,
    transform: [{ scale: 1.15 }],
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.textDark,
  },
  tabLabelActive: {
    color: COLORS.textLight,
    fontWeight: '700',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -6,
    width: 16,
    height: 3,
    backgroundColor: COLORS.primary,
    borderRadius: 2,
  },
});
