import { useRecoilValue, useSetRecoilState } from "recoil"
import { savedMovesAtom } from "./savedMoves.atom";
import { Move } from "@/common/types/global";

export const useSetSavedMoves = () => {
    const SetSavedMoves = useSetRecoilState(savedMovesAtom);

    const addSavedMove = (move: Move) => {
        if(move.options.mode === 'select') return;
        
        SetSavedMoves((prevMoves) => [move, ...prevMoves]);
    };

    const removeSavedMove = () => {
        let move: Move | undefined;

        SetSavedMoves((prevMoves) => {
            move = prevMoves.at(0);

            return prevMoves.slice(1);
        });

        return move;
    };

    const clearSavedMoves = () => {
        SetSavedMoves([]);
    };

    return { addSavedMove, removeSavedMove, clearSavedMoves }; 
};

export const useSavedMoves = () => {
    const savedMoves = useRecoilValue(savedMovesAtom);

    return savedMoves;
}