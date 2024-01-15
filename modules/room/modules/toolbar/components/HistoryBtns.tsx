import { useMyMoves } from "@/common/recoil/room";
import { useSavedMoves } from "@/common/recoil/savedMoves";
import { useRefs } from "@/modules/room/hooks/useRefs";
import { FaRedo, FaUndo } from "react-icons/fa";

const HistoryBtns = () => {
  const { redoRef, undoRef } = useRefs();

  const { myMoves } = useMyMoves();
  const savedMoves = useSavedMoves();

  return (
    <>
      {/* disabled prop is used to control whether the buttons are clickable based on the availability of redo and undo actions */}
      <button
        className="btn-icon text-xl"
        ref={redoRef}
        //moves saved to savedMoves atom if any
        disabled={!savedMoves.length}
      >
        <FaRedo />
      </button>
      <button
        className="btn-icon text-xl"
        ref={undoRef}
        //moves saved to myMoves using useMyMoves if any
        disabled={!myMoves.length}
      >
        <FaUndo />
      </button>
    </>
  );
};

export default HistoryBtns;
