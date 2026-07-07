//#region src/lib/api.ts
/** Base URL for all backend API calls. Change this once to affect the whole app. */
var API_BASE_URL = typeof window !== "undefined" ? "/api" : "https://admin-moderator-backend-staging.up.railway.app/api";
var createSubTopicsApi = async (topicIds) => {
	const response = await fetch(`${API_BASE_URL}/sub-topics/multi-topics`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${getToken()}`
		},
		body: JSON.stringify({ topicIds })
	});
	const data = await response.json();
	if (!response.ok || data.status !== "success" && data.success === false) throw new Error(data?.message ?? "Failed to create sub topics.");
	return data;
};
/**
* POST /auth/login
* Sends credentials and returns a JWT token + user object on success.
* Throws an Error with the server message on failure.
*/
async function loginApi(payload) {
	const response = await fetch(`${API_BASE_URL}/auth/login`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(payload)
	});
	const data = await response.json();
	if (!response.ok || data.status !== "success") throw new Error(data?.message ?? "Login failed. Please try again.");
	return data;
}
/** Shared fetch helper that attaches the JWT and throws on errors. */
async function apiFetch(path) {
	const res = await fetch(`${API_BASE_URL}${path}`, { headers: { Authorization: `Bearer ${getToken()}` } });
	const data = await res.json();
	if (!res.ok || data.status !== "success" && data.success === false) throw new Error(data?.message ?? "Request failed.");
	return data;
}
/** GET /tests — returns all tests for the logged-in admin. */
var getTestsApi = () => apiFetch("/tests");
/** GET /subjects — returns all subjects. */
var getSubjectsApi = () => apiFetch("/subjects");
/** GET /topics?subject_id=:id — returns topics for a subject. */
var getTopicsApi = (subjectId) => apiFetch(`/topics?subject_id=${subjectId}`);
/** GET /sub-topics?topic_id=:id — returns sub-topics for a topic. */
var getSubTopicsApi = (topicIds) => apiFetch(`/sub-topics?topic_id=${topicIds.join(",")}`);
/** POST /tests — creates a new test. */
async function createTestApi(payload) {
	const res = await fetch(`${API_BASE_URL}/tests`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${getToken()}`
		},
		body: JSON.stringify(payload)
	});
	const data = await res.json();
	if (!res.ok || data.status !== "success" && data.success === false) throw new Error(data?.errors?.[0]?.msg ?? data?.message ?? "Failed to create test.");
	return data;
}
/** PUT /tests/:id — updates an existing test. */
async function updateTestApi(id, payload) {
	const res = await fetch(`${API_BASE_URL}/tests/${id}`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${getToken()}`
		},
		body: JSON.stringify(payload)
	});
	const data = await res.json();
	if (!res.ok || data.status !== "success") throw new Error(data?.message ?? "Failed to update test.");
	return data;
}
/** GET /tests/:id — fetches a single test. */
async function getTestApi(id) {
	return apiFetch(`/tests/${id}`);
}
/** GET /questions?test_id=:id — fetches questions for a test. */
async function getQuestionsApi(testId) {
	return apiFetch(`/questions?test_id=${testId}`);
}
/** POST /questions/fetchBulk — fetches questions by IDs. */
async function fetchBulkApi(questionIds) {
	const res = await fetch(`${API_BASE_URL}/questions/fetchBulk`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${getToken()}`
		},
		body: JSON.stringify({ question_ids: questionIds })
	});
	const data = await res.json();
	if (!res.ok) throw new Error(data?.message ?? "Failed to fetch questions.");
	return data;
}
var TOKEN_KEY = "auth_token";
var USER_KEY = "auth_user";
/** Persist JWT to localStorage so it survives page refreshes. */
var saveToken = (token) => localStorage.setItem(TOKEN_KEY, token);
/** Retrieve the stored JWT (null if not logged in). */
var getToken = () => localStorage.getItem(TOKEN_KEY);
/** Remove the JWT + user on logout. */
var clearToken = () => {
	localStorage.removeItem(TOKEN_KEY);
	localStorage.removeItem(USER_KEY);
};
/** Persist the logged-in user object. */
var saveUser = (user) => localStorage.setItem(USER_KEY, JSON.stringify(user));
/** Retrieve the logged-in user object (null if not logged in). */
var getUser = () => {
	const raw = localStorage.getItem(USER_KEY);
	return raw ? JSON.parse(raw) : null;
};
//#endregion
export { updateTestApi as _, fetchBulkApi as a, getSubjectsApi as c, getToken as d, getTopicsApi as f, saveUser as g, saveToken as h, createTestApi as i, getTestApi as l, loginApi as m, clearToken as n, getQuestionsApi as o, getUser as p, createSubTopicsApi as r, getSubTopicsApi as s, API_BASE_URL as t, getTestsApi as u };
