import React from 'react';
import { AdvisorSelectionProvider } from '../../contexts/advisorSelectionContext';
import AdvisorsNavigation from './components/AdvisorsNavigation';
import AdvisorsWidget from './components/AdvisorsWidget';

const AdvisorsPageContent: React.FC = () => {
    return (
        <div className="content-center">
            <div className="flex mb-3">
                <AdvisorsNavigation recommendationType="baseline" />
                <AdvisorsWidget />
            </div>
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
