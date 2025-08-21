import { useCallback, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { Participant, RssaClientInterface, StudyStep } from "rssa-api";
import { participantState } from '../states/participantState';
import { studyStepState } from "../states/studyStepState";
import { useRetry } from "./useRetry";

interface UseStudyDataResult {
	isLoading: boolean;
	studyError: boolean;
	participant: Participant | null;
	studyStep: StudyStep | null;
	checkpointUrl: string;
	setParticipant: (participant: Participant) => void;
	handleStepUpdate: (step: StudyStep, currentParticipant: Participant, referrer: string) => void;
}

export const useStudyData = (studyApi: RssaClientInterface): UseStudyDataResult => {
	const [participant, setParticipant] = useRecoilState(participantState);
	const [studyStep, setStudyStep] = useRecoilState(studyStepState);
	const [checkpointUrl, setCheckpointUrl] = useState<string>('/');
	const [studyError, setStudyError] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	const triggerFetch = useCallback(() => {
		fetchInitialData();
	}, []);

	const { triggerRetry, resetRetry, hasReachedMaxAttempts } = useRetry({ onRetry: triggerFetch });

	const loadCachedData = useCallback(() => {
		const participantCache = localStorage.getItem('participant');
		const studyStepCache = localStorage.getItem('studyStep');
		const cachedCheckpointUrl = localStorage.getItem('lastUrl');

		if (participantCache && studyStepCache) {
			try {
				const cparticipant = JSON.parse(participantCache);
				const cstudyStep = JSON.parse(studyStepCache);

				setParticipant(cparticipant);
				studyApi.setParticipantId(cparticipant.id);
				setStudyStep(cstudyStep);
				if (cachedCheckpointUrl) { setCheckpointUrl(cachedCheckpointUrl); }
				setStudyError(false);
				return true;
			} catch (error) {
				console.error("Error parsing cached data", error);
				setStudyError(true);
				localStorage.removeItem('participant');
				localStorage.removeItem('studyStep');
				localStorage.removeItem('lastUrl');
				return false;
			}
		}
		return false;
	}, [setParticipant, setStudyStep, studyApi]); // studyApi is stable here

	const fetchInitialData = useCallback(async () => {
		if (hasReachedMaxAttempts) {
			console.warn("Not attempting fetch: Max retry attempts reached.");
			setIsLoading(false);
			return;
		}
		setIsLoading(true);
		setStudyError(false);

		try {
			const firstStep = await studyApi.get<StudyStep>('studies/steps/first');
			setStudyStep(firstStep);
			setStudyError(false);
			resetRetry();
		} catch (error) {
			console.error("Error fetching initial study data:", error);
			setStudyError(true);
			triggerRetry();
		} finally {
			setIsLoading(false);
		}
	}, [studyApi, setStudyStep, resetRetry, triggerRetry, hasReachedMaxAttempts]);


	useEffect(() => {
		if (participant && studyStep) {
			setIsLoading(false);
			return;
		}

		if (!isLoading && !hasReachedMaxAttempts) {
			if (!loadCachedData()) {
				fetchInitialData();
			}
		} else if (hasReachedMaxAttempts) {
			setIsLoading(false);
		}
	}, [participant, studyStep, isLoading, hasReachedMaxAttempts, loadCachedData, fetchInitialData]);

	const handleStepUpdate = useCallback((step: StudyStep, currentParticipant: Participant, referrer: string) => {
		const newParticipant: Participant = {
			...currentParticipant,
			current_step: step.id,
		};
		try {
			studyApi.put('participants/', newParticipant).then(() => {
				localStorage.setItem('participant', JSON.stringify(newParticipant));
				localStorage.setItem('studyStep', JSON.stringify(step));
				localStorage.setItem('lastUrl', referrer);
				setParticipant(newParticipant);
				setStudyStep(step);
				setCheckpointUrl(referrer);
				studyApi.setParticipantId(newParticipant.id);
			}).catch(error => {
				console.error("Error updating participant", error);

				setStudyError(true);
			});
		} catch (error) {
			console.error("Synchronous error updating participant", error);
			setStudyError(true);
		}
	}, [studyApi, setParticipant, setStudyStep, setCheckpointUrl]);


	return {
		isLoading,
		studyError,
		participant,
		setParticipant,
		studyStep,
		checkpointUrl,
		handleStepUpdate,
	};
};