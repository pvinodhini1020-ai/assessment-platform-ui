// ─── Global API Configuration ────────────────────────────────────────────────

/** Base URL for all backend API calls. Change this once to affect the whole app. */
export const API_BASE_URL =
  "https://admin-moderator-backend-staging.up.railway.app/api";

// ─── Types ────────────────────────────────────────────────────────────────────

// ── Auth ──
export interface LoginPayload {
  userId: string;
  password: string;
}

export interface LoginUser {
  id: string;
  userId: string;
  name: string;
  role: string;
  subrole: string;
  phone: string;
  joiningDate: string;
  endDate: string;
  lastActive: string;
  payment: boolean;
}

export interface LoginResponse {
  status: "success" | "error";  // API returns "success", not a boolean
  message: string;
  data: {
    token: string;
    user: LoginUser;
  };
}

// ── Tests ──
export type TestStatus = "draft" | "live" | "scheduled" | "unpublished" | "expired";
export type TestType   = "chapterwise" | "pyq" | "mock";

export interface Test {
  id: string;
  name: string;
  type: TestType;
  subject: string;
  topics: string[];
  sub_topics: string[];
  status: TestStatus | null;  // API may return null for existing records
  difficulty: "easy" | "medium" | "hard";
  total_marks: number;
  total_time: number;       // in minutes
  total_questions: number;
  created_at: string;
  updated_at: string | null;
  scheduled_date: string | null;
  expiry_date: string | null;
}

export interface TestsResponse {
  status: "success" | "error";
  message: string;
  data: Test[];
}

// ── Subjects / Topics ──

// POST /sub-topics/multi-topics — accepts multiple topic IDs.
export const createSubTopicsApi = async (topicIds: string[]) => {
  const response = await fetch(`${API_BASE_URL}/sub-topics/multi-topics`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
    body: JSON.stringify({ topicIds }),
  });
  const data = await response.json();
  if (!response.ok || (data.status !== "success" && data.success === false)) {
    throw new Error(data?.message ?? "Failed to create sub topics.");
  }
  return data;
}
export interface Subject {
  id: string;
  name: string;
}

export interface Topic {
  id: string;
  name: string;
  subject_id: string;
}

export interface SubTopic {
  id: string;
  name: string;
  topic_id: string;
}

export interface CreateTestPayload {
  name: string;
  type: TestType;
  subject: string;
  topics: string[];
  sub_topics: string[];
  correct_marks: number;
  wrong_marks: number;
  unattempt_marks: number;
  difficulty: "easy" | "medium" | "hard";
  total_time: number;
  total_marks: number;
  total_questions: number;
  status: TestStatus;
}

export interface CreateTestResponse {
  success: boolean;
  data: Test;
  message: string;
}

// ─── Auth API ─────────────────────────────────────────────────────────────────

/**
 * POST /auth/login
 * Sends credentials and returns a JWT token + user object on success.
 * Throws an Error with the server message on failure.
 */
export async function loginApi(payload: LoginPayload): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  // Treat non-2xx HTTP status or status !== "success" as an error
  if (!response.ok || data.status !== "success") {
    throw new Error(data?.message ?? "Login failed. Please try again.");
  }

  return data as LoginResponse;
}

// ─── Tests & Subjects API ──────────────────────────────────────────────────────────

// PUT /tests/:id — updates an existing test to live status.
export const publishTestApi = async (id: string) => {
  const payload: Partial<CreateTestPayload> = { status: 'live' };
  return await updateTestApi(id, payload);
}

/** Shared fetch helper that attaches the JWT and throws on errors. */
async function apiFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  const data = await res.json();
  if (!res.ok || (data.status !== "success" && data.success === false)) {
    throw new Error(data?.message ?? "Request failed.");
  }
  return data as T;
}

/** GET /tests — returns all tests for the logged-in admin. */
export const getTestsApi = () => apiFetch<TestsResponse>("/tests");

/** GET /subjects — returns all subjects. */
export const getSubjectsApi = () =>
  apiFetch<{ status: string; data: Subject[] }>("/subjects");

/** GET /topics?subject_id=:id — returns topics for a subject. */
export const getTopicsApi = (subjectId: string) =>
  apiFetch<{ status: string; data: Topic[] }>(`/topics?subject_id=${subjectId}`);

/** GET /sub-topics?topic_id=:id — returns sub-topics for a topic. */
export const getSubTopicsApi = (topicIds: string[]) =>
  apiFetch<{ status: string; success: boolean; data: SubTopic[] }>(`/sub-topics?topic_id=${topicIds.join(",")}`);

