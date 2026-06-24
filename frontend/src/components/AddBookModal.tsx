import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { booksApi } from '../api/books';
import { getCoverUrl } from '../api/openLibrary';
import { BookSearch } from './BookSearch';
import type { Book, BookRequest, ReadingStatus, OpenLibraryBook } from '../types';

interface BookModalProps {
    isOpen: boolean;
    onClose: () => void;
    book?: Book;
}

const STATUS_OPTIONS: { value: ReadingStatus; label: string }[] = [
    { value: 'WANT_TO_READ', label: 'Want to read' },
    { value: 'READING', label: 'Reading' },
    { value: 'FINISHED', label: 'Finished' },
];

function StarRating({
    value,
    onChange,
}: {
    value: number | null;
    onChange: (v: number | null) => void;
}) {
    const [hovered, setHovered] = useState<number | null>(null);

    const active = hovered ?? value;

    return (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    onClick={() => onChange(value === star ? null : star)}
                    onMouseEnter={() => setHovered(star)}
                    onMouseLeave={() => setHovered(null)}
                    className={`text-2xl transition-colors ${active !== null && star <= active
                            ? 'text-yellow-400'
                            : 'text-gray-300'
                        }`}
                >
                    ★
                </button>
            ))}
            {value && (
                <span className="ml-2 self-center text-sm text-gray-500">
                    {value}/5
                </span>
            )}
        </div>
    );
}

export function BookModal({ isOpen, onClose, book }: BookModalProps) {
    const queryClient = useQueryClient();
    const isEditing = !!book;

    const [title, setTitle] = useState(() => book?.title ?? '');
    const [author, setAuthor] = useState(() => book?.author ?? '');
    const [status, setStatus] = useState<ReadingStatus>(() => book?.status ?? 'WANT_TO_READ');
    const [publishedYear, setPublishedYear] = useState(() => book?.publishedYear?.toString() ?? '');
    const [isbn, setIsbn] = useState(() => book?.isbn ?? '');
    const [coverUrl, setCoverUrl] = useState(() => book?.coverUrl ?? '');
    const [rating, setRating] = useState<number | null>(() => book?.rating ?? null);
    const [review, setReview] = useState(() => book?.review ?? '');
    const [startedAt, setStartedAt] = useState(() => book?.startedAt ?? '');
    const [finishedAt, setFinishedAt] = useState(() => book?.finishedAt ?? '');
    const [error, setError] = useState('');

    const showReadingFields = status === 'READING' || status === 'FINISHED';
    const showRatingAndReview = status === 'FINISHED';

    const resetForm = () => {
        setTitle('');
        setAuthor('');
        setStatus('WANT_TO_READ');
        setPublishedYear('');
        setIsbn('');
        setCoverUrl('');
        setRating(null);
        setReview('');
        setStartedAt('');
        setFinishedAt('');
        setError('');
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const createMutation = useMutation({
        mutationFn: (data: BookRequest) => booksApi.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['books'] });
            handleClose();
        },
        onError: () => setError('Failed to add book. Please try again.'),
    });

    const updateMutation = useMutation({
        mutationFn: (data: BookRequest) => booksApi.update(book!.id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['books'] });
            handleClose();
        },
        onError: () => setError('Failed to update book. Please try again.'),
    });

    const isPending = createMutation.isPending || updateMutation.isPending;

    const handleOpenLibrarySelect = (selected: OpenLibraryBook) => {
        setTitle(selected.title);
        setAuthor(selected.author_name?.[0] ?? '');
        setPublishedYear(selected.first_publish_year?.toString() ?? '');
        setIsbn(selected.isbn?.[0] ?? '');
        const cover = getCoverUrl(selected.cover_i, selected.isbn);
        setCoverUrl(cover ?? '');
    };

    const handleSubmit = (e: React.SubmitEvent) => {
        e.preventDefault();
        setError('');

        const data: BookRequest = {
            title: title.trim(),
            author: author.trim(),
            status,
            publishedYear: publishedYear ? parseInt(publishedYear) : null,
            isbn: isbn.trim() || null,
            coverUrl: coverUrl.trim() || null,
            rating: showRatingAndReview ? rating : null,
            review: showRatingAndReview ? (review.trim() || null) : null,
            startedAt: showReadingFields ? (startedAt || null) : null,
            finishedAt: status === 'FINISHED' ? (finishedAt || null) : null,
        };

        if (isEditing) {
            updateMutation.mutate(data);
        } else {
            createMutation.mutate(data);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50" onClick={handleClose} />
            <div className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">
                        {isEditing ? 'Edit book' : 'Add book'}
                    </h2>
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
                            {isEditing ? 'Update the details below' : 'Or fill in the details manually'}
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

                            {showReadingFields && (
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label htmlFor="startedAt" className="block text-sm font-medium text-gray-700">
                                            Started
                                        </label>
                                        <input
                                            id="startedAt"
                                            type="date"
                                            value={startedAt}
                                            max={new Date().toISOString().split('T')[0]}
                                            onChange={(e) => setStartedAt(e.target.value)}
                                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                        />
                                    </div>

                                    {status === 'FINISHED' && (
                                        <div>
                                            <label htmlFor="finishedAt" className="block text-sm font-medium text-gray-700">
                                                Finished
                                            </label>
                                            <input
                                                id="finishedAt"
                                                type="date"
                                                value={finishedAt}
                                                max={new Date().toISOString().split('T')[0]}
                                                onChange={(e) => setFinishedAt(e.target.value)}
                                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                            />
                                        </div>
                                    )}
                                </div>
                            )}

                            {showRatingAndReview && (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Rating
                                        </label>
                                        <StarRating value={rating} onChange={setRating} />
                                    </div>

                                    <div>
                                        <label htmlFor="review" className="block text-sm font-medium text-gray-700">
                                            Review
                                        </label>
                                        <textarea
                                            id="review"
                                            rows={3}
                                            value={review}
                                            onChange={(e) => setReview(e.target.value)}
                                            placeholder="What did you think of this book?"
                                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
                                        />
                                    </div>
                                </>
                            )}

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
                                    disabled={isPending}
                                    className="flex-1 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {isPending
                                        ? (isEditing ? 'Saving...' : 'Adding...')
                                        : (isEditing ? 'Save changes' : 'Add book')
                                    }
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}