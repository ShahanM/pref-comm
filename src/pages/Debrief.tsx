// import { Select } from '@rssa-project/study-template';

const Debrief: React.FC = () => {
    return (
        <div className="ps-3 pt-3 pe-3 ms-3 mt-3 me-3 text-left">
            <p>
                Thank you for participating in our study! This research aimed to explore how people interact with peer
                recommendations when choosing movies and how they approach providing recommendations in return.
            </p>

            <p>
                We would like to disclose that the peer recommenders with whom you have interacted during this study
                were not real people but scripted by our study platform. The peer recommendations were selected using
                data from real users and the explanations were generated using a Large Language Model (LLM). Note that
                none of your data is being shared with an LLM and or with anyone aside from the researchers.
            </p>

            <p>As such, we invite you to answer this last question:</p>

            <label>Did you realize that the study did not involve real peer recommenders?</label>
            <select onChange={() => {}}>
                <option value="certain_not_real">I was certain that the peer recommenders were not real</option>
                <option value="suspected_not_real">
                    I suspected that the peer recommenders were not real, but I was not certain
                </option>
                <option value="suspected_real">
                    I suspected that the peer recommenders were real, but I was not certain
                </option>
                <option value="certain_real">I was certain that the peer recommenders were real</option>
            </select>

            <p>
                Your insights will help improve the design of personalized recommendation tools and enhance our
                understanding of collaborative filtering systems. If you have any questions, please contact Mina Mbodj
                at: ambodj@g.clemson.edu.
            </p>

            <p>Thank you for your valuable contributions!</p>
        </div>
    );
};

export default Debrief;
