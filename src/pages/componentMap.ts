import AdvisorsPage from './advisors/AdvisorsPage';
import InformedConsent from './ConsentPage';
import DemographicsPage from './DemographicsPage';
import FeedbackPage from './FeedbackPage';
import FinalPage from './FinalPage';
import MovieRatingPage from './MovieRatingPage';
import SurveyPage from './SurveyPage';
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
