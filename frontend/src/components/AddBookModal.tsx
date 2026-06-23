import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { booksApi } from '../api/books';
import { getCoverUrl } from '../api/openLibrary';
import { BookSearch } from './BookSearch';
import type { BookRequest, ReadingStatus, OpenLibraryBook } from '../types';

interface AddBookModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const STATUS_OPTIONS: { value: ReadingStatus; label: string }[] = [
    { value: 'WANT_TO_READ', label: 'Want to read' },
    { value: 'READING', label: 'Reading' },
    { value: 'FINISHED', label: 'Finished' },
];

export function AddBookModal({ isOpen, onClose }: AddBookModalProps) {
    const queryClient = useQueryClient();
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [status, setStatus] = useState<ReadingStatus>('WANT_TO_READ');
    const [publishedYear, setPublishedYear] = useState('');
    const [isbn, setIsbn] = useState('');
    const [coverUrl, setCoverUrl] = useState('');
    const [error, setError] = useState('');

    const mutation = useMutation({
        mutationFn: (data: BookRequest) => booksApi.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['books'] });
            handleClose();
        },
        onError: () => {
            setError('Failed to add book. Please try again.');
        },
    });

    const handleClose = () => {
        setTitle('');
        setAuthor('');
        setStatus('WANT_TO_READ');
        setPublishedYear('');
        setIsbn('');
        setCoverUrl('');
        setError('');
        onClose();
    };

    const handleOpenLibrarySelect = (book: OpenLibraryBook) => {
        setTitle(book.title);
        setAuthor(book.author_name?.[0] ?? '');
        setPublishedYear(book.first_publish_year?.toString() ?? '');
        setIsbn(book.isbn?.[0] ?? '');
        const cover = getCoverUrl(book.cover_i, book.isbn);
        setCoverUrl(cover ?? '');
    };

    const handleSubmit = (e: React.SubmitEvent) => {
        e.preventDefault();
        setError('');

        mutation.mutate({
            title: title.trim(),
            author: author.trim(),
            status,
            publishedYear: publishedYear ? parseInt(publishedYear) : null,
            isbn: isbn.trim() || null,
            coverUrl: coverUrl.trim() || null,
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50" onClick={handleClose} />
            <div className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">Add book</h2>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        ✕
                    </button>
                </div>

                <div className="space-y-4">
                    {error && (
                        <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    <BookSearch onSelect={handleOpenLibrarySelect} />

                    {coverUrl && (
                        <div className="flex items-center gap-3 rounded-md bg-gray-50 p-3">
                            <img
                                src={coverUrl}
                                alt="Cover preview"
                                className="h-16 w-11 rounded object-cover shadow-sm"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = 'none';
                                }}
                            />
                            <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium text-gray-900 line-clamp-1">{title}</p>
                                <p className="text-xs text-gray-500">{author}</p>
                                <button
                                    type="button"
                                    onClick={() => setCoverUrl('')}
                                    className="mt-1 text-xs text-red-500 hover:text-red-700"
                                >
                                    Remove cover
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="border-t border-gray-100 pt-4">
                        <p className="mb-3 text-xs text-gray-400">
                            Or fill in the details manually
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                                    Title <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="title"
                                    type="text"
                                    required
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                    placeholder="The Pragmatic Programmer"
                                />
                            </div>

                            <div>
                                <label htmlFor="author" className="block text-sm font-medium text-gray-700">
                                    Author <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="author"
                                    type="text"
                                    required
                                    value={author}
                                    onChange={(e) => setAuthor(e.target.value)}
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                    placeholder="David Thomas"
                                />
                            </div>

                            <div>
                                <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                                    Status <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="status"
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value as ReadingStatus)}
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                >
                                    {STATUS_OPTIONS.map((opt) => (
                                        <option key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label htmlFor="year" className="block text-sm font-medium text-gray-700">
                                        Year
                                    </label>
                                    <input
                                        id="year"
                                        type="number"
                                        min="1000"
                                        max={new Date().getFullYear()}
                                        value={publishedYear}
                                        onChange={(e) => setPublishedYear(e.target.value)}
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                        placeholder="2024"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="isbn" className="block text-sm font-medium text-gray-700">
                                        ISBN
                                    </label>
                                    <input
                                        id="isbn"
                                        type="text"
                                        value={isbn}
                                        onChange={(e) => setIsbn(e.target.value)}
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                        placeholder="978-0-13-468599-1"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    className="flex-1 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={mutation.isPending}
                                    className="flex-1 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {mutation.isPending ? 'Adding...' : 'Add book'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}