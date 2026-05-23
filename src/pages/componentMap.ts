import { DemographicsPage, FinalPage, MovieRatingPage, SurveyPage } from '@rssa-project/study-template';
import React from 'react';
import AdvisorsPage from './advisors/AdvisorsPage';
import InformedConsent from './ConsentPage';
import Debrief from './Debrief';
import SystemIntroPage from './SystemIntroPage';

export const componentMap: { [key: string]: React.FC } = {
    ConsentStep: InformedConsent,
    InstructionStep: SystemIntroPage,
    SurveyStep: SurveyPage,
    PreferenceElicitationStep: MovieRatingPage,
    TaskStep: AdvisorsPage,
    ExtraStep: Debrief,
    DemographicsStep: (props) =>
        React.createElement(DemographicsPage, {
            ...props,
            iCountry: false,
            countryState: 'United States',
            iStateRegion: true,
            iUrbanicity: true,
            iAge: true,
            iGender: true,
            iRaceEthnicity: true,
            iEducation: true,
            stateRegionState: undefined,
        }),
    CompletionStep: FinalPage,
};
