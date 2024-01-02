import { MotionValue } from "framer-motion";

export const getPos = (pos: number, motionValue: MotionValue) => {
    //we can set and get the value using motionValue
    pos - motionValue.get();
}