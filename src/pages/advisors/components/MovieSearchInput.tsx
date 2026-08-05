import { useStudy } from '@rssa-project/api';
import { useQuery } from '@tanstack/react-query';
import parse from 'html-react-parser';
import React, { useMemo, useState } from 'react';
import { useDebounce } from '../../../hooks/useDebounce';
import type { Movie } from '../../../types/rssa.types';

interface SearchMovieFormControlProps {
    onItemSelected: (selectedMovie: Movie | null) => void;
    placeholder?: string;
    formLabel: string;
}

const MovieSearchInput: React.FC<SearchMovieFormControlProps> = ({ onItemSelected, placeholder, formLabel }) => {
    const { studyApi } = useStudy();
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedQuery = useDebounce(searchTerm, 300);

    const {
        data: suggestions,
        isFetching: isSuggesting,
        isError,
    } = useQuery({
        queryKey: ['movieSuggestions', debouncedQuery],
        queryFn: async () => {
            if (debouncedQuery.trim() === '') return [];
            return await studyApi.post<{ query: string }, Movie[]>('movies/search', {
                query: debouncedQuery.trim(),
            });
        },
        enabled: debouncedQuery.trim().length > 2,
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
    });

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault();
        }
    };

    const handleSelectSuggestion = (movie: Movie) => {
        setSearchTerm('');
        onItemSelected(movie);
    };

    const parsedLabel = useMemo(() => parse(formLabel), [formLabel]);
    const finalPlaceholder = placeholder || 'Search for a movie...';

    return (
        <div className="w-full relative py-1">
            <label htmlFor="movie-search" className="block text-sm font-medium text-gray-700 my-3">
                {parsedLabel}
            </label>

            <div className="flex rounded-lg shadow-sm border border-gray-300 focus-within:border-amber-500 focus-within:ring-1 focus-within:ring-amber-500 transition-all">
                <input
                    type="text"
                    id="movie-search"
                    placeholder={finalPlaceholder}
                    aria-label="Search movie"
                    value={searchTerm}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    className="flex-1 w-full p-3 text-base text-gray-800 focus:outline-none border-none rounded-l-lg bg-white"
                />

                <div className="flex items-center justify-center px-4 bg-amber-500 text-white rounded-r-lg font-medium">
                    {isSuggesting ? (
                        <svg
                            className="animate-spin h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            ></circle>
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                        </svg>
                    ) : (
                        <span>Search</span>
                    )}
                </div>
            </div>

            {(isSuggesting ||
                (suggestions && suggestions.length > 0) ||
                (debouncedQuery.length > 2 && suggestions?.length === 0)) && (
                <ul className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {isSuggesting && <li className="p-3 text-gray-500 text-sm">Searching for suggestions...</li>}

                    {suggestions &&
                        suggestions.map((movie) => (
                            <li
                                key={movie.id}
                                className="flex items-center p-2 border-b border-gray-100 cursor-pointer hover:bg-amber-50 transition-colors"
                                onClick={() => handleSelectSuggestion(movie)}
                            >
                                <img
                                    src={movie.tmdb_poster}
                                    onError={(e) => {
                                        e.currentTarget.src = `https://placehold.co/72x108/eeeeee/999999?text=No+Poster`;
                                    }}
                                    className="w-10 h-14 object-cover mr-3 rounded shadow-sm"
                                    alt={`Poster for ${movie.title}`}
                                />
                                <p className="text-gray-900 text-sm font-medium">
                                    {movie.title} <span className="text-gray-500 font-normal">({movie.year})</span>
                                </p>
                            </li>
                        ))}

                    {suggestions && suggestions.length === 0 && !isSuggesting && debouncedQuery.length > 2 && (
                        <li className="p-3 text-gray-500 text-sm">No movies found. Try a different query.</li>
                    )}
                </ul>
            )}

            {isError && (
                <div
                    className="mt-2 p-2 text-sm font-medium text-red-700 bg-red-50 rounded-md border border-red-200"
                    role="alert"
                >
                    Failed to connect to the server. Please try again.
                </div>
            )}
        </div>
    );
};

export default MovieSearchInput;
