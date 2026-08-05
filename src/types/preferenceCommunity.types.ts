import type { Movie } from './rssa.types';

export type RecommendationType = 'baseline' | 'diverse' | 'reference';

type AvatarType = 'cow' | 'duck' | 'elephant' | 'fox' | 'llama' | 'tiger' | 'zebra';

export type Avatar = {
    name: string;
    alt: string;
    src: AvatarType;
};

export interface Recommendation extends Movie {
    advisor_suggestion: string;
}
export type AdvisorProfile = {
    id: string;
    profile_top_n: Movie[];
    recommendation: Recommendation;
    avatar?: Avatar;
    accepted?: boolean;
    responded?: boolean;
};

export interface PreferenceCommResponseObject {
    [key: string]: AdvisorProfile;
}

export interface PreferenceCommResponseWrapper {
    rec_type: string;
    items: PreferenceCommResponseObject;
}

export interface AdviseSelectionObject {
    advisor_id: string;
    status: 'accepted' | 'rejected' | 'unselected';
    suggested_movie: Movie | 'N/A';
    rationale_text: string;
}

export interface AdviseResponse {
    id?: string;
    payload_json: AdviseSelectionObject;
    version?: number;
    study_step_id?: string;
    study_step_page_id?: string | null;
    context_tag?: string;
}

export interface ParticipantResponsePayload {
    study_step_id: string;
    study_step_page_id: string | null;
    context_tag: string;
    payload_json: AdviseSelectionObject;
}
