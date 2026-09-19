// Mock user + localStorage-backed session for the boilerplate auth flow.
import { daysAgo } from "./_helpers";

export function formatNameFromEmail(email, fallback = "Candidate") {
  if (!email || typeof email !== "string") return fallback;
  const handle = email.split("@")[0] || "";
  const parts = handle.replace(/[^a-zA-Z0-9]/g, " ").trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return fallback;
  return parts.map((p) => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase()).join(" ");
}

const STORAGE_KEY = "arr-mock-user";
const USERS_KEY = "sara_registered_users";

const SEEDED_USERS = [
  {
    _id: "user_1",
    name: "Alex Morgan",
    email: "alex@example.com",
    password: "Password123",
    createdAt: daysAgo(45),
  },
  {
    _id: "user_2",
    name: "Rahul Kalla",
    email: "rahul@gmail.com",
    password: "Password123",
    createdAt: daysAgo(10),
  }
];

export const mockUser = SEEDED_USERS[0];

export function getRegisteredUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  localStorage.setItem(USERS_KEY, JSON.stringify(SEEDED_USERS));
  return SEEDED_USERS;
}

export function saveRegisteredUsers(users) {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch {}
}

export function findUserByEmail(email) {
  const users = getRegisteredUsers();
  const cleanEmail = email?.trim()?.toLowerCase() || "";
  return users.find((u) => u.email.toLowerCase() === cleanEmail);
}

export function registerUserRecord({ name, email, password }) {
  const cleanEmail = email?.trim()?.toLowerCase();
  if (!cleanEmail) {
    throw { status: 400, message: "Please provide a valid email address." };
  }
  if (!password || password.length < 6) {
    throw { status: 400, message: "Password must be at least 6 characters long." };
  }

  const existing = findUserByEmail(cleanEmail);
  if (existing) {
    throw { status: 400, message: "An account with this email address already exists. Please sign in instead." };
  }

  const users = getRegisteredUsers();
  const userName = name?.trim() || formatNameFromEmail(cleanEmail, "Candidate");
  const newUser = {
    _id: `user_${Date.now()}`,
    name: userName,
    email: cleanEmail,
    password: password,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  saveRegisteredUsers(users);

  const sessionUser = { _id: newUser._id, name: newUser.name, email: newUser.email, createdAt: newUser.createdAt };
  saveMockUser(sessionUser);
  return sessionUser;
}

export function authenticateUser({ email, password }) {
  const cleanEmail = email?.trim()?.toLowerCase();
  if (!cleanEmail) {
    throw { status: 400, message: "Please enter your email address." };
  }
  if (!password) {
    throw { status: 400, message: "Please enter your password." };
  }

  const user = findUserByEmail(cleanEmail);
  if (!user) {
    throw { status: 401, message: "No registered account found with this email. Please create an account first." };
  }

  if (user.password !== password) {
    throw { status: 401, message: "Invalid password. Please check your credentials and try again." };
  }

  const sessionUser = { _id: user._id, name: user.name, email: user.email, createdAt: user.createdAt };
  saveMockUser(sessionUser);
  return sessionUser;
}

export function loadMockUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveMockUser(u) {
  if (u) localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
  else localStorage.removeItem(STORAGE_KEY);
}

