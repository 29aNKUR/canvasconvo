import { RgbaColor } from "react-colorful";

export type Shape = 'line' | 'circle' | 'rect' | 'image';
export type CtxMode = 'eraser' | 'draw' | 'select';

export interface CtxOptions {
    lineWidth: number;
    lineColor: RgbaColor;
    fillColor: RgbaColor;
    shape: Shape;
    mode: CtxMode;
    selection: {
        x: number;
        y: number;
        width: number;
        height: number;
    } | null;
}

export interface Move {
    circle: {
        cX: number;
        cY: number;
        radiusX: number;
        radiusY: number;
    };
    rect: {
        width: number;
        height: number;
    };
    img: {
        base64: string;
    };
    path: [number, number][];
    options: CtxOptions;
    timeStamp: number;
    id: string; 
}

export type Room = {
    userMoves: Map<string, Move[]>;
    drawed: Move[];
    users: Map<string, string>;
}