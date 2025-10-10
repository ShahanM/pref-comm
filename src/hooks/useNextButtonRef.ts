import { useContext } from 'react';
import { NextButtonRefContext } from '../contexts/NextButtonContext';

// 3. Custom hook for consumption
export const useNextButtonRef = () => {
    const context = useContext(NextButtonRefContext);
    if (context === null) {
        throw new Error('useNextButtonRef must be used within a NextButtonRefProvider');
    }
    return context;
};
