import { useOptionsValue } from "@/common/recoil/options";
import { useCtx } from "./useCtx";
import { useRefs } from "@/modules/room/hooks/useRefs";
import { useMoveImage } from "@/modules/room/hooks/useMoveImage";
import { useEffect, useMemo } from "react";
import { Move } from "@/common/types/global";
import { socket } from "@/common/lib/socket";
import { DEFAULT_MOVE } from "@/common/constants/defaultMove";
import { toast } from "react-toastify";

// A temporary variable to store the previous selection
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
        // Function to draw the selection on the canvas
        const callback = async () => {
            // Redraw all moves on the canvas
            await drawAllMoves();

            // Check if the selection and context are available
            if (ctx && selection) {
                // Set a timeout to ensure the drawAllMoves has taken effect
                setTimeout(() => {
                    const { x, y, width, height } = selection;

                    // Set drawing properties
                    ctx.lineWidth = 2;
                    ctx.strokeStyle = '#000';
                    ctx.setLineDash([5,10]);
                    ctx.globalCompositeOperation = 'source-over';

                    // Draw a rectangle representing the selection
                    ctx.beginPath();
                    ctx.rect(x, y, width, height);
                    ctx.stroke();
                    ctx.closePath();

                    // Reset drawing properties
                    ctx.setLineDash([]);
                }, 10);
            }
        };

         // Check if the selection has changed
        if (
            tempSelection.width !== selection?.width ||
            tempSelection.height !== selection?.height ||
            tempSelection.x !== selection?.x ||
            tempSelection.y !== selection?.y
        )
            callback();// Invoke the callback function

            // Cleanup function to store the current selection as tempSelection
            return () => {
                if (selection) tempSelection = selection;
            };
            // Dependencies: listen for changes in the 'selection' and 'ctx'
    }, [selection, ctx]);

     // Calculate adjusted dimensions based on the selection
    const dimension = useMemo(() => {
        if (selection) {
            let { x, y, width, height } = selection;

            // Adjust the dimensions
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

            // Return adjusted dimensions
            return { x, y, width, height };
        }

         // Return default dimensions if no selection
        return {
            width: 0,
            height: 0,
            x: 0,
            y: 0,
        };
    }, [selection]);

    // Create a blob image from the selection
    const makeBlob = async (withBg?: boolean) => {
        if (!selection) return null;

        const { x, y, width, height } = dimension;

        // Get image data from the canvas
        const imageData = ctx?.getImageData(x, y, width, height);

        if(imageData) {
            // Create temporary canvases
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = width;
            tempCanvas.height = height;
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const tempCtx = canvas.getContext('2d');

            if (tempCtx && bgRef.current) {
                // Get background image data
                const bgImage = bgRef.current.getContext('2d')?.getImageData(x, y, width, height);

                // Put background image data on the temporary canvas
                if(bgImage && withBg) tempCtx.putImageData(bgImage, 0, 0);

                // Put selection image data on the temporary canvas
                const sTempCtx = tempCanvas.getContext('2d');
                sTempCtx?.putImageData(imageData, 0, 0);

                // Draw the temporary canvas on the main canvas
                tempCtx.drawImage(tempCanvas, 0, 0);

                 // Convert the canvas to a blob
                const blob: Blob = await new Promise((resolve) => {
                    canvas.toBlob((blobGenerated) => {
                        if (blobGenerated) resolve(blobGenerated);
                    });
                });

                // Return the generated blob
                return blob;
            }
        }
        // Return null if no selection or canvas context
        return null;
    };

    // Create a move to delete the selected portion
    const createDeleteMove = () => {
        if(!selection) return null;

        let { x, y, width, height} = dimension;

        // Adjust dimensions
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

        // Create a move object representing the delete action
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

         // Emit the 'draw' event with the delete move
        socket.emit('draw', move);

        // Return the created move
        return move;
    };

    // Copy the selected portion to the clipboard
    const handleCopy = async () => {
        const blob = await makeBlob(true);

        if(blob)
            navigator.clipboard
                .write([
                    new ClipboardItem({
                        'image/png' : blob,
                    }),
                ])
                .then(() => {
                    // Show a toast notification on successful copy
                    toast('Copies to clipboard!', {
                        position: 'top-center',
                        theme: 'colored',
                    });
                });
    };

    // Listen for keyboard events to handle copy and delete actions
    useEffect(() => {
        const handleSelection = async (e: KeyboardEvent) => {
            if(e.key === 'c' && e.ctrlKey) handleCopy();
            if(e.key === 'Delete' && selection) createDeleteMove();
        };

        // Attach event listener for keyboard events
        document.addEventListener('keydown', handleSelection);

        // Detach event listener on cleanup
        return () => {
            document.addEventListener('keydown', handleSelection);
        };
        // Dependencies: bgRef, createDeleteMove, ctx, handleCopy, makeBlob, options, selection
    }, [bgRef, createDeleteMove, ctx, handleCopy, makeBlob, options, selection]);

    // Listen for move button click events
    useEffect(() => {
        const handleSelectionMove = async () => {
            if (selection) {
                // Create a blob from the selection
                const blob = await makeBlob();
                  // Return if no blob is generated 
                if(!blob) return;

                const { x, y, width, height } = dimension;

                // Read the blob as base64 data
                const reader = new FileReader();
                reader.readAsDataURL(blob);
                reader.addEventListener('loadened', () => {
                    const base64 = reader.result?.toString();

                    if(base64) {
                        // Create a delete move and set the move image
                        createDeleteMove();
                        setMoveImage({
                            base64,
                            x: Math.min(x, x + width),
                            y: Math.min(y, y + height),
                        });
                    }
                })
            }
        };

        // Attach event listeners for move, copy, and delete buttons
        if(selectionRefs.current) {
            const moveBtn = selectionRefs.current[0];
            const copyBtn = selectionRefs.current[1];
            const deleteBtn = selectionRefs.current[2];

            moveBtn.addEventListener('click', handleSelectionMove);
            copyBtn.addEventListener('click', handleCopy);
            deleteBtn.addEventListener('click', createDeleteMove);

            // Detach event listeners on cleanup    
            return () => {
                moveBtn?.removeEventListener('click', handleSelectionMove);
                copyBtn?.removeEventListener('click', handleCopy);
                deleteBtn?.removeEventListener('click', createDeleteMove);
            }
        }
        
        /// Cleanup function when selectionRefs.current is not available
        return () => {};
    }, [
        createDeleteMove,
        dimension,
        handleCopy,
        makeBlob,
        selection,
        selectionRefs,
        setMoveImage,
    ]);
};