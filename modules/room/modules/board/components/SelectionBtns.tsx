// The SelectionBtns component displays three buttons (Move, Copy, Delete) for handling actions related to a selection on the board
import { useOptionsValue } from "@/common/recoil/options";
import { useRefs } from "@/modules/room/hooks/useRefs";
import { useBoardPosition } from "../hooks/useBoardPosition";
import { useEffect, useState } from "react";
import { BsArrowsMove } from "react-icons/bs";
import { FiCopy } from "react-icons/fi";
import { AiOutlineDelete } from "react-icons/ai";

const SelectionBtns = () => {
    // Retrieve the current selection from Recoil state
  const { selection } = useOptionsValue();  

  // Access the refs for selection buttons from the useRefs hook
  const { selectionRefs } = useRefs();

   // Get the current board position using the useBoardPosition hook
  const boardPos = useBoardPosition();

  // State variables to track the board's X and Y positions
  const [boardX, setX] = useState(0);
  const [boardY, setY] = useState(0);

  // Update the board's X position when it changes
  useEffect(() => {
    const unsubscribe = boardPos.x.onChange(setX);
    return unsubscribe;
  }, [boardPos.x]);

  // Update the board's Y position when it changes
  useEffect(() => {
    const unsubscribe = boardPos.y.onChange(setY);
    return unsubscribe;
  }, [boardPos.y]);

   // Default positioning for the buttons when there is no selection
  let top = -40;
  let left = -40;

  // If there is a selection, calculate the top and left positions based on selection dimensions
  if (selection) {
    const { x, y, width, height } = selection;
    top = Math.min(y, y + height) - 40 + boardY;
    left = Math.min(x, x + width) + boardX;
  }

  return (
    <div
      className="absolute top-0 left-0 z-50 flex items-center justify-center gap-2"
      style={{ top, left }}
    >
        {/* Move Button */}
      <button
        className="rounded-full bg-gray-200 p-2"
        ref={(ref) => {
          if (ref && selectionRefs.current) selectionRefs.current[0] = ref;
        }}
      >
        <BsArrowsMove />
      </button>

        {/* Copy Button */}
      <button
        className="rounded-full bg-gray-200 p-2"
        ref={(ref) => {
          if (ref && selectionRefs.current) selectionRefs.current[1];
        }}
      >
        <FiCopy />
      </button>

        {/* Delete Button */}
      <button
        className="rounded-full bg-gray-200 p-2"
        ref={(ref) => {
          if (ref && selectionRefs.current) selectionRefs.current[2];
        }}
      >
        <AiOutlineDelete />
      </button>
    </div>
  );
};

export default SelectionBtns;
