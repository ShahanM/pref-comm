import { useCallback, useEffect, useState } from 'react';
import { RETRY_DELAYS_MS } from '../utils/constants';

interface UseRetryOptions {
	onRetry: () => void;
	maxAttempts?: number;
}

interface UseRetryResult {
	isRetrying: boolean;
	retryAttempt: number;
	triggerRetry: () => void;
	resetRetry: () => void;
	hasReachedMaxAttempts: boolean;
}


export const useRetry = ({ onRetry, maxAttempts = RETRY_DELAYS_MS.length }: UseRetryOptions): UseRetryResult => {
	const [retryAttempt, setRetryAttempt] = useState(0);
	const [isRetrying, setIsRetrying] = useState(false);
	const [hasReachedMaxAttempts, setHasReachedMaxAttempts] = useState(false);

	const triggerRetry = useCallback(() => {
		if (retryAttempt < maxAttempts) {
			setIsRetrying(true);
			setHasReachedMaxAttempts(false);
		} else {
			setHasReachedMaxAttempts(true);
			setIsRetrying(false);
			console.warn("Max retry attempts reached. Please refresh to try again.");
		}
	}, [retryAttempt, maxAttempts]);

	const resetRetry = useCallback(() => {
		setRetryAttempt(0);
		setIsRetrying(false);
		setHasReachedMaxAttempts(false);
	}, []);

	useEffect(() => {
		if (isRetrying && !hasReachedMaxAttempts) {
			const nextDelay = RETRY_DELAYS_MS[retryAttempt];

			if (nextDelay !== undefined) {
				console.log(`Retrying fetch in ${nextDelay / 1000} seconds... (Attempt ${retryAttempt + 1})`);
				const timerId = setTimeout(() => {
					setRetryAttempt(prev => prev + 1);
					setIsRetrying(false);
					onRetry();
				}, nextDelay);

				return () => clearTimeout(timerId);
			} else {
				setHasReachedMaxAttempts(true);
				setIsRetrying(false);
				console.warn("Max retry attempts reached. Please refresh to try again.");
			}
		}
	}, [isRetrying, retryAttempt, hasReachedMaxAttempts, onRetry]);

	return { isRetrying, retryAttempt, triggerRetry, resetRetry, hasReachedMaxAttempts };
};