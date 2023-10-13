import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    products: [],
    loading: false,
    error: null,
}

const url = 'http://localhost:3000/wishList'

export const fetchWishList = createAsyncThunk('data/fetchWishList', async () => {
    const response = await axios.get(url);
    return response.data;
});

// export const fetchProductDetails = createAsyncThunk('data/fetchProductDetails', async (id) => {
//     const response = await axios.get(`http://localhost:3000/products/${id}`);
//     return response.data;
// });

// export const addToFavourite = createAsyncThunk('data/addToFavourite', async ({ id, req }) => {
//     const response = await axios.post(`http://localhost:3000/products/${id}`, req);
//     return response.data;
// });

export const wishListSlice = createSlice({
    name: 'wishlist',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchWishList.pending, (state) => {
                state.loading = true
            })
            .addCase(fetchWishList.fulfilled, (state, action) => {
                state.products = action.payload.data
                state.loading = false
            })
            .addCase(fetchWishList.rejected, (state, action) => {
                state.error = action.error.message
                state.loading = false
            })
    }
})