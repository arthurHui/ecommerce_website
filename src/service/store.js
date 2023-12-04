import { configureStore } from '@reduxjs/toolkit'
import cartReducer from './cart'
import categoryReducer from './category'
import globalReducer from './global'

export const store = configureStore({
    reducer: {
        cart: cartReducer,
        category: categoryReducer,
        global: globalReducer
    },
})
