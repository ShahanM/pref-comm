import DOMPurify from 'dompurify';
import parse from 'html-react-parser';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';

interface WarningDialogProps {
    show: boolean;
    title: string;
    message: string;
    onClose: (show: boolean) => void;
    confirmCallback?: () => void;
    confirmText?: string;
    cancelCallback?: () => void;
    disableHide?: boolean;
}
export const WarningDialog: React.FC<WarningDialogProps> = ({
    show,
    title,
    message,
    onClose,
    disableHide = false,
    confirmCallback,
    confirmText = 'Confirm',
    cancelCallback,
}) => {
    const handleClose = () => !disableHide && onClose(false);

    const htmlparser = (html: string) => {
        const clean = DOMPurify.sanitize(html);
        const parsed = parse(clean);
        return parsed;
    };

    return (
        <Dialog open={show} onClose={handleClose} className="relative z-50">
            {/* The backdrop, rendered as a fixed sibling to the panel container */}
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

            {/* Full-screen container to center the panel */}
            <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
                {/* The actual dialog panel  */}
                <DialogPanel className="mx-auto w-full max-w-lg rounded-lg bg-white shadow-xl overflow-hidden">
                    <div className="bg-[#f9b05c] px-4 py-3">
                        <DialogTitle className="text-lg font-medium">{title}</DialogTitle>
                    </div>

                    <div className="px-4 py-4">
                        {htmlparser(message)}
                    </div>

                    {!disableHide && (
                        <div className="flex justify-end gap-2 px-4 py-3 bg-gray-50">
                            {cancelCallback && (
                                <button
                                    className="px-4 py-2 rounded bg-[#c9ccd5] hover:bg-[#8b8b8b] text-[#4a4b4b] border border-[#c9ccd5] hover:border-[#8b8b8b]"
                                    onClick={cancelCallback}
                                >
                                    Close
                                </button>
                            )}
                            <button
                                className="px-4 py-2 rounded bg-[#f9b05c] hover:bg-[#d9903c] text-[#4a4b4b]"
                                onClick={confirmCallback ? confirmCallback : handleClose}
                            >
                                {confirmText}
                            </button>
                        </div>
                    )}
                </DialogPanel>
            </div>
        </Dialog>
    );
};
