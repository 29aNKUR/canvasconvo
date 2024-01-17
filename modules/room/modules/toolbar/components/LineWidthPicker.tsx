import { useOptions } from "@/common/recoil/options";
import { AnimatePresence, motion } from "framer-motion";
import { useRef, useState } from "react";
import { BsBorderWidth } from "react-icons/bs";
import { useClickAway } from "react-use";
import { EntryAnimation } from "../animations/Entry.animations";

const LineWidthPicker = () => {
  const [options, setOptions] = useOptions();

  const ref = useRef<HTMLDivElement>(null);

  const [opened, setOpened] = useState(false);

  useClickAway(ref, () => setOpened(false));

  return (
    <div className="relative flex items-center" ref={ref}>
      <button
        className="btn-icon text-xl"
        onClick={() => setOpened(!opened)}
        disabled={options.mode === "select"}
      >
        {/* icon with 3 horizontal lines with gradual increase in width */}
        <BsBorderWidth />
      </button>
      <AnimatePresence>
        {opened && (
          <motion.div
            className="absolute top-[6px] left-14 w-36"
            variants={EntryAnimation}
            initial="from"
            animate="to"
            exit="from"
          >
            {/* range make a slider */}
            <input
              type="range"
              min={1}
              max={20}
              value={options.lineWidth}
              onChange={(e) =>
                setOptions((prev) => ({
                  ...prev,
                  lineWidth: parseInt(e.target.value, 10),
                }))
              }
            //   appearance-none - removes default styling provided by the browser
              className="h-4 w-full cursor-pointer appearance-none rounded-lg bg-gray-200"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LineWidthPicker;
