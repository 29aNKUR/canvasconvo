import { optimizeImage } from "@/common/lib/optimizeImage";
import { useMoveImage } from "@/modules/room/hooks/useMoveImage";
import { useEffect } from "react";
import { BsFillImageFill } from "react-icons/bs";

const ImagePicker = () => {
    const  { setMoveImage } = useMoveImage();
    
    useEffect(() => {
        const handlePaste = (e: ClipboardEvent) => {
            const items = e.clipboardData?.items;
            if(items) {
                for(const item of items) {
                    if(item.type.includes('image')) {
                        //to get the 'File' object representing the image. Returns null if it's not a file(e.g. its text or another type of data)
                        const file = item.getAsFile();
                        if (file) {
                            optimizeImage(file, (uri) => setMoveImage({ base64: uri }));
                        }
                    }
                }
            }
        };

        document.addEventListener('paste', handlePaste);

        return () => {
            document.removeEventListener('paste', handlePaste);
        }
    }, [setMoveImage]);

    const handleImageInput = () => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.click();

        //This event is triggered when the user selects a file using the file selection dialog
        fileInput.addEventListener('change', () => {
            if(fileInput && fileInput.files) {
                const file = fileInput.files[0];
                optimizeImage(file, (uri) => setMoveImage({ base64: uri }));
            }
        });
    };

    return (
        <button className="btn-icon text-xl" onClick={handleImageInput}>
            <BsFillImageFill />
        </button>
    )

}

export default ImagePicker;