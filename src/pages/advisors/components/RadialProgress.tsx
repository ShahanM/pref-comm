import { CheckCircleIcon } from '@heroicons/react/16/solid';
import clsx from 'clsx';
import React, { useMemo } from 'react';

interface RadialProgressProps {
    totalSteps: number;
    currentStep?: number;
    className?: string;
}

const RADIUS = 12;
const STROKE_WIDTH = 3;
const VIEWBOX_SIZE = 30;
const CENTER_COORDINATE = VIEWBOX_SIZE / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const RadialProgress: React.FC<RadialProgressProps> = ({ totalSteps, currentStep = 0, className }) => {
    const effectiveStep = Math.max(0, currentStep);
    const isComplete = effectiveStep >= totalSteps;

    const { percentage, strokeDashoffset } = useMemo(() => {
        const calculatedPercentage = Math.floor((effectiveStep / totalSteps) * 100);
        const offset = CIRCUMFERENCE - (calculatedPercentage / 100) * CIRCUMFERENCE;
        return { percentage: calculatedPercentage, strokeDashoffset: offset };
    }, [effectiveStep, totalSteps]);

    const progressColor = isComplete ? 'text-green-500' : 'text-amber-500';

    return (
        <div className={clsx('flex flex-col items-center', className)}>
            <div className="w-8 h-8 flex items-center justify-center relative">
                {isComplete ? (
                    <CheckCircleIcon strokeWidth={2.5} className="w-8 h-8 text-green-600 absolute" />
                ) : (
                    <svg
                        className={clsx(
                            'w-8 h-8 transform -rotate-90 transition-all duration-500 absolute',
                            progressColor
                        )}
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
                )}
            </div>

            <div className="mt-1 whitespace-nowrap">
                {isComplete ? (
                    <span className="text-[10px] text-green-600 font-bold leading-none">Done!</span>
                ) : (
                    <span className={clsx('text-[10px] font-extrabold leading-none', progressColor)}>
                        {percentage}%
                    </span>
                )}
            </div>
        </div>
    );
};

export default RadialProgress;
