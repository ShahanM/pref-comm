import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { useStudy } from 'rssa-api';
import { AdvisorSelectionProvider } from '../../contexts/advisorSelectionContext';
import type { RatedItem } from '../../types/rssa.types';
import { type StudyLayoutContextType } from '../../types/study.types';
import LoadingScreen from '../../widgets/loadingscreen/LoadingScreen';
import AdvisorsNavigation from './components/AdvisorsNavigation';
import AdvisorsWidget from './components/AdvisorsWidget';
import './components/css/AdvisorsComponent.css';

const AdvisorsPageContent: React.FC = () => {
    const { studyStep } = useOutletContext<StudyLayoutContextType>();
    const { studyApi } = useStudy();

    const { data: ratedMovies, isLoading: ratedMoviesLoading } = useQuery({
        queryKey: ['movieRatings'],
        queryFn: async () => await studyApi.get<RatedItem[]>(`responses/ratings/`),
        staleTime: 1000 * 60 * 5,
    });
    return (
        <div className="content-center">
            {ratedMoviesLoading ? (
                <LoadingScreen
                    loading={ratedMoviesLoading}
                    message={'Please wait while the system prepares your recommendations'}
                    byline={'This may take a while.'}
                />
            ) : (
                <div className="flex mb-3">
                    <AdvisorsNavigation ratedItems={ratedMovies!} recommendationType="baseline" />
                    <AdvisorsWidget />
                </div>
            )}
        </div>
    );
};

const AdvisorsPage = () => {
    return (
        <AdvisorSelectionProvider>
            <AdvisorsPageContent />
        </AdvisorSelectionProvider>
    );
};

export default AdvisorsPage;
