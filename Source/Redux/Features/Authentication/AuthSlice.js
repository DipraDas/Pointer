import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    isLoggedIn: false,
    user: null,
};

const authSlice = createSlice({
    name: 'authentication',

    initialState,

    reducers: {
        setName: (state, action) => {
            state.name = action.payload;
        },

        setEmail: (state, action) => {
            state.email = action.payload;
        },

        setPassword: (state, action) => {
            state.password = action.payload;
        },

        setConfirmPassword: (state, action) => {
            state.confirmPassword = action.payload;
        },

        setUser: (state, action) => {
            state.user = action.payload;
            state.isLoggedIn = true;
        },

        logout: state => {
            state.name = '';
            state.email = '';
            state.password = '';
            state.confirmPassword = '';
            state.user = null;
            state.isLoggedIn = false;
        },

        clearSignUpForm: state => {
            state.name = '';
            state.email = '';
            state.password = '';
            state.confirmPassword = '';
        },
    },
});

export const {
    setName,
    setEmail,
    setPassword,
    setConfirmPassword,
    setUser,
    logout,
    clearSignUpForm,
} = authSlice.actions;

export default authSlice.reducer;