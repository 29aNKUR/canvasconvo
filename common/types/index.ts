import { RgbaColor } from "react-colorful";

export type shape = 'line' | 'circle' | 'rect' | 'image';
export type CtxMode = 'eraser' | 'draw' | 'select';

export interface Move {
    
}

export type Room = {
    userMoves: Map<string, Move[]>;
    drawed: Move[];
    users: Map<string, string>;
}