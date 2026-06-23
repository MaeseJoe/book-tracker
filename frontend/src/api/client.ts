import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export const apiClient = axios.create({
	baseURL: BASE_URL,
	headers: {
		'Content-Type': 'application/json',
	},
});

apiClient.interceptors.request.use((config) => {
	const token = localStorage.getItem('accessToken');
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

apiClient.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;

		if (
			error.response &&
			error.response.status === 401 &&
			!originalRequest._retry
		) {
			originalRequest._retry = true;

			const refreshToken = localStorage.getItem('refreshToken');
			if (!refreshToken) {
				clearTokens();
				window.location.href = '/login';
				return Promise.reject(error);
			}

			try {
				const { data } = await apiClient.post('/api/auth/refresh', {
					refreshToken,
				});

				localStorage.setItem('accessToken', data.accessToken);
				localStorage.setItem('refreshToken', data.refreshToken);

				originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
				return apiClient(originalRequest);
			} catch {
				clearTokens();
				window.location.href = '/login';
				return Promise.reject(error);
			}
		}

		return Promise.reject(error);
	},
);

export const clearTokens = () => {
	localStorage.removeItem('accessToken');
	localStorage.removeItem('refreshToken');
};
