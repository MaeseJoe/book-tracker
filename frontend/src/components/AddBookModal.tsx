import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { booksApi } from '../api/books';
import type { BookRequest, ReadingStatus } from '../types';

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
        setError('');
        onClose();
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
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="absolute inset-0 bg-black/50"
                onClick={handleClose}
            />
            <div className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">Add book</h2>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
                            {error}
                        </div>
                    )}

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
    );
}