import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    data: [],
    paymentMethod: '',
    deliveryMethod: '',
    deliveryLoction: '',
    isFreeShipping: false
}

export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            let data = state.data || []
            if (data.some((value) => value.id === action.payload.id)) {
                for (const value of data) {
                    if (value.id === action.payload.id) {
                        value.added_quantity += action.payload.added_quantity
                        break;
                    }
                }
                if (typeof window !== 'undefined') {
                    localStorage.setItem('cart', JSON.stringify(state.data))
                }
            } else {
                state.data = [
                    ...data,
                    action.payload
                ]
                if (typeof window !== 'undefined') {
                    localStorage.setItem('cart', JSON.stringify(state.data))
                }
            }
        },
        removeFromCart: (state, action) => {
            state.data = state.data.filter((value) => value.id !== action.payload)
            if (typeof window !== 'undefined') {
                localStorage.setItem('cart', JSON.stringify(state.data))
            }
        },
        onchangeCart: (state, action) => {
            for (const value of state.data) {
                if (value.id === action.payload.id) {
                    value.added_quantity = action.payload.added_quantity
                    break;
                }
            }
            if (typeof window !== 'undefined') {
                localStorage.setItem('cart', JSON.stringify(state.data))
            }
        },
        updateCart: (state, action) => {
            state[action.payload.target] = action.payload.data
            if (typeof window !== 'undefined') {
                localStorage.setItem(action.payload.target, JSON.stringify(state[action.payload.target]))
            }
        },
        clearData: (state, action) => {
            state.data = []
            state.paymentMethod = ""
            state.deliveryMethod = ""
            state.deliveryLoction = ""
        },
    },
})

// Action creators are generated for each case reducer function
export const { addToCart, removeFromCart, onchangeCart, updateCart, clearData } = cartSlice.actions

export default cartSlice.reducer