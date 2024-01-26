import { useEffect } from 'react';
import { socket } from '@/common/lib/socket';
import { useSetUsers } from '@/common/recoil/room';
import { Move } from '@/common/types/global';

// A custom hook to handle socket events related to drawing
export const useSocketDraw = (drawing: boolean) => {
  // Recoil state hook to manage user moves
  const { handleAddMoveToUser, handleRemoveMoveFromUser } = useSetUsers();

  useEffect(() => {
    // Variables to store move and user ID if drawing is in progress
    let moveToDrawLater: Move | undefined;
    let userIdLater = '';

    // Event listener for 'user_draw' socket event
    socket.on('user_draw', (move, userId) => {
      // If not currently drawing, add the move to the user's moves
      if (!drawing) {
        handleAddMoveToUser(userId, move);
      } else {
        // If drawing, store the move and user ID for later use
        moveToDrawLater = move;
        userIdLater = userId;
      }
    });

    // Cleanup function
    return () => {
      // Remove the 'user_draw' event listener
      socket.off('user_draw');

      // If there's a move to draw later, add it to the user's moves
      if (moveToDrawLater && userIdLater) {
        handleAddMoveToUser(userIdLater, moveToDrawLater);
      }
    };
  }, [drawing, handleAddMoveToUser]);

  useEffect(() => {
    // Event listener for 'user_undo' socket event
    socket.on('user_undo', (userId) => {
      // Remove moves associated with the user
      handleRemoveMoveFromUser(userId);
    });

    // Cleanup function
    return () => {
      // Remove the 'user_undo' event listener
      socket.off('user_undo');
    };
  }, [handleRemoveMoveFromUser]);
};
