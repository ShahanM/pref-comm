import { createContext, useContext } from 'react';
import type { AdvisorProfile } from '../types/preferenceCommunity.types';

export interface AdvisorSelectionContextType<T extends AdvisorProfile> {
    selectedAdvisor: T | undefined;
    setSelectedAdvisor: (item: T | undefined) => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const AdvisorSelectionContext = createContext<AdvisorSelectionContextType<any> | undefined>(undefined);
export const useAdvisorSelection = <T extends AdvisorProfile>() => {
    const context = useContext(AdvisorSelectionContext);
    if (context === undefined) {
        throw new Error('useAdvisorSelection must be used within a AdvisorSelectionProvider');
    }
    return context as AdvisorSelectionContextType<T>;
};
