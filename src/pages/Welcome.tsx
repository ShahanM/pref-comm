import { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

import { useLocation, useNavigate } from 'react-router-dom';
import {
  CurrentStep, NewParticipant, Participant, StudyStep,
  useStudy
} from 'rssa-api';
import { InitStudyPageProps } from './StudyPage.types';

import { useRecoilValue } from 'recoil';
import { studyStepState } from '../state/studyState';
import Footer from '../widgets/Footer';
import InformedConsentModal from '../widgets/dialogs/informedConsent';
import HeaderJumbotron from '../widgets/headerJumbotron';

const Welcome: React.FC<InitStudyPageProps> = ({
  next,
  checkpointUrl,
  setNewParticipant,
  onStepUpdate }) => {

  const studyStep: StudyStep | null = useRecoilValue(studyStepState);
  const [show, setShowInformedConsent] = useState<boolean>(false);

  const { studyApi } = useStudy();
  const navigate = useNavigate();
  const location = useLocation();

  const showInformedConsent = () => { setShowInformedConsent(!show); }

  useEffect(() => {
    if (checkpointUrl !== '/' && checkpointUrl !== location.pathname) {
      navigate(checkpointUrl);
    }
  }, [checkpointUrl, location.pathname, navigate]);

  const consentCallbackHandler = async (consent: boolean) => {
    if (consent && studyStep) {
      try {
        const response = await studyApi.post<NewParticipant, Participant>('participants/', {
          study_id: studyStep.study_id,
          external_id: 'test_user', // FIXME: change to actual platform id
          participant_type: '149078d0-cece-4b2c-81cd-a7df4f76d15a', // FIXME: use this as part of the environment variables and apiConfig
          current_step: studyStep.id,
          current_page: null
        });
        console.log("Participant created successfully:", response);
        setNewParticipant(response);
        const nextStep: StudyStep = await studyApi.post<CurrentStep, StudyStep>('studies/steps/next', {
          current_step_id: response.current_step
        });
        onStepUpdate(nextStep, response, next);
        navigate(next);
      } catch (error) {
        console.error("Error creating participant or updating step", error);
      }
    }
    setShowInformedConsent(false);
  }



  return (
    <Container>
      <Row>
        <HeaderJumbotron title="Welcome!"
          content="Thank you for participating in The Peer Recommendation Platform study. Your involvement is crucial for our research." />
      </Row>

      {/* {showNoConsentMessage && (
        <Row>
          <Alert variant="warning">
            You have chosen not to consent to the study. If you change your mind, you can click the "Get started" button again to review the consent form.
          </Alert>
        </Row>
      )} */}

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
      />
      <Row>
        <Footer callback={showInformedConsent} text={"Get Started"}
          disabled={!studyStep} />
      </Row>
    </Container>
  )
}

export default Welcome;