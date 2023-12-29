// import { motion, AnimatePresence } from "framer-motion"

import Portal from "@/common/components/portal/portal";
import { useEffect, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { modalAtom } from "../redux/modalSlice";
import { motion, AnimatePresence } from "framer-motion";
import { bgAnimation, modalAnimation } from "../animations/modalAnimation";

const ModalManager = () => {
  const [portalNode, setPortalNode] = useState<HTMLElement | null>(null);

  const [{ opened, modal }, setModal] = useRecoilState(modalAtom);

  useEffect(() => {
    const node = document.getElementById("portal");
    if (node) setPortalNode(node);
  }, []);

  const closeAndStopPropagation = () => {
    setModal({ modal: <></>, opened: false });
  };

  return (
    <div>
      {opened && (
        <motion.div
          className="absolute z-40 flex min-h-full w-full items-center justify-center bg-black/80"
          variants={bgAnimation}
          onClick={closeAndStopPropagation}
          initial="closed"
          animate="opened"
        >
          <AnimatePresence>
            {opened && (
              <motion.div
                className="p-6"
                variants={modalAnimation}
                initial="closed"
                animate="opened"
                exit="exited"
                onClick={(e) => e.stopPropagation}
              >
                {modal}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};

export default ModalManager;
