import { configureStore } from "@reduxjs/toolkit";
 import roomSlice from "@/common/redux/room/roomSlice";
import modalSlice from "@/modal/redux/modalSlice";
import backgroundSlice from "@recoil/background/backgroundSlice";


 const store = configureStore({
    reducer: {
        room: roomSlice,
        modal: modalSlice,
        background: backgroundSlice
    },
 });

 export default store;