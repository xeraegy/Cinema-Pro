import API from './api';

// إضافة محتوى جديد
export const createContent = (data) => API.post('/admin/contents', data);
// تحديث محتوى
export const updateContent = (id, data) => API.put(`/admin/contents/${id}`, data);
// حذف محتوى
export const deleteContent = (id) => API.delete(`/admin/contents/${id}`);
// إضافة حلقة لمسلسل
export const addEpisode = (contentId, seasonNum, episodeData) => API.post(`/admin/contents/${contentId}/seasons/${seasonNum}/episodes`, episodeData);
// حذف حلقة
export const deleteEpisode = (contentId, seasonNum, episodeNum) => API.delete(`/admin/contents/${contentId}/seasons/${seasonNum}/episodes/${episodeNum}`);
