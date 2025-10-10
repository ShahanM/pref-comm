import { XMarkIcon } from '@heroicons/react/16/solid';
import clsx from 'clsx';
import { useState } from 'react';
import { Row } from 'react-bootstrap';
import type { AdvisorProfile } from '../../../types/preferenceCommunity.types';
import type { Movie } from '../../../types/rssa.types';
import type { UserResponseFlag } from '../Advisor.types';
import MovieSearchInput from './MovieSearchInput';

export interface UserRecommendationFormProps {
    advisor: AdvisorProfile;
    onSave: (advisorId: number, response: UserResponseFlag) => void;
}

const RecommendationForm: React.FC<UserRecommendationFormProps> = ({ advisor, onSave }) => {
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>();

    const handleItemSelected = (item: Movie | null) => {
        setSelectedMovie(item);
    };

    const handleSubmit = (rationale: string) => {
        console.log(rationale);
    };

    return (
        <Row className="recommendation-form-content">
            {advisor.responded ? (
                <>
                    <div className="recommendation-results">
                        <div className="thank-you-box">
                            <p>Thank you for your feedback!</p>
                        </div>
                        <h5>Your Recommendation to </h5>
                        <p>
                            <strong>Movie:</strong>{' '}
                        </p>
                        <p>
                            <strong>Rationale:</strong>{' '}
                        </p>
                    </div>
                </>
            ) : (
                <>
                    {selectedMovie ? (
                        <>
                            <SelectedMovieBlock movie={selectedMovie} onRemove={() => setSelectedMovie(null)} />
                            <RationaleForm advisorName={advisor.avatar?.name} onSubmit={handleSubmit} />
                        </>
                    ) : (
                        <MovieSearchInput
                            onItemSelected={handleItemSelected}
                            formLabel={`Recommend a movie to <strong>${advisor.avatar?.name}</strong>`}
                        />
                    )}
                </>
            )}
        </Row>
    );
};

const SelectedMovieBlock = ({ movie, onRemove }: { movie: Movie; onRemove: () => void }) => {
    return (
        <div className="relative flex mb-3 p-3 bg-gray-300 rounded-lg shadow-inner">
            <img src={movie.poster} alt={`Movie poster for ${movie.title}`} className="rounded size-36" />
            <div className="m-3 w-54">
                <p className="text-gray-900 font-medium">
                    {movie.title} <span className="text-gray-600 font-normal">({movie.year})</span>
                </p>
            </div>

            <button
                type="button"
                onClick={onRemove}
                className={clsx(
                    'cursor-pointer',
                    'absolute top-0 right-0 m-1 p-1 rounded-full bg-red-500 text-white',
                    'hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-400'
                )}
                aria-label="Remove selected movie"
            >
                <XMarkIcon className="w-4 h-4" />
            </button>
        </div>
    );
};

const RationaleForm: React.FC<{
    advisorName: string | undefined;
    onSubmit: (rationale: string) => void;
}> = ({ advisorName, onSubmit }) => {
    const [rationale, setRationale] = useState('');
    const handleRationaleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setRationale(e.target.value);
    };
    const handleSubmit = () => {
        onSubmit(rationale);
    };

    const isRationaleInValid = rationale.trim() === '' && rationale.length <= 50;

    return (
        <div className="mt-5">
            <label htmlFor="rationale-textarea">Why do you recommend this movie to {advisorName}?</label>
            <textarea
                value={rationale}
                title=""
                placeholder="Respond to the prompts here."
                onChange={handleRationaleChange}
                className={clsx(
                    'rounded-md',
                    'p-3 mt-1',
                    'block w-full rounded-md border-amber-400',
                    'shadow-sm focus:border-yellow-500 focus:ring-yellow-500',
                    'sm:text-sm font-mono'
                )}
                name="rationale-textarea"
            />
            <button
                className="py-2 px-4 mt-4 bg-amber-500 rounded-lg"
                onClick={handleSubmit}
                disabled={isRationaleInValid}
            >
                Save
            </button>
        </div>
    );
};

export default RecommendationForm;
