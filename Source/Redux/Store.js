import { configureStore } from '@reduxjs/toolkit';
import authReducer from './Features/Authentication/AuthSlice';

const store = configureStore({
    reducer: {
        authentication: authReducer,
    },
});

export default store;