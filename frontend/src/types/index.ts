export type ReadingStatus = 'WANT_TO_READ' | 'READING' | 'FINISHED';

export interface Book {
	id: number;
	title: string;
	author: string;
	publishedYear: number | null;
	isbn: string | null;
	coverUrl: string | null;
	status: ReadingStatus;
}

export interface BookRequest {
	title: string;
	author: string;
	publishedYear?: number | null;
	isbn?: string | null;
	coverUrl?: string | null;
	status: ReadingStatus;
}

export interface AuthResponse {
	accessToken: string;
	refreshToken: string;
	tokenType: string;
	expiresIn: number;
}

export interface LoginRequest {
	username: string;
	password: string;
}

export interface RegisterRequest {
	name: string;
	email: string;
	password: string;
}
