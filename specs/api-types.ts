// =============================================================================
// JIJI API Types - Auto-extracted from gigi-be NestJS DTOs
// Generated for FE consumption. Use these types directly in API calls.
// =============================================================================

// -----------------------------------------------------------------------------
// Auth
// -----------------------------------------------------------------------------

/** POST /api/v1/auth/signup - Request */
export interface SignUpRequest {
  email: string;
  password: string; // minLength: 6
  name: string;
}

/** POST /api/v1/auth/signin - Request */
export interface SignInRequest {
  email: string;
  password: string;
}

/** Auth endpoints - Response */
export interface AuthUser {
  id: string;
  email: string;
  name?: string;
}

export interface AuthResponse {
  accessToken: string;
  user: AuthUser;
}

// -----------------------------------------------------------------------------
// Users / Profile
// -----------------------------------------------------------------------------

/** GET /api/v1/users/me - Response */
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

/** PATCH /api/v1/users/me - Request */
export interface UpdateProfileRequest {
  name?: string;
  birthDate?: string; // ISO date string
  height?: number; // min: 50, max: 250
  weight?: number; // min: 20, max: 300
}

// -----------------------------------------------------------------------------
// Surveys - Enums & Shared Types
// -----------------------------------------------------------------------------

export type MrsDomain = 'SOMATIC' | 'PSYCHOLOGICAL' | 'UROGENITAL';

export type MrsNextAction =
  | 'EXPERT_CONSULTATION'
  | 'CBT_GUIDANCE'
  | 'START_HRT_ABSOLUTE'
  | 'NON_HORMONAL_QA'
  | 'LIFESTYLE_GUIDANCE';

export type HrtAbsoluteNextAction =
  | 'START_HRT_RELATIVE'
  | 'EXPERT_CONSULTATION';

export type HrtRelativeNextAction =
  | 'HORMONAL_THERAPY'
  | 'RELATIVE_CONTRAINDICATION'
  | 'RELATIVE_CONTRAINDICATION_SUSPECTED';

export type HrtAnswer = 'YES' | 'NO' | 'DONT_KNOW';

// -----------------------------------------------------------------------------
// Surveys - Question / Answer DTOs
// -----------------------------------------------------------------------------

export interface NumberAnswerDef {
  type: 'NUMBER';
  options: number[];
}

export interface EnumAnswerDef {
  type: 'ENUM';
  options: string[];
}

export type AnswerDef = NumberAnswerDef | EnumAnswerDef;

export interface MrsQuestion {
  id: number;
  domain: MrsDomain;
  prompt: string;
  answer: NumberAnswerDef;
}

export interface HrtAbsoluteQuestion {
  id: number;
  prompt: string;
  answer: EnumAnswerDef;
}

export interface HrtRelativeQuestion {
  id: number;
  category: string;
  prompt: string;
  answer: EnumAnswerDef;
}

// -----------------------------------------------------------------------------
// Surveys - Questionnaire Responses (GET questions)
// -----------------------------------------------------------------------------

export interface MrsQuestionnaire {
  type: 'MRS';
  title: string;
  version: number;
  questions: MrsQuestion[];
}

export interface HrtAbsoluteQuestionnaire {
  type: 'HRT_ABSOLUTE';
  title: string;
  version: number;
  questions: HrtAbsoluteQuestion[];
}

export interface HrtRelativeQuestionnaire {
  type: 'HRT_RELATIVE';
  title: string;
  version: number;
  questions: HrtRelativeQuestion[];
}

export type Questionnaire =
  | MrsQuestionnaire
  | HrtAbsoluteQuestionnaire
  | HrtRelativeQuestionnaire;

// -----------------------------------------------------------------------------
// Surveys - MRS Submit
// -----------------------------------------------------------------------------

export interface MrsAnswerItem {
  questionId: number;
  answer: number; // 0-4
}

/** POST /api/v1/survey/mrs - Request */
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

/** POST /api/v1/survey/mrs - Response */
export interface MrsResult {
  id: number;
  diagnosis: MrsDiagnosis;
  symptoms: MrsSymptoms;
}

// -----------------------------------------------------------------------------
// Surveys - HRT Absolute Submit
// -----------------------------------------------------------------------------

export interface HrtAnswerItem {
  questionId: number;
  answer: string; // 'YES' | 'NO' | 'DONT_KNOW'
}

/** POST /api/v1/survey/hrt/absolute - Request */
export interface SubmitHrtAbsoluteRequest {
  answers: HrtAnswerItem[];
}

/** POST /api/v1/survey/hrt/absolute - Response */
export interface HrtAbsoluteResult {
  id: string;
  diagnosis: {
    nextAction: HrtAbsoluteNextAction;
  };
}

