import { getOrderByNumberApi } from '../../../utils/burger-api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

interface OrderState {
  data: {
    orders: TOrder[];
    currentOrder: TOrder | null;
  };
  status: {
    isLoading: boolean;
    error: string | null;
  };
}

const initialOrderState: OrderState = {
  data: {
    orders: [],
    currentOrder: null
  },
  status: {
    isLoading: false,
    error: null
  }
};

const fetchOrderByNumber = createAsyncThunk(
  'order/fetchByNumber',
  async (orderNumber: number) => {
    const response = await getOrderByNumberApi(orderNumber);
    return response.orders[0];
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState: initialOrderState,
  reducers: {
    clearOrderError: (state) => {
      state.status.error = null;
    }
  },
  selectors: {
    selectOrderState: (state) => state,
    selectCurrentOrder: (state) => state.data.currentOrder,
    selectOrderStatus: (state) => state.status
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.status.isLoading = true;
        state.status.error = null;
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.status.isLoading = false;
        state.status.error = action.error.message || 'Failed to fetch order';
      })
      .addCase(
        fetchOrderByNumber.fulfilled,
        (state, action: PayloadAction<TOrder>) => {
          state.status.isLoading = false;
          state.status.error = null;
          state.data.currentOrder = action.payload;
        }
      );
  }
});

export const { clearOrderError } = orderSlice.actions;
export const { selectOrderState, selectCurrentOrder, selectOrderStatus } =
  orderSlice.selectors;
export { fetchOrderByNumber };
export default orderSlice.reducer;
