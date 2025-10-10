import { useIsRestoring, useQueryClient } from '@tanstack/react-query';
import { Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useStudy } from 'rssa-api';
import { useStudyConfig } from '../hooks/useStudyConfig';
import StudyLayout from '../layouts/StudyLayout';
// import '../styles/_custom-bootstrap.scss';
// import '../styles/App.css';
// import '../styles/components.css';
import LoadingScreen from '../components/loadingscreen/LoadingScreen';
import type { StudyStep } from '../types/rssa.types';
import { componentMap } from './componentMap';
import WelcomePage from './WelcomePage';

const RouteWrapper: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { studyApi } = useStudy();
    const queryClient = useQueryClient();
    const isRestoring = useIsRestoring();

    const studyId = useMemo(() => studyApi.getStudyId(), [studyApi]);
    if (!studyId) {
        throw new Error('VITE_STUDY_ID is missing. Please ensure it is set in your environment file.');
    }
    const { data: config, isLoading } = useStudyConfig(studyId!);
    const [currentStepData, setCurrentStepData] = useState<StudyStep>();

    console.log('CONFIG', config);

    const loadStepData = useCallback(
        async (stepPath: string, configData: typeof config) => {
            if (!configData) return;

            const stepFromConfig = configData.steps.find((step) => step.path === stepPath);

            if (stepFromConfig && stepFromConfig.step_id !== currentStepData?.id) {
                try {
                    const data = await studyApi.get<StudyStep>(`steps/${stepFromConfig.step_id}`);
                    setCurrentStepData(data);
                } catch (error) {
                    console.error('Failed to load step data:', error);
                }
            }
        },
        [studyApi, currentStepData]
    );

    useEffect(() => {
        if (location.pathname === '/welcome' && config) {
            console.log('Resetting study data and cache upon landing on welcome page.');
            queryClient.clear();
        }
        if (config && config.steps) {
            loadStepData(location.pathname, config);
        }
    }, [location.pathname, config, loadStepData, queryClient]);

    const handleStartStudy = async () => {
        if (!config?.study_id) return;

        try {
            const firstStep = await studyApi.get<StudyStep>(`studies/${config.study_id}/steps/first`);
            if (firstStep) {
                setCurrentStepData(firstStep);
                navigate(firstStep.path);
            }
        } catch (error) {
            console.error('Failed to start study:', error);
        }
    };
    const dynamicRoutes = useMemo(() => {
        if (!config?.steps) return null;

        return config.steps.map(({ step_id, path, component_type }) => {
            const Component = componentMap[component_type];
            return Component ? <Route key={step_id} path={path} element={<Component />} /> : null;
        });
    }, [config?.steps]);

    if (isRestoring) {
        return <div className="p-8 font-semibold">Restoring session...</div>;
    }

    if (isLoading || !config) return <LoadingScreen loading={true} message={'Loading Study Configuration...'} />;

    return (
        <Suspense fallback={<div className="p-8">Loading step component...</div>}>
            <Routes>
                <Route
                    path="/welcome"
                    element={<WelcomePage isStudyReady={!isLoading} onStudyStart={handleStartStudy} />}
                />
                <Route path="/" element={<Navigate to="/welcome" replace />} />
                <Route path="/" element={<StudyLayout stepApiData={currentStepData} />}>
                    {dynamicRoutes}
                </Route>
            </Routes>
        </Suspense>
    );
};

export default RouteWrapper;
