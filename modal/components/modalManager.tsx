// import { motion, AnimatePresence } from "framer-motion"

import Portal from "@/common/components/portal/portal";
import { useEffect, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { modalAtom } from "../recoil/modal.atom";
import { motion, AnimatePresence } from "framer-motion";
import { bgAnimation, modalAnimation } from "../animations/modalAnimation";

const ModalManager = () => {
  const [portalNode, setPortalNode] = useState<HTMLElement | null>(null);

  const [{ opened, modal }, setModal] = useRecoilState(modalAtom);

  useEffect(() => {
    if(!portalNode) {
      const node = document.getElementById("portal");
      if (node) setPortalNode(node);
      return;
    }

    if (opened) {
      portalNode.style.pointerEvents = 'all';
    } else {
      portalNode.style.pointerEvents = 'none';
    }   
  }, [opened, portalNode]);

  return (
    <Portal>
        <motion.div
          className="absolute z-40 flex min-h-full w-full items-center justify-center bg-black/80"
          onClick={() => setModal({ modal: <></>, opened: false})}
          variants={bgAnimation}
          initial="closed"
          animate={opened ? 'opened' : 'closed'}
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
    </Portal>
  );
};

export default ModalManager;
