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

    // Listen for a 'check_room' event on the socket
    socket.on("check_room", (roomId) => {
      // Check if the 'rooms' object has a key matching the provided 'roomId'
      if (rooms.has(roomId)) {
        // If the room exists, emit a 'room_exists' event with the value 'true' to the current socket
        socket.emit("room_exists", true);
      } else {
        // If the room does not exist, emit a 'room_exists' event with the value 'false' to the current socket
        socket.emit("room_exists", false);
      }
    });

    // Listen for a 'join_room' event on the socket
    /*The code listens for a 'join_room' event on the socket. This event is expected to carry two parameters - roomId (the ID of the room the user wants to join) and username (the username associated with the user) */
    socket.on("join_room", (roomId, username) => {
      // Retrieve the room object associated with the provided 'roomId' from the 'rooms' data structure
      const room = rooms.get(roomId);

      // Check if the room exists and if it has fewer than 12 users
      if (room && room.users.size < 12) {
        // If the conditions are met, make the socket join the specified room
        socket.join(roomId);

        // Update the 'users' Map in the 'room' object with the new user's information
        room.users.set(socket.id, username);

        // Initialize an empty array for the user's moves (assuming 'room.usersMoves' is a Map)
        room.usersMoves.set(socket.id, []);

        // Emit a 'joined' event to the current socket with the 'roomId' as a confirmation
        io.to(socket.id).emit("joined", roomId);
      } else {
        // If the room doesn't exist or has reached its user limit, emit a 'joined' event with an empty 'roomId'
        // and a boolean 'true' indicating that the join operation failed
        io.to(socket.id).emit("joined", "", true);
      }
    });

    /*The code listens for a 'joined_room' event on the socket. This event is likely triggered after a successful room join operation */
    socket.on("joined_room", () => {
      /*It calls the getRoomId function to obtain the current roomId. This function determines the room ID that the socket has joined based on its presence in multiple rooms (as indicated by socket.rooms). */
      const roomId = getRoomId();

      /* The code then retrieves the room object associated with the obtained roomId from the rooms data structure. If the room doesn't exist, it exits the function, indicating that something went wrong */
      const room = rooms.get(roomId);
      if (!room) return;

      /*It emits a 'room' event to the current socket. This event includes information about the room (room), the user moves (room.usersMoves), and the users in the room (room.users). The information is serialized into JSON format before sending */
      /*room, room.usersMoves, room.users are all objects and JSON.stringify to convert them into JSON strings before sending them to the client. We can use JSON.parse to convert these strings back into Javascript objects on the client side */
      io.to(socket.id).emit(
        "room",
        room,
        JSON.stringify([...room.usersMoves]),
        JSON.stringify([...room.users])
      );

      /*It broadcasts a 'new_user' event to all sockets in the room (except the current socket). This event includes the socket ID of the new user (socket.id) and their username (room.users.get(socket.id) || 'Anonymous'). The username is retrieved from the room.users Map, and if not found, a default value of 'Anonymous' is used */
      /*In the socket.broadcast.to(roomId).emit("new_user", socket.id, room.users.get(socket.id) || "Anonymous"); line, socket.broadcast is used to broadcast an event to all sockets in the given room except the current socket.
        The .to(roomId) part specifies the room to which the broadcast should be sent. Only the sockets in that room will receive the broadcasted event.
        The socket.id is excluded from receiving the broadcast because the socket.broadcast method excludes the current socket that initiated the event. The event is emitted to all other sockets in the specified room.
        This mechanism ensures that the information about the new user is sent to all other users in the room except the user who just joined (socket.id). The new user is identified by their socket ID (socket.id), and their username is retrieved from room.users.get(socket.id) || "Anonymous". If the username is not found, a default value of 'Anonymous' is used. */
      socket.broadcast
        .to(roomId)
        .emit("new_user", socket.id, room.users.get(socket.id) || "Anonymous");
    });

    socket.on("leave_room", () => {
      const roomId = getRoomId();
      leaveRoom(roomId, socket.id);

      /*After leaving the room, the code emits a 'user_disconnected' event to all sockets in the room using io.to(roomId).emit('user_disconnected', socket.id).
        This event likely informs other users in the same room that a specific user (socket.id) has disconnected/left the room. The client-side code can then handle this event and update the UI accordingly, such as removing the disconnected user from the user list */
      io.to(roomId).emit("user_disconnected", socket.id);
    });

    // Listen for the 'draw' event from a client
    //this code handles a drawing event from a client, generates a unique identifier for the move, stores the move information on the server, and then broadcasts the move to all other users in the same room, providing real-time updates to the clients
    socket.on("draw", (move) => {
      // Get the room ID associated with the current socket connection
      const roomId = getRoomId();

      // Get the current timestamp
      const timestamp = Date.now();

      // Generate a unique ID for the move using the v4 function
      move.id = v4();

      // Add the move information to the server's data store (not provided in the code snippet)
      addMove(roomId, socket.id, { ...move, timestamp });

      // Emit an event to the current socket (the user who initiated the draw event)
      //This line emits a custom event 'your_move' to the current socket (user) with the drawing move information. This allows the user who initiated the draw event to receive real-time feedback about their own move.
      io.to(socket.id).emit("your_move", { ...move, timestamp });

      //This line broadcasts the drawing move to all other sockets in the same room (roomId) using socket.broadcast.to(roomId). The event 'user_draw' is emitted, and it includes the drawing move information and timestamp. The last parameter, socket.id, is likely used to identify which user made the drawing move and can be used for various purposes in the client-side code.
      socket.broadcast
        .to(roomId)
        .emit("user_draw", { ...move, timestamp }, socket.id);
    });

    // Listen for the 'undo' event from a client
    socket.on("undo", () => {
      const roomId = getRoomId();

      // Call the undoMove function to handle undoing a move
      undoMove(roomId, socket.id);

      // Broadcast an 'user_undo' event to all other sockets in the same room
      socket.broadcast.to(roomId).emit("user_undo", socket.id);
    });

    // Listen for the 'mouse_move' event from a client
    // /This section listens for the 'mouse_move' event, which is likely triggered by a client when a mouse movement occurs. It then broadcasts a 'mouse_moved' event to all other sockets in the same room, relaying the new mouse coordinates (x, y) and the socket ID of the client that initiated the event
    socket.on("mouse_move", (x, y) => {
      socket.broadcast.to(getRoomId()).emit("mouse_moved", x, y, socket.id);
    });

    // Listen for the 'send_msg' event from a client
    socket.on("send_msg", (msg) => {
       // Broadcast a 'new_msg' event to all sockets in the same room
      io.to(getRoomId()).emit("new_msg", socket.id, msg);
    });

    // Listen for the 'disconnecting' event when a client is about to disconnect
    socket.on("disconnecting", () => {
      const roomId = getRoomId();

        // Call the leaveRoom function to handle the user leaving the room
      leaveRoom(roomId, socket.id);

      // Broadcast a 'user_disconnected' event to all sockets in the same room
      io.to(roomId).emit("user_disconnected", socket.id);
    });
  });

  // the app.all("*", (req, res) => nextHandler(req, res)); code creates a route that matches any HTTP method and any path. When a request matches this route, the nextHandler function is called to handle the request and send a response. This catch-all route is often used for scenarios where you want to define a default behavior for any unmatched routes or perform some common tasks for all incoming requests.
  app.all("*", (req: any, res: any) => nextHandler(req, res));

  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});

/*Why is the user's ID the same as the socketId?

In many Socket.IO applications, especially those involving real-time collaboration or communication, each connected client (or user) is identified by a unique identifier. This identifier is often the socket.id assigned by Socket.IO when a client connects. The socket.id is unique to each client socket connection.
In the given code, the assumption seems to be that a user is uniquely identified by their socket ID within the context of the application. Therefore, the socketId serves as a convenient and unique identifier for users */
