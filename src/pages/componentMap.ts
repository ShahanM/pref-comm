import { DemographicsPage, MovieRatingPage, SurveyPage } from 'rssa-study-template';
import AdvisorsPage from './advisors/AdvisorsPage';
import InformedConsent from './ConsentPage';
import FeedbackPage from './FeedbackPage';
import FinalPage from './FinalPage';
import SystemIntroPage from './SystemIntroPage';

export const componentMap: {
    [key: string]: React.FC;
} = {
    ConsentStep: InformedConsent,
    InstructionStep: SystemIntroPage,
    SurveyStep: SurveyPage,
    PreferenceElicitationStep: MovieRatingPage,
    TaskStep: AdvisorsPage,
    ExtraStep: FeedbackPage,
    DemographicsStep: DemographicsPage,
    CompletionStep: FinalPage,
};
