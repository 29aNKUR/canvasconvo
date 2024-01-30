import { useViewportSize } from "@/common/hooks/useViewportSize";
import { useRefs } from "@/modules/room/hooks/useRefs";
import { useBoardPosition } from "../hooks/useBoardPosition";
import { useCtx } from "../hooks/useCtx";
import { useEffect, useState } from "react";
import { useSocketDraw } from "../hooks/useSocketDraw";
import { useDraw } from "../hooks/useDraw";
import { useMovesHandlers } from "@/modules/room/hooks/useMovesHandlers";
import { useDragControls } from "framer-motion";

const Canvas = () => {
    const { canvasRef, bgRef, undoRef, redoRef } = useRefs();
    const { width, height } = useViewportSize();
    const { x, y } = useBoardPosition();
    const ctx = useCtx();

    const [dragging, setDragging] = useState(true);

    const {
        handleEndDrawing,
        handleDraw,
        handleStartDrawing,
        drawing,
        clearOnYourMove,
    } = useDraw(dragging);
    useSocketDraw(drawing);

    const { handleUndo, handleRedo } = useMovesHandlers(clearOnYourMove);

    const dragControls = useDragControls();

    useEffect(() => {
        setDragging(false);
    },[]);

    useEffect(() => {
        const undoBtn = undoRef.current;
        const redoBtn = redoRef.current;

        undoBtn?.addEventListener('click', handleUndo);
        redoBtn?.addEventListener('click', handleRedo);

        return () => {
            undoBtn?.removeEventListener('click', handleUndo);
            redoBtn?.addEventListener('click', handleRedo);
        };
    }, [canvasRef, dragging, handleRedo, handleUndo, redoRef, undoRef ]);

}

export default Canvas;