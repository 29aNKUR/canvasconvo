import { socket } from "@/common/lib/socket";
import { useRoom } from "@/common/recoil/room";
import { MessageType } from "@/common/types/global";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useList } from "react-use";
import { BsFillChatFill } from "react-icons/bs";
import { FaChevronDown } from "react-icons/fa";
import Message from "./Message";
import ChatInput from "./ChatInput";

const Chat = () => {
  const room = useRoom();

  const msgList = useRef<HTMLDivElement>(null);

  const [newMsg, setNewMsg] = useState(false);
  const [opened, setOpened] = useState(false);
  const [msgs, handleMsgs] = useList<MessageType>([]);

  useEffect(() => {
    const handleNewMsg = (userId: string, msg: string) => {
      const user = room.users.get(userId);

      handleMsgs.push({
        userId,
        msg,
        id: msgs.length + 1,
        username: user?.name || "Anonymous",
        color: user?.color || "#000",
      });

      //if message list present then scroll to the bottom by default(latest msgs visible first)
      if (msgList.current) {
        msgList.current.scrollTop = msgList.current.scrollHeight;
      }

      if (!opened) setNewMsg(true);
    };

    socket.on("new_msg", handleNewMsg);

    return () => {
      socket.off("new_msg", handleNewMsg);
    };
  }, [handleMsgs, msgs, opened, room.users]);

  return (
    <motion.div
      className="absolute bottom-0 z-50 flex h-[300px] w-full flex-col overflow-hidden rounded-t-md sm:left-36 sm:w-[30rem]"
      /*When opened is true, the y property is set to 0, meaning no vertical translation (no movement).
       When opened is false, the y property is set to 260, causing a vertical translation of 260 pixels.*/
      //This creates a smooth vertical animation effect, making the chat component slide up or down based on the opened state.
      animate={{ y: opened ? 0 : 260 }}
      transition={{ duration: 0.2 }}
    >
        {/* whole strip acts as a button to open chat window */}
      <button
        className="flex w-full cursor-pointer items-center justify-between bg-zinc-900 py-2 px-10 font-semibold text-white"
        onClick={() => {
          setOpened((prev) => !prev);
          setNewMsg(false);
        }}
      >
        <div className="flex items-center gap-2">
            {/* balloon icon near chat */}
          <BsFillChatFill className="mt-[-2px]" />
          Chat
          {newMsg && (
            <p className="rounded-md bg-green-500 px-1 font-semibold text-green-900">
              New!
            </p>
          )}
        </div>

        {/* animation for arrow key to open chat window {arrow facing upwards and downwards} */}
        <motion.div
          animate={{ rotate: opened ? 0 : 180 }}
          transition={{ duration: 0.2 }}
        >
          <FaChevronDown />
        </motion.div>

      </button>
      <div className="flex flex-1 flex-col justify-between bg-white p-3">
        {/* chat lists */}
        <div className="h-[190px] overflow-y-scroll pr-2" ref={msgList}>
          {msgs.map((msg) => (
            <Message key={msg.id} {...msg} />
          ))}
        </div>
        {/* chat input box and submit button */}
        <ChatInput />
      </div>
    </motion.div>
  );
};

export default Chat;
