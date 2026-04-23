import axios from "axios";

const API_URL = "http://localhost:8000";

// Tách hàm riêng biệt
export const getAuthors = () => axios.get(`${API_URL}/authors`);
export const createAuthor = (data) => axios.post(`${API_URL}/author`, data);
export const updateAuthor = (id, data) =>
  axios.put(`${API_URL}/authors/${id}`, data);
export const deleteAuthor = (id) => axios.delete(`${API_URL}/authors/${id}`);

export const getBooks = (skip = 0, limit = 10) =>
  axios.get(`${API_URL}/books?skip=${skip}&limit=${limit}`);
export const createBook = (data) => axios.post(`${API_URL}/book`, data);
export const updateBook = (id, data) =>
  axios.put(`${API_URL}/books/${id}`, data);
export const deleteBook = (id) => axios.delete(`${API_URL}/books/${id}`);

export const getReviews = () => axios.get(`${API_URL}/reviews`);
export const createReview = (data) => axios.post(`${API_URL}/review`, data);
export const updateReview = (id, data) =>
  axios.put(`${API_URL}/reviews/${id}`, data);
export const deleteReview = (id) => axios.delete(`${API_URL}/reviews/${id}`);
