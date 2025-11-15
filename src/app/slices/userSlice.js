import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    user: null,
    token: null,
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        login: (state, action) => {
            state.user = action.payload.user
            state.token = action.payload.token
        },
        logout: (state) => {
            state.user = null
            state.token = null
        },
        removeToken: (state) => {
            state.token = null
        }
    }
})

export const { login, logout, removeToken} = userSlice.actions;

export default userSlice.reducer

export const selectUser = (state) => state.user.user