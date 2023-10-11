import { createSelector, createSlice } from '@reduxjs/toolkit'
import { Alert } from 'react-native';

const initialState = {
    item: [],
    deliveryFee: 15,
    freeDeliveryFrom: 200,
}

export const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addCartItem: (state, action) => {
            const newProduct = action.payload.product
            const cartItem = state.item.find((items) => items.product._id === newProduct._id && items.product.sizes === newProduct.sizes);
            if (cartItem) {
                cartItem.quantity += 1
            } else {
                state.item.push({ product: newProduct, quantity: 1 })
            }
        },
        changeQuantity: (state, action) => {
            const { productId, amount } = action.payload
            const cartItem = state.item.find((items) => items.product._id === productId)
            if (cartItem) {
                cartItem.quantity += amount
            }
            if (cartItem.quantity == 0) {
                state.item = state.item.filter((items) => items !== cartItem)
            }
        },
        clearCart: (state) => {
            state.item = []
        }
    }
});

export const selectedCartItems = (state) => state.cart.item.length;

export const selectSubTotal = (state) => state.cart.item.reduce((sum, cartItem) => sum + cartItem.product.price * cartItem.quantity, 0);

const cartSelector = (state) => state.cart

export const selectDeliveryPrice = createSelector(
    cartSelector,
    selectSubTotal,
    (cart, subTotal) => (subTotal > cart.freeDeliveryFrom ? 0 : cart.deliveryFee)
)

export const selectedTotalPrice = createSelector(
    selectSubTotal,
    selectDeliveryPrice,
    (subTotal, deliveryFee) => subTotal + deliveryFee
)