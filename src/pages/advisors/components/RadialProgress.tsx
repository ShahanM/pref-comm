import { CheckCircleIcon, MinusCircleIcon, PlusCircleIcon } from '@heroicons/react/16/solid';
import React, { forwardRef, useImperativeHandle, useMemo, useRef, useState } from 'react';

// --- Type Definitions ---

// 1. Interface for the methods we expose to the parent (the ref handle)
export interface ProgressRef {
    increment: () => void;
    decrement: () => void;
    getCurrentStep: () => number;
}

// 2. Props for the RadialProgress component
interface RadialProgressProps {
    TOTAL_STEPS: number;
}

// --- Constants ---
const RADIUS = 60;
const STROKE_WIDTH = 12;
const VIEWBOX_SIZE = 200;
const CENTER_COORDINATE = VIEWBOX_SIZE / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

// 3. RadialProgress Component (The Child)
// We use forwardRef to receive a ref from the parent
const RadialProgress = forwardRef<ProgressRef, RadialProgressProps>(({ TOTAL_STEPS }, ref) => {
    const [currentStep, setCurrentStep] = useState(1);

    // Define the actual functions that modify the state
    const increment = () => {
        setCurrentStep((prev) => Math.min(prev + 1, TOTAL_STEPS));
    };

    const decrement = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 1));
    };

    const getCurrentStep = () => currentStep;

    // Use useImperativeHandle to expose only the increment/decrement methods
    // and the current step getter via the ref passed from the parent.
    useImperativeHandle(ref, () => ({
        increment,
        decrement,
        getCurrentStep,
    }));

    // Calculate percentage and stroke offset
    const { percentage, strokeDashoffset } = useMemo(() => {
        const calculatedPercentage = Math.floor((currentStep / TOTAL_STEPS) * 100);
        const offset = CIRCUMFERENCE - (calculatedPercentage / 100) * CIRCUMFERENCE;
        return { percentage: calculatedPercentage, strokeDashoffset: offset };
    }, [currentStep, TOTAL_STEPS]);

    // Determine the color class based on progress
    const progressColor =
        currentStep === TOTAL_STEPS ? 'text-green-500' : percentage >= 50 ? 'text-blue-500' : 'text-indigo-500';

    return (
        <div className="flex justify-center relative">
            <svg
                className={`w-48 h-48 transform -rotate-90 transition-all duration-500 ${progressColor}`}
                viewBox={`0 0 ${VIEWBOX_SIZE} ${VIEWBOX_SIZE}`}
            >
                {/* Background Circle */}
                <circle
                    className="text-gray-200"
                    strokeWidth={STROKE_WIDTH}
                    stroke="currentColor"
                    fill="transparent"
                    r={RADIUS}
                    cx={CENTER_COORDINATE}
                    cy={CENTER_COORDINATE}
                />

                {/* Foreground Progress Arc */}
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

            {/* Percentage Text / Completion Icon */}
            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                {currentStep === TOTAL_STEPS ? (
                    <div className="text-green-600 flex flex-col items-center">
                        <CheckCircleIcon className="size-40" strokeWidth={2.5} />
                        <span className="text-lg font-semibold mt-1">Complete!</span>
                    </div>
                ) : (
                    <span className={`text-4xl font-bold ${progressColor.replace('text', 'text-')}`}>
                        {percentage}%
                    </span>
                )}
            </div>
        </div>
    );
});

// 4. App Component (The Parent)
const App: React.FC = () => {
    const TOTAL_STEPS = 10;
    // Create a ref to attach to the child component
    const progressRef = useRef<ProgressRef>(null);
    const [currentStepDisplay, setCurrentStepDisplay] = useState(1);

    // Helper function to update the step display after an action
    const updateStepDisplay = () => {
        if (progressRef.current) {
            setCurrentStepDisplay(progressRef.current.getCurrentStep());
        }
    };

    const handleIncrement = () => {
        progressRef.current?.increment();
        // Use a timeout to allow the state change in the child to propagate
        setTimeout(updateStepDisplay, 50);
    };

    const handleDecrement = () => {
        progressRef.current?.decrement();
        // Use a timeout to allow the state change in the child to propagate
        setTimeout(updateStepDisplay, 50);
    };

    const isComplete = currentStepDisplay === TOTAL_STEPS;
    const isStart = currentStepDisplay === 1;

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-sm bg-white shadow-xl rounded-2xl p-6 transition-all duration-300">
                <h1 className="text-2xl font-extrabold text-gray-800 mb-2 text-center">External Control Progress</h1>
                <p className="text-sm text-gray-500 mb-6 text-center">
                    Current Step: <span className="font-semibold text-indigo-600">{currentStepDisplay}</span> of{' '}
                    {TOTAL_STEPS}
                </p>

                {/* The child component (RadialProgress) is mounted here */}
                <RadialProgress ref={progressRef} TOTAL_STEPS={TOTAL_STEPS} />

                {/* Step Control Buttons (now in the Parent App component) */}
                <div className="flex justify-center space-x-4 mt-8">
                    <button
                        onClick={handleDecrement}
                        disabled={isStart}
                        className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white font-medium rounded-full shadow-lg hover:bg-red-600 transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <MinusCircleIcon className="size-20" />
                        <span>Prev Step</span>
                    </button>

                    <button
                        onClick={handleIncrement}
                        disabled={isComplete}
                        className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white font-medium rounded-full shadow-lg hover:bg-indigo-700 transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <span>Next Step</span>
                        <PlusCircleIcon className="size-20" />
                    </button>
                </div>

                {isComplete && <p className="text-center mt-4 text-green-600 font-bold">Goal Achieved!</p>}
            </div>
        </div>
    );
};

export default RadialProgress;
