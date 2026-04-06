import { createClient } from "@/lib/supabase";
import type {
  AuthResponse, SignUpRequest, SignInRequest,
  ProfileResponse, UpdateProfileRequest,
  MrsQuestionnaire, SubmitMrsRequest, MrsResult,
  HrtAbsoluteQuestionnaire, SubmitHrtAbsoluteRequest, HrtAbsoluteResult,
  HrtRelativeQuestionnaire, SubmitHrtRelativeRequest, HrtRelativeResult,
  ChatSessionResponse, CreateChatSessionRequest,
  MessageResponse, CreateMessageRequest,
  FaqResponse, ClosingResponse,
} from "@/lib/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://jiji-production-ee02.up.railway.app";

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

async function getToken(): Promise<string | null> {
  if (typeof window === "undefined") return null;
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token ?? null;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = await getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    if (res.status === 401 && typeof window !== "undefined") {
      window.location.href = "/login";
    }
    const body = await res.text();
    throw new ApiError(res.status, body);
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

// Generic methods
const get = <T>(path: string) => request<T>(path);
const post = <T>(path: string, body?: unknown) =>
  request<T>(path, { method: "POST", body: body ? JSON.stringify(body) : undefined });
const patch = <T>(path: string, body?: unknown) =>
  request<T>(path, { method: "PATCH", body: body ? JSON.stringify(body) : undefined });

// Auth
export const authApi = {
  signUp: (data: SignUpRequest) => post<AuthResponse>("/api/v1/auth/signup", data),
  signIn: (data: SignInRequest) => post<AuthResponse>("/api/v1/auth/signin", data),
};

// Users
export const usersApi = {
  getMe: () => get<ProfileResponse>("/api/v1/users/me"),
  updateMe: (data: UpdateProfileRequest) => patch<ProfileResponse>("/api/v1/users/me", data),
};

// Surveys - MRS
export const mrsApi = {
  getQuestionnaire: () => get<MrsQuestionnaire>("/api/v1/survey/mrs"),
  submit: (data: SubmitMrsRequest) => post<MrsResult>("/api/v1/survey/mrs", data),
};

// Surveys - HRT
export const hrtApi = {
  getAbsoluteQuestionnaire: () => get<HrtAbsoluteQuestionnaire>("/api/v1/survey/hrt/absolute"),
  submitAbsolute: (data: SubmitHrtAbsoluteRequest) => post<HrtAbsoluteResult>("/api/v1/survey/hrt/absolute", data),
  getRelativeQuestionnaire: () => get<HrtRelativeQuestionnaire>("/api/v1/survey/hrt/relative"),
  submitRelative: (data: SubmitHrtRelativeRequest) => post<HrtRelativeResult>("/api/v1/survey/hrt/relative", data),
};

// Chat Sessions
export const chatApi = {
  createSession: (data: CreateChatSessionRequest) => post<ChatSessionResponse>("/chats/sessions", data),
  getSessions: () => get<ChatSessionResponse[]>("/chats/sessions"),
  getSession: (id: string) => get<ChatSessionResponse>(`/chats/sessions/${id}`),
  endSession: (id: string) => post<ChatSessionResponse>(`/chats/sessions/${id}/end`),
  getMessages: (sessionId: string) => get<MessageResponse[]>(`/chats/sessions/${sessionId}/messages`),
  sendMessage: (sessionId: string, data: CreateMessageRequest) => post<MessageResponse>(`/chats/sessions/${sessionId}/messages`, data),
  getClosing: (sessionId: string) => get<ClosingResponse>(`/api/v1/chats/sessions/${sessionId}/closing`),
};

// FAQ
export const faqApi = {
  getAll: (category?: string) => get<FaqResponse[]>(`/api/v1/chats/faq${category ? `?category=${category}` : ""}`),
  getById: (id: string) => get<FaqResponse>(`/api/v1/chats/faq/${id}`),
};

// Keep backward-compatible generic api object
export const api = { get, post, patch };
