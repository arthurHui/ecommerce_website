import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    user: null,
}

export const globalSlice = createSlice({
    name: 'global',
    initialState,
    reducers: {
        setGlobal: (state, action) => {
            state[action.payload.key] = action.payload.data
        },
    },
})

// Action creators are generated for each case reducer function
export const { setGlobal } = globalSlice.actions

export default globalSlice.reducer