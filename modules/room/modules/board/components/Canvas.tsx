import { useViewportSize } from "@/common/hooks/useViewportSize";
import { useRefs } from "@/modules/room/hooks/useRefs";
import { useBoardPosition } from "../hooks/useBoardPosition";
import { useCtx } from "../hooks/useCtx";
import { useEffect, useState } from "react";
import { useSocketDraw } from "../hooks/useSocketDraw";
import { useDraw } from "../hooks/useDraw";
import { useMovesHandlers } from "@/modules/room/hooks/useMovesHandlers";
import { useDragControls } from "framer-motion";
import { socket } from "@/common/lib/socket";
import { CANVAS_SIZE } from "@/common/constants/canvasSize";
import Background from "./Background";
import MiniMap from "./Minimap";
import { BsArrowsMove } from "react-icons/bs";

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

  // Framer Motion hook for handling drag controls
  const dragControls = useDragControls();

  useEffect(() => {
    setDragging(false);
  }, []);

  useEffect(() => {
    const undoBtn = undoRef.current;
    const redoBtn = redoRef.current;

    undoBtn?.addEventListener("click", handleUndo);
    redoBtn?.addEventListener("click", handleRedo);

    return () => {
      undoBtn?.removeEventListener("click", handleUndo);
      redoBtn?.addEventListener("click", handleRedo);
    };
  }, [canvasRef, dragging, handleRedo, handleUndo, redoRef, undoRef]);

  useEffect(() => {
    if (ctx) socket.emit("joined_room");
  }, [ctx]);

  return (
    <div className="relative h-full w-full overflow-hidden">
      <motion.canvas
        ref={canvasRef}
        width={CANVAS_SIZE.width}
        height={CANVAS_SIZE.height}
        className={`absolute top-0 z-10 ${dragging && "cursor-move"}`}
        style={{ x, y }}
        // Framer Motion drag-related props
        drag={dragging}
        dragConstraints={{
          left: -(CANVAS_SIZE.width - width),
          right: 0,
          top: -(CANVAS_SIZE.height - height),
          bottom: 0,
        }}
        dragControls={dragControls}
        dragElastic={0}
        dragTransition={{ power: 0, timeConstant: 0 }}
        // Event handlers for mouse and touch interactions
        onContextMenu={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onMouseDown={(e) => {
          if (e.button === 2) {
            setDragging(true);
            dragControls.start(e);
          } else handleStartDrawing(e.clientX, e.clientY);
        }}
        onMouseUp={(e) => {
          if (e.button === 2) setDragging(false);
          else handleEndDrawing();
        }}
        onMouseMove={(e) => {
          handleDraw(e.clientX, e.clientY, e.shiftKey);
        }}
        onTouchStart={(e) =>
          handleStartDrawing(
            e.changedTouces[0].clientX,
            e.changedTouches[0].clientY
          )
        }
        onTouchEnd={handleEndDrawing}
        onTouchMove={(e) =>
          handleDraw(e.changedTouches[0].clientX, e.changeTouches[0].clientY)
        }
      />

      {/* Background and MiniMap components */}
      <Background bgRef={bgRef} />
      <MiniMap dragging={dragging} />

{/* Button to toggle dragging state */}
      <button
        className={`absolute bottom-14 right-5 z-10 rounded-xl md:bottom-5 ${
          dragging ? "bg-green-500" : "bg-zinc-300 text-black"
        } p-3 text-lg text-white`}
        onClick={() => setDragging((prev) => !prev)}
      >
        <BsArrowsMove />
      </button>
    </div>
  );
};

export default Canvas;
