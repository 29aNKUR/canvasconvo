import { useViewportSize } from "@/common/hooks/useViewportSize";
import { useRefs } from "@/modules/room/hooks/useRefs";



const Canvas = () => {
    const { canvasRef, bgRef, undoRef, redoRef } = useRefs();
    const { width, height } = useViewportSize();

}

export default Canvas;