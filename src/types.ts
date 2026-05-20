export type TabType = 'discover' | 'submit' | 'pricing' | 'track';

export interface IntakeFormState {
  fullName: string;
  email: string;
  phone: string;
  genre: string;
  manuscriptUri: string | null;
  manuscriptName: string | null;
  manuscriptSize: number | null;
  digitalSignature: string;
}

export interface SubmissionRecord {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  genre: string;
  manuscriptName: string;
  status: 'Submitted' | 'In Review' | 'Formatting' | 'Ready';
  progress: number; // 0.0 to 1.0
  createdAt: string;
  updatedAt: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  gradient: string[];
  isPopular: boolean;
}

export interface FAQItem {
  question: string;
  answer: string;
}
