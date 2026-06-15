// ─────────────────────────────────────────────
//  STOP & SHOP — API Endpoints
//  All backend routes in one place.
//  Change base path here → updates everywhere.
// ─────────────────────────────────────────────

const BASE = "/api";

// ── AUTH ──────────────────────────────────────
export const AUTH = {
  LOGIN: `${BASE}/auth/login`,
  REGISTER: `${BASE}/auth/register`,
  ME: `${BASE}/auth/me`,
  CREATE_ADMIN: `${BASE}/auth/create-admin`,
};

// ── CATEGORIES ────────────────────────────────
export const CATEGORIES = {
  GET_ALL_PUBLIC: `${BASE}/categories`, // public (active only)
  GET_ALL_ADMIN: `${BASE}/categories/all`, // admin (all)
  CREATE: `${BASE}/categories`,
  UPDATE: (id) => `${BASE}/categories/${id}`,
  DELETE: (id) => `${BASE}/categories/${id}`,
};

// ── PRODUCTS ──────────────────────────────────
export const PRODUCTS = {
  GET_PUBLIC: `${BASE}/products`, // public + filters
  GET_ALL_ADMIN: `${BASE}/products/all`, // admin all
  GET_STATS: `${BASE}/products/stats`,
  GET_BY_ID: (id) => `${BASE}/products/${id}`,
  CREATE: `${BASE}/products`,
  UPDATE: (id) => `${BASE}/products/${id}`,
  DELETE: (id) => `${BASE}/products/${id}`,
};

// ── ORDERS ────────────────────────────────────
export const ORDERS = {
  CREATE: `${BASE}/orders`,
  MY_ORDERS: `${BASE}/orders/my`,
  GET_ALL_ADMIN: `${BASE}/orders`,
  GET_STATS: `${BASE}/orders/stats`,
  GET_BY_ID: (id) => `${BASE}/orders/${id}`,
  UPDATE_STATUS: (id) => `${BASE}/orders/${id}/status`,
};

// ── USERS ─────────────────────────────────────
export const USERS = {
  GET_ALL: `${BASE}/users`,
  GET_STATS: `${BASE}/users/stats`,
  GET_BY_ID: (id) => `${BASE}/users/${id}`,
  UPDATE: (id) => `${BASE}/users/${id}`,
  DELETE: (id) => `${BASE}/users/${id}`,
};

// ── UPLOAD ────────────────────────────────────
export const UPLOAD = {
  PRODUCT_IMAGES: `${BASE}/upload/product-images`,
};

// ── HEALTH ────────────────────────────────────
export const HEALTH = `${BASE}/health`;
