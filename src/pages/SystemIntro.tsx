import { useCallback, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { useLocation, useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { CurrentStep, Participant, StudyStep, useStudy } from "rssa-api";
import { participantState, studyStepState } from '../state/studyState';
import HeaderJumbotron from '../widgets/headerJumbotron';
import NextButton from '../widgets/nextButton';
import { StudyPageProps } from "./StudyPage.types";

const SystemIntro: React.FC<StudyPageProps> = ({
    next,
    checkpointUrl,
    onStepUpdate
}) => {

    const participant: Participant | null = useRecoilValue(participantState);
    const studyStep: StudyStep | null = useRecoilValue(studyStepState);

    const { studyApi } = useStudy();
    const navigate = useNavigate();
    const location = useLocation();


    useEffect(() => {
        if (checkpointUrl !== '/' && checkpointUrl !== location.pathname) {
            navigate(checkpointUrl);
        }
    }, [checkpointUrl, location.pathname, navigate]);

    const handleNextBtn = useCallback(async () => {
        if (!participant || !studyStep) {
            console.error("Participant or study step is not defined.");
            return;
        }
        try {

            const nextRouteStep = await studyApi.post<CurrentStep, StudyStep>('studies/steps/next', {
                current_step_id: participant.current_step
            });
            onStepUpdate(nextRouteStep, participant, next)
            navigate(next);
        } catch (error) {
            console.error("Error fetching next step:", error);
            // Handle error, e.g., show a message to the user
        }

    }, [studyApi, participant, studyStep, next, navigate, onStepUpdate]);

    return (
        <Container>
            <Row>
                <HeaderJumbotron title="Introduction to the Peer Recommendation Platform"
                    content="Welcome to the Peer Recommendation Platform" />
            </Row>

            <Row>
                <Card bg="light">
                    <Card.Body className="instructionblurb">
                        <Card.Title>What is the Peer Recommendation Platform?</Card.Title>
                        <p>
                            The Peer Recommendation Platform is a platform where you will get to receive movie recommendations from members of your community and will be invited to give recommendations back.
                        </p>
                        <p>
                            In the system, you will have seven peer recommenders who will remain anonymous and you will be anonymous to them. This will allow you to be free in your exploration of the system as well as in your recommendations.
                        </p>
                    </Card.Body>
                </Card>
            </Row>

            <Row>
                <Card bg="light">
                    <Card.Body className="instructionblurb">
                        <Card.Title>How to navigate the Peer Recommendation Platform:</Card.Title>
                        <ol>
                            <li>
                                First, you will come across a page with a grid of movie posters. Here, you will be asked to rate at least 10 movies that you have watched between 1 and 5 stars. There are a lot more movies than those listed on the first page, so feel free to click on the right hand side arrow to look through our movies.
                            </li>
                            <li>
                                Your peer recommenders will be listed to the left of your screen. Whenever you click on a peer recommender's name or picture, you will see a bit of information on the preferences of the peer recommender, the movie which they recommend you in the middle of the screen as well as the reason why they recommended that movie.
                            </li>
                            <li>
                                To the right of your screen, you will see two buttons (one red (reject) and one green (accept)). If the movie recommended by the peer recommender is a movie that you would like to watch, press the green or accept button; otherwise, press the red button.
                            </li>
                            <li>
                                Once you press one of these buttons, the right side of your screen will turn into fillable fields where you will be asked to enter a movie recommendation for the peer-recommender; you will be asked to enter a movie title as well as why you recommend this movie to the advisor. Your explanation should be at least 10 words long. Once you are finished, you may submit your recommendation and click on the next peer recommender.
                            </li>
                            <li>
                                You must give recommendations to each peer recommender before proceeding to the post-survey.
                            </li>
                        </ol>
                        <p>
                            Happy recommending!
                        </p>
                    </Card.Body>
                </Card>
            </Row>

            <Row>
                <div className="jumbotron jumbotron-footer">
                    <NextButton
                        variant="ers"
                        size="lg"
                        className="footer-btn"
                        onClick={handleNextBtn}
                    >
                        Get started
                    </NextButton>
                </div>
            </Row>
        </Container>
    )
}

export default SystemIntro;