import React, { useCallback, useEffect, useState } from "react";
import { Row } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import { useLocation, useNavigate } from 'react-router-dom';
import { useRecoilValue } from "recoil";
import {
	CurrentStep,
	Participant, StudyStep,
	useStudy
} from "rssa-api";
import { participantState, studyStepState } from "../../state/studyState";
import Footer from "../../widgets/Footer";
import Header from "../../widgets/Header";
import LoadingScreen from '../../widgets/loadingscreen/LoadingScreen';
import { MovieRating } from "../../widgets/moviegrid/moviegriditem/MovieGridItem.types";
import { StudyPageProps } from '../StudyPage.types';
import { AdvisorProfile } from "./Advisor.types";
import AdvisorsWidget from "./components/AdvisorsWidget";
import "./components/css/AdvisorsComponent.css";


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

const AdvisorsPage: React.FC<StudyPageProps> = ({
	next,
	checkpointUrl,
	onStepUpdate,
	sizeWarning
}) => {

	const participant: Participant | null = useRecoilValue(participantState);
	const studyStep: StudyStep | null = useRecoilValue(studyStepState);

	const { studyApi } = useStudy();
	const navigate = useNavigate();
	const location = useLocation();

	const stateData = location.state as LocationState;
	const [ratedMovies, setRatedMovies] = useState(new Map<string, MovieRating>());

	const [loading, setLoading] = useState(false);
	const [nextButtonDisabled, setNextButtonDisabled] = useState(true);

	const [advisorDetails, setAdvisorDetails] =
		useState<Map<string, AdvisorProfile>>(
			new Map<string, AdvisorProfile>());

	useEffect(() => {
		if (checkpointUrl !== '/' && checkpointUrl !== location.pathname) {
			navigate(checkpointUrl);
		}
	}, [checkpointUrl, location.pathname, navigate]);

	const getRecommendations = useCallback(async (ratings: Map<string, MovieRating>) => {
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
				ratings: [...ratings.values()].map(rating => {
					return {
						item_id: rating.movielens_id,
						rating: rating.rating
					}
				})
			});
			let itemMap = new Map<string, AdvisorProfile>();
			for (let item of responseItems) { itemMap.set(item.id, item); }
			setAdvisorDetails(itemMap);
		} catch (error) {
			console.error("Error fetching recommendations:", error);
		} finally {
			setLoading(false);

		}
	}, [studyApi, participant, studyStep]);

	useEffect(() => {
		if (!participant || !studyStep) {
			console.warn("AdvisorsPage or participant is undefined in useEffect.");
			return;
		}

		if (ratedMovies.size === 0) {
			if (stateData && stateData.ratedMovies) {
				const ratedMoviesData = new Map<string, MovieRating>();
				for (let key in stateData.ratedMovies) {
					let moviedata = stateData.ratedMovies[key];
					ratedMoviesData.set(moviedata.id, moviedata);
				}
				setRatedMovies(ratedMoviesData);
			} else {
				const storedRatedMovies = localStorage.getItem('ratedMoviesData');
				if (storedRatedMovies) {
					try {
						const ratedMovieCache: { [key: string]: MovieRating } = JSON.parse(storedRatedMovies);
						const ratedMovieData = new Map<string, MovieRating>();
						for (let key in ratedMovieCache) {
							const movie = ratedMovieCache[key];
							ratedMovieData.set(movie.id, ratedMovieCache[key]);
						}
						setRatedMovies(ratedMovieData);
					} catch (error) {
						console.error("Error parsing rated movies from local storage:", error);
						// TODO: Clear stored local data and redirect to start of study
						// localStorage.removeItem('ratedMoviesData');
						// navigate('/'); // Example redirection
					}
				} else {
					console.error("No rated movies found in state or local storage.");
					// TODO: Clear stored local data and redirect to start of study
					// localStorage.removeItem('ratedMoviesData');
					// navigate('/'); // Example redirection
				}
			}
		}
		if (ratedMovies.size > 0) {
			getRecommendations(ratedMovies);
		}
	}, [ratedMovies, stateData, getRecommendations, participant, studyStep]);


	const handleNextBtn = useCallback(async () => {
		if (!participant || !studyStep) {
			console.error("Participant or study step is not defined.");
			return;
		}
		try {
			const nextRouteStep: StudyStep = await studyApi.post<CurrentStep, StudyStep>('studies/steps/next', {
				current_step_id: participant.current_step
			});
			onStepUpdate(nextRouteStep, participant, next);
			navigate(next);
		} catch (error) {
			console.error("Error fetching next step:", error);
			// Handle error appropriately, e.g., show a notification or alert
		} finally {
			setLoading(false);
		}
	}, [studyApi, participant, onStepUpdate, next, studyStep, navigate]);

	if (!participant || !studyStep) {
		return <LoadingScreen loading={true} message="Initializing study data..." />;
	}

	return (
		<Container>
			<Row>
				<Header title={studyStep?.name} content={studyStep?.description} />
			</Row>
			{loading || advisorDetails.size === 0 ?
				<LoadingScreen
					loading={loading || advisorDetails.size === 0}
					message={'Please wait while the system prepares your recommendations'}
					byline={"This may take a while."}
				/>
				:
				<AdvisorsWidget
					participantId={participant.id}
					currentAdvisors={advisorDetails}
				/>
			}
			<Row>
				<Footer callback={handleNextBtn} disabled={nextButtonDisabled} text={"Next"} />
			</Row>
		</Container>
	)
}

export default AdvisorsPage;