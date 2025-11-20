// src/api/api.js
import axios from "axios";

const API = axios.create({
  baseURL: "https://localhost:7250/api",
  headers: { "Content-Type": "application/json" }
});

// attach token automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// login
export const login = async (username, password) => {
  const res = await API.post("/Auth/login", { username, password });
  return res.data; // { token, role, userId, ... }
};

// admin: get all users
export const getAllUsers = async () => {
  const res = await API.get("/admin/users");
  return res.data;
};

// -----------------------------------------------------
// UPDATED getCustomerAccount (final version)
// -----------------------------------------------------
export const getCustomerAccount = async (idOrNull) => {
  // 1️⃣ FIRST TRY: direct stored accountId (BEST & FASTEST)
  const storedAccountId = localStorage.getItem("accountId");
  if (storedAccountId) {
    try {
      const r = await API.get(`/Accounts/${storedAccountId}`);
      return r.data;
    } catch (e) {
      // if fails, continue to fallback
    }
  }

  // 2️⃣ SECOND: try robust pattern attempts (old logic)
  const storedCustomerId = localStorage.getItem("customerId");
  const userId = idOrNull ?? localStorage.getItem("userId");
  const idsToTry = [];

  if (storedCustomerId) idsToTry.push(storedCustomerId);
  if (userId && userId !== storedCustomerId) idsToTry.push(userId);

  const patterns = [
    (x) => `/Accounts/${x}`,
    (x) => `/Accounts/customer/${x}`,
    (x) => `/Accounts/user/${x}`,
    (x) => `/Accounts?customerId=${x}`,
    (x) => `/Accounts?userId=${x}`,
    (x) => `/Customers/${x}`,
    (x) => `/customers/${x}`,
  ];

  let lastErr = null;

  for (const id of idsToTry) {
    for (const p of patterns) {
      const path = p(id);
      try {
        const res = await API.get(path);
        return res.data;
      } catch (err) {
        lastErr = err;
      }
    }
  }

  // 3️⃣ THIRD: fallback — get all accounts & filter by customerId/userId
  try {
    const list = await API.get("/Accounts");
    if (Array.isArray(list.data)) {
      const desired =
        idOrNull ??
        localStorage.getItem("customerId") ??
        localStorage.getItem("userId");

      const matches = list.data.filter(
        (a) =>
          String(a.customerId) === String(desired) ||
          String(a.userId) === String(desired)
      );

      if (matches.length) return matches;
    }
  } catch (e) {
    // ignore
  }

  throw new Error("No matching account found");
};

// create new account (admin)
export const createAccount = async (payload) => {
  const res = await API.post("/Accounts", payload);
  return res.data;
};

// deposit
export const deposit = async (payload) => {
  const res = await API.post("/Accounts/deposit", payload);
  return res.data;
};

// withdraw
export const withdraw = async (payload) => {
  const res = await API.post("/Accounts/withdraw", payload);
  return res.data;
};

// transactions
export const getTransactions = async (id, role, from, to) => {
  if (role === "Admin") {
    const res = await API.get("/admin/transactions");
    return res.data;
  }

  const qparams = [];
  if (from) qparams.push(`from=${from}`);
  if (to) qparams.push(`to=${to}`);
  const q = qparams.length ? `?${qparams.join("&")}` : "";

  const candidatePaths = [
    `/Transactions/${id}${q}`,
    `/Transactions/user/${id}${q}`,
    `/Transactions?userId=${id}${q}`,
    `/Transactions?customerId=${id}${q}`,
  ];

  for (const p of candidatePaths) {
    try {
      const res = await API.get(p);
      return res.data;
    } catch (e) {
      // continue
    }
  }

  throw new Error("No transactions endpoint matched for this user.");
};

export default API;
