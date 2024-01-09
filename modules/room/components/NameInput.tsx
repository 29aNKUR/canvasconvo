import { socket } from '@/common/lib/socket';
import { useModal } from '@/modal';
import { useSetRoomId } from '@recoil/room'
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react'

const NameInput = () => {
    const setRoomId = useSetRoomId();
    const { openModal } = useModal();

    const [name, setName] = useState('');

    const router = useRouter();
    const roomId = (router.query.roomId || '').toString();

    useEffect(() => {
        if(!roomId) return;

        socket.emit('check_room', roomId);

        socket.on('room_exists', (exists) => {
            if(!exists) {
                router.push("/");
            }
        });

        return () => {
            socket.off('room_exists');
        };
    },[roomId, router]);

    const handleJoinRoom = () => {

    }

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
            id="room-id"
            placeholder='Username...'
            value={name}
            onChange={(e) => setTokenSourceMapRange(e.target.value.slice(0,15))}
        />
    </div>

    <button className='btn' type="submit">
        Enter room
        </button>   
    </form>
  )
}

export default NameInput