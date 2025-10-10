import { Checkbox } from '@headlessui/react';
import { CheckIcon } from '@heroicons/react/24/solid';
import { useMutation } from '@tanstack/react-query';
import { clsx } from 'clsx';
import { useCallback, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useParticipant, useStudy } from 'rssa-api';
import { useStepCompletion } from '../hooks/useStepCompletion';
import type { StudyLayoutContextType } from '../types/study.types';

export interface BaseParticipant {
    participant_type_id: string;
    external_id: string;
    current_step_id: string;
    current_page_id?: string | null;
}

export interface Participant extends BaseParticipant {
    study_id: string;
    conition_id: string;
    current_status: string;
}

export interface ParticipantTokenObject {
    resume_code: string;
    token: string;
}

const InformedConsent: React.FC = () => {
    const { studyStep } = useOutletContext<StudyLayoutContextType>();

    const { studyApi } = useStudy();
    const { setJwt } = useParticipant();
    const [agreed, setAgreed] = useState(false);
    const [resumeCode, setResumeCode] = useState<string>();
    const { isStepComplete, setIsStepComplete } = useStepCompletion();

    const consentMutation = useMutation({
        mutationFn: (participantData: BaseParticipant) => {
            return studyApi.post<BaseParticipant, ParticipantTokenObject>(
                `studies/${studyApi.getStudyId()}/new-participant`,
                participantData
            );
        },
        onSuccess: (tokenObject) => {
            setJwt(tokenObject.token);
            setResumeCode(tokenObject.resume_code);
            setIsStepComplete(true);
        },
        onError: (error) => {
            setIsStepComplete(false);
            console.error('Error creating participant:', error);
        },
    });

    const handleConsent = useCallback(async () => {
        if (!studyStep) return;
        consentMutation.mutate({
            participant_type_id: '149078d0-cece-4b2c-81cd-a7df4f76d15a',
            external_id: 'N/A',
            current_step_id: studyStep?.id,
        });
    }, [studyStep, consentMutation]);

    const consentButtonDisabled = !agreed || consentMutation.isPending || isStepComplete;

    return (
        <div>
            <div className="ps-3 pt-3 pe-3 ms-3 mt-3 me-3 text-left">
                <h3>Call for Participation and Consent</h3>
                <p>
                    Dr. Bart Knijnenburg is inviting you to volunteer for a research study. Dr. Bart Knijnenburg is an
                    Associate Professor at Clemson University conducting the study with graduate students. In this
                    study, you will be asked to interact with a movie recommender system.
                </p>
                <h4 className="mt-3">Study Purpose</h4>
                <p>
                    The goal of this study is to support users in developing, exploring, and understanding their unique
                    personal preferences to help them escape the trap of "Filter bubbles," a problematic side effect of
                    recommendation technology that is otherwise meant to help make decisions. To support users and
                    understand their unique personal taste, we designed a movie rating system that displays items beyond
                    the top-rated ones to help both the users understand their tastes and recommenders get a better idea
                    of users' tastes. In this experiment, we will ask users to rate N number of movies in our system and
                    complete a survey pertaining to their thoughts about how the movies helped them learn, grow, and
                    expand their preferences.
                </p>

                <h4 className="mt-3">Eligibility</h4>
                <p>
                    Please note that you may only participate in this study once. Previous participants in this study
                    are not eligible to participate again. When you participate, please carefully perform every task and
                    read each question before you provide your answers. We are not able to pay workers who just click
                    through without paying attention to what they are doing. If your attention drops or your mouse hand
                    gets tired, please take a short break before continuing the study. Feel free to take it easy. Please
                    feel free to reach out to Sushmita Khan (sushmik@clemson.edu) if you have any questions. Thank you
                    for your time!
                </p>

                <h4 className="mt-3">Time and Compensation</h4>
                <p>
                    It will take about 15 to 20 minutes to complete the study, and you will receive&nbsp;
                    <span className="textemph">$2.75</span>&nbsp; upon completion. Participation is voluntary. Please
                    feel free to reach out to Sushmita Khan (sushmik@clemson.edu) if you have any questions. Thank you
                    for your time!
                </p>
                {/** TODO: Incorporate the following instead of the content above */}
                <p className="informedConsent-title">Key Information About the Research Study</p>
                <p>
                    Dr. Bart Knijnenburg is inviting you to volunteer for a research study. Bart Knijnenburg is an
                    assistant professor at Clemson University conducting the study with one of his graduate students,
                    Mina Mbodj, at Clemson University.
                </p>

                <p>
                    <span className="informedConsent-bold">Study Purpose:&nbsp;</span>
                    The purpose of this research is to investigate how a peer-based recommendation system works and the
                    behaviors that it elicits in members of the community.
                </p>

                <p>
                    <span className="informedConsent-bold">Voluntary Consent:&nbsp;</span>
                    Participation is voluntary, and you have the option to not participate. You will not be punished in
                    any way if you decide not to be in the study or to stop taking part in the study.
                </p>

                <p>
                    <span className="informedConsent-bold">Activities and Procedures:&nbsp;</span>
                    You will be provided a consent form that you will have to sign to agree to the terms and conditions.
                    Once you sign the consent form, you will be asked to complete the pre-survey, read through The Peer
                    Recommendation Platform introduction page.
                </p>

                <p>
                    <span className="informedConsent-bold">Participation Time:&nbsp;</span>
                    It will take you about 65 minutes to be part of this study.
                </p>

                <p>
                    <span className="informedConsent-bold">Risks and Discomforts:&nbsp;</span>
                    We do not know of any risks or discomforts to you in this research study. You may opt out of the
                    study at any time if you are not comfortable.
                </p>
                <p>
                    <span className="informedConsent-bold">Possible Benefits:&nbsp;</span>
                    You may not benefit directly for taking part in this study; however, we believe that this system
                    will help you help.
                </p>

                <p className="informedConsent-title">Incentives</p>
                <p>
                    For participating in this user study, you will be compensated with TBD upon successful completion of
                    the study.
                </p>

                <p className="informedConsent-title">Audio/Video Recording and Photographs</p>
                <p>
                    Our study does not ask you to provide personal or identifiable information. No audio or video will
                    be recorded while participants will take the study.
                </p>

                <p className="informedConsent-title">Equipment and Devices that will be used in Research Study</p>
                <p>
                    Are required: a computer, Internet browser and internet connection to access the survey and take the
                    experiment.
                </p>

                <p className="informedConsent-title">Protection of Privacy and Confidentiality</p>
                <p>
                    The results of this study may be published in scientific journals, professional publications, or
                    educational presentations. Identifiable information collected during the study will be removed and
                    the de-identified information will not be used or distributed for future research studies. We might
                    be required to share the information we collect from you with the Clemson University Office of
                    Research Compliance and the federal Office for Human Research Protections. If this happens, the
                    information would only be used to find out if we ran this study properly and protected your rights
                    in the study.
                </p>

                <p className="informedConsent-title">Contact Information</p>
                <p>
                    If you have any questions or concerns about your rights in this research study, please contact the
                    Clemson University Office of Research Compliance (ORC) at 864-656- 0636 or{' '}
                    <a href="mailto:irb@clemson.edu">irb@clemson.edu</a>. The Clemson IRB will not be able to answer
                    some study specific questions. However, you may contact the Clemson IRB if the research staff cannot
                    be reached or if you wish to speak with someone other than the research staff.
                </p>
                <p>
                    If you have any study related questions or if any problem arise, please contact Dr. Bart Knijnenburg
                    (<a href="mailto:bartk@clemson.edu">bartk@clemson.edu</a>). Mina Mbodj{' '}
                    <a href="mailto:ambodj@g.clemson.edu">ambodj@g.clemson.edu</a>.
                </p>
            </div>
            <div className="flex items-center gap-x-3 ms-4 p-3 rounded-lg mt-3">
                <Checkbox
                    checked={agreed}
                    onChange={setAgreed}
                    className={clsx(
                        'group h-6 w-6 rounded-md p-1',
                        'ring-1 ring-inset ring-gray-300',
                        'data-[checked]:bg-amber-500 data-[checked]:ring-amber-300',
                        'cursor-pointer',
                        'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-300'
                    )}
                    disabled={isStepComplete}
                >
                    <CheckIcon className="hidden h-4 w-4 fill-white group-data-[checked]:block" />
                </Checkbox>
                <label
                    htmlFor="consent-checkbox"
                    className="text-gray-700 select-none"
                    onClick={() => setAgreed(!agreed)}
                >
                    I have read and understood the study information, and I consent to participate.
                </label>
            </div>
            <button
                className={clsx(
                    'm-3 p-3 rounded-md',
                    consentButtonDisabled
                        ? 'bg-gray-400 text-gray-500 cursor-not-allowed'
                        : 'bg-amber-500 hover:bg-amber-600 text-gray-800 hover:text-gray-100 cursor-pointer'
                )}
                onClick={handleConsent}
                disabled={consentButtonDisabled}
            >
                {consentMutation.isPending
                    ? 'Submitting response...'
                    : isStepComplete
                      ? 'Consent recorded.'
                      : 'I consent to participate in this study'}
            </button>
            {resumeCode && (
                <div>
                    <p>Thank you for agreeing to participate in the study.</p>
                    <div
                        className={clsx(
                            'p-4 mx-auto mt-3 mb-3 w-45 h-30 bg-gray-200 rounded-md',
                            'text-3xl text-center content-center text-amber-900'
                        )}
                    >
                        <code>{resumeCode}</code>
                    </div>
                    <div>
                        <p>
                            Please copy the code above. In case the study session fails, you may be able to resume the
                            study by using the code.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InformedConsent;
