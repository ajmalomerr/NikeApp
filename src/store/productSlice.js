import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    products: [],
    productDetails: [],
    loading: false,
    fecthLoader:false,
    error: null,
    isFav: false
}

const url = 'http://localhost:3000/products'

export const fetchProducts = createAsyncThunk('data/fetchProducts', async () => {
    const response = await axios.get(url);
    return response.data;
});

export const fetchProductDetails = createAsyncThunk('data/fetchProductDetails', async (id) => {
    const response = await axios.get(`http://localhost:3000/products/${id}`);
    return response.data;
});

export const addToFavourite = createAsyncThunk('data/addToFavourite', async ({ id, req }) => {
    const response = await axios.post(`http://localhost:3000/products/${id}`, req);
    return response.data;
});

export const productsSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.
            addCase(fetchProducts.pending, (state) => {
                state.loading = true
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.products = action.payload.data
                state.loading = false
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.error = action.error.message
                state.loading = false
            })
            .addCase(fetchProductDetails.pending, (state) => {
                state.fecthLoader = true
            })
            .addCase(fetchProductDetails.fulfilled, (state, action) => {
                state.productDetails = action.payload.data
                state.isFav = action.payload.data.favourite
                state.fecthLoader = false
            })
            .addCase(fetchProductDetails.rejected, (state, action) => {
                state.error = action.error.message
                state.fecthLoader = false
            })
            .addCase(addToFavourite.pending, (state) => {
                // state.loading = true
            })
            .addCase(addToFavourite.fulfilled, (state, action) => {
                state.productDetails = action.payload.data
                state.isFav = action.payload.data.favourite
                state.loading = false
            })
    }
})