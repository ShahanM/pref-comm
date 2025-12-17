import { ConsentPage as GenericConsentPage } from 'rssa-study-template';

const ConsentContent: React.FC = () => {
    return (
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
                <span className="font-bold underline">$2.75</span>&nbsp; upon completion. Participation is voluntary. Please
                feel free to reach out to Sushmita Khan (sushmik@clemson.edu) if you have any questions. Thank you
                for your time!
            </p>
            {/** TODO: Incorporate the following instead of the content above */}
            <p className="mb-2 font-bold uppercase">Key Information About the Research Study</p>
            <p>
                Dr. Bart Knijnenburg is inviting you to volunteer for a research study. Bart Knijnenburg is an
                assistant professor at Clemson University conducting the study with one of his graduate students,
                Mina Mbodj, at Clemson University.
            </p>

            <p>
                <span className="mb-0 font-medium">Study Purpose:&nbsp;</span>
                The purpose of this research is to investigate how a peer-based recommendation system works and the
                behaviors that it elicits in members of the community.
            </p>

            <p>
                <span className="mb-0 font-medium">Voluntary Consent:&nbsp;</span>
                Participation is voluntary, and you have the option to not participate. You will not be punished in
                any way if you decide not to be in the study or to stop taking part in the study.
            </p>

            <p>
                <span className="mb-0 font-medium">Activities and Procedures:&nbsp;</span>
                You will be provided a consent form that you will have to sign to agree to the terms and conditions.
                Once you sign the consent form, you will be asked to complete the pre-survey, read through The Peer
                Recommendation Platform introduction page.
            </p>

            <p>
                <span className="mb-0 font-medium">Participation Time:&nbsp;</span>
                It will take you about 65 minutes to be part of this study.
            </p>

            <p>
                <span className="mb-0 font-medium">Risks and Discomforts:&nbsp;</span>
                We do not know of any risks or discomforts to you in this research study. You may opt out of the
                study at any time if you are not comfortable.
            </p>
            <p>
                <span className="mb-0 font-medium">Possible Benefits:&nbsp;</span>
                You may not benefit directly for taking part in this study; however, we believe that this system
                will help you help.
            </p>

            <p className="mb-2 font-bold uppercase">Incentives</p>
            <p>
                For participating in this user study, you will be compensated with TBD upon successful completion of
                the study.
            </p>

            <p className="mb-2 font-bold uppercase">Audio/Video Recording and Photographs</p>
            <p>
                Our study does not ask you to provide personal or identifiable information. No audio or video will
                be recorded while participants will take the study.
            </p>

            <p className="mb-2 font-bold uppercase">Equipment and Devices that will be used in Research Study</p>
            <p>
                Are required: a computer, Internet browser and internet connection to access the survey and take the
                experiment.
            </p>

            <p className="mb-2 font-bold uppercase">Protection of Privacy and Confidentiality</p>
            <p>
                The results of this study may be published in scientific journals, professional publications, or
                educational presentations. Identifiable information collected during the study will be removed and
                the de-identified information will not be used or distributed for future research studies. We might
                be required to share the information we collect from you with the Clemson University Office of
                Research Compliance and the federal Office for Human Research Protections. If this happens, the
                information would only be used to find out if we ran this study properly and protected your rights
                in the study.
            </p>

            <p className="mb-2 font-bold uppercase">Contact Information</p>
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
    );
};

const ConsentPage: React.FC = () => {
    // FIXME: These should be environment variables or constants
    const PARTICIPANT_TYPE_ID = '149078d0-cece-4b2c-81cd-a7df4f76d15a';
    const PARTICIPANT_EXTERNAL_ID = 'N/A';

    return (
        <GenericConsentPage
            participantTypeId={PARTICIPANT_TYPE_ID}
            externalId={PARTICIPANT_EXTERNAL_ID}
            title=""
            itemTitle=""
        >
            <ConsentContent />
        </GenericConsentPage>
    );
};

export default ConsentPage;
