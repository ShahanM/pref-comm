import type { Movie, MovieDetails } from './rssa.types';

export type RecommendationType = 'baseline' | 'diverse' | 'reference';

type AvatarType = 'cow' | 'duck' | 'elephant' | 'fox' | 'llama' | 'tiger' | 'zebra';

export type Avatar = {
    name: string;
    alt: string;
    src: AvatarType;
};

export type AdvisorProfile = {
    id: number;
    movies: Movie[];
    recommendation: MovieDetails;
    avatar?: Avatar;
    accepted?: boolean;
    responded?: boolean;
};

export interface PreferenceCommResponseObject {
    [key: string]: AdvisorProfile;
}

export interface AdviseSelectionObject {
    advisor_id: number;
    status: 'accepted' | 'rejected' | 'unselected';
    suggested_movie: Movie | 'N/A';
    rationale_text: string;
}

export interface AdviseResponse {
    id?: string;
    payload_json: AdviseSelectionObject;
    version?: number;
}

export interface ParticipantResponsePayload {
    step_id: string;
    step_page_id: string | null;
    context_tag: string;
    payload_json: AdviseSelectionObject;
}
