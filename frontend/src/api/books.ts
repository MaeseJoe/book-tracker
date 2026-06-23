import type { Book, BookRequest, ReadingStatus } from '../types';
import { apiClient } from './client';

export const booksApi = {
	findAll: async (status?: ReadingStatus): Promise<Book[]> => {
		const params = status ? { status } : {};
		const response = await apiClient.get<Book[]>('/api/books', { params });
		return response.data;
	},

	findById: async (id: number): Promise<Book> => {
		const response = await apiClient.get<Book>(`/api/books/${id}`);
		return response.data;
	},

	create: async (data: BookRequest): Promise<Book> => {
		const response = await apiClient.post<Book>('/api/books', data);
		return response.data;
	},

	update: async (id: number, data: BookRequest): Promise<Book> => {
		const response = await apiClient.put<Book>(`/api/books/${id}`, data);
		return response.data;
	},

	delete: async (id: number): Promise<void> => {
		await apiClient.delete(`/api/books/${id}`);
	},
};
