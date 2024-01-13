import { socket } from "@/common/lib/socket";
import { MessageType } from "@/common/types/global";

const Message = ({ userId, msg, username, color }: MessageType) => {
    //check If the message is sent by the current user    
    const me = socket.id === userId;

    return (
        <div className={`my-2 flex gap-2 text-clip ${me && 'justify-end text-right'}`}>
        {/* Display the username if the message is not from the current user */}
        {!me && (
            <h5 style = {{ color }} className="font-bold">
                {username}
            </h5>
        )}
        <p className="break-all">{msg}</p>
        </div>
    );
};

export default Message;