import { createContext, type Dispatch, type RefObject, type SetStateAction } from 'react';

// Define the type for the action function and the label
export interface NextButtonControl {
    label: string;
    action: () => void; // The function to execute on click
    isDisabled: boolean; // Whether the button is grayed out
}

export const defaultControl: NextButtonControl = {
    label: 'Continue to Next Step',
    action: () => console.log('Executing Default Global Navigation...'),
    isDisabled: false,
};
// 1. Define the type for the context value. It holds a ref to the button element.
export interface NextButtonContextType {
    setButtonControl: Dispatch<SetStateAction<NextButtonControl>>;
    buttonControl: NextButtonControl;
    // The ref object itself (pointing to the button)
    // nextButtonRef: RefObject<HTMLButtonElement | null>;
    // A function to set the ref (used in the parent layout)
    // setNextButtonRef: (ref: HTMLButtonElement | null) => void;
}

// 2. Create the context with an initial null value.
export const NextButtonContext = createContext<NextButtonContextType | null>(null);
