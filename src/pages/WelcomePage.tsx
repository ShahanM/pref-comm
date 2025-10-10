import { useMutation } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParticipant, useStudy } from 'rssa-api';
import ContinueFormModal from '../components/ContinueFormModal';
import { useStudyConfig } from '../hooks/useStudyConfig';
import Header from '../layouts/StudyHeader';
import WelcomeFooter from '../layouts/WelcomeFooter';

export interface ResumePayload {
    resume_code: string;
}
export interface ResumeResponse {
    current_step_id: string;
    current_page_id: string;
    token: string;
}

const WelcomePage: React.FC<{ isStudyReady: boolean; onStudyStart: () => void }> = ({ isStudyReady, onStudyStart }) => {
    const [showCodeForm, setShowCodeForm] = useState<boolean>(false);

    const { studyApi } = useStudy();
    const { setJwt } = useParticipant();
    const studyId = useMemo(() => studyApi.getStudyId(), [studyApi]);

    const { data: config } = useStudyConfig(studyId!);

    const navigate = useNavigate();

    const resumeMutation = useMutation({
        mutationFn: (resumeCode: string) => {
            return studyApi.post<ResumePayload, ResumeResponse>(`studies/${studyId}/resume`, {
                resume_code: resumeCode,
            });
        },
        onSuccess: (data: ResumeResponse) => {
            setJwt(data.token);
            const stepFromConfig = config?.steps.find((step) => step.step_id === data.current_step_id);
            if (stepFromConfig) navigate(stepFromConfig.path);
            else throw new Error('Something went wrong. Could not resolve resume path.');
        },
        onError: (error) => {
            console.error('Resume failed:', error.message);
        },
    });

    return (
        <div className="p-5 m-5">
            <Header
                title={'Welcome!'}
                content={
                    'Thank you for participating in The Peer Recommendation Platform study. Your involvement is crucial for our research.'
                }
            />
            <ContinueFormModal
                isOpen={showCodeForm}
                onClose={() => setShowCodeForm(false)}
                title="Resume previous session"
                onSubmit={(code) => resumeMutation.mutate(code)}
                isSubmitting={resumeMutation.isPending}
                submitButtonText="Submit"
            />
            <div className="m-3 p-5 text-left rounded-3">
                <h3>What to expect?</h3>
                <h4 className="mt-3">Consent Form:</h4>
                <ul className="list-disc list-inside">
                    <li>Begin by reviewing and signing the consent form.</li>
                    <li>Your participation is voluntary, and you can withdraw at any time.</li>
                </ul>
                <h4 className="mt-3">Pre-Survey:</h4>
                <ul className="list-disc list-inside">
                    <li>Complete a brief pre-survey to help us understand your background and preferences.</li>
                    <li>This will take approximately 10 to 15 minutes.</li>
                </ul>
                <h4 className="mt-3">Introduction to The Peer Recommendation Platform:</h4>
                <ul className="list-disc list-inside">
                    <li>
                        Learn about The Peer Recommendation Platform, our innovative community based movie recommender
                        system.
                    </li>
                    <li>Understand its purpose and how it will assist you throughout the study.</li>
                </ul>
                <h4 className="mt-3">Complete the Study:</h4>
                <ul className="list-disc list-inside">
                    <li>Navigate through the system following the guided steps.</li>
                    <li>Engage with the features and provide feedback as prompted.</li>
                </ul>
                <h4 className="mt-3">Post-Survey:</h4>
                <ul className="list-disc list-inside">
                    <li>After completing the study steps, you will be directed to a post-survey.</li>
                    <li>
                        Your feedback will be invaluable for improving the system and understanding your experience.
                    </li>
                </ul>

                <p className="mt-3">
                    We appreciate your time and insights. <strong>Let's get started!</strong>
                </p>
            </div>
            <WelcomeFooter
                onStudyStart={onStudyStart}
                onStudyContinue={setShowCodeForm}
                disabled={!isStudyReady}
                text={'Start study'}
            />
        </div>
    );
};

export default WelcomePage;
