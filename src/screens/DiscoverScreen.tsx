import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import { COLORS, GLOBAL_STYLES } from '../styles/Theme';

interface DiscoverScreenProps {
  onStartSubmission: () => void;
}

export default function DiscoverScreen({ onStartSubmission }: DiscoverScreenProps) {
  const steps = [
    {
      num: '01',
      title: 'Upload & Legal Ingest',
      desc: 'Attach your Word or RTF document and verify your legal identity. Your intellectual property is protected by immediate contract execution.',
    },
    {
      num: '02',
      title: 'Automated Structure Scan',
      desc: 'Our engine parses headings, page margins, and fonts. It scans for forgotten templates, brackets, and placeholder text leaks.',
    },
    {
      num: '03',
      title: 'EPUB3 & PDF Formatting',
      desc: 'We format your content into valid Reflowable EPUB3 code and high-resolution PDF print templates tailored to your exact spine dimensions.',
    },
    {
      num: '04',
      title: 'Distribute Globally',
      desc: 'Download your files and upload directly to Amazon KDP, Apple Books, and Google Play. Keep 100% of your royalties and control.',
    },
  ];

  const benefits = [
    {
      icon: '💎',
      title: 'Premium Styling',
      desc: 'Every chapter head, drop cap, and page break is generated dynamically to meet global retail standard.',
    },
    {
      icon: '🛡️',
      title: '100% Rights Kept',
      desc: 'No sneaky royalty-share cuts. You paid for formatting, so you own every single byte and dollar.',
    },
    {
      icon: '⚡',
      title: 'Instant Email Tracking',
      desc: 'Receive confirmation immediately with direct links to monitor validation milestones in real time.',
    },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentPadding} showsVerticalScrollIndicator={false}>
      {/* Hero Section */}
      <Animated.View entering={FadeInUp.delay(100).duration(800)} style={styles.heroSection}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>AUTHOR-FIRST PLATFORM</Text>
        </View>
        <Text style={styles.heroTitle}>Liberelo makes publishing simple.</Text>
        <Text style={styles.heroSubtitle}>
          We take your raw manuscript files, parse them for structural integrity, and format them into industry-grade files. No marketing tricks. No royalty share. Just beautiful books.
        </Text>
        
        <TouchableOpacity style={styles.ctaButton} onPress={onStartSubmission}>
          <Text style={styles.ctaButtonText}>Get Started — Submit Manuscript</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Benefits Grid */}
      <Animated.View entering={FadeInUp.delay(300).duration(800)} style={styles.section}>
        <Text style={styles.sectionTitle}>Why Liberelo?</Text>
        <View style={styles.grid}>
          {benefits.map((b, i) => (
            <View key={i} style={[GLOBAL_STYLES.glassCard, styles.benefitCard]}>
              <Text style={styles.benefitIcon}>{b.icon}</Text>
              <Text style={styles.benefitTitle}>{b.title}</Text>
              <Text style={styles.benefitDesc}>{b.desc}</Text>
            </View>
          ))}
        </View>
      </Animated.View>

      {/* The Workflow */}
      <Animated.View entering={FadeInDown.delay(400).duration(800)} style={styles.section}>
        <Text style={styles.sectionTitle}>How We Help You</Text>
        <Text style={styles.sectionSubtitle}>A fully automated pipeline mapping files to stores.</Text>
        
        <View style={styles.timeline}>
          {steps.map((s, idx) => (
            <View key={idx} style={styles.timelineItem}>
              <View style={styles.timelineIndicator}>
                <View style={styles.timelineDot}>
                  <Text style={styles.timelineNumber}>{s.num}</Text>
                </View>
                {idx < steps.length - 1 && <View style={styles.timelineLine} />}
              </View>
              
              <View style={styles.timelineContent}>
                <Text style={styles.timelineTitle}>{s.title}</Text>
                <Text style={styles.timelineDesc}>{s.desc}</Text>
              </View>
            </View>
          ))}
        </View>
      </Animated.View>

      {/* Final Callout */}
      <View style={[GLOBAL_STYLES.glassCard, styles.calloutBox]}>
        <Text style={styles.calloutTitle}>Ready to begin your journey?</Text>
        <Text style={styles.calloutText}>
          Upload your draft today. We will validate and format your file. You'll receive progress notifications via email as your book goes through review.
        </Text>
        <TouchableOpacity style={styles.secondaryCta} onPress={onStartSubmission}>
          <Text style={styles.secondaryCtaText}>Go to Submission Form</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  contentPadding: {
    padding: 20,
    paddingTop: 40,
    paddingBottom: 60,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  badge: {
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.3)',
    marginBottom: 16,
  },
  badgeText: {
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  heroTitle: {
    color: COLORS.textLight,
    fontSize: 32,
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: 40,
    marginBottom: 16,
  },
  heroSubtitle: {
    color: COLORS.textMuted,
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 28,
    paddingHorizontal: 10,
  },
  ctaButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
    width: '100%',
    alignItems: 'center',
  },
  ctaButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  section: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.textLight,
    marginBottom: 20,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: COLORS.textMuted,
    marginTop: -16,
    marginBottom: 24,
  },
  grid: {
    flexDirection: 'column',
    gap: 16,
  },
  benefitCard: {
    padding: 20,
    backgroundColor: 'rgba(30, 41, 59, 0.4)',
  },
  benefitIcon: {
    fontSize: 28,
    marginBottom: 12,
  },
  benefitTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textLight,
    marginBottom: 6,
  },
  benefitDesc: {
    fontSize: 13,
    color: COLORS.textMuted,
    lineHeight: 18,
  },
  timeline: {
    marginTop: 10,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  timelineIndicator: {
    alignItems: 'center',
    marginRight: 16,
    width: 32,
  },
  timelineDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.surfaceCard,
    borderWidth: 2,
    borderColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  timelineNumber: {
    color: COLORS.textLight,
    fontSize: 12,
    fontWeight: '700',
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: 'rgba(99, 102, 241, 0.25)',
    position: 'absolute',
    top: 32,
    bottom: -24,
    zIndex: 1,
  },
  timelineContent: {
    flex: 1,
    paddingTop: 4,
  },
  timelineTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textLight,
    marginBottom: 6,
  },
  timelineDesc: {
    fontSize: 13,
    color: COLORS.textMuted,
    lineHeight: 20,
  },
  calloutBox: {
    padding: 24,
    backgroundColor: 'rgba(99, 102, 241, 0.05)',
    borderColor: 'rgba(99, 102, 241, 0.2)',
    alignItems: 'center',
  },
  calloutTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textLight,
    marginBottom: 8,
  },
  calloutText: {
    fontSize: 13,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  secondaryCta: {
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  secondaryCtaText: {
    color: COLORS.textLight,
    fontWeight: '700',
    fontSize: 14,
  },
});
