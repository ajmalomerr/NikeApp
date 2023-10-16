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

export const removeFromFavourite = createAsyncThunk('data/removeFromFavourite', async (id) => {
    const response = await axios.post(`${url}/${id}`);
    return response.data;
});

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
            .addCase(removeFromFavourite.pending, (state) => {
                state.loading = true
            })
            .addCase(removeFromFavourite.fulfilled, (state, action) => {
                state.products = action.payload.data
                state.loading = false
            })
            .addCase(removeFromFavourite.rejected, (state, action) => {
                state.error = action.error.message
                state.loading = false
            })
    }
})