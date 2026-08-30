import api from "./api";

export const folderService = {
  get: (id) => api.get(`/folders/${id || "root"}`).then((r) => r.data),
  create: (data) => api.post("/folders", data).then((r) => r.data),
  update: (id, data) => api.patch(`/folders/${id}`, data).then((r) => r.data),
  delete: (id) => api.delete(`/folders/${id}`),
};

export const fileService = {
  list: (folderId) => api.get("/files", { params: { folderId } }).then((r) => r.data),
  get: (id) => api.get(`/files/${id}`).then((r) => r.data),
  update: (id, data) => api.patch(`/files/${id}`, data).then((r) => r.data),
  trash: (id) => api.post(`/files/${id}/trash`),
  restore: (id) => api.post(`/files/${id}/restore`),
  deleteForever: (id) => api.delete(`/files/${id}`),
  upload: (formData, onProgress) =>
    api.post("/files/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (evt) => {
        if (onProgress) onProgress(Math.round((evt.loaded * 100) / evt.total));
      },
    }).then((r) => r.data),
};

export const searchService = {
  search: (params) => api.get("/search", { params }).then((r) => r.data),
  recent: () => api.get("/recent").then((r) => r.data),
};

export const starService = {
  add: (resourceType, resourceId) =>
    api.post("/stars", { resourceType, resourceId }),
  remove: (resourceType, resourceId) =>
    api.delete("/stars", { data: { resourceType, resourceId } }),
};

export const trashService = {
  list: () => api.get("/trash").then((r) => r.data),
  restore: (resourceType, resourceId) =>
    api.post("/trash/restore", { resourceType, resourceId }),
};