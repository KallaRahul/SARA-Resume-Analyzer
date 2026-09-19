// ─────────────────────────────────────────────────────────────────────────────
// AUTH API — backed by mocks while the backend is offline.
// TO ENABLE THE REAL BACKEND:
//   1. Uncomment each `apiClient.*` line below.
//   2. Delete the mock implementation block underneath.
//   3. Delete the `import` from "@/mock/auth" + "@/mock/_helpers".
// ─────────────────────────────────────────────────────────────────────────────

// import { apiClient } from "./client";
import {
  mockUser,
  loadMockUser,
  saveMockUser,
  registerUserRecord,
  authenticateUser,
} from "@/mock/auth";
import { mockDelay } from "@/mock/_helpers";

export const authApi = {
  // register: (payload) => apiClient.post("/auth/register", payload).then((r) => r.data),
  register: async ({ name, email, password }) => {
    await mockDelay(600);
    const user = registerUserRecord({ name, email, password });
    return { user };
  },

  // login: (payload) => apiClient.post("/auth/login", payload).then((r) => r.data),
  login: async ({ email, password }) => {
    await mockDelay(600);
    const user = authenticateUser({ email, password });
    return { user };
  },

  // logout: () => apiClient.post("/auth/logout").then((r) => r.data),
  logout: async () => {
    await mockDelay(150);
    saveMockUser(null);
    return { ok: true };
  },

  // me: () => apiClient.get("/auth/me").then((r) => r.data),
  me: async () => {
    await mockDelay(100);
    const u = loadMockUser();
    if (!u) {
      throw { status: 401, message: "Unauthenticated" };
    }
    return { user: u };
  },

  // updateProfile: (payload) => apiClient.patch("/auth/profile", payload).then((r) => r.data),
  updateProfile: async (payload) => {
    await mockDelay();
    const current = loadMockUser() || mockUser;
    const u = { ...current, ...payload };
    saveMockUser(u);
    return { user: u };
  },

  // changePassword: (payload) => apiClient.patch("/auth/password", payload).then((r) => r.data),
  changePassword: async () => {
    await mockDelay();
    return { ok: true };
  },
};

