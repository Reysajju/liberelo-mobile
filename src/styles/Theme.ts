import { StyleSheet } from 'react-native';

export const COLORS = {
  // Deep Backgrounds
  background: '#0B0F19',
  surface: '#111827',
  surfaceCard: '#1E293B',
  surfaceCardElevated: '#334155',

  // Primary Accent Colors
  primary: '#6366F1', // Premium Indigo
  secondary: '#38BDF8', // Cyan / Sky Blue
  accent: '#A855F7', // Purple
  success: '#10B981', // Emerald Green
  warning: '#F59E0B', // Amber
  danger: '#EF4444', // Coral Red

  // Text Colors
  textLight: '#F8FAFC', // Slate 50
  textMuted: '#94A3B8', // Slate 400
  textDark: '#64748B', // Slate 500
  
  // Borders
  border: '#1F2937',
  borderLight: '#334155',
  borderPrimary: '#4F46E5',

  // Gradients represented as color arrays
  primaryGradient: ['#6366F1', '#A855F7'],
  skyGradient: ['#06B6D4', '#38BDF8'],
  successGradient: ['#10B981', '#059669'],
};

export const GLOBAL_STYLES = StyleSheet.create({
  glassCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.7)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  accentText: {
    fontWeight: '800',
    color: '#6366F1',
    letterSpacing: 0.5,
  },
  glowContainer: {
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  }
});
