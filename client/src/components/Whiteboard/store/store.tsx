// import { useState } from 'react';
// import React from 'react'
// import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import WhiteboardPageSliceReducer from '../board/whiteboardSlice';


export const store = configureStore({
    reducer: {
        whiteboardPage: WhiteboardPageSliceReducer,
    },
    // middleware: (getDefaultMiddleware) =>
    //     getDefaultMiddleware({
    //         serializableCheck: {
    //             ignoreActions:["whiteboard/setElements"],
    //             ignorePaths:["whiteboard.elements"],
    //         }, // Disable serializable check for non-serializable data
    //     }), 
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;