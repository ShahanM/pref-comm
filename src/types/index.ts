import type { Participant, StudyStep } from '@rssa-project/api';

export interface Movie {
  id: string;
  movie_id: number;
  title: string;
  year: number;
  poster_identifier?: string;
  rating?: number;
}

export interface AdvisorType {
  id: string;
  name: string;
  movie_id: number;
  poster_identifier: string;
  status?: string;
  rating?: number;
}

export interface MovieRating {
  movielens_id: number;
  rating: number;
}

export interface PageProps {
  next: string;
  participant?: Participant;
  studyStep?: StudyStep;
  updateCallback?: (step: StudyStep, referrer: string) => void;
}

export interface UserData {
  id: string;
  study_id: string;
  condition?: string;
}