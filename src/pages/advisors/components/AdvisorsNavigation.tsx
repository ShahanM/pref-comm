import { CheckCircleIcon } from '@heroicons/react/16/solid';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { useMemo, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useStudy } from 'rssa-api';
import { useAdvisorSelection } from '../../../hooks/useAdvisorSelection';
import type {
    AdviseResponse,
    AdvisorProfile,
    PreferenceCommResponseObject,
    RecommendationType,
} from '../../../types/preferenceCommunity.types';
import { type StudyLayoutContextType } from '../../../types/study.types';
import { useStepCompletion } from 'rssa-study-template';
import { AVATAR_IMGS } from '../advisorsMap';

interface RecommendationRequestPayload {
    step_id: string;
    // step_page_id?: string;
    // context_tag?: string;
    // rec_type?: 'baseline' | 'reference' | 'diverse'; // Could include if needed by new endpoint via run_config
}

const AdvisorsNavigation = ({
    // ratedItems, // Removed
    condition,
    recommendationType = 'baseline',
}: {
    // ratedItems: RatedItem[];
    condition?: number;
    recommendationType?: RecommendationType;
}) => {
    const { studyStep } = useOutletContext<StudyLayoutContextType>();
    const { studyApi } = useStudy();

    const { data: advisors, isLoading: recommendationsLoading } = useQuery({
        queryKey: ['recommendations', condition], // Removed ratedItems from key
        queryFn: async () => {
            const contextData = {
                step_id: studyStep.id,
                context_tag: 'preference community advisor recommendations',
                rec_type: recommendationType,
            };
            const response = await studyApi.post<any, PreferenceCommResponseObject>( // Payload type relaxed for now
                'recommendations/',
                contextData
            );
            return response;
        },
        enabled: !!studyStep, // Changed enabled condition
    });

    const { data: adviseResponses, isLoading } = useQuery({
        queryKey: ['adviseResponses'],
        queryFn: async () => await studyApi.get<AdviseResponse[]>(`responses/interactions/${studyStep.id}`),
        enabled: !!studyApi,
    });

    const responseMap = useMemo(() => {
        if (!adviseResponses) return;
        const newMap = new Map<string, number>();
        adviseResponses.forEach((advRes) => {
            let count = 0;
            if (advRes.payload_json.status === 'accepted' || advRes.payload_json.status === 'rejected') count += 1;
            if (advRes.payload_json.suggested_movie !== 'N/A') count += 1;
            if (advRes.payload_json.rationale_text.length > 10) count += 1;
            newMap.set(advRes.payload_json.advisor_id, count);
        });
        return newMap;
    }, [adviseResponses]);

    console.log(adviseResponses);
    console.log(responseMap);

    const { setIsStepComplete } = useStepCompletion();

    useEffect(() => {
        if (!advisors || !responseMap) {
            setIsStepComplete(false);
            return;
        }

        const advisorIds = Object.keys(advisors);
        if (advisorIds.length === 0) {
            setIsStepComplete(false);
            return;
        }

        const allComplete = advisorIds.every((id) => {
            const count = responseMap.get(id) || 0;
            return count >= 3;
        });

        setIsStepComplete(allComplete);
    }, [advisors, responseMap, setIsStepComplete]);

    if (recommendationsLoading) return <>Loading ...</>;
    if (!advisors) return <>Loading advisors</>;

    return (
        <div className="py-3 mt-1 me-1 border border-gray-300 rounded-md text-left w-full">
            <h2 className="mt-5 ms-3">Your Advisors</h2>
            <div className="">
                {Object.values(advisors).map((advisor) => {
                    console.log(advisor.id, responseMap?.get(advisor.id));
                    return (
                        <AdvisorListItem
                            key={advisor.id}
                            advisor={advisor}
                            taskCount={responseMap?.get(advisor.id) || 0}
                        />
                    );
                })}
            </div>
        </div>
    );
};

