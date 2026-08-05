import clsx from 'clsx';

type Status = 'accepted' | 'rejected' | 'unselected';

const AdviseChooser = ({
    onSelect,
    currentState = 'unselected',
}: {
    onSelect: (newStatus: Status) => void;
    currentState: Status;
}) => {
    const status = currentState;

    const handleSelect = (newStatus: Status) => {
        if (newStatus === status) return;
        onSelect(newStatus);
    };

    const handleReset = () => {
        onSelect('unselected');
    };

    const baseButtonClasses = clsx(
        'h-full flex items-center justify-center font-normal text-lg rounded-lg transition-all duration-300',
        'cursor-pointer'
    );

    const acceptWidth = clsx({
        'w-1/2': status === 'unselected',
        'w-full': status === 'accepted',
        'w-0 overflow-hidden ml-0': status === 'rejected',
    });

    const rejectWidth = clsx({
        'w-1/2': status === 'unselected',
        'w-full': status === 'rejected',
        'w-0 overflow-hidden mr-0': status === 'accepted',
    });

    const acceptAction = status === 'accepted' ? handleReset : () => handleSelect('accepted');
    const rejectAction = status === 'rejected' ? handleReset : () => handleSelect('rejected');

    const acceptText = status === 'accepted' ? 'Accepted' : 'Accept';
    const rejectText = status === 'rejected' ? 'Rejected' : 'Reject';

    return (
        <div className="flex w-full h-11 space-x-3 p-1 bg-white rounded-xl transition-all duration-300">
            <button
                onClick={acceptAction}
                className={clsx(
                    baseButtonClasses,
                    acceptWidth,
                    status === 'accepted'
                        ? 'bg-lime-600 text-gray-900 shadow-lg'
                        : 'bg-lime-500 text-gray-900 hover:bg-green-600',
                    status === 'rejected' && 'text-transparent'
                )}
                disabled={status === 'rejected'}
            >
                {acceptText}
            </button>

            <button
                onClick={rejectAction}
                className={clsx(
                    baseButtonClasses,
                    rejectWidth,
                    status === 'rejected'
                        ? 'bg-red-600 text-gray-900 shadow-lg'
                        : 'bg-red-500 text-gray-900 hover:bg-red-600',
                    status === 'accepted' && 'text-transparent'
                )}
                disabled={status === 'accepted'}
            >
                {rejectText}
            </button>
        </div>
    );
};

export default AdviseChooser;
