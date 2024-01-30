import { useViewportSize } from "@/common/hooks/useViewportSize";
import { useRefs } from "@/modules/room/hooks/useRefs";
import { useBoardPosition } from "../hooks/useBoardPosition";
import { useCtx } from "../hooks/useCtx";
import { useState } from "react";
import { useSocketDraw } from "../hooks/useSocketDraw";
import { useDraw } from "../hooks/useDraw";

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

}

export default Canvas;