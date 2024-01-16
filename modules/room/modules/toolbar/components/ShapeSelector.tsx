import { useOptions } from "@/common/recoil/options";
import { Shape } from "@/common/types/global";
import { useRef, useState } from "react";
import { BsCircle } from "react-icons/bs";
import { CgShapeZigzag } from "react-icons/cg";
import { useClickAway } from "react-use";
import { BiRectangle } from 'react-icons/bi'
import { AnimatePresence, motion } from "framer-motion";
import { EntryAnimation } from "../animations/Entry.animations";


const ShapeSelector = () => {
    const [options, setOptions] = useOptions();

    const ref = useRef<HTMLDivElement>(null);

    const [opened, setOpened] = useState(false);

    //To detect clicks outside the component and close the shape selector if needed
    useClickAway(ref, () => setOpened(false));

    const handleShapeChange = (shape: Shape) => {
        setOptions((prev) => ({
            ...prev,
            shape,
        }));

        setOpened(false);
    };

    return (
        <div className="relative flex items-center" ref={ref}>
            <button className="btn-icon text-2xl" disabled={options.mode === 'select'} onClick={() => setOpened((prev) => !prev)}>
                {options.shape === 'circle' && <BsCircle />}
                {options.shape === 'rect' && <BiRectangle />}
                {options.shape === 'line' && <CgShapeZigzag />}
            </button>

            <AnimatePresence>
                {opened && (
                    <motion.div className="absolute left-14 z-10 flex gap-1 rounded-lg border bg-zinc-900 p-2 md:border-0"
                    variants={EntryAnimation}
                    initial="from"
                    animate="to"
                    exit="from"                    
                    >
                    <button className="btn-icon text-2xl" onClick={() => handleShapeChange('line')}>
                        <CgShapeZigzag />
                    </button>

                    <button className="btn-icon text-2xl" onClick={() => handleShapeChange('circle')}>
                        <BsCircle />
                    </button>

                    <button className="btn-icon text-2xl" onClick={() => handleShapeChange('rect')}>
                        <BiRectangle />
                    </button>

                   
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )

}

export default ShapeSelector;