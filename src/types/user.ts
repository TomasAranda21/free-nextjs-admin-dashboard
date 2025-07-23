// Language types
export const Language = {
  es: "Español",
  en: "English",
  pt: "Português"
} as const;

export type UserGoal = "know" | "fun" | "tough" | "spice" | "none";
export type PremiumType = "weekly" | "monthly" | "annual" | "lifetime" | "annual_offer";
export type OfferType = "annual" | "lifetime" | "none";

export interface IUser {
  id: string;
  name: string;
  goal: UserGoal;
  email: string;
  createdAt: string;
  lastActivityAt: string;
  streakDays: number;
  chatsTodayCount: number;
  language: keyof typeof Language | "en";
  isPremium: boolean;
  codeCouple: string;
  myCoupleId: string | null;
  challengesTodayCount: number;
  availableDailyChallenges: boolean;
  deviceType?: "android" | "ios" | "web" | "unknown";
  lastOfferShown: {
    type: OfferType;
    at: string;
  };
}

export interface IUserReferral {
  id: string;
  referredUserId: string;
  createdAt: string;
}

export interface IUserFeedback {
  id: string;
  source: "paywall" | "offer";
  reason: "price" | "interest" | "timing" | "other";
  otherText?: string;
  createdAt: string;
} 