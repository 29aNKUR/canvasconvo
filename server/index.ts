import { createServer } from "http";
import express from "express";
import next, { NextApiHandler } from "next";
import { Server } from "socket.io";
import { v4 } from "uuid";

import {
  Room,
  Move,
  ClientToServerEvents,
  ServerToClientEvents,
} from "@/common/types/global";

const port = parseInt(process.env.PORT || "3000", 10);
const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const nextHandler: NextApiHandler = nextApp.getRequestHandler();

//Socket.IO connection handing
nextApp.prepare().then(() => {
  const app = express();
  const server = createServer(app);

  const io = new Server<ClientToServerEvents, ServerToClientEvents>(server);

  app.get("/hello", async (_, res) => {
    res.send("hello world");
  });

  const rooms = new Map<string, Room>();

  /*addMove function ensures that user moves are stored in the usersMoves Map within the appropriate room. If the user is not already present, a new entry is initialized with the first move. If the user is present, the move is simply added to the existing array of moves. */
  const addMove = (roomId: string, socketId: string, move: Move) => {
    /*rooms.get(roomId) retrieves the room object associated with the provided roomId from the rooms Map.
    The ! is a non-null assertion operator, indicating that TypeScript should consider room as non-null. This assumes that the roomId is valid, and there's a corresponding room in the rooms Map. */
    const room = rooms.get(roomId)!;
    /*rooms.get(roomId) retrieves the room object associated with the provided roomId from the rooms Map.
    The ! is a non-null assertion operator, indicating that TypeScript should consider room as non-null. This assumes that the roomId is valid, and there's a corresponding room in the rooms Map. */
    if (!room.users.has(socketId)) {
      /*room.usersMoves.set(socketId, [move]) initializes an entry in the usersMoves Map.
    The key is the socketId, and the associated value is an array containing the initial move.*/
      room.usersMoves.set(socketId, [move]);
    }
    /*room.usersMoves.get(socketId) retrieves the array associated with the socketId from the usersMoves Map.
    The ! is again a non-null assertion, assuming that the entry for the socketId was initialized in the previous step.
    push(move) adds the new move object to the array. */
    room.usersMoves.get(socketId)!.push(move);
  };

  /*undoMove function is designed to undo the last move made by a user in a specific room. It achieves this by accessing the array of moves associated with the socketId in the usersMoves Map and removing the last element (i.e., undoing the last move). */
  const undoMove = (roomId: string, socketId: string) => {
    const room = rooms.get(roomId)!;
    /*room.usersMoves.get(socketId) retrieves the array associated with the socketId from the usersMoves Map. */
    room.usersMoves.get(socketId)!.pop();
  };

  //Socket.IO Connection Event Handling
  io.on("connection", (socket) => {
    /*getRoomId is a function defined within the connection event. It is responsible for determining the room identifier associated with the current socket. */
    const getRoomId = () => {
      /*socket.rooms is a Set-like object containing the unique identifiers (room IDs) of all the rooms the socket is currently in.
        The spread operator [...socket.rooms] is used to convert the Set-like object into an array.
        The find method is then employed to search for a room ID that is not equal to the socket's own ID (socket.id). The assumption here is that a socket is usually in multiple rooms, and we want to find the room it has joined. */
      /*this code is finding the room ID that the socket has joined, excluding its own ID from the list of rooms. It's a common pattern when dealing with socket connections in a multi-room setup */
      const joinedRoom = [...socket.rooms].find((room) => room !== socket.id);

      /*If the joinedRoom is falsy (i.e., the socket is not in any room other than its own), the function returns the socket's own ID (socket.id). This is a fallback, assuming that the socket is considered to be in its own room if it's not found in any other rooms. */
      if (!joinedRoom) return socket.id;

      /*If the joinedRoom is truthy, meaning the socket is found in another room, the function returns the ID of that room */
      return joinedRoom;
    };

    /*leaveRoom function is designed to handle the logic when a user leaves a room. It takes care of moving user-specific drawing moves to a shared drawed array, removing the user from the users Map, and instructing the socket to leave the Socket.IO room */
    /* the use of socketId as the user's unique identifier simplifies user management, and moving user moves to the drawed array ensures that the drawings contributed by the leaving user are retained and visible to others in the shared drawing space. */
    const leaveRoom = (roomId: string, socketId: string) => {
      const room = rooms.get(roomId);
      if (!room) return;

      /*This line retrieves the moves (an array) of the specific user (socketId) from the usersMoves Map within the room object. */
      const userMoves = room.usersMoves.get(socketId);

      /*If the user has previous moves (userMoves exists), it pushes these moves into the drawed array of the room. This is likely a mechanism to store or broadcast the drawn elements to all users in the room. */
      if (userMoves) room.drawed.push(...userMoves);

      /*This line removes the user (socketId) from the users Map within the room object. The assumption here is that each user is associated with a unique socket ID. */
      room.users.delete(socketId);
      /* this line instructs the socket associated with this operation to leave the specified Socket.IO room (roomId). This is a Socket.IO method that manages rooms and helps organize sockets. */
      socket.leave(roomId);
    };

    //'create_room' Event Handling
    socket.on("create_room", (username) => {
      // Generate a unique room ID
      let roomId: string;
      /*The do-while loop generates a random string (roomId) using Math.random() and toString(36) functions. The substring(2, 6) extracts a portion of the string, creating a short identifier.
The loop ensures that the generated roomId is unique by checking if it already exists in the rooms map. If it does, the loop generates a new roomId until a unique one is found */
      do {
        roomId = Math.random().toString(36).substring(2, 6);
      } while (rooms.has(roomId));

      //Join the room
      /*The socket.join(roomId) method makes the current socket (user) join the room with the newly created roomId. This is a Socket.IO feature that allows a socket to be part of one or more "rooms." */
      socket.join(roomId);

      //Create and Add a new Room object to the 'rooms' Map
      /*A new room object is created with three properties:
usersMoves: A Map containing the current user's socket ID mapped to an empty array. This array will store the drawing moves made by the users in the room.
drawed: An empty array that will store the collective drawing made by all users in the room.
users: A Map containing the current user's socket ID mapped to their username. */
      rooms.set(roomId, {
        usersMoves: new Map([[socket.id, []]]),
        drawed: [],
        users: new Map([[socket.id, username]]),
      });

      //Emit a 'created' event
      /*The io.to(socket.id).emit('created', roomId) emits a 'created' event to the current user, providing them with the newly created roomId. This allows the client to know the ID of the room they have just created. */
      io.to(socket.id).emit("created", roomId);
    });
  });
});

/*Why is the user's ID the same as the socketId?

In many Socket.IO applications, especially those involving real-time collaboration or communication, each connected client (or user) is identified by a unique identifier. This identifier is often the socket.id assigned by Socket.IO when a client connects. The socket.id is unique to each client socket connection.
In the given code, the assumption seems to be that a user is uniquely identified by their socket ID within the context of the application. Therefore, the socketId serves as a convenient and unique identifier for users */
