import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { COLORS, GLOBAL_STYLES } from '../styles/Theme';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function PricingScreen() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const plans = [
    {
      id: 'starter',
      name: 'Starter Ingest',
      price: '$0',
      description: 'Check structure, scan for placeholders, and test validation.',
      features: [
        'Document Structure Integrity Scan',
        'Placeholder Leak Detection',
        'Word Count Calculation',
        'Sample EPUB3 File (First 3 Chapters)',
      ],
      isPopular: false,
      buttonText: 'Current Plan / Try Free',
    },
    {
      id: 'standard',
      name: 'Standard Publisher',
      price: '$49',
      description: 'Format a single manuscript for global retail distribution.',
      features: [
        'Everything in Starter',
        'Full Reflowable EPUB3 Output',
        'Print-Ready PDF Layout (Custom Trim)',
        'Spine Width Calculation',
        'Email Tracking Notifications',
      ],
      isPopular: true,
      buttonText: 'Choose Standard',
    },
    {
      id: 'premium',
      name: 'Premium Success',
      price: '$149',
      description: 'Professional grade formatting and validation support.',
      features: [
        'Everything in Standard',
        'Cover Artwork Integrity Audit',
        'Metadata Optimization Checklist',
        'Priority Review Queue',
        'EPUB3 Re-compiles (up to 3 revisions)',
      ],
      isPopular: false,
      buttonText: 'Choose Premium',
    },
  ];

  const faqs = [
    {
      q: 'Do you take any royalties from my book sales?',
      a: 'Absolutely not. Liberelo is a flat-fee formatting tool. You retain 100% of your intellectual property and 100% of the royalties you earn from Amazon, Apple, Google, and other storefronts.',
    },
    {
      q: 'What manuscript file formats do you accept?',
      a: 'We accept Microsoft Word (.docx) and Rich Text Format (.rtf) documents. These formats allow our ingestion engine to safely identify headings, styles, and paragraphs.',
    },
    {
      q: 'How long does the review and formatting take?',
      a: 'Our automated structural review begins instantly. A standard layout conversion is typically finalized and sent via email within 24 to 48 hours of submission.',
    },
    {
      q: 'How do email tracking updates work?',
      a: 'When you upload your manuscript, our server sends a confirmation email via Google SMTP containing a unique ID. You will receive automatic updates when our team approves your draft or finishes formatting.',
    },
  ];

  const toggleFaq = (index: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentPadding} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <Animated.View entering={FadeInUp.delay(100).duration(800)} style={styles.header}>
        <Text style={styles.title}>Simple Formatting Plans</Text>
        <Text style={styles.subtitle}>No subscriptions. Pay once per manuscript. Keep all rights.</Text>
      </Animated.View>

      {/* Plan Cards */}
      <View style={styles.plansContainer}>
        {plans.map((plan, index) => (
          <Animated.View 
            key={plan.id}
            entering={FadeInUp.delay(200 + index * 100).duration(800)}
            style={[
              GLOBAL_STYLES.glassCard,
              styles.planCard,
              plan.isPopular && styles.popularCard
            ]}
          >
            {plan.isPopular && (
              <View style={styles.popularBadge}>
                <Text style={styles.popularBadgeText}>MOST POPULAR</Text>
              </View>
            )}

            <Text style={styles.planName}>{plan.name}</Text>
            <View style={styles.priceContainer}>
              <Text style={styles.price}>{plan.price}</Text>
              <Text style={styles.pricePeriod}>/ manuscript</Text>
            </View>
            
            <Text style={styles.planDesc}>{plan.description}</Text>
            
            <View style={styles.divider} />
            
            <View style={styles.featuresList}>
              {plan.features.map((feature, idx) => (
                <View key={idx} style={styles.featureItem}>
                  <Text style={styles.featureBullet}>✓</Text>
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </View>

            <TouchableOpacity 
              style={[
                styles.planButton,
                plan.isPopular ? styles.popularButton : styles.normalButton
              ]}
              activeOpacity={0.8}
            >
              <Text style={[
                styles.planButtonText,
                plan.isPopular ? styles.popularButtonText : styles.normalButtonText
              ]}>
                {plan.buttonText}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>

      {/* FAQ Section */}
      <View style={styles.faqSection}>
        <Text style={styles.faqTitle}>Frequently Asked Questions</Text>
        
        {faqs.map((faq, index) => {
          const isOpen = activeFaq === index;
          return (
            <TouchableOpacity 
              key={index} 
              style={[styles.faqItem, isOpen && styles.faqItemOpen]}
              onPress={() => toggleFaq(index)}
              activeOpacity={0.9}
            >
              <View style={styles.faqHeader}>
                <Text style={styles.faqQuestion}>{faq.q}</Text>
                <Text style={[styles.faqArrow, isOpen && styles.faqArrowRotated]}>
                  {isOpen ? '−' : '+'}
                </Text>
              </View>
              {isOpen && (
                <Text style={styles.faqAnswer}>{faq.a}</Text>
              )}
            </TouchableOpacity>
          );
        })}
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
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    color: COLORS.textLight,
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    color: COLORS.textMuted,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  plansContainer: {
    flexDirection: 'column',
    gap: 24,
    marginBottom: 40,
  },
  planCard: {
    padding: 24,
    backgroundColor: 'rgba(30, 41, 59, 0.4)',
    position: 'relative',
    overflow: 'hidden',
  },
  popularCard: {
    borderColor: COLORS.primary,
    borderWidth: 2,
    backgroundColor: 'rgba(30, 41, 59, 0.65)',
  },
  popularBadge: {
    position: 'absolute',
    top: 14,
    right: -32,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 32,
    paddingVertical: 4,
    transform: [{ rotate: '45deg' }],
  },
  popularBadgeText: {
    color: '#FFF',
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1,
  },
  planName: {
    color: COLORS.textLight,
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  price: {
    color: COLORS.textLight,
    fontSize: 36,
    fontWeight: '800',
  },
  pricePeriod: {
    color: COLORS.textMuted,
    fontSize: 14,
    marginLeft: 6,
  },
  planDesc: {
    color: COLORS.textMuted,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 20,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    marginBottom: 20,
  },
  featuresList: {
    marginBottom: 24,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  featureBullet: {
    color: COLORS.secondary,
    fontWeight: 'bold',
    marginRight: 10,
    fontSize: 14,
  },
  featureText: {
    color: COLORS.textMuted,
    fontSize: 13,
    flex: 1,
    lineHeight: 18,
  },
  planButton: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  popularButton: {
    backgroundColor: COLORS.primary,
  },
  normalButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  planButtonText: {
    fontWeight: '700',
    fontSize: 14,
  },
  popularButtonText: {
    color: '#FFF',
  },
  normalButtonText: {
    color: COLORS.textLight,
  },
  faqSection: {
    marginTop: 20,
  },
  faqTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textLight,
    marginBottom: 16,
  },
  faqItem: {
    backgroundColor: 'rgba(30, 41, 59, 0.3)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    padding: 16,
    marginBottom: 12,
  },
  faqItemOpen: {
    borderColor: 'rgba(99, 102, 241, 0.2)',
    backgroundColor: 'rgba(30, 41, 59, 0.5)',
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqQuestion: {
    color: COLORS.textLight,
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
    paddingRight: 15,
  },
  faqArrow: {
    color: COLORS.textMuted,
    fontSize: 18,
    fontWeight: '600',
  },
  faqArrowRotated: {
    color: COLORS.primary,
  },
  faqAnswer: {
    color: COLORS.textMuted,
    fontSize: 13,
    lineHeight: 18,
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
    paddingTop: 10,
  },
});
