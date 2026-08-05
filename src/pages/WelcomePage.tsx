import { WelcomePage as GenericWelcomePage, PCallout } from '@rssa-project/study-template';

const WelcomeContent: React.FC = () => {
    return (
        <div className="m-3 p-5 text-left rounded-3">
            <PCallout>What to expect?</PCallout>

            <div className="p-3">
                <p className="italic mb-1">Consent Form:</p>
                <ul className="list-disc list-inside">
                    <li>Begin by reviewing and signing the consent form.</li>
                    <li>Your participation is voluntary, and you can withdraw at any time.</li>
                </ul>
            </div>

            <div className="p-3">
                <p className="italic mb-1">Pre-Survey:</p>
                <ul className="list-disc list-inside">
                    <li>Complete a brief pre-survey to help us understand your background and preferences.</li>
                    <li>This will take approximately 10 to 15 minutes.</li>
                </ul>
            </div>

            <div className="p-3">
                <p className="italic mb-1">Introduction to The Peer Recommendation Platform:</p>
                <ul className="list-disc list-inside">
                    <li>
                        Learn about The Peer Recommendation Platform, our innovative community based movie recommender
                        system.
                    </li>
                    <li>Understand its purpose and how it will assist you throughout the study.</li>
                </ul>
            </div>

            <div className="p-3">
                <p className="italic mb-1">Complete the Study:</p>
                <ul className="list-disc list-inside">
                    <li>Navigate through the system following the guided steps.</li>
                    <li>Engage with the features and provide feedback as prompted.</li>
                </ul>
            </div>

            <div className="p-3">
                <p className="italic mb-1">Post-Survey:</p>
                <ul className="list-disc list-inside">
                    <li>After completing the study steps, you will be directed to a post-survey.</li>
                    <li>
                        Your feedback will be invaluable for improving the system and understanding your experience.
                    </li>
                </ul>
            </div>

            <div className="p-3">
                <p className="mt-3">
                    We appreciate your time and insights. <span className="font-bold">Let's get started!</span>
                </p>
            </div>
        </div>
    );
};

const WelcomePage: React.FC<{ isStudyReady: boolean; onStudyStart: () => void }> = (props) => {
    return <GenericWelcomePage {...props} ContentComponent={WelcomeContent} />;
};

export default WelcomePage;
