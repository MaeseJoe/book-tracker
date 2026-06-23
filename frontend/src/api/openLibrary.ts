import type { OpenLibraryBook, OpenLibrarySearchResponse } from '../types';

const BASE_URL = 'https://openlibrary.org';
const COVERS_URL = 'https://covers.openlibrary.org';

const FIELDS = 'key,title,author_name,first_publish_year,isbn,cover_i';

export async function searchBooks(query: string): Promise<OpenLibraryBook[]> {
	if (!query.trim()) return [];

	const params = new URLSearchParams({
		q: query,
		fields: FIELDS,
		limit: '8',
	});

	const response = await fetch(`${BASE_URL}/search.json?${params}`);

	if (!response.ok) {
		throw new Error(`OpenLibrary search failed: ${response.status}`);
	}

	const data: OpenLibrarySearchResponse = await response.json();
	return data.docs;
}

export function getCoverUrl(coverI?: number, isbn?: string[]): string | null {
	if (coverI) {
		return `${COVERS_URL}/b/id/${coverI}-M.jpg`;
	}
	if (isbn && isbn.length > 0) {
		return `${COVERS_URL}/b/isbn/${isbn[0]}-M.jpg`;
	}
	return null;
}
