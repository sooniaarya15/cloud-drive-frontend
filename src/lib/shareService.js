import api from "./api";

export const shareService = {
  create: (data) => api.post("/shares", data).then((r) => r.data),
  list: (resourceType, resourceId) =>
    api.get(`/shares/${resourceType}/${resourceId}`).then((r) => r.data),
  revoke: (shareId) => api.delete(`/shares/${shareId}`),
  sharedWithMe: () => api.get("/shares/shared-with-me").then((r) => r.data),

  createLink: (data) => api.post("/link-shares", data).then((r) => r.data),
  revokeLink: (linkId) => api.delete(`/link-shares/${linkId}`),
  resolveLink: (token, password) =>
    api
      .get(`/link/${token}`, { params: password ? { password } : {} })
      .then((r) => r.data),
};
