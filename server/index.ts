import { createServer } from 'http';
import express from 'express';
import next, { NextApiHandler } from 'next';
import { Server } from 'socket.io';
import { v4 } from 'uuid';

import { Room, Move, ClientToServerEvents, ServerToClientEvents } from '@/common/types/global';
 
const port = parseInt(process.env.PORT || '3000', 10);
const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const nextHandler: NextApiHandler = nextApp.getRequestHandler();
 
nextApp.prepare().then(() => {
    const app = express();
    const server = createServer(app);

    const io = new Server<ClientToServerEvents, ServerToClientEvents>(server);

    app.get("/hello", async(_,res) => {
        res.send("hello world");
    });
 
    const rooms = new Map<string, Room>();
  
    const addMove = (roomId: string, socketId: string, move: Move) => {
        const room = rooms.get(roomId)!;

        if(!room.users.has(socketId)) {
            room.usersMoves.set(socketId, [move]);
        }

        room.usersMoves.get(socketId)!.push(move);
    };

    const undoMove = (roomId: string, socketId: string) => {
        const room = rooms.get(roomId)!;

        room.usersMoves.get(socketId)!.pop();
    };

    io.on('connection', (socket) => {
        const getRoomId = () => {
            const joinedRoom = [...socket.rooms].find((room) => room !== socket.id);

            if(!joinedRoom) return socket.id;

            return joinedRoom; 
        };

        const leaveRoom = (roomId: string, socketId: string) => {
            const room = rooms.get(roomId);
            if(!room) return;

            const userMoves = room.usersMoves.get(socketId);

            if(userMoves) room.drawed.push(...userMoves);
            room.users.delete(socketId);

            socket.leave(roomId);
        }
    })
})