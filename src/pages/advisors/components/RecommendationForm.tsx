import { useState } from "react";
import { Button, Form, Image, Row } from "react-bootstrap";
import { useStudy } from "rssa-api";
import { Movie } from "../../../widgets/moviegrid/moviegriditem/MovieGridItem.types";
import { AdvisorProfile, UserResponseFlag } from "../Advisor.types";
import SearchMovieFormControl from "./SearchMovieFormControl";


export interface UserRecommendationFormProps {
	advisor: AdvisorProfile
	onSubmit: (advisorId: number, response: UserResponseFlag) => void
	avatarName: string
	participantId: string
}


const RecommendationForm: React.FC<UserRecommendationFormProps> = ({
	advisor,
	onSubmit,
	avatarName,
	participantId
}) => {

	const { studyApi } = useStudy();

	const [selectedMovie, setSelectedMovie] = useState<Movie>();

	const handleItemSelected = (item: any) => {
		setSelectedMovie(item);
	};

	const handleSubmit = (rationale: string) => {
		console.log(rationale);
	}

	return (
		<Row className="recommendation-form-content">
			{
				// isSubmitted ? (
				// 	<Alert variant="success" className="success-message">
				// 		Your recommendation has been saved; thank you!
				// 	</Alert>
				// ) : 
				advisor.responded ?
					<>
						<div className="recommendation-results">
							<div className="thank-you-box">
								<p>Thank you for your feedback!</p>
							</div>
							<h5>Your Recommendation to </h5>
							<p><strong>Movie:</strong> </p>
							<p><strong>Rationale:</strong> </p>
						</div>
					</>
					:
					(
						<>
							<SearchMovieFormControl
								onItemSelected={handleItemSelected}
								formLabel={`Recommend a movie to <strong>${avatarName}</strong>`}
							/>
							{selectedMovie &&
								<>
									<SelectedMovieBlock movie={selectedMovie} />
									<RationaleForm advisorName={avatarName}
										onSubmit={handleSubmit} />
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
	advisorName: string
	onSubmit: (rationale: string) => void
}> = ({ advisorName, onSubmit }) => {

	const [rationale, setRationale] = useState("");
	const handleRationaleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setRationale(e.target.value);
	};
	const handleSubmit = () => {
		onSubmit(rationale);
	}

	const isRationaleInValid = rationale.trim() === "" && rationale.length <= 50;

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
			/>
			<Form.Text className="text-muted">
				Your rationale will be shared with the advisor.
			</Form.Text>
			<Button
				className="submit-btn mt-auto"
				variant="primary"
				onClick={handleSubmit}
				disabled={isRationaleInValid}
			>
				Submit
			</Button>
		</Form.Group>
	);
}

export default RecommendationForm;