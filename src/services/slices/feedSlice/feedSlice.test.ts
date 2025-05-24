import { orderFeedSlice, fetchOrderFeed } from './feedSlice';
import { expect, test, describe } from '@jest/globals';

describe('Order Feed Reducer Tests', () => {
  describe('Feed Fetching Tests', () => {
    const actions = {
      pending: {
        type: fetchOrderFeed.pending.type,
        payload: null
      },
      rejected: {
        type: fetchOrderFeed.rejected.type,
        error: { message: 'Test error message' }
      },
      fulfilled: {
        type: fetchOrderFeed.fulfilled.type,
        payload: { orders: ['order1', 'order2'] }
      }
    };

    test('Should handle pending feed fetch state', () => {
      const state = orderFeedSlice.reducer(
        orderFeedSlice.getInitialState(),
        actions.pending
      );
      expect(state.isLoading).toBe(true);
      expect(state.errorMessage).toBe(null);
    });

    test('Should handle rejected feed fetch state', () => {
      const state = orderFeedSlice.reducer(
        orderFeedSlice.getInitialState(),
        actions.rejected
      );
      expect(state.isLoading).toBe(false);
      expect(state.errorMessage).toBe(actions.rejected.error.message);
    });

    test('Should handle successful feed fetch state', () => {
      const state = orderFeedSlice.reducer(
        orderFeedSlice.getInitialState(),
        actions.fulfilled
      );
      expect(state.isLoading).toBe(false);
      expect(state.orderList).toEqual(actions.fulfilled.payload.orders);
    });
  });
});
