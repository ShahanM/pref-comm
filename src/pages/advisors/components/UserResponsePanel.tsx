import { XMarkIcon } from '@heroicons/react/16/solid';
import { useStudy } from '@rssa-project/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import clsx from 'clsx';
import { memo, useEffect, useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useDebounce } from '../../../hooks/useDebounce';
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

const UserResponsePanel = memo(
    ({ userResponse, advisor }: { userResponse: AdviseResponse | undefined; advisor: AdvisorProfile }) => {
        const { studyStep } = useOutletContext<StudyLayoutContextType>();
        const { studyApi } = useStudy();
        const queryClient = useQueryClient();

        const [draft, setDraft] = useState<AdviseSelectionObject>(
            () =>
                userResponse?.payload_json || {
                    advisor_id: advisor.id,
                    status: 'unselected',
                    suggested_movie: 'N/A',
                    rationale_text: '',
                }
        );

        const debouncedRationale = useDebounce(draft.rationale_text, 1500);

        useEffect(() => {
            setDraft(
                userResponse?.payload_json || {
                    advisor_id: advisor.id,
                    status: 'unselected',
                    suggested_movie: 'N/A',
                    rationale_text: '',
                }
            );
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [advisor.id]);

        const isRationaleSaved = useMemo(() => {
            if (!userResponse) return false;
            return userResponse.payload_json.rationale_text === draft.rationale_text;
        }, [userResponse, draft.rationale_text]);

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
                        payload_json: { ...newResponse },
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
                            return [
                                ...existingResponses,
                                {
                                    id: result.id,
                                    version: result.version,
                                    payload_json: newPayload,
                                    study_step_id: studyStep.id,
                                    study_step_page_id: null,
                                    context_tag: `community_pref-advisor-${advisor.id}`,
                                },
                            ];
                        }
                        return existingResponses.map((res, i) =>
                            i === index
                                ? {
                                      ...res,
                                      payload_json: { ...res.payload_json, ...newPayload },
                                      version: result.version,
                                  }
                                : res
                        );
                    }
                );
            },
            onError: () => {
                if (userResponse) setDraft(userResponse.payload_json);
            },
        });

        useEffect(() => {
            const savedRationale = userResponse?.payload_json.rationale_text || '';

            if (
                debouncedRationale !== savedRationale &&
                debouncedRationale.trim().length > 10 &&
                !adviseMutation.isPending
            ) {
                adviseMutation.mutate({
                    newResponse: { ...draft, rationale_text: debouncedRationale },
                    recordId: userResponse?.id,
                    fullRecord: userResponse,
                });
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [debouncedRationale]);

        const handleSelection = (selection: 'accepted' | 'rejected' | 'unselected') => {
            if (adviseMutation.isPending) return;
            const newStatus = selection === 'accepted' || selection === 'rejected' ? selection : 'unselected';
            const newDraft: AdviseSelectionObject = { ...draft, status: newStatus };

            setDraft(newDraft);
            if (newStatus !== 'unselected') {
                adviseMutation.mutate({ newResponse: newDraft, recordId: userResponse?.id, fullRecord: userResponse });
            }
        };

        const handleMovieSelection = (selectedMovie: Movie | 'N/A' | null) => {
            if (!selectedMovie || adviseMutation.isPending) return;
            const newDraft = { ...draft, suggested_movie: selectedMovie };

            setDraft(newDraft);
            adviseMutation.mutate({ newResponse: newDraft, recordId: userResponse?.id, fullRecord: userResponse });
        };

        if (!advisor) return <>No advisor selected</>;

        const currentRationale = draft.rationale_text || '';
        const isRationaleValid = currentRationale.trim().length > 10;

        return (
            <div className="ms-1 border border-gray-300 rounded-md flex flex-col h-full">
                <div className="p-3 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-800">
                        Evaluation of {advisor.avatar?.name}'s recommendation.
                    </h2>
                </div>
                <div className="flex-1 p-1">
                    <p className="text-left mb-3">How do you feel about this recommendation?</p>
                    <AdviseChooser onSelect={handleSelection} currentState={draft.status || 'unselected'} />

                    {draft.status !== 'unselected' &&
                        (draft.suggested_movie && draft.suggested_movie !== 'N/A' ? (
                            <div className="text-left mt-5">
                                <p>
                                    Your recommendations to{' '}
                                    <span className="font-semibold">{advisor.avatar?.name}</span>.
                                </p>
                                <SelectedMovieBlock
                                    movie={draft.suggested_movie}
                                    onRemove={() => handleMovieSelection('N/A')}
                                />
                                <RationaleForm
                                    text={currentRationale}
                                    onTextChange={(text) => setDraft((prev) => ({ ...prev, rationale_text: text }))}
                                />

                                <div className="text-left mt-3 flex justify-start items-center h-8">
                                    {adviseMutation.isPending ? (
                                        <span className="text-sm font-medium text-amber-600 animate-pulse flex items-center gap-2">
                                            <svg
                                                className="animate-spin h-4 w-4"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                            >
                                                <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                                                <path
                                                    d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                            Saving...
                                        </span>
                                    ) : !isRationaleSaved ? (
                                        <span className="ms-1 text-sm font-medium text-gray-500">Typing...</span>
                                    ) : isRationaleValid ? (
                                        <span className="ms-1 text-sm font-medium text-green-600">
                                            ✓ All progress saved
                                        </span>
                                    ) : (
                                        <span className="ms-1 text-sm font-medium text-gray-400">
                                            Keep typing to auto-save (min 10 chars)
                                        </span>
                                    )}
                                </div>
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
    }
);

const SelectedMovieBlock = ({ movie, onRemove }: { movie: Movie | 'N/A'; onRemove: () => void }) => {
    if (!movie || movie === 'N/A') return null;
    return (
        <div className="relative flex items-center my-3 p-3 bg-gray-50 border border-gray-200 rounded-lg shadow-inner w-full overflow-hidden">
            <img
                src={movie.tmdb_poster}
                alt={`Poster for ${movie.title}`}
                className="w-16 h-24 object-cover rounded shadow-sm shrink-0"
            />
            <div className="ml-4 flex-1 min-w-0 pr-6">
                <p className="text-gray-900 font-medium truncate" title={movie.title}>
                    {movie.title}
                </p>
                <p className="text-gray-500 text-sm mt-1">({movie.year})</p>
            </div>
            <button
                type="button"
                onClick={onRemove}
                className={clsx(
                    'cursor-pointer absolute top-2 right-2 p-1 rounded-full bg-red-100 text-red-600',
                    'hover:bg-red-500 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-red-400'
                )}
                aria-label="Remove selected movie"
            >
                <XMarkIcon className="w-4 h-4" />
            </button>
        </div>
    );
};

const RationaleForm = ({ text, onTextChange }: { text: string; onTextChange: (text: string) => void }) => {
    return (
        <div className="mt-5">
            <label htmlFor="rationale-textarea" className="block text-sm font-medium text-gray-700">
                Why do you recommend this movie?
            </label>
            <textarea
                value={text}
                title=""
                placeholder="Enter response"
                onChange={(evt) => onTextChange(evt.target.value)}
                className={clsx(
                    'rounded-md',
                    'p-3 mt-2',
                    'block w-full border-gray-300',
                    'shadow-sm focus:border-amber-500 focus:ring-amber-500',
                    'sm:text-sm font-mono transition-colors'
                )}
                name="rationale-textarea"
                rows={4}
            />
        </div>
    );
};

export default UserResponsePanel;
