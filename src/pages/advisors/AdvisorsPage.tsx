import React, { useCallback, useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import { useNavigate } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from "recoil";
import {
	CurrentStep,
	Participant, StudyStep,
	useStudy
} from "rssa-api";
import { advisorsMapState } from "../../states/advisorState";
import { participantState } from '../../states/participantState';
import { ratedMoviesState } from "../../states/ratedMoviesState";
import { studyStepState } from "../../states/studyStepState";
import Footer from "../../widgets/Footer";
import LoadingScreen from '../../widgets/loadingscreen/LoadingScreen';
import { MovieRating } from "../../widgets/moviegrid/moviegriditem/MovieGridItem.types";
import { StudyPageProps } from '../StudyPage.types';
import { AdvisorProfile } from "./Advisor.types";
import AdvisorsWidget from "./components/AdvisorsWidget";
import "./components/css/AdvisorsComponent.css";


// Note: The state of advisors is maintained at runtime and is not persisted in local storage. Also, although the
// accept/reject and user response is stored in the database, it is only unidirectional. Meaning, refreshing the page
// will reset the states and the participant will have to re-accept/reject and respond to the advisors again. As such,
// it is possible to have multiple responses to the same advisor.

interface LocationState {
	ratedMovies?: { [key: number]: MovieRating };
}

type AdvisorRecItemDetail = {
	id: string; // This will likely be a UUID string
	// TODO: Add the rest of the fields by checking the API response
}

type AdvisorRequestObj = {
	// TODO: Add the rest of the fields by checking the API request
}

const AdvisorsPage: React.FC<StudyPageProps> = ({ next, navigateToNextStep }) => {

	// const location = useLocation();
	// const stateData = location.state as LocationState;

	const { studyApi } = useStudy();
	const navigate = useNavigate();

	const [advisors, setAdvisors] = useRecoilState(advisorsMapState);

	const [participant, setParticipant] = useRecoilState(participantState);
	const [studyStep, setStudyStep] = useRecoilState(studyStepState);

	const ratedMovies: Map<string, MovieRating> = useRecoilValue(ratedMoviesState);

	const [loading, setLoading] = useState(false);
	const [nextButtonDisabled, setNextButtonDisabled] = useState(true);

	const getRecommendations = useCallback(async () => {
		if (!participant || !studyStep) {
			console.warn("AdvisorsPage or participant is undefined in getRecommendations.");
			return null;
		}
		setLoading(true);
		try {
			const responseItems: AdvisorProfile[] = await studyApi.post<AdvisorRequestObj, AdvisorProfile[]>(
				"recommendations/advisors/", {
				user_id: participant.id,
				user_condition: participant.condition_id,
				is_baseline: 1, // FIXME: this should be based on the participant condition, not hardcoded
				ratings: [...ratedMovies.values()].map(rating => {
					return { item_id: rating.movielens_id, rating: rating.rating };
				})
			});
			let itemMap = new Map<string, AdvisorProfile>();
			for (let item of responseItems) { itemMap.set(item.id, item); }
			setAdvisors(itemMap);
		} catch (error) {
			console.error("Error fetching recommendations:", error);
		} finally {
			setLoading(false);

		}
	}, [studyApi, participant, studyStep, setAdvisors, ratedMovies]);
	useEffect(() => { getRecommendations(); }, [getRecommendations]);

	useEffect(() => {
		if (advisors.size > 0) {
			const allResponded = Array.from(advisors.values()).every(advisor => advisor.responded);
			setNextButtonDisabled(!allResponded);
		}

	}, [advisors]);

	const handleNextBtn = useCallback(async () => {
		if (!participant || !studyStep) {
			console.error("Participant or study step is not defined.");
			return;
		}
		try {
			const nextStep: StudyStep = await studyApi.post<CurrentStep, StudyStep>('studies/steps/next', {
				current_step_id: participant.current_step
			});
			setStudyStep(nextStep);
			const updatedParticipant: Participant = {
				...participant,
				current_step: nextStep.id,
			};
			await studyApi.put('participants/', updatedParticipant);
			setParticipant(updatedParticipant);
			navigateToNextStep(next);
		} catch (error) {
			console.error("Error fetching next step:", error);
			// Handle error appropriately, e.g., show a notification or alert
		} finally {
			setLoading(false);
		}
	}, [studyApi, participant, next, studyStep, setStudyStep, setParticipant, navigateToNextStep]);

	if (!participant || !studyStep) {
		return <LoadingScreen loading={true} message="Initializing study data..." />;
	}

	return (
		<Container>
			{loading || advisors.size === 0 ?
				<LoadingScreen
					loading={loading || advisors.size === 0}
					message={'Please wait while the system prepares your recommendations'}
					byline={"This may take a while."}
				/>
				:
				<AdvisorsWidget />
			}
			<Footer callback={handleNextBtn} disabled={nextButtonDisabled} text={"Next"} />
		</Container>
	)
}

export default AdvisorsPage;