import { useState, useEffect, useRef } from 'react';
import { searchBooks, getCoverUrl } from '../api/openLibrary';
import type { OpenLibraryBook } from '../types';

interface BookSearchProps {
    onSelect: (book: OpenLibraryBook) => void;
}

export function BookSearch({ onSelect }: BookSearchProps) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<OpenLibraryBook[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);

        if (!query.trim() || query.length < 2) {
            debounceRef.current = setTimeout(() => {
                setResults([]);
                setIsOpen(false);
            }, 0);
            return () => {
                if (debounceRef.current) clearTimeout(debounceRef.current);
            };
        }

        debounceRef.current = setTimeout(async () => {
            setIsLoading(true);
            try {
                const books = await searchBooks(query);
                setResults(books);
                setIsOpen(books.length > 0);
            } catch {
                setResults([]);
            } finally {
                setIsLoading(false);
            }
        }, 400);

        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, [query]);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (
                containerRef.current &&
                !containerRef.current.contains(e.target as Node)
            ) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (book: OpenLibraryBook) => {
        onSelect(book);
        setQuery('');
        setResults([]);
        setIsOpen(false);
    };

    return (
        <div ref={containerRef} className="relative">
            <label className="block text-sm font-medium text-gray-700">
                Search on OpenLibrary
            </label>
            <div className="relative mt-1">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search by title or author..."
                    className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                {isLoading && (
                    <div className="absolute right-3 top-2.5 text-gray-400 text-xs">
                        Searching...
                    </div>
                )}
            </div>

            {isOpen && results.length > 0 && (
                <ul className="absolute z-10 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg max-h-72 overflow-y-auto">
                    {results.map((book) => {
                        const coverUrl = getCoverUrl(book.cover_i, book.isbn);
                        return (
                            <li key={book.key}>
                                <button
                                    type="button"
                                    onClick={() => handleSelect(book)}
                                    className="flex w-full items-center gap-3 px-3 py-2 text-left hover:bg-indigo-50 transition-colors"
                                >
                                    {coverUrl ? (
                                        <img
                                            src={coverUrl}
                                            alt={book.title}
                                            className="h-12 w-8 shrink-0 rounded object-cover"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).style.display = 'none';
                                            }}
                                        />
                                    ) : (
                                        <div className="h-12 w-8 shrink-0 rounded bg-gray-100 flex items-center justify-center text-gray-400 text-xs">
                                            📚
                                        </div>
                                    )}
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-medium text-gray-900 line-clamp-1">
                                            {book.title}
                                        </p>
                                        {book.author_name && (
                                            <p className="text-xs text-gray-500 line-clamp-1">
                                                {book.author_name[0]}
                                            </p>
                                        )}
                                        {book.first_publish_year && (
                                            <p className="text-xs text-gray-400">
                                                {book.first_publish_year}
                                            </p>
                                        )}
                                    </div>
                                </button>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}