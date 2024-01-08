import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil"
import { DEFAULT_ROOM, roomAtom } from "./room.atom"
import { getNextColor } from "@/common/lib/getNextColor";
import { Move } from "@/common/types/global";


//This hook provides read-only access to the current state of the roomAtom.
export const useRoom = () => {
    const room = useRecoilValue(roomAtom);

    return room;
};

//This hook provides the setRoom function, which can be used to update the state of the roomAtom.
export const useSetRoom = () => {
    const setRoom = useSetRecoilState(roomAtom);

    return setRoom;
};

//This hook provides a function handleSetRoomId that can be used to update the room's id while preserving other default values.
//In a component, we can call useSetRoomId() to get the handleSetRoomId function.
export const useSetRoomId = () => {
    const setRoomId = useSetRecoilState(roomAtom);

    const handleSetRoomId = (id: string) => {
        setRoomId({...DEFAULT_ROOM, id});
    };

    return handleSetRoomId;
}

//This hook provides functions (handleAddUser, handleRemoveUser, handleAddMoveToUser, handleRemoveMoveFromUser) for manipulating the users and usersMoves properties in the room.
export const useSetUsers = () => {
    const setRoom = useSetRecoilState(roomAtom);

    const handleAddUser = (userId: string, name: string) => {
        setRoom((prev) => {
            const newUsers = prev.users;
            const newUsersMoves = prev.usersMoves;

            const color = getNextColor([...newUsers.values()].pop()?.color);

            newUsers.set(userId, {
                name,
                color,
            });
            newUsersMoves.set(userId, []);
        
            return { ...prev, users: newUsers, usersMoves: newUsersMoves};
        });
    };

    const handleRemoveUser = (userId: string) => {
        setRoom((prev) => {
            const newUsers = prev.users;
            const newUsersMoves = prev.usersMoves;

            const usersMoves = newUsersMoves.get(userId);

            newUsers.delete(userId);
            newUsersMoves.delete(userId);
            return {
                ...prev,
                users: newUsers,
                usersMoves: newUsersMoves,
                movesWithoutUser: [ ...prev.movesWithoutUser, ...(usersMoves || [])],
            };   
        });
    };

    const handleAddMoveToUser = (userId: string, moves: Move) => {
        setRoom((prev) => {
            const newUsersMoves = prev.usersMoves;
            const oldMoves = prev.usersMoves.get(userId);

            newUsersMoves.set(userId, [...(oldMoves || []), moves]);
            return { ...prev, usersMoves: newUsersMoves };
        });
    };

    const handleRemoveMoveFromUser = (userId: string) => {
        setRoom((prev) => {
            const newUsersMoves = prev.usersMoves;
            const oldMoves = prev.usersMoves.get(userId);
            oldMoves?.pop();

            newUsersMoves.set(userId, oldMoves || []);
            return { ...prev, usersMoves: newUsersMoves };
        });
    };

    return {
        handleAddUser,
        handleRemoveUser,
        handleAddMoveToUser,
        handleRemoveMoveFromUser
    };
};
 

export const useMyMoves = () => {
    const [room, setRoom] = useRecoilState(roomAtom);

    const handleAddMyMove = (move: Move) => {
        setRoom((prev) => {
            if(prev.myMoves[prev.myMoves.length - 1]?.options.mode === 'select')
            return {
                ...prev,
                myMoves: [...prev.myMoves.slice(0, prev.myMoves.length - 1), move],
            };

            return { ...prev, myMoves: [...prev.myMoves, move] };
        
        });
    };

    const handleRemoveMyMove = () => {
        const newMoves = [...room.myMoves];
        const move = newMoves.pop();

        setRoom((prev) => ({ ...prev, myMoves: newMoves }));

        return move;
    };

    return { handleAddMyMove, handleRemoveMyMove, myMoves: room.myMoves };
}; 