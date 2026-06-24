import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { booksApi } from '../../api/books';
import { useAuth } from '../../hooks/useAuth';
import { useThemeContext } from '../../hooks/useThemeContext';
import { BookModal } from '../../components/AddBookModal';
import { DeleteBookModal } from '../../components/DeleteBookModal';
import type { Book, ReadingStatus } from '../../types';

const STATUS_LABELS: Record<ReadingStatus, string> = {
    WANT_TO_READ: 'Want to read',
    READING: 'Reading',
    FINISHED: 'Finished',
};

const STATUS_COLORS: Record<ReadingStatus, string> = {
    WANT_TO_READ: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
    READING: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    FINISHED: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
};

export function BooksPage() {
    const { logout } = useAuth();
    const { theme, toggle } = useThemeContext();
    const [statusFilter, setStatusFilter] = useState<ReadingStatus | undefined>();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingBook, setEditingBook] = useState<Book | null>(null);
    const [deletingBook, setDeletingBook] = useState<Book | null>(null);

    const { data: books, isLoading, error } = useQuery({
        queryKey: ['books', statusFilter],
        queryFn: () => booksApi.findAll(statusFilter),
    });

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
            <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
                <div className="mx-auto max-w-4xl px-4 py-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">📚 BookTracker</h1>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={toggle}
                            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                            aria-label="Toggle dark mode"
                        >
                            {theme === 'dark' ? '☀️' : '🌙'}
                        </button>
                        <button
                            onClick={logout}
                            className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                        >
                            Sign out
                        </button>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-4xl px-4 py-8">
                <div className="mb-6 flex items-center justify-between">
                    <div className="flex gap-2">
                        {([undefined, 'WANT_TO_READ', 'READING', 'FINISHED'] as const).map((s) => (
                            <button
                                key={s ?? 'all'}
                                onClick={() => setStatusFilter(s)}
                                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${statusFilter === s
                                        ? 'bg-indigo-600 text-white'
                                        : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600'
                                    }`}
                            >
                                {s ? STATUS_LABELS[s] : 'All'}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="rounded-md bg-indigo-600 px-4 py-2 text-sm text-white font-medium hover:bg-indigo-700 transition-colors"
                    >
                        + Add book
                    </button>
                </div>

                {isLoading && (
                    <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                        Loading books...
                    </div>
                )}

                {error && (
                    <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-4 text-sm text-red-700 dark:text-red-400">
                        Failed to load books. Please try again.
                    </div>
                )}

                {books && books.length === 0 && (
                    <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                        No books yet. Add your first book!
                    </div>
                )}

                {books && books.length > 0 && (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {books.map((book) => (
                            <div
                                key={book.id}
                                className="rounded-xl bg-white dark:bg-gray-800 p-5 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-start gap-3">
                                    {book.coverUrl ? (
                                        <img
                                            src={book.coverUrl}
                                            alt={book.title}
                                            className="h-20 w-14 shrink-0 rounded object-cover shadow-sm"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).style.display = 'none';
                                            }}
                                        />
                                    ) : (
                                        <div className="h-20 w-14 shrink-0 rounded bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-2xl">
                                            📚
                                        </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                            <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2">
                                                {book.title}
                                            </h3>
                                            <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[book.status]}`}>
                                                {STATUS_LABELS[book.status]}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                                            {book.author}
                                        </p>
                                        {book.publishedYear && (
                                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                                                {book.publishedYear}
                                            </p>
                                        )}
                                        {book.rating && (
                                            <div className="mt-1 flex items-center gap-1">
                                                <span className="text-yellow-400 text-xs">
                                                    {'★'.repeat(book.rating)}{'☆'.repeat(5 - book.rating)}
                                                </span>
                                                <span className="text-xs text-gray-400 dark:text-gray-500">
                                                    {book.rating}/5
                                                </span>
                                            </div>
                                        )}
                                        {book.finishedAt && (
                                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                                                Finished {new Date(book.finishedAt).toLocaleDateString('en-GB', {
                                                    month: 'short',
                                                    year: 'numeric',
                                                })}
                                            </p>
                                        )}
                                        <div className="mt-3 flex gap-2">
                                            <button
                                                onClick={() => setEditingBook(book)}
                                                className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium transition-colors"
                                            >
                                                Edit
                                            </button>
                                            <span className="text-xs text-gray-300 dark:text-gray-600">·</span>
                                            <button
                                                onClick={() => setDeletingBook(book)}
                                                className="text-xs text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium transition-colors"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            <BookModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
            />

            <BookModal
                key={editingBook?.id ?? 'edit'}
                isOpen={!!editingBook}
                onClose={() => setEditingBook(null)}
                book={editingBook ?? undefined}
            />

            <DeleteBookModal
                isOpen={!!deletingBook}
                onClose={() => setDeletingBook(null)}
                book={deletingBook}
            />
        </div>
    );
}