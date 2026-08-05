import { useStudy } from '@rssa-project/api';
import { LoadingText, useStepCompletion } from '@rssa-project/study-template';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { useEffect, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useAdvisorSelection } from '../../../hooks/useAdvisorSelection';
import type { AdviseResponse, AdvisorProfile, RecommendationType } from '../../../types/preferenceCommunity.types';
import { type StudyLayoutContextType } from '../../../types/study.types';
import { AVATAR_IMGS } from '../advisorsMap';
import RadialProgress from './RadialProgress';

interface EnrichedResponseWrapper<T> {
    response_type: string;
    items: T[];
}

const AdvisorsNavigation = ({ condition }: { condition?: number; recommendationType?: RecommendationType }) => {
    const { studyStep } = useOutletContext<StudyLayoutContextType>();
    const { studyApi } = useStudy();

    const { data: advisors, isLoading: recommendationsLoading } = useQuery({
        queryKey: ['recommendations', condition],
        queryFn: async () => {
            const contextData = {
                step_id: studyStep.id,
                context_tag: 'preference community advisor recommendations',
                schema_type: 'community_advisors',
            };

            const response = await studyApi.post<any, EnrichedResponseWrapper<AdvisorProfile>>(
                'recommendations/',
                contextData
            );

            const mappedAdvisors: Record<string, AdvisorProfile> = {};
            if (response?.items) {
                response.items.forEach((advisor) => {
                    mappedAdvisors[String(advisor.id)] = advisor;
                });
            }
            return mappedAdvisors;
        },
        enabled: !!studyStep,
    });

    const { data: adviseResponses } = useQuery({
        queryKey: ['adviseResponses'],
        queryFn: async () => await studyApi.get<AdviseResponse[]>(`responses/interactions/${studyStep.id}`),
        enabled: !!studyApi,
    });

    const responseMap = useMemo(() => {
        const newMap = new Map<string, number>();
        if (!adviseResponses) return newMap;

        adviseResponses.forEach((advRes: AdviseResponse) => {
            let count = 0;
            if (advRes.payload_json.status === 'accepted' || advRes.payload_json.status === 'rejected') count += 1;
            if (advRes.payload_json.suggested_movie && advRes.payload_json.suggested_movie !== 'N/A') count += 1;
            if (advRes.payload_json.rationale_text && advRes.payload_json.rationale_text.length > 150) count += 1;
            newMap.set(advRes.payload_json.advisor_id, count);
        });
        return newMap;
    }, [adviseResponses]);

    const advisorList = useMemo(() => (advisors ? Object.values(advisors) : []), [advisors]);
    const allComplete = useMemo(() => {
        if (advisorList.length === 0) return false;
        return advisorList.every((advisor) => {
            const count = responseMap.get(advisor.id) || 0;
            return count >= 3;
        });
    }, [advisorList, responseMap]);

    const { setIsStepComplete } = useStepCompletion();

    useEffect(() => {
        setIsStepComplete(allComplete);
    }, [allComplete, setIsStepComplete]);

    const { selectedAdvisor, setSelectedAdvisor } = useAdvisorSelection();

    useEffect(() => {
        if (advisorList.length > 0 && !selectedAdvisor) {
            setSelectedAdvisor(advisorList[0]);
        }
    }, [advisorList, selectedAdvisor, setSelectedAdvisor]);

    if (recommendationsLoading) return <LoadingText text="Loading ..." />;
    if (!advisors) return <LoadingText text="Loading advisors..." />;

    return (
        <div
            className={clsx(
                'py-3 mt-1 me-1 border border-gray-300 rounded-md text-left',
                'w-1/4 min-w-62.5 shadow-inner bg-gray-50/50'
                // 'overflow-y-auto [&::-webkit-scrollbar]:w-1.5',
                // '[&::-webkit-scrollbar-track]:bg-transparent',
                // '[&::-webkit-scrollbar-thumb]:bg-gray-300',
                // '[&::-webkit-scrollbar-thumb]:rounded-full',
                // 'hover:[&::-webkit-scrollbar-thumb]:bg-gray-400'
            )}
            // style={{ maxHeight: '80vh' }}
        >
            <h2 className="mt-5 ms-3 text-lg font-semibold text-gray-800">Your Advisors</h2>
            <div className="mt-2">
                {advisorList.map((advisor) => (
                    <AdvisorListItem key={advisor.id} advisor={advisor} taskCount={responseMap.get(advisor.id) || 0} />
                ))}
            </div>
        </div>
    );
};

const AdvisorListItem = ({ advisor, taskCount }: { advisor: AdvisorProfile; taskCount: number }) => {
    const { selectedAdvisor, setSelectedAdvisor } = useAdvisorSelection();
    const nameSplit = advisor.avatar?.name.split(' ');

    const avatarImg = useMemo(() => {
        if (!advisor?.avatar) return undefined;
        return AVATAR_IMGS[advisor.avatar.src];
    }, [advisor]);

    if (!avatarImg) return <div className="p-3 text-red-500">Missing Avatar Data</div>;

    return (
        <div
            className={clsx(
                'flex gap-3 py-3 mt-1 px-3 text-left items-center transition-colors duration-200',
                'hover:bg-amber-100 cursor-pointer border-l-4',
                selectedAdvisor?.id === advisor.id ? 'bg-amber-50 border-amber-500' : 'border-transparent'
            )}
            onClick={() => setSelectedAdvisor(advisor)}
        >
            <img
                className="w-12 h-12 rounded-full object-cover shadow-sm border border-gray-200"
                src={avatarImg}
                alt={advisor.avatar?.alt}
            />
            <div className="flex-1 font-medium text-sm text-gray-800 leading-tight">
                {nameSplit && (
                    <>
                        {nameSplit[0]}
                        <br />
                        <span className="text-gray-500">{nameSplit[1]}</span>
                    </>
                )}
            </div>
            <div className="pe-1">
                <RadialProgress totalSteps={3} currentStep={taskCount} />
            </div>
        </div>
    );
};

export default AdvisorsNavigation;
