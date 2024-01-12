import { useRecoilValue, useSetRecoilState } from "recoil"
import { savedMovesAtom } from "./savedMoves.atom";
import { Move } from "@/common/types/global";

// Hook for updating the state of saved moves
export const useSetSavedMoves = () => {
    // Access the Recoil state and the setter function
    const SetSavedMoves = useSetRecoilState(savedMovesAtom);

    // Function to add a new move to the saved moves
    const addSavedMove = (move: Move) => {
         // Check if the move is a 'select' mode; if so, do not add to saved moves
        if(move.options.mode === 'select') return;
        
        // Update the saved moves state by prepending the new move
        SetSavedMoves((prevMoves) => [move, ...prevMoves]);
    };

    // Function to remove and return the first move from saved moves
    const removeSavedMove = () => {
        let move: Move | undefined;

        SetSavedMoves((prevMoves) => {
            move = prevMoves.at(0);

            return prevMoves.slice(1);
        });

        return move;
    };

    // Function to clear all saved moves
    const clearSavedMoves = () => {
        // Update the saved moves state to an empty array
        SetSavedMoves([]);
    };

    // Return the functions for external use
    return { addSavedMove, removeSavedMove, clearSavedMoves }; 
};

// Hook for accessing the current state of saved moves
export const useSavedMoves = () => {
    // Access the current value of saved moves from Recoil state
    const savedMoves = useRecoilValue(savedMovesAtom);

    return savedMoves;
}