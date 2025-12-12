import { useEffect } from 'react';
import { useStepCompletion } from 'rssa-study-template';

const SystemIntroPage: React.FC = () => {
    const { setIsStepComplete } = useStepCompletion();
    useEffect(() => {
        setIsStepComplete(false);
        const timerId = setTimeout(() => {
            setIsStepComplete(true);
        }, 3000);
        return () => {
            clearTimeout(timerId);
        };
    }, [setIsStepComplete]);
    return (
        <div className="p-5 m-3 text-left">
            <div>
                <h3>What is the Peer Recommendation Platform?</h3>
                <p>
                    The Peer Recommendation Platform is a platform where you will get to receive movie recommendations
                    from members of your community and will be invited to give recommendations back.
                </p>
                <p>
                    In the system, you will have seven peer recommenders who will remain anonymous and you will be
                    anonymous to them. This will allow you to be free in your exploration of the system as well as in
                    your recommendations.
                </p>
            </div>

            <div>
                <h3>How to navigate the Peer Recommendation Platform:</h3>
                <ol>
                    <li>
                        First, you will come across a page with a grid of movie posters. Here, you will be asked to rate
                        at least 10 movies that you have watched between 1 and 5 stars. There are a lot more movies than
                        those listed on the first page, so feel free to click on the right hand side arrow to look
                        through our movies.
                    </li>
                    <li>
                        Your peer recommenders will be listed to the left of your screen. Whenever you click on a peer
                        recommender's name or picture, you will see a bit of information on the preferences of the peer
                        recommender, the movie which they recommend you in the middle of the screen as well as the
                        reason why they recommended that movie.
                    </li>
                    <li>
                        To the right of your screen, you will see two buttons (one red (reject) and one green (accept)).
                        If the movie recommended by the peer recommender is a movie that you would like to watch, press
                        the green or accept button; otherwise, press the red button.
                    </li>
                    <li>
                        Once you press one of these buttons, the right side of your screen will turn into fillable
                        fields where you will be asked to enter a movie recommendation for the peer-recommender; you
                        will be asked to enter a movie title as well as why you recommend this movie to the advisor.
                        Your explanation should be at least 10 words long. Once you are finished, you may submit your
                        recommendation and click on the next peer recommender.
                    </li>
                    <li>
                        You must give recommendations to each peer recommender before proceeding to the post-survey.
                    </li>
                </ol>
                <p>Happy recommending!</p>
            </div>
        </div>
    );
};

export default SystemIntroPage;
