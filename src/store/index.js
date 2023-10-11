import { configureStore } from "@reduxjs/toolkit";
import { productsSlice } from "./productSlice";
import { cartSlice } from "./cartSlice";
import { apiSlice } from "./apisLice";

export const store = configureStore({
    reducer: {
        products: productsSlice.reducer,
        cart: cartSlice.reducer,
        api: apiSlice.reducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(apiSlice.middleware),
})