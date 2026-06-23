import { useMutation, useQueryClient } from '@tanstack/react-query';
import { booksApi } from '../api/books';
import type { Book } from '../types';

interface DeleteBookModalProps {
    isOpen: boolean;
    onClose: () => void;
    book: Book | null;
}

export function DeleteBookModal({ isOpen, onClose, book }: DeleteBookModalProps) {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: () => booksApi.delete(book!.id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['books'] });
            onClose();
        },
    });

    if (!isOpen || !book) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />
            <div className="relative w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
                <h2 className="text-lg font-semibold text-gray-900">Delete book</h2>
                <p className="mt-2 text-sm text-gray-600">
                    Are you sure you want to delete{' '}
                    <span className="font-medium">"{book.title}"</span>?
                    This action cannot be undone.
                </p>

                {mutation.isError && (
                    <div className="mt-3 rounded-md bg-red-50 p-3 text-sm text-red-700">
                        Failed to delete book. Please try again.
                    </div>
                )}

                <div className="mt-6 flex gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={mutation.isPending}
                        className="flex-1 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={() => mutation.mutate()}
                        disabled={mutation.isPending}
                        className="flex-1 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {mutation.isPending ? 'Deleting...' : 'Delete'}
                    </button>
                </div>
            </div>
        </div>
    );
}