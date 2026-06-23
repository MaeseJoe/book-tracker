import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { Book, ReadingStatus } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { booksApi } from '../../api/books';

const STATUS_LABELS: Record<ReadingStatus, string> = {
    WANT_TO_READ: 'Want to read',
    READING: 'Reading',
    FINISHED: 'Finished',
};

const STATUS_COLORS: Record<ReadingStatus, string> = {
    WANT_TO_READ: 'bg-gray-100 text-gray-700',
    READING: 'bg-blue-100 text-blue-700',
    FINISHED: 'bg-green-100 text-green-700',
};

export function BooksPage() {
    const { logout } = useAuth();
    const [statusFilter, setStatusFilter] = useState<ReadingStatus | undefined>();

    const { data: books, isLoading, error } = useQuery({
        queryKey: ['books', statusFilter],
        queryFn: () => booksApi.findAll(statusFilter),
    });

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-sm">
                <div className="mx-auto max-w-4xl px-4 py-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-900">📚 BookTracker</h1>
                    <button
                        onClick={logout}
                        className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        Sign out
                    </button>
                </div>
            </header>

            <main className="mx-auto max-w-4xl px-4 py-8">
                <div className="mb-6 flex items-center justify-between">
                    <div className="flex gap-2">
                        {([undefined, 'WANT_TO_READ', 'READING', 'FINISHED'] as const).map((status) => (
                            <button
                                key={status ?? 'all'}
                                onClick={() => setStatusFilter(status)}
                                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${statusFilter === status
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                                    }`}
                            >
                                {status ? STATUS_LABELS[status] : 'All'}
                            </button>
                        ))}
                    </div>

                    <button className="rounded-md bg-indigo-600 px-4 py-2 text-sm text-white font-medium hover:bg-indigo-700 transition-colors">
                        + Add book
                    </button>
                </div>

                {isLoading && (
                    <div className="text-center py-12 text-gray-500">Loading books...</div>
                )}

                {error && (
                    <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
                        Failed to load books. Please try again.
                    </div>
                )}

                {books && books.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        No books yet. Add your first book!
                    </div>
                )}

                {books && books.length > 0 && (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {books.map((book: Book) => (
                            <div
                                key={book.id}
                                className="rounded-xl bg-white p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-gray-900 truncate">{book.title}</h3>
                                        <p className="text-sm text-gray-500 mt-0.5">{book.author}</p>
                                        {book.publishedYear && (
                                            <p className="text-xs text-gray-400 mt-0.5">{book.publishedYear}</p>
                                        )}
                                    </div>
                                    <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[book.status]}`}>
                                        {STATUS_LABELS[book.status]}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}