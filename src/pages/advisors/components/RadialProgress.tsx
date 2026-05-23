import { CheckCircleIcon } from '@heroicons/react/16/solid';
import { forwardRef, useImperativeHandle, useMemo, useState } from 'react';

export interface ProgressRef {
    increment: () => void;
    decrement: () => void;
    getCurrentStep: () => number;
}

interface RadialProgressProps {
    TOTAL_STEPS: number;
}

const RADIUS = 60;
const STROKE_WIDTH = 12;
const VIEWBOX_SIZE = 200;
const CENTER_COORDINATE = VIEWBOX_SIZE / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const RadialProgress = forwardRef<ProgressRef, RadialProgressProps>(({ TOTAL_STEPS }, ref) => {
    const [currentStep, setCurrentStep] = useState(1);

    const increment = () => {
        setCurrentStep((prev) => Math.min(prev + 1, TOTAL_STEPS));
    };

    const decrement = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 1));
    };

    const getCurrentStep = () => currentStep;

    useImperativeHandle(ref, () => ({
        increment,
        decrement,
        getCurrentStep,
    }));

    const { percentage, strokeDashoffset } = useMemo(() => {
        const calculatedPercentage = Math.floor((currentStep / TOTAL_STEPS) * 100);
        const offset = CIRCUMFERENCE - (calculatedPercentage / 100) * CIRCUMFERENCE;
        return { percentage: calculatedPercentage, strokeDashoffset: offset };
    }, [currentStep, TOTAL_STEPS]);

    const progressColor =
        currentStep === TOTAL_STEPS ? 'text-green-500' : percentage >= 50 ? 'text-blue-500' : 'text-indigo-500';

    return (
        <div className="flex justify-center relative">
            <svg
                className={`w-48 h-48 transform -rotate-90 transition-all duration-500 ${progressColor}`}
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

export default RadialProgress;
