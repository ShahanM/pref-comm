import type { Movie } from '../../types/rssa.types';

export type AdvisorProfile = {
    id: number;
    movies: Movie[];
    recommendation: Movie;
    selected?: boolean;
    responded?: boolean;
};

export interface Avatar {
    src: string;
    alt: string;
    name: string;
}

export interface UserResponseFlag {
    selected?: boolean;
    responded?: boolean;
}

export type AdviceSelectionAction = { type: 'ACCEPT' } | { type: 'REJECT' } | { type: 'RESET' };

export interface AdviceSelectionButtonState {
    acceptButtonSelected: boolean;
    rejectButtonSelected: boolean;
}

export interface AdviceSelectionButtonProps {
    onAccept: () => void;
    onReject: () => void;
    disabled?: boolean;
    resetCondition?: number;
}

export interface UserResponsePanelProps {
    participantId: string;
    advisor: AdvisorProfile;
    updateCallback: (advisorId: number, response: UserResponseFlag) => void;
    avatar: Avatar;
}

export interface UserSelectionResponse {
    user_id: string;
    advisor_id: number;
    selection: string;
}

export interface AdviceSelectionWidgetProps {
    avatarName: string;
    participantId: string;
    onSelection: (advisorId: number, response: UserResponseFlag) => void;
    advisorId: number;
}
