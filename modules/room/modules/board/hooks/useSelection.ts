import { useOptionsValue } from "@/common/recoil/options";
import { useCtx } from "./useCtx";
import { useRefs } from "@/modules/room/hooks/useRefs";
import { useMoveImage } from "@/modules/room/hooks/useMoveImage";
import { useEffect, useMemo } from "react";
import { Move } from "@/common/types/global";
import { socket } from "@/common/lib/socket";
import { DEFAULT_MOVE } from "@/common/constants/defaultMove";


let tempSelection = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
};

export const useSelection = (drawAllMoves: () => Promise<void>) => {
    const ctx = useCtx();
    const options = useOptionsValue();
    const { selection } = options;
    const { bgRef, selectionRefs} = useRefs();
    const { setMoveImage } = useMoveImage();

    useEffect(() => {
        const callback = async () => {
            await drawAllMoves();

            if (ctx && selection) {
                setTimeout(() => {
                    const { x, y, width, height } = selection;

                    ctx.lineWidth = 2;
                    ctx.strokeStyle = '#000';
                    ctx.setLineDash([5,10]);
                    ctx.globalCompositeOperation = 'source-over';

                    ctx.beginPath();
                    ctx.rect(x, y, width, height);
                    ctx.stroke();
                    ctx.closePath();

                    ctx.setLineDash([]);
                }, 10);
            }
        };

        if (
            tempSelection.width !== selection?.width ||
            tempSelection.height !== selection?.height ||
            tempSelection.x !== selection?.x ||
            tempSelection.y !== selection?.y
        )
            callback();

            return () => {
                if (selection) tempSelection = selection;
            };
    }, [selection, ctx]);

    const dimension = useMemo(() => {
        if (selection) {
            let { x, y, width, height } = selection;

            if (width < 0) {
                width += 4;
                x -= 2;
            } else {
                width -= 4;
                x += 2;
            }
            if (height < 0) {
                height += 4;
                y -= 2;
            } else {
                height -= 4;
                y += 2;
            }

            return { x, y, width, height };
        }

        return {
            width: 0,
            height: 0,
            x: 0,
            y: 0,
        };
    }, [selection]);

    const makeBlob = async (withBg?: boolean) => {
        if (!selection) return null;

        const { x, y, width, height } = dimension;

        const imageData = ctx?.getImageData(x, y, width, height);

        if(imageData) {
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = width;
            tempCanvas.height = height;
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const tempCtx = canvas.getContext('2d');

            if (tempCtx && bgRef.current) {
                const bgImage = bgRef.current.getContext('2d')?.getImageData(x, y, width, height);

                if(bgImage && withBg) tempCtx.putImageData(bgImage, 0, 0);

                const sTempCtx = tempCanvas.getContext('2d');
                sTempCtx?.putImageData(imageData, 0, 0);

                tempCtx.drawImage(tempCanvas, 0, 0);

                const blob: Blob = await new Promise((resolve) => {
                    canvas.toBlob((blobGenerated) => {
                        if (blobGenerated) resolve(blobGenerated);
                    });
                });

                return blob;
            }
        }
        return null;
    };

    const createDeleteMove = () => {
        if(!selection) return null;

        let { x, y, width, height} = dimension;

        if(width < 0) {
            width += 4;
            x -= 2;
        } else {
            width -= 4;
            x += 2;
        }
        if (height < 0) {
            height += 4;
            y -= 2;
        } else {
            height -= 4;
            y += 2;
        }

        const move: Move = {
            ...DEFAULT_MOVE,
            rect: {
                width,
                height,
            },
            path: [[x, y]],
            options: {
                ...options,
                shape: 'rect',
                mode: 'eraser',
                fillColor: { r: 0, g: 0, b: 0, a: 1 },
            },
        };

        socket.emit('draw', move);

        return move;
    };


}