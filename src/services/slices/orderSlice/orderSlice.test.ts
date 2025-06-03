import orderSlice, { fetchOrderByNumber } from './orderSlice';
import { expect, test, describe } from '@jest/globals';

describe('Order Reducer Tests', () => {
  describe('Order Fetching Tests', () => {
    const initialState = {
      data: {
        orders: [],
        currentOrder: null
      },
      status: {
        isLoading: false,
        error: null
      }
    };

    const actions = {
      pending: {
        type: fetchOrderByNumber.pending.type,
        payload: null
      },
      rejected: {
        type: fetchOrderByNumber.rejected.type,
        error: { message: 'Test error message' }
      },
      fulfilled: {
        type: fetchOrderByNumber.fulfilled.type,
        payload: 'someOrder'
      }
    };

    test('Should handle pending order fetch state', () => {
      const state = orderSlice(initialState, actions.pending);
      expect(state.status.isLoading).toBe(true);
      expect(state.status.error).toBe(null);
    });

    test('Should handle rejected order fetch state', () => {
      const state = orderSlice(initialState, actions.rejected);
      expect(state.status.isLoading).toBe(false);
      expect(state.status.error).toBe(actions.rejected.error.message);
    });

    test('Should handle successful order fetch state', () => {
      const state = orderSlice(initialState, actions.fulfilled);
      expect(state.status.isLoading).toBe(false);
      expect(state.status.error).toBe(null);
      expect(state.data.currentOrder).toBe(actions.fulfilled.payload);
    });
  });
});
