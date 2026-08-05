import { PCallout, useStepCompletion } from '@rssa-project/study-template';
import { useEffect, type PropsWithChildren } from 'react';

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
            <PCallout>What is the Peer Recommendation Platform?</PCallout>
            <p className="my-3">
                The Peer Recommendation Platform is a platform where you will get to receive movie recommendations from
                members of your community and will be invited to give recommendations back.
            </p>
            <p className="my-3">
                On the platform, you will have seven anonymous peer recommenders; you will be anonymous to them as well.
                This will allow you to be free in your exploration of the system as well as in your recommendations.
                Your peer recommenders will be:
            </p>
            <ul className="space-y-1 ms-3">
                <ListItem> Anonymous Alligator</ListItem>
                <ListItem>Anonymous Buffalo</ListItem>
                <ListItem>Anonymous Coyote</ListItem>
                <ListItem>Anonymous Dolphin</ListItem>
                <ListItem>Anonymous Elephant</ListItem>
                <ListItem>Anonymous Frog</ListItem>
                <ListItem>Anonymous Giraffe</ListItem>
            </ul>

            <PCallout>How to navigate the Peer Recommendation Platform:</PCallout>
            <p className="my-3">
                First, you will come across a page with a grid of movie posters. Here, you will be asked to rate at
                least 10 movies that you have watched, between 1 and 5 stars. There are a lot more movies than those
                listed on the first page, so feel free to click on the right-hand side arrow to look through our movies.
            </p>
            <p className="my-3">
                On the next page, your peer recommenders will be listed on the left panel. Whenever you click on a peer
                recommender’s name or picture, you will see some information about their preferences, the movie they
                think you should watch, and why they think you should watch it, in the middle panel.
            </p>
            <p className="my-3">
                On the right panel, you will see two buttons (one red (reject) and one green (accept)). If the movie
                suggested by the peer recommender is a movie that you would like to watch, press the green or accept
                button; otherwise, press the red button.
            </p>
            <p className="my-3">
                Once you press one of these buttons, the right panel will turn into a form where you will tell the
                peer-recommender which movie you think they should watch and why. Your explanation should be at least
                150 characters long. Once you are finished, you may submit your recommendation and click on the next
                peer recommender.
            </p>
            <p className="my-3">
                You must give recommendations to each peer recommender before proceeding to the post-survey.
            </p>
            <p>Have fun!</p>
        </div>
    );
};

const ListItem: React.FC<PropsWithChildren> = ({ children }) => {
    return (
        <li className="flex items-start gap-x-2">
            <svg
                xmlns="http://w3.org"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="2.5"
                stroke="currentColor"
                className="size-4 mt-1 shrink-0 text-gray-500"
            >
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 12h-15" />
            </svg>
            <span>{children}</span>
        </li>
    );
};

export default SystemIntroPage;
