import { getFeedsApi } from '../../../utils/burger-api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

interface IOrderFeedState {
  orderList: TOrder[];
  totalOrders: number;
  todayOrders: number;
  isLoading: boolean;
  errorMessage: string | null;
}

const initialOrderFeedState: IOrderFeedState = {
  orderList: [],
  totalOrders: 0,
  todayOrders: 0,
  isLoading: false,
  errorMessage: null
};

export const fetchOrderFeed = createAsyncThunk(
  'orderFeed/fetchAll',
  getFeedsApi
);

export const orderFeedSlice = createSlice({
  name: 'orderFeed',
  initialState: initialOrderFeedState,
  reducers: {},
  selectors: {
    getOrderFeedState: (state) => state
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrderFeed.pending, (state) => {
        state.isLoading = true;
        state.errorMessage = null;
      })
      .addCase(fetchOrderFeed.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.error.message as string;
      })
      .addCase(fetchOrderFeed.fulfilled, (state, action) => {
        state.isLoading = false;
        state.errorMessage = null;
        state.orderList = action.payload.orders;
        state.totalOrders = action.payload.total;
        state.todayOrders = action.payload.totalToday;
      });
  }
});

export const { getOrderFeedState } = orderFeedSlice.selectors;
export default orderFeedSlice.reducer;
