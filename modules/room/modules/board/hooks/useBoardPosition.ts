import { roomContext } from "@/modules/room/context/Room.context";
import { useContext } from "react";

export const useBoardPosition = () => {
    const { x, y } = useContext(roomContext);

    return { x, y };
}