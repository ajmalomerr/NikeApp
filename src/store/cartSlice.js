import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit'
import { Alert } from 'react-native';
import axios from 'axios';

const initialState = {
    item: [],
    deliveryFee: 15,
    freeDeliveryFrom: 200,
    allOrders: [],
    createOrderStatus: "",
    loader: false,
    error: null
}

const url = 'http://localhost:3000/orders/viewOrders'

export const fetchOrders = createAsyncThunk('data/fetchOrders', async () => {
    const response = await axios.get(url);
    return response.data;
});

export const creatOrders = createAsyncThunk('data/createOrder', async (req) => {
    const response = await axios.post('http://localhost:3000/orders/', req);
    return response.data;
});

export const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addCartItem: (state, action) => {
            const newProduct = action.payload.product
            const cartItem = state.item.find((items) => items.product._id === newProduct._id && items.product.sizes === newProduct.sizes);
            if (cartItem) {
                cartItem.product.quantity += 1
            } else {
                state.item.push({ product: newProduct })
            }
        },
        changeQuantity: (state, action) => {
            const { productId, amount } = action.payload
            const cartItem = state.item.find((items) => items.product._id === productId)
            if (cartItem) {
                cartItem.product.quantity += amount
            }
            if (cartItem.product.quantity == 0) {
                state.item = state.item.filter((items) => items !== cartItem)
            }
        },
        clearCart: (state) => {
            state.item = []
            state.createOrderStatus = ""
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchOrders.pending, (state) => {
                state.loader = true
            })
            .addCase(fetchOrders.fulfilled, (state, action) => {
                state.allOrders = action.payload.data,
                    state.loader = false
            })
            .addCase(fetchOrders.rejected, (state, action) => {
                state.error = action.error.message
                state.loader = false
            })
            .addCase(creatOrders.pending, (state) => {
                state.loader = true
            })
            .addCase(creatOrders.fulfilled, (state, action) => {
                state.loader = false
                state.createOrderStatus = action.payload.status
            })
            .addCase(creatOrders.rejected, (state, action) => {
                state.error = action.error.message
                state.loader = false
            })
    }
});

export const selectedCartItems = (state) => state.cart.item.length;

export const selectSubTotal = (state) => state.cart.item.reduce((sum, cartItem) => sum + cartItem.product.price * cartItem.product.quantity, 0);

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