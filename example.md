1) Quiero tarjetas para ver:
  - Cuantos usuarios hay en la base de datos
  - Cuantos usuarios premiums hay
  - Cuantos usuarios free hay
  - Cuantas couples hay


2) una tabla donde uno puede ver los usuarios:
  - nombre del usuario
  - email del usuario
  - dispositivo del usuario (IOS, Android)
  - premium o free (un badge para identificarlo)
  - fecha de creacion (un formato de fecha)
  - fecha de ultima actualizacion (un formato de fecha)

types: 
import { Language } from "./ILenguages";
export type UserGoal = "know" | "fun" | "tough" | "spice" | "none";
export type PremiumType =
  | "weekly"
  | "monthly"
  | "annual"
  | "lifetime"
  | "annual_offer";
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

3) Crear una pagina para las reviews: /reviews

- Quiero una tabla para las Reviews:
  - coupleName
  - coupleId
  - status
  - telegramId
  - language
  - firebaseImageUrl
  - createdAt
  - imageAddedAt
  - approvedAt

En la tabla quiero que se pueda filtrar por:
  - status

Tambien quiero poder seleccionar con un select el status que puedo poner "pending", "approved", "rejected" en donde se va a mandar a la base de datos de firebase una funcion para actualizar el status. No es necesario que lo hagamos ahora despues nos vamos a encargar de eso.


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
