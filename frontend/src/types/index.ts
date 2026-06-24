export type ReadingStatus = 'WANT_TO_READ' | 'READING' | 'FINISHED';

export interface Book {
	id: number;
	title: string;
	author: string;
	publishedYear: number | null;
	isbn: string | null;
	coverUrl: string | null;
	status: ReadingStatus;
	rating: number | null;
	review: string | null;
	startedAt: string | null;
	finishedAt: string | null;
}

export interface BookRequest {
	title: string;
	author: string;
	publishedYear?: number | null;
	isbn?: string | null;
	coverUrl?: string | null;
	status: ReadingStatus;
	rating?: number | null;
	review?: string | null;
	startedAt?: string | null;
	finishedAt?: string | null;
}

export interface AuthResponse {
	accessToken: string;
	refreshToken: string;
	tokenType: string;
	expiresIn: number;
}

export interface LoginRequest {
	email: string;
	password: string;
}

export interface RegisterRequest {
	name: string;
	email: string;
	password: string;
}

export interface OpenLibraryBook {
	key: string;
	title: string;
	author_name?: string[];
	first_publish_year?: number;
	isbn?: string[];
	cover_i?: number;
}

export interface OpenLibrarySearchResponse {
	numFound: number;
	docs: OpenLibraryBook[];
}
