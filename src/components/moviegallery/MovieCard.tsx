import { useMutation, useQueryClient } from '@tanstack/react-query';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useStudy } from 'rssa-api';
import type { MovieDetails, ParticipantRatingPayload, RatedItem } from '../../types/rssa.types';
import type { StudyLayoutContextType } from '../../types/study.types';
import StarRating from './StarRating';

interface MutationResult {
    type: 'POST' | 'PATCH';
    id: string;
    item_id: string;
    rating: number;
    version: number;
}

const MovieCard = ({
    movie,
    userRating,
    onClick,
}: {
    movie: MovieDetails;
    userRating: RatedItem | undefined;
    onClick: () => void;
}) => {
    const { studyStep } = useOutletContext<StudyLayoutContextType>();
    const initialRating = userRating;
    const [movieRating, setMovieRating] = useState<number>(0);
    const [prevRating, setPrevRating] = useState<number>(0);
    const [isHovered, setIsHovered] = useState<boolean>(false);
    const { studyApi } = useStudy();

    useEffect(() => {
        if (initialRating) {
            setMovieRating(initialRating.rating);
            setPrevRating(initialRating.rating);
        }
    }, [initialRating]);

    const queryClient = useQueryClient();
    const ratingMutation = useMutation({
        mutationKey: ['movieRatings'],
        mutationFn: async (newRating: number): Promise<MutationResult> => {
            if (initialRating && initialRating.id) {
                const patchPayload: RatedItem = {
                    id: initialRating.id,
                    item_id: initialRating.item_id,
                    rating: newRating,
                    version: initialRating.version,
                };
                await studyApi.patch<RatedItem, void>(`responses/ratings/${initialRating.id}`, patchPayload);
                return {
                    type: 'PATCH',
                    id: initialRating.id,
                    item_id: initialRating.item_id,
                    rating: newRating,
                    version: initialRating.version! + 1,
                };
            } else {
                const postPayload: ParticipantRatingPayload = {
                    step_id: studyStep.id,
                    step_page_id: null,
                    context_tag: 'preference_elicitation',
                    rated_item: {
                        item_id: movie.id,
                        rating: newRating,
                    },
                };
                const response = await studyApi.post<ParticipantRatingPayload, RatedItem>(
                    'responses/ratings/',
                    postPayload
                );

                return {
                    type: 'POST',
                    id: response.id!,
                    item_id: response.item_id,
                    rating: response.rating,
                    version: response.version || 1,
                };
            }
        },
        onSuccess: (result) => {
            const newRating: RatedItem = {
                id: result.id,
                item_id: result.item_id,
                rating: result.rating,
                version: result.version,
            };
            queryClient.setQueryData<RatedItem[]>(['movieRatings'], (oldRatings: RatedItem[] | undefined) => {
                const existingRatings = oldRatings || [];
                const index = existingRatings.findIndex((rat) => rat.item_id === result.item_id);
                if (index > -1) {
                    return existingRatings.map((rat, i) => (i === index ? newRating : rat));
                } else {
                    return [...existingRatings, newRating];
                }
            });
        },
        onError: () => {
            console.error('Failed to save rating on the server.');
            setMovieRating(prevRating);
        },
    });

    const handleRating = (newRating: number) => {
        if (ratingMutation.isPending || newRating === movieRating) return;
        setPrevRating(movieRating);
        setMovieRating(newRating);
        ratingMutation.mutateAsync(newRating);
    };

    return (
        <div
            className={clsx(
                'bg-red-200',
                'rounded-lg overflow-hidden shadow-lg',
                'transform transition-transform duration-300 hover:scale-115 cursor-pointer',
                'flex flex-col hover:z-10'
            )}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="relative lg:h-54 xxl:h-81 flex items-center justify-center bg-black">
                <img
                    className={clsx('h-full w-full', isHovered ? 'object-contain' : 'object-contain')}
                    src={movie.poster}
                    alt={`Poster for ${movie.title}`}
                    onError={(e) => {
                        e.currentTarget.src = 'https://placehold.co/400x600/000000/FFFFFF?text=No+Image';
                    }}
                />
                <div className={clsx('absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent')}>
                    <div className="absolute bottom-0 w-full pt-4 px-1 flex flex-col items center text-center">
                        <p className="text-white text-md font-medium mb-0 leading-tight">{movie.title}</p>
                        <p className="text-gray-300 text-md mx-auto">{movie.year}</p>
                    </div>
                </div>
            </div>
            <div className="bg-gray-700 py-1">
                <StarRating initialRating={movieRating} onRatingChange={handleRating} maxStars={5} />
            </div>
        </div>
    );
};

export default MovieCard;
