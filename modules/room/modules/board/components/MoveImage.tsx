import { useMoveImage } from "@/modules/room/hooks/useMoveImage";
import { useBoardPosition } from "../hooks/useBoardPosition"
import { motion, useMotionValue } from "framer-motion";
import { useEffect } from "react";
import { getPos } from "@/common/lib/getPos";
import { Move } from "@/common/types/global";
import { socket } from "@/common/lib/socket";
import { AiOutlineCheck, AiOutlineClose } from "react-icons/ai";


const MoveImage = () => {
    const { x, y } = useBoardPosition();
    const { moveImage, setMoveImage } = useMoveImage();

    const imageX = useMotionValue(moveImage.x || 50);
    const imageY = useMotionValue(moveImage.y || 50);

    useEffect(() => {
        if (moveImage.x) imageX.set(moveImage.x);
        else imageX.set(50);
        if (moveImage.y) imageY.set(moveImage.y);
        else imageY.set(50);
    }, [imageX, imageY, moveImage.x, moveImage.y]);

    const handlePlaceImage = () => {
        const [finaX, finalY] = [getPos(imageX.get(), x), getPos(imageY.get(), y)];

        const move: Move = {
            ...DEFAULT_MOVE,
            img: { base64: moveImage.base64},
            path: [[finalX, finalY]],
            options: {
                ...DEFAULT_MOVE.options,
                selection: null,
                shape: 'image',
            },
        };

        socket.emit('draw', move);

        setMoveImage({ base64: '' });
        imageX.set(50);
        imageY.set(50);
    };

    if(!moveImage.base64) return null;

    return (
        <motion.div drag dragElastic={0} dragTransition={{ power: 0.03, timeConstant: 50 }} className="absolute top-0 z-20 cursor-grab" style={{ x: imageX, y: imageY }}>
            <div className="absolute bottom-full mb-2 flex gap-3">
                <button className="rounded-full bg-gray-200 p-2" onClick={handlePlaceImage}>
                    <AiOutlineCheck />
                </button>
                <button className="rounded-full bg-gray-200 p-2" onClick={() => setMoveImage({ base64: '' })}><AiOutlineClose/></button>
            </div>
            <img src={moveImage.base64} alt="image to place" className="pointer-events-none" />
        </motion.div>
    )
}

export default MoveImage;