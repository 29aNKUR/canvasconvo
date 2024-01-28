import { useMoveImage } from "@/modules/room/hooks/useMoveImage";
import { useBoardPosition } from "../hooks/useBoardPosition";
import { motion, useMotionValue } from "framer-motion";
import { useEffect } from "react";
import { getPos } from "@/common/lib/getPos";
import { Move } from "@/common/types/global";
import { socket } from "@/common/lib/socket";
import { AiOutlineCheck, AiOutlineClose } from "react-icons/ai";
import { DEFAULT_MOVE } from "@/common/constants/defaultMove";


const MoveImage = () => {
    // Getting the current board position
  const { x, y } = useBoardPosition();

  // Using the useMoveImage hook to get and set the moveImage state
  const { moveImage, setMoveImage } = useMoveImage();

  // Creating motion values for the image X and Y positions
  const imageX = useMotionValue(moveImage.x || 50);
  const imageY = useMotionValue(moveImage.y || 50);

   // Effect to set initial values when moveImage changes
  useEffect(() => {
    if (moveImage.x) imageX.set(moveImage.x);
    else imageX.set(50);
    if (moveImage.y) imageY.set(moveImage.y);
    else imageY.set(50);
  }, [imageX, imageY, moveImage.x, moveImage.y]);

  // Handler to place the image on the canvas
  const handlePlaceImage = () => {
    // Calculating the final X and Y positions based on board position
    const [finalX, finalY] = [getPos(imageX.get(), x), getPos(imageY.get(), y)];

    // Creating a Move object representing the image placement
    const move: Move = {
      ...DEFAULT_MOVE,
      img: { base64: moveImage.base64 },
      path: [[finalX, finalY]],
      options: {
        ...DEFAULT_MOVE.options,
        selection: null,
        shape: "image",
      },
    };

    // Emitting a 'draw' event with the move object to the server
    socket.emit("draw", move);

    // Resetting the moveImage state and image positions
    setMoveImage({ base64: "" });
    imageX.set(50);
    imageY.set(50);
  };

  // If there is no image to place, return null (nothing to render)
  if (!moveImage.base64) return null;

  // Rendering the MoveImage component with motion and buttons for confirmation/cancellation
  return (
    <motion.div
      drag
      dragElastic={0}
      dragTransition={{ power: 0.03, timeConstant: 50 }}
      className="absolute top-0 z-20 cursor-grab"
      style={{ x: imageX, y: imageY }}
    >
      <div className="absolute bottom-full mb-2 flex gap-3">
        {/* Button to confirm placing the image */}
        <button
          className="rounded-full bg-gray-200 p-2"
          onClick={handlePlaceImage}
        >
          <AiOutlineCheck />
        </button>
        {/* Button to cancel placing the image */}
        <button
          className="rounded-full bg-gray-200 p-2"
          onClick={() => setMoveImage({ base64: "" })}
        >
          <AiOutlineClose />
        </button>
      </div>
      {/* Displaying the image to be placed on the canvas */}
      <img
        src={moveImage.base64}
        alt="image to place"
        className="pointer-events-none"//to show image as a visual representation without any interactive functionality
      />
    </motion.div>
  );
};

export default MoveImage;
