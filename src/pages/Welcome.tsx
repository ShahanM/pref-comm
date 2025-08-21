import { useState } from 'react';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

import {
	CurrentStep, NewParticipant, Participant, StudyStep,
	useStudy
} from 'rssa-api';
import { StudyPageProps } from './StudyPage.types';

import { useRecoilState, useSetRecoilState } from 'recoil';
import { participantState } from '../states/participantState';
import { studyStepState } from '../states/studyStepState';
import Footer from '../widgets/Footer';
import InformedConsentModal from '../widgets/dialogs/informedConsent';

const Welcome: React.FC<StudyPageProps> = ({ next, navigateToNextStep }) => {

	const { studyApi } = useStudy();
// TODO: FIX THE STUDY STEP FLOW: Ideally we want to fetch step each time and not load from storage
	const setParticipant = useSetRecoilState(participantState);
	const [studyStep, setStudyStep] = useRecoilState(studyStepState);

	const [show, setShowInformedConsent] = useState<boolean>(false);

	const showInformedConsent = () => { setShowInformedConsent(!show); }

	const consentCallbackHandler = async (consent: boolean) => {
		if (consent && studyStep) {
			try {
				const response = await studyApi.post<NewParticipant, Participant>('participants/', {
					external_id: 'test_user', // FIXME: change to actual platform id
					participant_type: '149078d0-cece-4b2c-81cd-a7df4f76d15a', // FIXME: use this as part of the environment variables and apiConfig
					current_step: studyStep.id,
					current_page: null
				});
				setParticipant(response);

				const nextStep: StudyStep = await studyApi.post<CurrentStep, StudyStep>('studies/steps/next', {
					current_step_id: response.current_step
				});

				const newParticipant: Participant = {
					...response,
					current_step: nextStep.id,
				};
				await studyApi.put('participants/', newParticipant);

				setParticipant(newParticipant);
				setStudyStep(nextStep);
				navigateToNextStep(next);
			} catch (error) {
				console.error("Error creating participant or updating step", error);
			}
		}
		setShowInformedConsent(false);
	}

	return (
		<Container>
			<Row>
				<Card bg="light">
					<Card.Body className="instructionblurb">
						<Card.Title>What to expect?</Card.Title>
						<p>
							<em>Consent Form:</em>
						</p>
						<ul>
							<li>
								Begin by reviewing and signing the consent form.
							</li>
							<li>
								Your participation is voluntary, and you can withdraw at any time.
							</li>
						</ul>
						<p>
							<em>Pre-Survey:</em>
						</p>
						<ul>
							<li>
								Complete a brief pre-survey to help us understand your background and preferences.
							</li>
							<li>
								This will take approximately 10 to 15 minutes.
							</li>
						</ul>
						<p>
							<em>Introduction to The Peer Recommendation Platform:</em>
						</p>
						<ul>
							<li>
								Learn about The Peer Recommendation Platform, our innovative community based movie recommender system.
							</li>
							<li>
								Understand its purpose and how it will assist you throughout the study.
							</li>
						</ul>
						<p>
							<em>Complete the Study:</em>
						</p>
						<ul>
							<li>
								Navigate through the system following the guided steps.
							</li>
							<li>
								Engage with the features and provide feedback as prompted.
							</li>
						</ul>
						<p>
							<em>Post-Survey:</em>
						</p>
						<ul>
							<li>
								After completing the study steps, you will be directed to a post-survey.
							</li>
							<li>
								Your feedback will be invaluable for improving the system and understanding your experience.
							</li>
						</ul>

						<p>
							We appreciate your time and insights. <strong>Let's get started!</strong>
						</p>
					</Card.Body>
				</Card>
			</Row>

			<InformedConsentModal
				show={show}
				consentCallback={consentCallbackHandler}
				onClose={setShowInformedConsent}
			/>
			<Footer callback={showInformedConsent} text={"Get Started"} disabled={!studyStep} />
		</Container>
	)
}

export default Welcome;