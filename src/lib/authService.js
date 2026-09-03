import api from "./api";

export const authService = {
  register: (data) => api.post("/auth/register", data).then((r) => r.data),
  login: (data) => api.post("/auth/login", data).then((r) => r.data),
  logout: () => api.post("/auth/logout"),
  me: () => api.get("/auth/me").then((r) => r.data),
  googleLoginUrl: () => `${process.env.NEXT_PUBLIC_API_URL}/auth/google`,
  forgotPassword: (email) => api.post("/auth/forgot-password", { email }).then((r) => r.data),
  resetPassword: (token, newPassword) =>
    api.post("/auth/reset-password", { token, newPassword }).then((r) => r.data),
};