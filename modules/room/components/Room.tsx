
import { useRoom } from "@/common/recoil/room";
import NameInput from "./NameInput";
import UserList from "./UserList";
import RoomContextProvider from "../context/Room.context";
import ToolBar from "../modules/toolbar";
import Board from "../modules/board";
import Chat from "../modules/chat";

const Room = () => {
  const room = useRoom();

  if (!room.id) return <NameInput />;

  return (
    <RoomContextProvider>
      <div className="relative h-full w-full overflow-hidden">
        <UserList />
        <ToolBar />
        <Board />
        <Chat />
      </div>
    </RoomContextProvider>
  );
};

export default Room;
