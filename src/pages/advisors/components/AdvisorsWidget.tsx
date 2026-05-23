import { useQuery } from '@tanstack/react-query';
import React, { useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useStudy } from '@rssa-project/api';
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
        if (!selectedAdvisor || !selectedAdvisor.avatar) return;
        return AVATAR_IMGS[selectedAdvisor.avatar?.src];
    }, [selectedAdvisor]);

    const adviseResponse = useMemo(() => {
        if (!selectedAdvisor || !adviseResponses) return;
        const response = adviseResponses.find(
            (res: AdviseResponse) => res.payload_json.advisor_id === selectedAdvisor.id
        );
        return response;
    }, [selectedAdvisor, adviseResponses]);

    const loadingContainer = (content: React.ReactNode) => (
        <div className="flex flex-1 items-center justify-center border border-gray-300 rounded-md mt-1 ms-1 bg-gray-50 text-gray-500">
            {content}
        </div>
    );

    if (!selectedAdvisor) return loadingContainer(<>No Advisors selected</>);
    if (isLoading) return loadingContainer(<>Loading data...</>);

    const recommendation = selectedAdvisor.recommendation;
    console.log('Advisor', selectedAdvisor, typeof selectedAdvisor);
    return (
        <div className="flex flex-1 w-full">
            <div className="py-3 mt-1 border border-gray-300 rounded-md text-left">
                <div className="flex justify-between m-3 shadow-sm py-3 rounded-md">
                    <h4 className="mx-3 font-medium">{`${selectedAdvisor?.avatar?.name}'s profile`}</h4>
                    <img className="size-27 rounded-md mx-5 mt-3" src={avatarImg} alt={selectedAdvisor?.avatar?.alt} />
                </div>
                <div className="mx-3 mt-3">
                    <h4 className="font-medium">Top movies</h4>
                    <div className="grid grid-cols-7 gap-1 mt-2">
                        {Array.from(selectedAdvisor.profile_top_n).map((movie, index) => (
                            <div key={index} className="">
                                <img
                                    className="rounded-md"
                                    src={movie.tmdb_poster}
                                    alt={`Movie poster for ${movie.title} from ${movie.year}`}
                                />
                                <p className="mt-2">{movie.title}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex mx-3 mt-5 justify-between gap-5">
                    <div>
                        <h4 className="font-medium">{`${selectedAdvisor?.avatar?.name}'s recommendation to you`}</h4>
                        <p className="mt-3 text-justify">{recommendation.recommendations_text?.formal}</p>
                    </div>
                    <img
                        className="rounded-md h-81"
                        src={recommendation.tmdb_poster}
                        alt={`Movie poster for ${recommendation.title} from ${recommendation.year}`}
                    />
                </div>
            </div>
            <UserResponsePanel key={selectedAdvisor.id} userResponse={adviseResponse} advisor={selectedAdvisor} />
        </div>
    );
};

export default AdvisorsWidget;
