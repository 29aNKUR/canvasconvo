import { COLORS_ARRAY } from "@/common/constants/color";
import { socket } from "@/common/lib/socket";
import { useRoom, useSetRoom, useSetUsers } from "@/common/recoil/room/room.hooks";
import { Move, User } from "@/common/types/global";
import { MotionValue, useMotionValue } from "framer-motion"
import { createContext, RefObject, Dispatch, SetStateAction, ReactChild, useRef, useState, useEffect } from "react";
import { toast } from "react-toastify";

// Creating a React context for the room state
export const roomContext = createContext<{
    x: MotionValue<number>;
    y: MotionValue<number>;
    undoRef: RefObject<HTMLButtonElement>;
    redoRef: RefObject<HTMLButtonElement>;
    canvasRef: RefObject<HTMLCanvasElement>;
    bgRef: RefObject<HTMLCanvasElement>;
    selectionRefs: RefObject<HTMLButtonElement[]>;
    minimapRef: RefObject<HTMLCanvasElement>; 
    moveImage: { base64: string; x?: number; y?: number};
    setMoveImage: Dispatch<
        SetStateAction<{
            base64: string;
            x?: number | undefined;
            y?: number | undefined;
        }>
    >;
}>(null!);

const RoomContextProvider = ({ children }: { children: ReactChild }) => {
    // Hooks for managing Recoil state
    const setRoom = useSetRoom();
    const { users } = useRoom();
    const { handleAddUser, handleRemoveUser } = useSetUsers();

    // Refs for DOM elements
    const undoRef = useRef(null);
    const redoRef = useRef(null);
    const canvasRef = useRef(null);
    const bgRef = useRef(null);
    const minimapRef = useRef(null);
    const selectionRefs = useRef([]);

    // State for move image details
    const [moveImage, setMoveImage] = useState<{
        base64: string;
        x?: number;
        y?: number;
    }>({ base64: '' });

    // Using framer-motion to track motion values
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    useEffect(() => {
        // Event listeners for socket events related to the room
        socket.on('room', (room: { drawed: any; }, usersMovesToParse: string, usersToParse: string) => {
            const usersMoves = new Map<string, Move[]>(JSON.parse(usersMovesToParse));
            const usersParsed = new Map<string, string>(JSON.parse(usersToParse));
        
            const newUsers = new Map<string, User>();

            usersParsed.forEach((name, id) => {
                if(id === socket.id) return;

                const index = [...usersParsed.keys()].indexOf(id);

                const color = COLORS_ARRAY[index % COLORS_ARRAY.length];

                newUsers.set(id, {
                    name,
                    color,
                });
            });
        
            setRoom((prev) => ({
                ...prev,
                users: newUsers,
                usersMoves,
                movesWithoutUser: room.drawed,
            }));
        });

        socket.on('new_user', (userId: string, username: string) => {
            toast(`${username} has joined the room.`, {
                position: 'top-center',
                theme: 'colored',
            });

            handleAddUser(userId, username);
        });

        socket.on('user_disconnected', (userId: string) => {
            toast(`${users.get(userId)?.name || 'Anonymous'} has left the room.`, {
                position: 'top-center',
                theme: 'colored',
            });

            handleRemoveUser(userId);
        });

        return () => {
            socket.off('room');
            socket.off('new_user');
            socket.off('user_disconnected');
        };
    }, [handleAddUser, handleRemoveUser, setRoom, users]);
    
    return (
        <roomContext.Provider
        value={{
            x,
            y,
            bgRef,
            undoRef,
            redoRef,
            canvasRef,
            setMoveImage,
            moveImage,
            minimapRef,
            selectionRefs,
        }}
        >
            {children}
        </roomContext.Provider>
    );
};

export default RoomContextProvider;