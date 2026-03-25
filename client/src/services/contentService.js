import API from './api';

export const getLatestMovies = () => API.get('/contents/movies/latest');
export const getLatestSeries = () => API.get('/contents/series/latest');
export const getLatestEpisodes = () => API.get('/contents/episodes/latest');
export const getContentById = (id) => API.get(`/contents/${id}`);
export const searchContent = (query) => API.get(`/contents/search?q=${query}`);
export const getByGenre = (genre) => API.get(`/contents/genre/${genre}`);
