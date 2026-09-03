import api from "./api";

export const versionService = {
  list: (fileId) => api.get(`/files/${fileId}/versions`).then((r) => r.data),
  upload: (fileId, formData, onProgress) =>
    api.post(`/files/${fileId}/versions`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (evt) => onProgress?.(Math.round((evt.loaded * 100) / evt.total)),
    }).then((r) => r.data),
  revert: (fileId, versionId) =>
    api.post(`/files/${fileId}/versions/${versionId}/revert`).then((r) => r.data),
};