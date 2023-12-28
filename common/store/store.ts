import { configureStore } from "@reduxjs/toolkit";
 import roomSlice from "@recoil/room/roomSlice";

 const store = configureStore({
    reducer: {
        room: roomSlice,
    },
 });

 export default store;