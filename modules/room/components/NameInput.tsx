import { socket } from '@/common/lib/socket';
import { useSetRoomId } from '@/common/recoil/room';
import { useModal } from '@/modal';
import NotFoundModal from '@/modules/modals/NotFound';
import { useRouter } from 'next/router';
import { FormEvent, useEffect, useState } from 'react';

const NameInput = () => {
  // Recoil state and custom hooks
  const setRoomId = useSetRoomId();
  const { openModal } = useModal();

  // Local state for user's name and the current room ID from the router
  const [name, setName] = useState('');
  const router = useRouter();
  const roomId = (router.query.roomId || '').toString();

  // useEffect to check if the room exists when the component mounts
  useEffect(() => {
    if (!roomId) return;

    // Emit a 'check_room' event to the server
    socket.emit('check_room', roomId);

    // Listen for 'room_exists' event from the server
    socket.on('room_exists', (exists) => {
      if (!exists) {
        router.push('/'); // Redirect to home page if the room doesn't exist
      }
    });

    // Cleanup: Remove the event listener when the component unmounts
    return () => {
      socket.off('room_exists');
    };
  }, [roomId, router]);

  // useEffect to handle joining a room after the component mounts
  useEffect(() => {
    // Define a function to handle the 'joined' event from the server
    const handleJoined = (roomIdFromServer: string, failed?: boolean) => {
      if (failed) {
        router.push('/');
        openModal(<NotFoundModal id={roomIdFromServer} />); // Show modal if joining failed
      } else setRoomId(roomIdFromServer); // Set the Recoil state with the room ID
    };

    // Listen for 'joined' event from the server
    socket.on('joined', handleJoined);

    // Cleanup: Remove the event listener when the component unmounts
    return () => {
      socket.off('joined', handleJoined);
    };
  }, [openModal, router, setRoomId]);

  // Function to handle submitting the form (joining a room)
  const handleJoinRoom = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Emit a 'join_room' event to the server with the room ID and user's name
    socket.emit('join_room', roomId, name);
  };

  // Render the form with input fields and a submit button
  return (
    <form
      className='my-24 flex flex-col items-center'
      onSubmit={handleJoinRoom}
    >
      <h1 className='text-5xl font-extrabold leading-tight sm:text-extra'>
        Canvasconvo
      </h1>
      <h3 className='text-xl sm:text-2xl'>Real-time whiteboard</h3>

      <div className='mt-10 mb-3 flex flex-col gap-2'>
        <label className='self-start font-bold leading-tight'>
          Enter your name
        </label>
        <input
          className='rounded-xl border p-5 py-1'
          id='room-id'
          placeholder='Username...'
          value={name}
          onChange={(e) => setName(e.target.value.slice(0, 15))}
        />
      </div>

      <button className='btn' type='submit'>
        Enter room
      </button>
    </form>
  );
};

export default NameInput;