import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import clsx from 'clsx';
import parse from 'html-react-parser';
import React, { useMemo, useState } from 'react';
import { useStudy } from '@rssa-project/api';
import { useDebounce } from '../../../hooks/useDebounce';
import type { Movie } from '../../../types/rssa.types';

interface SearchMovieFormControlProps {
    onItemSelected: (selectedMovie: Movie | null) => void;
    placeholder?: string;
    formLabel: string;
}
interface MovieSearchPayload {
    query: string;
}

const MovieSearchInput: React.FC<SearchMovieFormControlProps> = ({ onItemSelected, placeholder, formLabel }) => {
    const { studyApi } = useStudy();
    const queryClient = useQueryClient();

    const [searchTerm, setSearchTerm] = useState('');
    const [searchError, setSearchError] = useState('');

    const debouncedQuery = useDebounce(searchTerm, 300);

    const {
        data: suggestions,
        isFetching: isSuggesting,
    } = useQuery({
        queryKey: ['movieSuggestions', debouncedQuery],
        queryFn: async () => {
            if (debouncedQuery.trim() === '') return [];

            const response = await studyApi.post<MovieSearchPayload, Movie[]>('movies/search', {
                query: debouncedQuery.trim(),
            });
            return response;
        },
        enabled: debouncedQuery.trim().length > 2,
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
    });

    const searchMutation = useMutation({
        mutationFn: async (query: string) => {
            const response = await studyApi.post<MovieSearchPayload, Movie[]>('movies/search', {
                query: query.trim(),
            });
            return response;
        },
        onSuccess: (response) => {
            setSearchError('');
            queryClient.setQueryData(['movieSuggestions', searchTerm], response);
        },
        onError: (error) => {
            console.error('Error fetching movie search:', error);
            setSearchError('Failed to complete search.');
        },
    });

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newInputValue = event.target.value;
        setSearchTerm(newInputValue);
        // onItemSelected(null);
        setSearchError('');
    };

    const handleSearchClick = () => {
        if (searchTerm.trim()) {
            searchMutation.mutate(searchTerm);
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleSearchClick();
            event.preventDefault();
        }
    };

    const handleSelectSuggestion = (movie: Movie) => {
        setSearchTerm('');
        onItemSelected(movie);
        queryClient.removeQueries({ queryKey: ['movieSuggestions'] });
    };

    const parsedLabel = useMemo(() => parse(formLabel), [formLabel]);
    const finalPlaceholder = placeholder || 'Search for a movie...';

    const isButtonLoading = searchMutation.isPending;

    return (
        <div className="mx-auto max-w-xl p-1 relative">
            <label htmlFor="movie-search" className="block text-sm font-medium text-gray-700 my-3">
                {parsedLabel}
            </label>

            <div className="flex rounded-lg shadow-md border border-gray-300 focus-within:ring-2 focus-within:ring-amber-500">
                <input
                    type="text"
                    id="movie-search"
                    placeholder={finalPlaceholder}
                    aria-label="Search movie"
                    value={searchTerm}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    className="flex-grow p-3 w-54 text-base text-gray-800 focus:outline-none border-none rounded-l-lg"
                />

                <button
                    type="button"
                    onClick={handleSearchClick}
                    disabled={isButtonLoading}
                    className={clsx(
                        'flex items-center justify-center px-3 text-sm font-medium transition-colors duration-150',
                        'whitespace-nowrap rounded-r-lg',
                        isButtonLoading
                            ? 'bg-amber-500 text-white cursor-not-allowed'
                            : 'bg-amber-500 text-white hover:bg-amber-700'
                    )}
                >
                    {isButtonLoading ? (
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
                </button>
            </div>

            {(isSuggesting || (suggestions && suggestions.length > 0)) && (
                <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {isSuggesting && <li className="p-3 text-gray-500">Searching for suggestions...</li>}

                    {suggestions &&
                        suggestions.map((movie) => (
                            <li
                                key={movie.id}
                                className="flex items-center p-2 border-b cursor-pointer hover:bg-gray-100 transition-colors"
                                onClick={() => handleSelectSuggestion(movie)}
                            >
                                <img
                                    src={movie.poster}
                                    onError={(e) => {
                                        e.currentTarget.src = `https://placehold.co/72x108/000000/FFFFFF?text=Poster`;
                                    }}
                                    className="w-12 h-auto mr-3 rounded"
                                    alt={`Movie poster for ${movie.title} from ${movie.year}`}
                                />
                                <p className="text-gray-900 text-sm font-medium">
                                    {movie.title} <span className="text-gray-500 font-normal">({movie.year})</span>
                                </p>
                            </li>
                        ))}

                    {suggestions && suggestions.length === 0 && !isSuggesting && debouncedQuery.length > 2 && (
                        <li className="p-3 text-gray-500">No movies found. Try a different query.</li>
                    )}
                </ul>
            )}

            {searchError && (
                <div className="mt-3 p-3 text-sm font-medium text-red-700 bg-red-100 rounded-lg" role="alert">
                    {searchError}
                </div>
            )}

            {searchMutation.isError && (
                <div className="mt-3 p-3 text-sm font-medium text-red-700 bg-red-100 rounded-lg" role="alert">
                    Error on search button: Failed to connect to the server.
                </div>
            )}
        </div>
    );
};

export default MovieSearchInput;
