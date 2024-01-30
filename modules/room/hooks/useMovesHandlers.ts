import { useMyMoves, useRoom } from "@/common/recoil/room";
import { useRefs } from "./useRefs";
import { useSetSavedMoves } from "@/common/recoil/savedMoves";
import { useCtx } from "../modules/board/hooks/useCtx";
import { useBackground } from "@/common/recoil/background";
import { useSetSelection } from "@/common/recoil/options";
import { useEffect, useMemo } from "react";
import { Move } from "@/common/types/global";
import { getStringFromRgba } from "@/common/lib/rgba";

let prevMovesLength = 0;

export const useMovesHandlers = (clearOnYourMove: () => void) => {
  const { canvasRef, minimapRef, bgRef } = useRefs();
  const room = useRoom();
  const { handleAddMyMove, handleRemoveMyMove } = useMyMoves();
  const { addSavedMove, removeSavedMove } = useSetSavedMoves();
  const ctx = useCtx();
  const bg = useBackground();
  const { clearSelection } = useSetSelection();

  const sortedMoves = useMemo(() => {
    const { usersMoves, movesWithoutUser, myMoves } = room;

    const moves = [...movesWithoutUser, ...myMoves];

    usersMoves.forEach((userMoves) => moves.push(...userMoves));

    moves.sort((a, b) => a.timestamp - b.timestamp);

    return moves;
  }, [room]);

  const copyCanvasToSmall = () => {
    if (canvasRef.current && minimapRef.current && bgRef.current) {
      const smallCtx = minimapRef.current.getContext("2d");
      if (smallCtx) {
        smallCtx.clearRect(0, 0, smallCtx.canvas.width, smallCtx.canvas.height);
        smallCtx.drawImage(
          bgRef.current,
          0,
          0,
          smallCtx.canvas.width,
          smallCtx.canvas.height
        );
        smallCtx.drawImage(
          canvasRef.current,
          0,
          0,
          smallCtx.canvas.width,
          smallCtx.canvas.height
        );
      }
    }
  };

  useEffect(() => copyCanvasToSmall(), [bg]);

  const drawMove = (move: Move, image?: HTMLImageElement) => {
    const { path } = move;

    if(!ctx || !path.length) return;

    const moveOptions = move.options;

    if(moveOptions.mode === 'select') return;

    ctx.lineWidth = moveOptions.lineWidth;
    ctx.strokeStyle = getStringFromRgba(moveOptions.lineColor);
    ctx.fillStyle = getStringFromRgba(moveOptions.fillColor);

    if(moveOptions.mode === 'eraser') {
        ctx.globalCompositeOperation = 'destination-out';
    } else {
        ctx.globalCompositeOperation = 'source-over';
    }

    if(moveOptions.shape === 'image' && image) {
        ctx.drawImage(image,path[0][0], path[0][1]);
    }

    switch (moveOptions.shape) {
        case 'line' : {
            ctx.beginPath();
            path.forEach(([x, y]) => {
                ctx.lineTo(x, y);
            });

            ctx.stroke();
            ctx.closePath();
            break;
        }

        case 'circle' : {
            const { cX, cY, radiusX, radiusY } = move.circle;

            ctx.beginPath();
            ctx.ellipse(cX, cY, radiusX, radiusY, 0, 0, 2 * Math.PI);
            ctx.stroke();
            ctx.fill();
            ctx.closePath();
            break;
        }

        case 'rect' : {
            const { width, height } = move.rect;

            ctx.beginPath();

            ctx.rect(path[0][0], path[0][1], width, height);
            ctx.stroke();
            ctx.fill();

            ctx.closePath();
            break;
        }

        default:
            break;
    }

    copyCanvasToSmall();
  };

  const drawAllMoves = async () => {
    if(!ctx) return;

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    const images = await Promise.all(
        sortedMoves.filter((move) => move.options.shape === 'image').map((move) => {
            return new Promise<HTMLImageElement>((resolve) => {
                const img = new Image();
                img.src = move.img.base64;
                img.id = move.id;
                img.addEventListener('load', () => resolve(img));
            })
        })
    )
  }


};
