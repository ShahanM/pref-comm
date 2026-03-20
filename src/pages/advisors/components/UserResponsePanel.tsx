import { XMarkIcon } from '@heroicons/react/16/solid';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useStudy } from '@rssa-project/api';
import type {
    AdviseResponse,
    AdviseSelectionObject,
    AdvisorProfile,
    ParticipantResponsePayload,
} from '../../../types/preferenceCommunity.types';
import type { Movie } from '../../../types/rssa.types';
import type { StudyLayoutContextType } from '../../../types/study.types';
import AdviseChooser from './AdviseChooser';
import MovieSearchInput from './MovieSearchInput';

interface MutationResult {
    type: 'POST' | 'PATCH';
    id: string;
    advisor_id: string;
    status: 'accepted' | 'rejected' | 'unselected';
    suggested_movie: Movie | 'N/A';
    rationale_text: string;
    version: number;
}

const UserResponsePanel = ({
    userResponse,
    advisor,
}: {
    userResponse: AdviseResponse | undefined;
    advisor: AdvisorProfile;
}) => {
    const [localResponseDraft, setLocalResponseDraft] = useState<AdviseSelectionObject | null>(null);
    const [prevResponse, setPrevResponse] = useState<AdviseSelectionObject | null>(null);

    const { studyStep } = useOutletContext<StudyLayoutContextType>();
    const { studyApi } = useStudy();
    const [isRationaleSaved, setIsRationaleSaved] = useState<boolean>(false);

    useEffect(() => {
        if (userResponse) {
            setLocalResponseDraft(userResponse.payload_json);
            setPrevResponse(userResponse.payload_json);
            setIsRationaleSaved(true);
        } else {
            setLocalResponseDraft({
                advisor_id: advisor.id,
                status: 'unselected',
                suggested_movie: 'N/A',
                rationale_text: '',
            } as AdviseSelectionObject);
            setPrevResponse(null);
            setIsRationaleSaved(false);
        }
    }, [userResponse, advisor.id]);

    const queryClient = useQueryClient();
    const adviseMutation = useMutation({
        mutationKey: ['adviseResponse'],
        mutationFn: async ({
            newResponse,
            recordId,
            fullRecord,
        }: {
            newResponse: AdviseSelectionObject;
            recordId?: string;
            fullRecord?: AdviseResponse;
        }): Promise<MutationResult> => {
            if (recordId && fullRecord) {
                const patchPayload: AdviseResponse = {
                    ...fullRecord,
                    id: recordId,
                    payload_json: { ...newResponse },
                    version: fullRecord.version || 1,
                };

                await studyApi.patch<AdviseResponse, void>(`responses/interactions/${recordId}`, patchPayload);
                return {
                    type: 'PATCH',
                    id: recordId,
                    advisor_id: newResponse.advisor_id,
                    status: newResponse.status,
                    suggested_movie: newResponse.suggested_movie,
                    rationale_text: newResponse.rationale_text,
                    version: (fullRecord.version || 1) + 1,
                };
            } else {
                const postPayload: ParticipantResponsePayload = {
                    study_step_id: studyStep.id,
                    study_step_page_id: null,
                    context_tag: `community_pref-advisor-${advisor.id}`,
                    payload_json: {
                        advisor_id: advisor.id,
                        status: newResponse.status,
                        suggested_movie: newResponse.suggested_movie,
                        rationale_text: newResponse.rationale_text,
                    },
                };
                const response = await studyApi.post<ParticipantResponsePayload, AdviseResponse>(
                    'responses/interactions/',
                    postPayload
                );
                return {
                    type: 'POST',
                    id: response.id!,
                    advisor_id: response.payload_json.advisor_id,
                    status: response.payload_json.status,
                    suggested_movie: response.payload_json.suggested_movie!,
                    rationale_text: response.payload_json.rationale_text!,
                    version: response.version || 1,
                };
            }
        },
        onSuccess: (result) => {
            const newPayload: AdviseSelectionObject = {
                status: result.status,
                advisor_id: result.advisor_id,
                suggested_movie: result.suggested_movie,
                rationale_text: result.rationale_text,
            };

            queryClient.setQueryData<AdviseResponse[]>(
                ['adviseResponses'],
                (oldResponses: AdviseResponse[] | undefined) => {
                    const existingResponses = oldResponses || [];
                    const index = existingResponses.findIndex(
                        (res) => res.payload_json.advisor_id === result.advisor_id
                    );

                    if (index === -1) {
                        const newResponse: AdviseResponse = {
                            id: result.id,
                            version: result.version,
                            payload_json: newPayload,
                            study_step_id: studyStep.id,
                            study_step_page_id: null,
                            context_tag: `community_pref-advisor-${advisor.id}`,
                        };
                        return [...existingResponses, newResponse];
                    }
                    return existingResponses.map((res, i) => {
                        if (i === index) {
                            return {
                                ...res,
                                payload_json: {
                                    ...res.payload_json,
                                    ...newPayload,
                                },
                                version: result.version,
                            };
                        }
                        return res;
                    });
                }
            );
            setIsRationaleSaved(true);
        },
        onError: () => {

            setLocalResponseDraft(prevResponse);
        },
    });
    const { isPending, mutateAsync } = adviseMutation;

    const handleSelection = (selection: 'accepted' | 'rejected' | 'unselected') => {
        if (isPending) return;
        const newStatus = selection === 'accepted' || selection === 'rejected' ? selection : 'unselected';

        setPrevResponse(localResponseDraft);
        const newDraft: AdviseSelectionObject = {
            ...(localResponseDraft as AdviseSelectionObject),
            advisor_id: advisor.id,
            status: newStatus,
        };
        setLocalResponseDraft(newDraft);

        if (newStatus !== 'unselected') {
            mutateAsync({ newResponse: newDraft, recordId: userResponse?.id, fullRecord: userResponse });
        }
    };

    const handleMovieSelection = (selectedMovie: Movie | 'N/A' | null) => {
        if (!selectedMovie || !localResponseDraft || isPending) return;
        setPrevResponse(localResponseDraft);
        const newDraft: AdviseSelectionObject = {
            ...(localResponseDraft as AdviseSelectionObject),
            advisor_id: advisor.id,
            suggested_movie: selectedMovie,
        };
        setLocalResponseDraft(newDraft);
        mutateAsync({ newResponse: newDraft, recordId: userResponse?.id, fullRecord: userResponse });
    };
    const handleRationaleChange = (newText: string) => {
        if (!localResponseDraft) return;
        setIsRationaleSaved(false);
        setLocalResponseDraft((prevDraft) => ({
            ...(prevDraft as AdviseSelectionObject),
            rationale_text: newText,
        }));
    };
    const handleSaveRationale = () => {
        if (!localResponseDraft) return;
        setPrevResponse(localResponseDraft);
        mutateAsync({ newResponse: localResponseDraft, recordId: userResponse?.id, fullRecord: userResponse });
    };

    if (!advisor) return <>No advisor selected</>;
    const currentRationale = localResponseDraft?.rationale_text || '';
    const isRationaleValid = currentRationale.trim().length > 10;

    return (
        <div className="mt-1 ms-1 border border-gray-300 rounded-md">
            <div className="p-3">
                <h2 className="m-5">Recommendations</h2>
            </div>
            <div className="content-center m-3">
                <p className="text-left my-5 p-3">
                    How do you feel about <strong>{advisor.avatar?.name}</strong>'s recommendation?
                </p>
                <AdviseChooser onSelect={handleSelection} currentState={localResponseDraft?.status || 'unselected'} />

                {localResponseDraft?.status !== 'unselected' &&
                    !adviseMutation.isPending &&
                    (localResponseDraft?.suggested_movie && localResponseDraft?.suggested_movie !== 'N/A' ? (
                        <div className="text-left">
                            <SelectedMovieBlock
                                movie={localResponseDraft?.suggested_movie}
                                onRemove={() => handleMovieSelection('N/A')}
                            />
                            <RationaleForm
                                advisorName={advisor.avatar?.name}
                                text={currentRationale}
                                onTextChange={handleRationaleChange}
                            />
                            <button
                                onClick={handleSaveRationale}
                                disabled={!isRationaleValid || adviseMutation.isPending || isRationaleSaved}
                                className={clsx(
                                    'py-2 px-4 mt-4 rounded-lg font-medium transition-colors duration-200',
                                    'cursor-pointer',
                                    isRationaleValid && !isRationaleSaved
                                        ? 'bg-amber-500 hover:bg-amber-600 text-gray-700'
                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                )}
                            >
                                {adviseMutation.isPending ? 'Saving...' : isRationaleSaved ? 'Saved' : 'Save'}
                            </button>
                        </div>
                    ) : (
                        <MovieSearchInput
                            onItemSelected={handleMovieSelection}
                            formLabel={`Recommend a movie to <strong>${advisor.avatar?.name}</strong>`}
                        />
                    ))}
            </div>
        </div>
    );
};

const SelectedMovieBlock = ({ movie, onRemove }: { movie: Movie | 'N/A'; onRemove: () => void }) => {

    if (!movie || movie === 'N/A') return <></>;
    return (
        <div className="relative flex my-3 p-3 bg-gray-300 rounded-lg shadow-inner">
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

const RationaleForm = ({
    advisorName,
    text,
    onTextChange,
}: {
    advisorName: string | undefined;
    text: string;
    onTextChange: (text: string) => void;
}) => {
    return (
        <div className="mt-5">
            <label htmlFor="rationale-textarea">Why do you recommend this movie to {advisorName}?</label>
            <textarea
                value={text}
                title=""
                placeholder="Enter response"
                onChange={(evt) => onTextChange(evt.target.value)}
                className={clsx(
                    'rounded-md',
                    'p-3 mt-1',
                    'block w-full rounded-md border-amber-400',
                    'shadow-sm focus:border-yellow-500 focus:ring-yellow-500',
                    'sm:text-sm font-mono'
                )}
                name="rationale-textarea"
            />
        </div>
    );
};

export default UserResponsePanel;
