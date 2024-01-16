import { CANVAS_SIZE } from "@/common/constants/canvasSize";
import { useViewportSize } from "@/common/hooks/useViewportSize";
import { useModal } from "@/modal";
import { useRefs } from "@/modules/room/hooks/useRefs";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import ShareModal from "../modals/ShareModal";
import { motion } from "framer-motion";
import HistoryBtns from "./HistoryBtns";
import ShapeSelector from "./ShapeSelector";
import ColorPicker from "./ColorPicker";
import LineWidthPicker from "./LineWidthPicker";
import ModePicker from "./ModePicker";
import ImagePicker from "./ImagePicker";
import BackgroundPicker from "./BackgroundPicker";
import { IoIosShareAlt } from 'react-icons/io';
import { FiChevronRight } from 'react-icons/fi';
import { HiOutlineDownload } from 'react-icons/hi';
import { ImExit } from 'react-icons/im';

const ToolBar = () => {
    const { canvasRef, bgRef } = useRefs();
    const { openModal } = useModal();
    const { width } = useViewportSize();

    const [opened, setOpened] = useState(false);

    const router = useRouter();

    useEffect(() => {
        if(width >= 1024) setOpened(true);
        else setOpened(false);
    }, [width]);

    const handleExit = () => router.push('/');

    // Event handler to download the canvas as an image
    const handleDownload = () => {

        const canvas = document.createElement('canvas');
        canvas.width = CANVAS_SIZE.width;
        canvas.height = CANVAS_SIZE.height;

        // Drawing canvas and background onto the temporary canvas
        const tempCtx = canvas.getContext('2d');
        if(tempCtx && canvasRef.current && bgRef.current) {
            tempCtx.drawImage(bgRef.current, 0, 0);
            tempCtx.drawImage(canvasRef.current, 0, 0);
        }

        // Creating a download link and triggering a click to initiate download
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = 'canvas.png';
        link.click();
    };

    const handleShare = () => openModal(<ShareModal />);

    return (
        <>
        {/* For adding animation on toolbar opening arrow */}
        <motion.button
            className="btn-icon absolute bottom-1/2 -left-2 z-50 h-10 w-10 rounded-full bg-black text-2xl transition-none lg:hidden"
            animate={{ rotate: opened ? 0 : 180}}
            transition={{ duration: 0.2 }}
            onClick={() => setOpened(!opened)}
        >
            <FiChevronRight />
        </motion.button>
        {/* animation for toolbar */}

        <motion.div 
            className="absolute left-10 top-[50%] z-50 grid grid-cols-2 items-center gap-5 rounded-lg bg-zinc-900 p-5 text-white 2xl:grid-cols-1"
            animate={{
                x: opened ? 0 : -160,
                y: '-50%'
            }} 
            transition={{
                duration: 0.2,
            }}   
            >
                <HistoryBtns />

                 {/* for horizontal lines below undo redo button */}
                <div className="h-px w-full bg-white 2xl:hidden" />
                <div className="h-px w-full bg-white"/>

                <ShapeSelector/>
                <ColorPicker />
                <LineWidthPicker />
                <ModePicker />
                <ImagePicker />

                {/* for black square space near imagepicker */}
                <div className="2xl:hidden"></div>

                 {/* horizontal lines */}
                <div className="h-px w-full bg-white 2xl:hidden"></div>
                <div className="h-px w-full bg-white"></div>

                <BackgroundPicker />
                <button className="btn-icon text-2xl" onClick={handleShare}>
                    <IoIosShareAlt />
                </button>
                <button className="btn-icon text-2xl" onClick={handleDownload}>
                    <HiOutlineDownload />
                </button>
                <button className="btn-icon text-xl" onClick={handleExit}>
                    <ImExit />
                </button>
        </motion.div>
        </>
    )
}

export default ToolBar;
