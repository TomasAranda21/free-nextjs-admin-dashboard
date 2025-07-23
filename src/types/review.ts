import { Timestamp } from 'firebase/firestore';

// Review types
export type ReviewStatus = "pending" | "with_image" | "approved" | "rejected";
export type ReviewLanguage = "es" | "en" | "pt";

export interface IReview {
  coupleId: string;
  telegramId: number;
  coupleName: string;
  language: ReviewLanguage;
  firebaseImageUrl?: string;
  status: ReviewStatus;
  createdAt: Timestamp;
  imageAddedAt?: Timestamp;
  approvedAt?: Timestamp;
  rejectionReason?: string;
} 