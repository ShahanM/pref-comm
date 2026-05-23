import React, { useCallback, useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { useLocation, useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { CurrentStep, Participant, StudyStep, useStudy } from 'rssa-api';
import { participantState, studyStepState } from '../state/studyState';
import Footer from '../widgets/Footer';
import Header from '../widgets/Header';
import MovieGrid from '../widgets/moviegrid/MovieGrid';
import { MovieRating } from '../widgets/moviegrid/moviegriditem/MovieGridItem.types';
import { StudyPageProps } from './StudyPage.types';


const MovieRatingPage: React.FC<StudyPageProps> = ({
	next,
	checkpointUrl,
	onStepUpdate,
	sizeWarning
}) => {
	const itemsPerPage = 24;
	const minRatingCount = 10;


	const participant: Participant | null = useRecoilValue(participantState);
	const studyStep: StudyStep | null = useRecoilValue(studyStepState);

	const { studyApi } = useStudy();
	const navigate = useNavigate();
	const location = useLocation();

	const [buttonDisabled, setButtonDisabled] = useState(true);
	const [loading, setLoading] = useState(false);
	const [ratedMovies, setRatedMovies] = useState<MovieRating[]>([]);


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
		if (ratedMovies.length < minRatingCount) {
			console.warn(`Please rate at least ${minRatingCount} movies.`);
		}
		setLoading(true);
		setButtonDisabled(true);

		try {
			const nextRouterStep = await studyApi.post<CurrentStep, StudyStep>('studies/steps/next', {
				current_step_id: participant.current_step
			});
			onStepUpdate(nextRouterStep, participant, next);
			localStorage.setItem('ratedMoviesData', JSON.stringify(ratedMovies));
		} catch (error) {
			console.error("Error fetching next step:", error);
		} finally {
			setLoading(false);
		}

	}, [participant, studyStep, ratedMovies, studyApi, next, onStepUpdate]);

	useEffect(() => {
		setButtonDisabled(ratedMovies.length < minRatingCount);
	}, [ratedMovies])


	if (!participant || !studyStep) {
		return <div>Loading study data...</div>;
	}

	return (
		<Container>
			<Row>
				<Header title={studyStep?.name} content={studyStep?.description} />
			</Row>
			{sizeWarning ? <Row className="size-error-overlay">Nothing to display</Row> :
				<Row>
					<MovieGrid
						dataCallback={setRatedMovies}
						itemsPerPage={itemsPerPage} />
				</Row>
			}
			<Row>
				<RankHolder count={ratedMovies.length} max={minRatingCount} />
				<Footer callback={handleNextBtn} disabled={buttonDisabled}
					loading={loading} />
			</Row>
		</Container>
	);
}


interface RankHolderProps {
	count: number;
	max: number;
}


const RankHolder: React.FC<RankHolderProps> = ({ count, max }) => {
	return (
		<div className="rankHolder">
			<span>Rated Movies: </span>
			<span><i>{count}</i></span>
			<span><i>of {max}</i></span>
		</div>
	)
}

export default MovieRatingPage;