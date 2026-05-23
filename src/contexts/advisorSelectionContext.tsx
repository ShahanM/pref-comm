import { useState, type ReactNode } from 'react';
import { AdvisorSelectionContext } from '../hooks/useAdvisorSelection';
import type { AdvisorProfile } from '../types/preferenceCommunity.types';

export const AdvisorSelectionProvider = <T extends AdvisorProfile>({ children }: { children: ReactNode }) => {
    const [selectedAdvisor, setSelectedAdvisor] = useState<T | undefined>(undefined);
    const value = { selectedAdvisor, setSelectedAdvisor };

    return <AdvisorSelectionContext.Provider value={value}>{children}</AdvisorSelectionContext.Provider>;
};
