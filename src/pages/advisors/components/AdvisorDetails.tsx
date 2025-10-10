import { useMemo } from 'react';
import { useAdvisorSelection } from '../../../hooks/useAdvisorSelection';
import { AVATAR_IMGS } from '../advisorsMap';

const AdvisorDetails = () => {
    const { selectedAdvisor } = useAdvisorSelection();

    const avatarImg = useMemo(() => {
        if (!selectedAdvisor || !selectedAdvisor.avatar) return;
        return AVATAR_IMGS[selectedAdvisor.avatar?.src];
    }, [selectedAdvisor]);

    if (!selectedAdvisor) return <>No Advisors selected</>;

    const recommendation = selectedAdvisor.recommendation;

    return (
        <div className="py-3 mt-1 border border-gray-300 rounded-md text-left">
            <div className="flex justify-between m-3 shadow-sm py-3 rounded-md">
                <h4 className="mx-3 font-medium">{`${selectedAdvisor?.avatar?.name}'s profile`}</h4>
                <img className="size-27 rounded-md mx-5 mt-3" src={avatarImg} alt={selectedAdvisor?.avatar?.alt} />
            </div>
            <div className="mx-3 mt-3">
                <h4 className="font-medium">Top movies</h4>
                <div className="grid grid-cols-7 gap-1 mt-2">
                    {Array.from(selectedAdvisor.movies).map((movie) => (
                        <div key={movie.id} className="">
                            <img
                                className="rounded-md"
                                src={movie.tmdb_poster}
                                alt={`Movie poster for ${movie.title} from ${movie.year}`}
                            />
                            <p className="mt-2">{movie.title}</p>
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex mx-3 mt-5 justify-between gap-5">
                <div>
                    <h4 className="font-medium">{`${selectedAdvisor?.avatar?.name}'s recommendation to you`}</h4>
                    <p className="mt-3 text-justify">{recommendation.recommendations_text?.formal}</p>
                </div>
                <img
                    className="rounded-md h-81"
                    src={recommendation.tmdb_poster}
                    alt={`Movie poster for ${recommendation.title} from ${recommendation.year}`}
                />
            </div>
        </div>
    );
};

export default AdvisorDetails;
