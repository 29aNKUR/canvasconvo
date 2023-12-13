// import { motion, AnimatePresence } from "framer-motion"

import { useEffect, useState } from "react";

// export const MyComponent = ({ isVisible }) => (
//   <AnimatePresence>
//     {isVisible && (
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         exit={{ opacity: 0 }}
//       />
//     )}
//   </AnimatePresence>
// )

const modalManager = () => {

    const [portalNode, setPortalNode] = useState();

    useEffect(() => {
        if(!portalNode){
            const node = document.getElementById("portal")
            if(node) setPortalNode(node)
            return;
        }
    })

}

export default modalManager;