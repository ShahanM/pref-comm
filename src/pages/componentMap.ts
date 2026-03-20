import { DemographicsPage, FinalPage, MovieRatingPage, SurveyPage, FeedbackPage } from '@rssa-project/study-template';
import AdvisorsPage from './advisors/AdvisorsPage';
import InformedConsent from './ConsentPage';
import SystemIntroPage from './SystemIntroPage';
import Debrief from './Debrief';

export const componentMap: {
    [key: string]: React.FC;
} = {
    ConsentStep: InformedConsent,
    InstructionStep: SystemIntroPage,
    SurveyStep: SurveyPage,
    PreferenceElicitationStep: MovieRatingPage,
    TaskStep: AdvisorsPage,
    ExtraStep: Debrief,
    DemographicsStep: DemographicsPage,
    CompletionStep: FinalPage,
};
