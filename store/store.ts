import { configureStore } from "@reduxjs/toolkit";
 import roomSlice from "@/common/redux/room/roomSlice";
import modalSlice from "@/modal/redux/modalSlice";


 const store = configureStore({
    reducer: {
        room: roomSlice,
        modal: modalSlice
    },
 });

 export default store;