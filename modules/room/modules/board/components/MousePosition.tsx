//  this component facilitates real-time tracking and display of the adjusted mouse position on the canvas while handling touch devices appropriately. The adjusted coordinates consider the current view (visible area) on the board, providing accurate information for users interacting with the canvas.
import { useRef } from "react";
import { useBoardPosition } from "../hooks/useBoardPosition";
import { useInterval, useMouse } from "react-use";
import { socket } from "@/common/lib/socket";
import { getPos } from "@/common/lib/getPos";
import { motion } from "framer-motion";

const MousePosition = () => {
  const { x, y } = useBoardPosition();

  const prevPosition = useRef({ x: 0, y: 0 });

  const ref = useRef<HTMLDivElement>(null);

  const { docX, docY } = useMouse(ref);

  const touchDevice = window.matchMedia("(pointer: coarse)").matches;

  useInterval(() => {
    if (
      (prevPosition.current.x !== docX || prevPosition.current.y !== docY) &&
      !touchDevice
    ) {
      socket.emit("mouse_move", getPos(docX, x), getPos(docY, y));
      prevPosition.current = { x: docX, y: docY };
    }
  }, 150);

  if (touchDevice) return null;

  return (
    <motion.div
      ref={ref}
      className="pointer-events-none absolute top-0 left-0 z-50 select-none transition-colors dark:text-white"
      animate={{ x: docX + 15, y: docY + 15 }}
      transition={{ duration: 0.05, ease: "linear" }}
    >
      {getPos(docX, x).toFixed(0)} | {getPos(docY, y).toFixed(0)}
    </motion.div>
  );
};

export default MousePosition;
