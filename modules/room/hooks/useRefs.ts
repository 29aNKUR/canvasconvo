import { useContext } from "react";
import { roomContext } from "../context/Room.context";

export const useRefs = () => {
    const { undoRef, canvasRef, bgRef, minimapRef, redoRef, selectionRefs } = useContext(roomContext);

    return {
        undoRef,
        redoRef,
        bgRef,
        canvasRef,
        minimapRef,
        selectionRefs
    };
};