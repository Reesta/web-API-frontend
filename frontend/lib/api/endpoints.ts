export const AUTH_ENDPOINTS = {
  REGISTER: "/auth/register",
  LOGIN: "/auth/login",
  WHOAMI: "/auth/whoami",
  UPDATE: "/auth/update",
  REQUEST_PASSWORD_RESET: "/auth/request-password-reset",
  RESET_PASSWORD: (token: string) => `/auth/reset-password/${token}`,
};

export const ADMIN_USER_ENDPOINTS = {
  LIST: "/admin/users",
  DETAIL: (id: string) => `/admin/users/${id}`,
};