// -----------------------------------------------------------------------------
// Surveys - HRT Relative Submit
// -----------------------------------------------------------------------------

/** POST /api/v1/survey/hrt/relative - Request */
export interface SubmitHrtRelativeRequest {
  answers: HrtAnswerItem[];
}

/** POST /api/v1/survey/hrt/relative - Response */
export interface HrtRelativeResult {
  id: string;
  diagnosis: {
    nextAction: HrtRelativeNextAction;
  };
}

// -----------------------------------------------------------------------------
// Surveys - Generic Question (legacy /surveys/questions endpoints)
// -----------------------------------------------------------------------------

export interface QuestionOption {
  value: number;
  label: string;
}

export interface QuestionResponse {
  id: string;
  questionType: string;
  title: string;
  description: string | null;
  options: QuestionOption[] | null;
  category: string | null;
  maxScore: number | null;
  orderIndex: number;
  nextQuestionId: string | null;
}

// -----------------------------------------------------------------------------
// Surveys - Sessions (legacy /surveys/sessions endpoints)
// -----------------------------------------------------------------------------

export interface SurveySessionResponse {
  id: string;
  userId: string;
  startedAt: string;
  completedAt: string | null;
  status: string;
}

export interface SubmitSurveyResponseRequest {
  questionId: string; // UUID
  answer?: unknown;
  score?: number;
}

export interface SurveyResponseItem {
  id: string;
  questionId: string;
  answer: unknown;
  score: number | null;
  answeredAt: string;
}

export interface SurveySessionWithResponses extends SurveySessionResponse {
  responses: SurveyResponseItem[];
}

// -----------------------------------------------------------------------------
// Surveys - Results
// -----------------------------------------------------------------------------

export interface CategoryScore {
  score: number;
  maxScore: number;
  percentage: number;
}

export interface SurveyResultResponse {
  id: string;
  sessionId: string;
  totalScore: number;
  maxScore: number;
  severityLevel: string;
  percentile: number | null;
  physical: CategoryScore | null;
  psychological: CategoryScore | null;
  urogenital: CategoryScore | null;
  aiInsight: string | null;
  recommendations: unknown;
  createdAt: string;
}

// -----------------------------------------------------------------------------
// Chats - Sessions
// -----------------------------------------------------------------------------

export type ChatContext = 'result' | 'faq' | 'question' | 'closing';

/** POST /chats/sessions - Request */
export interface CreateChatSessionRequest {
  context: ChatContext;
  surveyResultId?: string; // UUID, optional
}

/** Chat session endpoints - Response */
export interface ChatSessionResponse {
  id: string;
  userId: string;
  surveyResultId: string | null;
  context: string;
  startedAt: string;
  endedAt: string | null;
}

// -----------------------------------------------------------------------------
// Chats - Messages
// -----------------------------------------------------------------------------

export type SenderType = 'user' | 'assistant';

/** POST /chats/sessions/:sessionId/messages - Request */
export interface CreateMessageRequest {
  senderType: SenderType;
  content: string;
  metadata?: Record<string, unknown>;
}

/** Message endpoints - Response */
export interface MessageResponse {
  id: string;
  sessionId: string;
  senderType: string;
  content: string;
  metadata: Record<string, unknown> | null;
  createdAt: string;
}

// -----------------------------------------------------------------------------
// Chats - FAQ
// -----------------------------------------------------------------------------

export interface DataBox {
  title: string;
  items: string[];
}

export interface FaqResponse {
  id: string;
  question: string;
  answer: string;
  dataBox: DataBox | null;
  footerType: string | null;
  footerMessage: string | null;
  category: string | null;
  orderIndex: number | null;
}

// -----------------------------------------------------------------------------
// Chats - Closing
// -----------------------------------------------------------------------------

export interface TaskSummary {
  completed: number;
  total: number;
  items: string[];
}

export interface ClosingResponse {
  sessionId: string;
  taskSummary: TaskSummary;
  closingMessage: string;
  nextSteps: string[];
}

// -----------------------------------------------------------------------------
// Emails
// -----------------------------------------------------------------------------

/** POST /api/v1/emails/send - Request */
export interface SendEmailRequest {
  to: string; // email
  subject: string;
  html: string;
  text?: string;
}

/** POST /api/v1/emails/send - Response */
export interface EmailResponse {
  id: string;
  to: string;
  subject: string;
}

// -----------------------------------------------------------------------------
// Health / Test
// -----------------------------------------------------------------------------

export interface HealthCheckResponse {
  status: string;
  info?: Record<string, unknown>;
  error?: Record<string, unknown>;
  details?: Record<string, unknown>;
}

export interface AgentKitTestResponse {
  message: string;
}
