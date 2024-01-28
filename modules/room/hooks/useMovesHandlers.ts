import { useMyMoves, useRoom } from "@/common/recoil/room";
import { useRefs } from "./useRefs"
import { useSetSavedMoves } from "@/common/recoil/savedMoves";
import { useCtx } from "../modules/board/hooks/useCtx";
import { useBackground } from "@/common/recoil/background";
import { useSetSelection } from "@/common/recoil/options";
import { useEffect, useMemo } from "react";

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
        if(canvasRef.current && minimapRef.current && bgRef.current) {
            const smallCtx = minimapRef.current.getContext('2d');
            if(smallCtx) {
                smallCtx.clearRect(0, 0, smallCtx.canvas.width, smallCtx.canvas.height);
                smallCtx.drawImage(bgRef.current, 0, 0, smallCtx.canvas.width, smallCtx.canvas.height);
                smallCtx.drawImage(canvasRef.current, 0, 0, smallCtx.canvas.width, smallCtx.canvas.height);
            }
        }
    };

    useEffect(() => copyCanvasToSmall(), [bg]);

}