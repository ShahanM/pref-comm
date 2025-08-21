import { Participant, StudyStep } from 'rssa-api';

interface BaseStudyPageProps {
	next: string;
}

export interface StudyPageProps extends BaseStudyPageProps {
	navigateToNextStep: (next: string) => void;
}


export interface InitStudyPageProps extends BaseStudyPageProps {
	setNewParticipant: (newParticipant: Participant) => void;
	onStepUpdate: (nextStep: StudyStep, UpdatedParticipant: Participant, referrer: string) => void;
}


export interface FinalStudyPageProps extends BaseStudyPageProps {
	onStudyDone: () => void;
}