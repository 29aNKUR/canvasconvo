import { createServer } from 'http';
import express from 'express';
import next, { NextApiHandler } from 'next';
import { Server } from 'socket.io';
import { v4 } from 'uuid';

import { Room, Move } from '@/common/types';
 
const port = parseInt(process.env.PORT || '3000', 10);
const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const nextHandler: NextApiHandler = nextApp.getRequestHandler();
 
nextApp.prepare().then(() => {
    const app = express();
    const server = createServer(app);

    const io = new Server(server);

    app.get("/hello", async(_,res) => {
        res.send("hello world");
    });
 
    const rooms = new Map();
  
    const addMove = (roomId: string, socketId: string, move: Move) => {
        const room = rooms.get(roomId);

        if(!room.users.has(socketId)) {
            room.usersMoves.set(socketId, [move]);
        }

        room.userMoves.get(socketId)!.push(move);
    }

})