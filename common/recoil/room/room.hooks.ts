import { useDispatch, useSelector } from "react-redux";
import { setRoom } from "./roomSlice";


export const useRoom = () => {
    const room = useSelector((state: any) => state.room);
    return room;
}

export const useSetRoom = () => {
    const dispatch = useDispatch();

    const setRoomFunc = (newRoom: any) => {
        dispatch(setRoom({newRoom}));
    }
    return setRoomFunc;
}

export const useSetRoomId = () => {
    const dispatch = useDispatch();

    const handleSetRoomId = (id: string) => {
        dispatch(setRoom((prev: any) => ({
            ...prev,
            id,
        })));
    };

    return handleSetRoomId;
}

// export const useSetUsers = () => {
//     const dispatch = useDispatch();

//     const handleAddUser = (userId: string, name: string) => {
//         dispatch(setRoom)
//     }
// }

