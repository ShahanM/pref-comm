import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useStudy } from 'rssa-api';
import LoadingScreen from '../components/loadingscreen/LoadingScreen';
import { useNextButtonControl } from '../hooks/useNextButtonControl';
import { usePageCompletion } from '../hooks/usePageCompletion';
import { useStepCompletion } from '../hooks/useStepCompletion';
import SurveyTemplate from '../layouts/templates/SurveyTemplate';
import type { SurveyPageType } from '../types/rssa.types';
import type { StudyLayoutContextType } from '../types/study.types';

const SurveyPage: React.FC = () => {
    const { studyStep, resetNextButton } = useOutletContext<StudyLayoutContextType>();
    const { studyApi } = useStudy();
    const [currentPageId, setCurrentPageId] = useState<string | null>(null);
    const { setIsStepComplete } = useStepCompletion();
    const { isPageComplete } = usePageCompletion();
    const { setButtonControl } = useNextButtonControl();

    useEffect(() => {
        if (studyStep.survey_api_root) setCurrentPageId(studyStep.survey_api_root);
    }, [studyStep.survey_api_root]);

    const {
        data: currentPage,
        isLoading,
        error,
    } = useQuery({
        queryKey: ['surveyPage', currentPageId],
        queryFn: () => studyApi.get<SurveyPageType>(`pages/${currentPageId}`),
        enabled: !!currentPageId,
        refetchOnWindowFocus: false,
    });
    useEffect(() => {
        if (!currentPage) return;
        if (currentPage.next) {
            setButtonControl({
                label: 'Continue',
                action: () => setCurrentPageId(currentPage.next),
                isDisabled: !isPageComplete,
            });
        } else {
            if (isPageComplete) {
                resetNextButton();
                setIsStepComplete(true);
            }
        }
        return () => {
            resetNextButton();
        };
    }, [isPageComplete, setButtonControl, resetNextButton, currentPage, setIsStepComplete]);

    if (!currentPage) {
        return <LoadingScreen loading={true} message="Loading survey page..." />;
    }
    console.log('SurveyPage', currentPage, isPageComplete);
    return (
        <div className="flex justify-content-evenly">
            <div className="">
                <SurveyTemplate surveyPage={currentPage} />
            </div>
            <div className="content-center"></div>
        </div>
    );
};

export default SurveyPage;
