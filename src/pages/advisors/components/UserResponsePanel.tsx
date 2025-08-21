import React, { act, useEffect, useReducer, useState } from "react";
import { Button, Container, Row } from "react-bootstrap";
import {
	AdviceSelectionAction,
	AdviceSelectionButtonProps,
	AdviceSelectionButtonState,
	AdviceSelectionWidgetProps,
	UserResponsePanelProps
} from "../Advisor.types";
import RecommendationForm from "./RecommendationForm";
import { useRecoilValue } from "recoil";
import { activeAdvisorSelector } from "../../../states/advisorState";


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
	onSelection,
	advisorId
}) => {

	const [loading, setLoading] = useState(false);


	const handleAccept = () => {
		onSelection(advisorId, { selected: true });
	};

	const handleReject = () => {
		onSelection(advisorId, { selected: false });
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
	updateCallback,
	avatar
}) => {

	const advisor = useRecoilValue(activeAdvisorSelector);

	if (!advisor) {
		return (
			<Container className="advisor-recommendations-container">
				<Row className="advisor-recommendations-header">
					<h4>Recommendations</h4>
				</Row>
				<Row className="advisor-recommendations-content">
					<p>Please select an advisor from the left panel.</p>
				</Row>
			</Container>
		)
	}
	return (
		<Container className="advisor-recommendations-container">
			<Row className="advisor-recommendations-header">
				<h4>Recommendations</h4>
			</Row>
			<Row className="advisor-recommendations-content">
				{advisor.selected === undefined ?
					<AdviceSelectionWidget
						advisorId={advisor.id}
						onSelection={updateCallback}
						avatarName={avatar.name} />
					:
					<RecommendationForm
						advisor={advisor}
						// onSuccessfulResponse={updateCallback}
						avatarName={avatar.name} />
				}
			</Row>
		</Container>
	);
};

export default UserResponsePanel;