const AdvisorListItem = ({ advisor, taskCount }: { advisor: AdvisorProfile; taskCount: number }) => {
    const { selectedAdvisor, setSelectedAdvisor } = useAdvisorSelection();
    const nameSplit = advisor.avatar?.name.split(' ');
    console.log(advisor.avatar?.name, taskCount);
    const avatarImg = useMemo(() => {
        if (!advisor || !advisor.avatar) return;
        return AVATAR_IMGS[advisor.avatar?.src];
    }, [advisor]);

    if (!avatarImg) return <>Something went wrong</>;

    return (
        <div
            className={clsx(
                'flex gap-3 py-2 mt-2 ps-3 text-left items-center',
                'hover:bg-amber-500 cursor-pointer',
                selectedAdvisor?.id === advisor.id ? 'bg-amber-300' : ''
            )}
            onClick={() => setSelectedAdvisor(advisor)}
        >
            <img className="size-18 rounded-full" src={avatarImg} alt={advisor.avatar?.alt} />
            {nameSplit && (
                <span>
                    {nameSplit[0]}
                    <br />
                    {nameSplit[1]}
                </span>
            )}
            <div className="">
                {/* <CheckIcon className="size-5 ms-3 text-green-600" /> */}
                <RadialProgress totalSteps={3} currentStep={taskCount} />
            </div>
        </div>
    );
};
const classNames = (...classes: (string | boolean | undefined | null)[]) => {
    return classes.filter(Boolean).join(' ');
};

// --- Constants (Unchanged as requested by user) ---
const RADIUS = 10;
const STROKE_WIDTH = 9;
const VIEWBOX_SIZE = 30; // The SVG coordinate space
const CENTER_COORDINATE = VIEWBOX_SIZE / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

interface RadialProgressProps {
    totalSteps: number;
    currentStep?: number;
}

const RadialProgress: React.FC<RadialProgressProps> = ({ totalSteps, currentStep = 0 }) => {
    const effectiveStep = Math.max(1, currentStep);

    const isComplete = effectiveStep >= totalSteps;

    const { percentage, strokeDashoffset } = useMemo(() => {
        const calculatedPercentage = Math.floor((effectiveStep / totalSteps) * 100);
        const offset = CIRCUMFERENCE - (calculatedPercentage / 100) * CIRCUMFERENCE;
        return { percentage: calculatedPercentage, strokeDashoffset: offset };
    }, [effectiveStep, totalSteps]);

    const progressColor = isComplete ? 'text-green-500' : percentage >= 50 ? 'text-amber-500' : 'text-amber-500';

    return (
        <div className="flex flex-col items-center">
            <div className="w-6 h-6 flex items-center justify-center">
                {isComplete ? (
                    <CheckCircleIcon strokeWidth={2.5} className="size-24 text-green-600" />
                ) : (
                    <svg
                        className={classNames(
                            'w-6 h-6 transform -rotate-90 transition-all duration-500',
                            progressColor
                        )}
                        viewBox={`0 0 ${VIEWBOX_SIZE} ${VIEWBOX_SIZE}`}
                    >
                        <circle
                            className="text-gray-200"
                            strokeWidth={STROKE_WIDTH}
                            stroke="currentColor"
                            fill="transparent"
                            r={RADIUS}
                            cx={CENTER_COORDINATE}
                            cy={CENTER_COORDINATE}
                        />

                        <circle
                            className="transition-all duration-500 ease-out"
                            strokeWidth={STROKE_WIDTH}
                            strokeDasharray={CIRCUMFERENCE}
                            strokeDashoffset={strokeDashoffset}
                            stroke="currentColor"
                            strokeLinecap="round"
                            fill="transparent"
                            r={RADIUS}
                            cx={CENTER_COORDINATE}
                            cy={CENTER_COORDINATE}
                        />
                    </svg>
                )}
            </div>

            <div className="mt-1 whitespace-nowrap">
                {isComplete ? (
                    <span className="text-[10px] text-green-600 font-bold leading-none">Done!</span>
                ) : (
                    <span
                        className={classNames(
                            `text-[10px] font-extrabold leading-none`,
                            progressColor.replace('text', 'text-')
                        )}
                        style={{ fontSize: '10px' }}
                    >
                        {percentage}%
                    </span>
                )}
            </div>
        </div>
    );
};

export default AdvisorsNavigation;
