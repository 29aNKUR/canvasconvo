import { socket } from "@/common/lib/socket";
import { useRoom } from "@/common/recoil/room";


const MousesRenderer = () => {
    const { users } = useRoom();

    return (
        <>
            {[...users.keys()].map((userId) => {
                if(userId === socket.id) return null;
                return <UserMouse userId={userId} key={userId} />
            })}
        </>
    )
}