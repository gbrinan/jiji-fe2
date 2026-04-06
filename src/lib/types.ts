// Auth
export interface SignUpRequest {
  email: string;
  password: string;
  name: string;
}

export interface SignInRequest {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
}

export interface AuthResponse {
  accessToken: string;
  user: AuthUser;
}

// Users
export interface ProfileResponse {
  id: string;
  email: string;
  name: string | null;
  birthDate: string | null;
  height: number | null;
  weight: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileRequest {
  name?: string;
  birthDate?: string;
  height?: number;
  weight?: number;
}

// Surveys
export type MrsDomain = "SOMATIC" | "PSYCHOLOGICAL" | "UROGENITAL";
export type MrsNextAction =
  | "EXPERT_CONSULTATION"
  | "CBT_GUIDANCE"
  | "START_HRT_ABSOLUTE"
  | "NON_HORMONAL_QA"
  | "LIFESTYLE_GUIDANCE";
export type HrtAbsoluteNextAction = "START_HRT_RELATIVE" | "EXPERT_CONSULTATION";
export type HrtRelativeNextAction =
  | "HORMONAL_THERAPY"
  | "RELATIVE_CONTRAINDICATION"
  | "RELATIVE_CONTRAINDICATION_SUSPECTED";
export type HrtAnswer = "YES" | "NO" | "DONT_KNOW";

export interface MrsQuestion {
  id: number;
  domain: MrsDomain;
  prompt: string;
  answer: { type: "NUMBER"; options: number[] };
}

export interface MrsQuestionnaire {
  type: "MRS";
  title: string;
  version: number;
  questions: MrsQuestion[];
}

export interface MrsAnswerItem {
  questionId: number;
  answer: number;
}

export interface SubmitMrsRequest {
  answers: MrsAnswerItem[];
}

export interface MrsDiagnosis {
  summaryScore: number;
  severityLabel: string;
  totalPossibleScore: number;
  topPercentileLabel: string;
  nextAction: MrsNextAction;
}

export interface MrsSymptoms {
  physical: { score: number; total: number };
  psychological: { score: number; total: number };
  urinary: { score: number; total: number };
}

export interface MrsResult {
  id: number;
  diagnosis: MrsDiagnosis;
  symptoms: MrsSymptoms;
}

export interface HrtAbsoluteQuestion {
  id: number;
  prompt: string;
  answer: { type: "ENUM"; options: string[] };
}

export interface HrtAbsoluteQuestionnaire {
  type: "HRT_ABSOLUTE";
  title: string;
  version: number;
  questions: HrtAbsoluteQuestion[];
}

export interface HrtAnswerItem {
  questionId: number;
  answer: string;
}

export interface SubmitHrtAbsoluteRequest {
  answers: HrtAnswerItem[];
}

export interface HrtAbsoluteResult {
  id: string;
  diagnosis: { nextAction: HrtAbsoluteNextAction };
}

export interface HrtRelativeQuestion {
  id: number;
  category: string;
  prompt: string;
  answer: { type: "ENUM"; options: string[] };
}

export interface HrtRelativeQuestionnaire {
  type: "HRT_RELATIVE";
  title: string;
  version: number;
  questions: HrtRelativeQuestion[];
}

export interface SubmitHrtRelativeRequest {
  answers: HrtAnswerItem[];
}

export interface HrtRelativeResult {
  id: string;
  diagnosis: { nextAction: HrtRelativeNextAction };
}

// Chats
export type ChatContext = "result" | "faq" | "question" | "closing";
export type SenderType = "user" | "assistant";

export interface CreateChatSessionRequest {
  context: ChatContext;
  surveyResultId?: string;
}

export interface ChatSessionResponse {
  id: string;
  userId: string;
  surveyResultId: string | null;
  context: string;
  startedAt: string;
  endedAt: string | null;
}

export interface CreateMessageRequest {
  senderType: SenderType;
  content: string;
  metadata?: Record<string, unknown>;
}

export interface MessageResponse {
  id: string;
  sessionId: string;
  senderType: string;
  content: string;
  metadata: Record<string, unknown> | null;
  createdAt: string;
}

// FAQ
export interface FaqResponse {
  id: string;
  question: string;
  answer: string;
  dataBox: { title: string; items: string[] } | null;
  footerType: string | null;
  footerMessage: string | null;
  category: string | null;
  orderIndex: number | null;
}

// Closing
export interface ClosingResponse {
  sessionId: string;
  taskSummary: { completed: number; total: number; items: string[] };
  closingMessage: string;
  nextSteps: string[];
}
