import { Movie } from "../../widgets/moviegrid/moviegriditem/MovieGridItem.types";

export interface AdvisorWidgetProps {
	// participantId: string;
	// currentAdvisors: Map<string, any>;
}

export type AdvisorProfile = {
	id: string;
	movies: Movie[];
	recommendation: Movie;
	selected?: boolean;
	responded?: boolean;
	recommendedMovie?: Movie;
	rationaleText?: string;
}

export interface Avatar {
	src: string;
	alt: string;
	name: string;
}

export interface UserResponseFlag {
	selected?: boolean;
	responded?: boolean;
}

export type AdviceSelectionAction =
	| { type: "ACCEPT" }
	| { type: "REJECT" }
	| { type: 'RESET' };


export interface AdviceSelectionButtonState {
	acceptButtonSelected: boolean;
	rejectButtonSelected: boolean;
}

export interface AdviceSelectionButtonProps {
	onAccept: () => void;
	onReject: () => void;
	disabled?: boolean;
	resetCondition?: string;
}

export interface UserResponsePanelProps {
	// participantId: string;
	// advisor: AdvisorProfile;
	updateCallback: (advisorId: string, response: UserResponseFlag) => void;
	avatar: Avatar;
}

export interface UserSelectionResponse {
	user_id: string;
	advisor_id: string;
	selection: string;
}

export interface AdviceSelectionWidgetProps {
	avatarName: string
	onSelection: (advisorId: string, response: UserResponseFlag) => void
	advisorId: string
}