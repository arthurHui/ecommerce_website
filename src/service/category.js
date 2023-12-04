import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    data: [],
}

export const categorySlice = createSlice({
    name: 'category',
    initialState,
    reducers: {
        setCategory: (state, action) => {
            state[action.payload.target] = action.payload.data
        }
    },
})

// Action creators are generated for each case reducer function
export const { setCategory } = categorySlice.actions

export default categorySlice.reducer