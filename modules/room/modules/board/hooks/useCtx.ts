import { useRefs } from "@/modules/room/hooks/useRefs";
import { useEffect, useState } from "react";


export const useCtx = () => {
    const { canvasRef } = useRefs();

    const [ctx, setCtx] = useState<CanvasRenderingContext2D>()

    useEffect(() => {
        // Retrieve the 2D rendering context
        const newCtx = canvasRef?.current?.getContext('2d');

        if(newCtx) {
            newCtx.lineJoin = 'round';// Set the line join property to 'round'

            newCtx.lineCap = 'round';// Set the line cap property to 'round'
            setCtx(newCtx);// Update the state with the configured rendering context
        }
    }, [canvasRef]);

    return ctx;
};