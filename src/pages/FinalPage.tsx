const FinalPage: React.FC = () => {

    return (
        <div className="container mx-auto px-4">
            <div className="text-left">
                <p>
                    You should be automatically redirected back to the Prolific page. If not, please click the link
                    below.
                </p>
                <a href="#" className="block text-center">
                    Some redirect url.
                </a>
                <p>
                    Currently, this is a placeholder for testing. Please click the Done button below to finish the
                    study.
                </p>
                <p>
                    Note: If you do not click the Done button, you will not be able to run the study again on this
                    browser without clearing browser data/cache.
                </p>
            </div>
        </div>
    );
};

export default FinalPage;
