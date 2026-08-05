import { useStudy } from '@rssa-project/api';
import { useQuery } from '@tanstack/react-query';
import React, { useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useAdvisorSelection } from '../../../hooks/useAdvisorSelection';
import type { AdviseResponse } from '../../../types/preferenceCommunity.types';
import type { StudyLayoutContextType } from '../../../types/study.types';
import { AVATAR_IMGS } from '../advisorsMap';
import UserResponsePanel from './UserResponsePanel';

const AdvisorsWidget: React.FC = () => {
    const { selectedAdvisor } = useAdvisorSelection();
    const { studyStep } = useOutletContext<StudyLayoutContextType>();
    const { studyApi } = useStudy();

    const { data: adviseResponses, isLoading } = useQuery({
        queryKey: ['adviseResponses'],
        queryFn: async () => await studyApi.get<AdviseResponse[]>(`responses/interactions/${studyStep.id}`),
        enabled: !!studyApi,
    });

    const avatarImg = useMemo(() => {
        if (!selectedAdvisor?.avatar) return undefined;
        return AVATAR_IMGS[selectedAdvisor.avatar.src];
    }, [selectedAdvisor]);

    const adviseResponse = useMemo(() => {
        if (!selectedAdvisor || !adviseResponses) return undefined;
        return adviseResponses.find((res) => res.payload_json.advisor_id === selectedAdvisor.id);
    }, [selectedAdvisor, adviseResponses]);

    const loadingContainer = (content: React.ReactNode) => (
        <div className="flex flex-1 items-center justify-center border border-gray-300 rounded-md mt-1 ms-1 bg-gray-50 text-gray-500 h-[60vh]">
            {content}
        </div>
    );

    if (!selectedAdvisor) return loadingContainer(<span>No Advisors selected</span>);
    if (isLoading) return loadingContainer(<span>Loading data...</span>);

    const recommendation = selectedAdvisor.recommendation;

    return (
        <div className="flex flex-col lg:flex-row flex-1 w-full gap-4 mt-1">
            <div className="flex-1 border border-gray-300 rounded-md text-left bg-white overflow-hidden flex flex-col">
                <div className="m-4 pb-4 border-b border-gray-100 flex items-center gap-4">
                    <img
                        className="w-20 h-20 rounded-md object-cover shadow-sm border border-gray-200"
                        src={avatarImg}
                        alt={selectedAdvisor.avatar?.alt}
                    />
                    <h3 className="text-xl font-semibold text-gray-800">{`${selectedAdvisor.avatar?.name}'s Profile`}</h3>
                </div>

                <div className="mx-4 mt-2">
                    <h4 className="font-medium text-gray-700">{`${selectedAdvisor.avatar?.name}'s Top Rated Movies`}</h4>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-3 mt-3">
                        {selectedAdvisor.profile_top_n.map((movie) => (
                            <div key={movie.id} className="flex flex-col">
                                <img
                                    className="rounded-md shadow-sm aspect-2/3 object-cover w-full"
                                    src={movie.tmdb_poster}
                                    alt={`Movie poster for ${movie.title} from ${movie.year}`}
                                />
                                <p className="mt-2 text-xs font-medium text-gray-800 text-center leading-tight">
                                    {movie.title}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row mx-4 mt-8 mb-6 p-4 bg-amber-50 rounded-lg gap-6 items-start">
                    <div className="flex-1">
                        <h4 className="font-semibold text-amber-900">{`Recommendation for You`}</h4>
                        <p className="mt-3 text-justify text-amber-800 text-sm leading-relaxed">
                            {recommendation.advisor_suggestion}
                        </p>
                    </div>
                    <img
                        className="rounded-md w-32 md:w-48 shadow-md aspect-2/3 object-cover shrink-0"
                        src={recommendation.tmdb_poster}
                        alt={`Movie poster for ${recommendation.title} from ${recommendation.year}`}
                    />
                </div>
            </div>

            <div className="lg:w-1/3 w-full">
                <UserResponsePanel key={selectedAdvisor.id} userResponse={adviseResponse} advisor={selectedAdvisor} />
            </div>
        </div>
    );
};

export default AdvisorsWidget;
