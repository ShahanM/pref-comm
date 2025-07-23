import { useCallback, useEffect, useState } from "react";
import { Button, Form, Image, Row } from "react-bootstrap";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { FreeFormTextResponseRequest, Participant, StudyStep, useStudy } from "rssa-api";
import { participantState, studyStepState } from '../../../state/studyState';
import { Movie } from "../../../widgets/moviegrid/moviegriditem/MovieGridItem.types";
import { AdvisorProfile, UserResponseFlag } from "../Advisor.types";
import SearchMovieFormControl from "./SearchMovieFormControl";
import { advisorsMapState } from "../../../state/advisorState";

export interface UserRecommendationFormProps {
	advisor: AdvisorProfile
	// onSuccessfulResponse: (advisorId: string, response: UserResponseFlag) => void
	avatarName: string
}

const RecommendationForm: React.FC<UserRecommendationFormProps> = ({
	advisor,
	// onSuccessfulResponse,
	avatarName,
}) => {

	const [selectedMovie, setSelectedMovie] = useState<Movie | undefined>();

	useEffect(() => {
		setSelectedMovie(undefined);
	}, [advisor.id]);

	const handleItemSelected = (item: Movie) => {
		setSelectedMovie(item);
	};

	return (
		<Row className="recommendation-form-content">
			<p>
				You have <span>{advisor.selected ? "accepted" : "rejected"}</span> <span>{avatarName}'s</span> recommendation.
			</p>
			{advisor.responded ?
				<>
					<div className="recommendation-results">
						<div className="thank-you-box">
							<p>Thank you for your feedback!</p>
						</div>
						<h5>Your Recommendation to {avatarName}</h5>
						<p><strong>Movie:</strong> {advisor.recommendedMovie?.title} ({advisor.recommendedMovie?.year})</p>
						<p style={{ wordWrap: "break-word" }}><strong>Rationale:</strong> {advisor.rationaleText}</p>
					</div>
				</>
				:
				(
					<>
						<SearchMovieFormControl
							onItemSelected={handleItemSelected}
							formLabel={`Please recommend a movie to <strong>${avatarName}</strong>.`}
						/>
						{selectedMovie &&
							<>
								<SelectedMovieBlock movie={selectedMovie} />
								<RationaleForm
									selectedMovie={selectedMovie}
									advisor={advisor}
									advisorName={avatarName}
								// onSuccessfulResponse={onSuccessfulResponse} 
								/>
							</>
						}
					</>
				)
			}
		</Row >
	);
};


const SelectedMovieBlock: React.FC<{ movie: Movie }> = ({ movie }) => {
	return (
		<div className="selected-movie-block mb-3">
			<Image src={movie.poster} alt={movie.title} width={72} />
			<div className="movie-details">
				<p>{movie.title} <span>({movie.year})</span></p>
			</div>
		</div>
	);
};

const RationaleForm: React.FC<{
	selectedMovie: Movie,
	advisor: AdvisorProfile,
	advisorName: string,
	// onSuccessfulResponse: (advisorId: string, response: UserResponseFlag) => void
}> = ({ selectedMovie, advisor, advisorName,
	// onSuccessfulResponse 

}) => {

		const [rationale, setRationale] = useState("");
		const [isSubmitting, setIsSubmitting] = useState(false);

		const handleRationaleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
			setRationale(e.target.value);
		};

		const { studyApi } = useStudy();
		const participant: Participant | null = useRecoilValue(participantState);
		const studyStep: StudyStep | null = useRecoilValue(studyStepState);

		const setAdvisorsMap = useSetRecoilState(advisorsMapState);

		const handleSubmit = useCallback(async () => {
			if (rationale.trim() === "") {
				console.error("Rationale cannot be empty.");
				return;
			}
			if (rationale.length < 50) {
				console.error("Rationale must be at least 50 characters long.");
				return;
			}
			if (!participant || !studyStep) {
				console.warn("Participant or study step is undefined in handleSubmit.");
				return;
			}
			setIsSubmitting(true);
			try {
				await studyApi.post<FreeFormTextResponseRequest, boolean>('responses/text',
					{
						participant_id: participant.id,
						step_id: studyStep.id,
						responses: [
							{
								context_tag: `recommendation [FROM] advisor [${advisor.id}] [${advisorName}]`,
								response: JSON.stringify({
									movieId: advisor.recommendation.id,
									movieLensId: advisor.recommendation.movielens_id,
									movieTitle: advisor.recommendation.title,
									movieYear: advisor.recommendation.year,
									decision: advisor.selected ? "accept" : "reject",
								})
							},
							{
								context_tag: `recommendation [TO] advisor [${advisor.id}] [${advisorName}]`,
								response: JSON.stringify({
									movieId: selectedMovie.id,
									movieLensId: selectedMovie.movielens_id,
									movieTitle: selectedMovie.title,
									movieYear: selectedMovie.year,
									rationale: rationale,
								}),
							}
						]

					});
				// onSuccessfulResponse(advisor.id, { responded: true });
				setAdvisorsMap(prev => {
					const updatedAdvisor = {
						...advisor,
						responded: true,
						recommendedMovie: selectedMovie,
						rationaleText: rationale,
					};
					const newMap = new Map(prev);
					newMap.set(advisor.id, updatedAdvisor);
					return newMap;
				});
			} catch (error) {
				console.error("Error submitting rationale:", error);
				return;
			} finally {
				setIsSubmitting(false);
			}

		}, [rationale, participant, studyStep, advisor, advisorName, studyApi, selectedMovie, setAdvisorsMap]);

		const isRationaleInValid = rationale.trim() === "" || rationale.length <= 50;

		return (
			<Form.Group className="mb-3 mt-3 flex-grow-1 d-flex flex-column" controlId="rationale">
				<Form.Label>
					Why do you recommend this movie to {advisorName}?
				</Form.Label>
				<Form.Control
					as="textarea"
					className="flex-grow-1"
					value={rationale}
					onChange={handleRationaleChange}
					placeholder="Enter your rationale"
					rows={5}
					disabled={advisor.responded || isSubmitting}
				/>
				<Form.Text className="text-muted">
					Your rationale will be shared with the advisor.
				</Form.Text>
				<Button
					className="submit-btn mt-auto"
					variant="primary"
					onClick={handleSubmit}
					disabled={isRationaleInValid || advisor.responded || isSubmitting}
				>
					Submit
				</Button>
			</Form.Group>
		);
	}

export default RecommendationForm;