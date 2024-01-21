import { useOptionsValue, useSetSelection } from "@/common/recoil/options";
import { useBoardPosition } from "./useBoardPosition";
import { useSetSavedMoves } from "@/common/recoil/savedMoves";
import { useMyMoves } from "@/common/recoil/room";
import { useViewportSize } from "@/common/hooks/useViewportSize";
import { useState } from "react";
import { useCtx } from "./useCtx";
import { getStringFromRgba } from "@/common/lib/rgba";

let tempMoves: [number, number][] = [];
let tempCircle = { cX: 0, cY: 0, radiusX: 0, radiusY: 0 };
let tempSize = { width: 0, height: 0};
let tempImageData: ImageData | undefined;


export const useDraw = () => {
  const options = useOptionsValue();
  const boardPosition = useBoardPosition();
  const { clearSavedMoves } = useSetSavedMoves();
  const { handleAddMyMove } = useMyMoves();
  const { setSelection, clearSelection } = useSetSelection();
  const vw = useViewportSize();

  const movedX = boardPosition.x;
  const movedY = boardPosition.y;

  const [drawing, setDrawing] = useState(false);
  const ctx = useCtx();

  const setupCtxOptions = () => {
    if (ctx) {
      ctx.lineWidth = options.lineWidth;
      ctx.strokeStyle = getStringFromRgba(options.lineColor);
      ctx.fillStyle = getStringFromRgba(options.fillColor);
      if (options.mode === 'eraser')
        ctx.globalCompositeOperation = 'destination-out';
      else ctx.globalCompositeOperation = 'source-over';
    }
  };

  const drawAndSet = () => {
    if (!tempImageData)
      tempImageData = ctx?.getImageData(
        movedX.get() * -1,
        movedY.get() * -1,
        vw.width,
        vw.height
        );

    if (tempImageData) 
        ctx?.putImageData(tempImageData, movedX.get() * -1, movedY.get() * -1)
  };

  const handleStartDrawing = (x: number, y: number) => {
    if(!ctx || blocked) return ;

    const [finalX, finalY] = [getPos(x, movedX), getPos(y, movedY)];

    setDrawing(true);
    setupCtxOptions();
    drawAndSet();

    if (options.shape === 'line' && options.mode !== 'select') {
      ctx.beginPath();
      ctx.lineTo(finalX, finalY);
      ctx.stroke();
    }

    tempMoves.push([finalX, finalY]);
  };

  const handleDraw = (x: number, y: number, shift?: boolean) => {
    if (!ctx || !drawing || blocked) return;

    const [finalX, finalY] = [getPos(x, movedX), getPos(y, movedY)];

    drawAndSet();

    if(options.mode === 'select') {
      ctx.fillStyle = 'rgba(0, 0, 0, 0,2)';
      drawRect(ctx, tempMoves[0], finalX, finalY, false, true);
      tempMoves.push([finalX, finalY]);

      setupCtxOptions();

      return;
    }

    if(options.mode === 'select') {
      ctx.fillStyle 'rgba(0, 0, 0, 0.2)';
      drawRect(ctx, tempMoves[0], finalX, finalY, false, true);
      }
  }

}