/** POST /tests — creates a new test. */
export async function createTestApi(payload: CreateTestPayload): Promise<CreateTestResponse> {
  const res = await fetch(`${API_BASE_URL}/tests`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok || (data.status !== "success" && data.success === false)) {
    throw new Error(data?.errors?.[0]?.msg ?? data?.message ?? "Failed to create test.");
  }
  return data as CreateTestResponse;
}

// ── Questions ──

// POST /questions/fetchBulk — fetches questions by IDs.
export const fetchQuestionsBulkApi = async (questionIds: string[]) => {
  const response = await fetch(`${API_BASE_URL}/questions/fetchBulk`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question_ids: questionIds }),
  });
  return response.json();
}
export interface QuestionPayload {
  test_id: string;
  question: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  correct_option: string;
  explanation?: string;
  difficulty?: "easy" | "medium" | "hard";
  topic?: string;
  sub_topic?: string;
  media_url?: string;
}

export interface Question {
  id: string;
  test_id: string;
  question: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  correct_option: string;
  subject?: string;
  explanation?: string;
  difficulty?: string;
  topic?: string;
  sub_topic?: string;
  media_url?: string;
}

export interface QuestionResponse {
  success: boolean;
  data: Question;
  message: string;
}

export interface FetchBulkResponse {
  status: string;
  data: Question[];
}

/** PUT /tests/:id — updates an existing test. */
export async function updateTestApi(id: string, payload: Partial<CreateTestPayload> & { status?: TestStatus; scheduled_date?: string }): Promise<CreateTestResponse> {
  const res = await fetch(`${API_BASE_URL}/tests/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok || data.status !== "success") throw new Error(data?.message ?? "Failed to update test.");
  return data as CreateTestResponse;
}

/** POST /questions/bulk — adds a question to a test. */
export async function addQuestionApi(payload: QuestionPayload & { subject?: string }): Promise<QuestionResponse> {
  const res = await fetch(`${API_BASE_URL}/questions/bulk`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
    body: JSON.stringify({ questions: [{ ...payload, type: "mcq" }] }),
  });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data?.message ?? "Failed to add question.");
  // The bulk endpoint returns an array, so we take the first item
  return {
    success: data.success,
    data: data.data[0],
    message: data.message,
  } as QuestionResponse;
}

/** PUT /questions/:id — updates an existing question. */
export async function updateQuestionApi(id: string, payload: Partial<QuestionPayload>): Promise<QuestionResponse> {
  const res = await fetch(`${API_BASE_URL}/questions/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data?.message ?? "Failed to update question.");
  return data as QuestionResponse;
}

/** DELETE /questions/:id — deletes a question. */
export async function deleteQuestionApi(id: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/questions/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message ?? "Failed to delete question.");
}

/** GET /tests/:id — fetches a single test. */
export async function getTestApi(id: string): Promise<{ status: string; data: Test }> {
  return apiFetch(`/tests/${id}`);
}

/** GET /questions?test_id=:id — fetches questions for a test. */
export async function getQuestionsApi(testId: string): Promise<{ status: string; data: Question[] }> {
  return apiFetch(`/questions?test_id=${testId}`);
}

/** POST /questions/fetchBulk — fetches questions by IDs. */
export async function fetchBulkApi(questionIds: string[]): Promise<FetchBulkResponse> {
  const res = await fetch(`${API_BASE_URL}/questions/fetchBulk`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
    body: JSON.stringify({ question_ids: questionIds }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message ?? "Failed to fetch questions.");
  return data as FetchBulkResponse;
}

// ─── Token Helpers ────────────────────────────────────────────────────────────

const TOKEN_KEY = "auth_token";
const USER_KEY  = "auth_user";

/** Persist JWT to localStorage so it survives page refreshes. */
export const saveToken = (token: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(TOKEN_KEY, token);
  }
};

/** Retrieve the stored JWT (null if not logged in). */
export const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(TOKEN_KEY);
  }
  return null;
};

/** Remove the JWT + user on logout. */
export const clearToken = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }
};

/** Persist the logged-in user object. */
export const saveUser = (user: LoginUser) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
};

/** Retrieve the logged-in user object (null if not logged in). */
export const getUser = (): LoginUser | null => {
  if (typeof window !== "undefined") {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as LoginUser) : null;
  }
  return null;
};
