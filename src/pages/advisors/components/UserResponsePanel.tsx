import React, { useCallback, useEffect, useReducer, useState } from "react";
import { Button, Container, Row } from "react-bootstrap";
import { useStudy } from "rssa-api";
import {
	AdviceSelectionAction,
	AdviceSelectionButtonProps,
	AdviceSelectionButtonState,
	AdviceSelectionWidgetProps,
	UserResponsePanelProps,
	UserSelectionResponse
} from "../Advisor.types";
import RecommendationForm from "./RecommendationForm";


const initialState: AdviceSelectionButtonState = {
	acceptButtonSelected: false,
	rejectButtonSelected: false,
}

const adviceSelectionButtonReducer = (
	state: AdviceSelectionButtonState,
	action: AdviceSelectionAction): AdviceSelectionButtonState => {
	switch (action.type) {
		case 'ACCEPT':
			return {
				acceptButtonSelected: true,
				rejectButtonSelected: false,
			};
		case 'REJECT':
			return {
				acceptButtonSelected: false,
				rejectButtonSelected: true,
			};
		case 'RESET':
			return initialState;
		default:
			return state;
	}
}

const AdviceSelectionButtonGroup: React.FC<AdviceSelectionButtonProps> = ({ onAccept, onReject, disabled, resetCondition }) => {
	const [state, dispatch] = useReducer(adviceSelectionButtonReducer, initialState);

	const handleAccept = () => {
		dispatch({ type: 'ACCEPT' });
		onAccept();
	};

	const handleReject = () => {
		dispatch({ type: 'REJECT' });
		onReject();
	};

	useEffect(() => {
		dispatch({ type: 'RESET' })
	}, [resetCondition]);

	return (
		<div className="buttons-container">
			<Button
				className={`recommendation-button accept-button ${state.acceptButtonSelected ? 'selected' : ''}`}
				disabled={disabled}
				onClick={handleAccept}
			>
				Accept Recommendation
			</Button>
			<Button
				className={`recommendation-button reject-button ${state.rejectButtonSelected ? 'selected' : ''}`}
				disabled={disabled}
				onClick={handleReject}
			>
				Reject Recommendation
			</Button>
		</div>
	)
}

const AdviceSelectionWidget: React.FC<AdviceSelectionWidgetProps> = ({
	avatarName,
	participantId,
	onSelection,
	advisorId
}) => {

	const { studyApi } = useStudy();

	const [loading, setLoading] = useState(false);

	const submitChoice = useCallback(
		(advisorId: string, selection: string) => {
			setLoading(true);
			studyApi.post<UserSelectionResponse,
				boolean>("prefComm/advisors/", {
					user_id: participantId,
					advisor_id: advisorId,
					selection: selection
				}).then((booleanResponse: boolean) => {
					if (booleanResponse) {
						onSelection(advisorId, { selected: true });
					}
					setLoading(false);
				}).catch((err: any) => {
					console.log("Error", err);
				});
		}, [studyApi, participantId, onSelection]);


	const handleAccept = () => {
		onSelection(advisorId, { selected: true });
	};

	const handleReject = () => {
		submitChoice(advisorId, "reject");
	};

	return (
		<div className="centered-content">
			<div className="question-container">
				<p>How do you feel about <strong>{avatarName}</strong>'s recommendation?</p>
			</div>
			<AdviceSelectionButtonGroup onAccept={handleAccept} onReject={handleReject}
				disabled={loading}
				resetCondition={advisorId} />
		</div>
	)
}


const UserResponsePanel: React.FC<UserResponsePanelProps> = ({
	participantId,
	advisor,
	updateCallback,
	avatar
}) => {
	const submitRecResponse = () => {
		updateCallback(advisor.id, { responded: true });
	}

	return (
		<Container className="advisor-recommendations-container">
			<Row className="advisor-recommendations-header">
				<h4>Recommendations</h4>
			</Row>
			<Row className="advisor-recommendations-content">
				{!advisor.selected ?
					<AdviceSelectionWidget
						participantId={participantId}
						advisorId={advisor.id}
						onSelection={updateCallback}
						avatarName={avatar.name} />
					:
					<RecommendationForm
						participantId={participantId}
						advisor={advisor}
						onSubmit={submitRecResponse}
						avatarName={avatar.name} />
				}
			</Row>
		</Container>
	);
};

export default UserResponsePanel;