import { configureStore } from "@reduxjs/toolkit";
import { productsSlice } from "./productSlice";
import { cartSlice } from "./cartSlice";
import { apiSlice } from "./apisLice";
import { wishListSlice } from "./wishListSlice";

const store = configureStore({
    reducer: {
        products: productsSlice.reducer,
        cart: cartSlice.reducer,
        api: apiSlice.reducer,
        wishlist: wishListSlice.reducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(apiSlice.middleware),
})

export default store