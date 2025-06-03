import { ingredientSlice, getIngredients } from './ingredientSlice';
import { expect, test, describe } from '@jest/globals';

describe('Ingredient Reducer Tests', () => {
  describe('Ingredient Fetching Tests', () => {
    const actions = {
      pending: {
        type: getIngredients.pending.type,
        payload: null
      },
      rejected: {
        type: getIngredients.rejected.type,
        payload: 'Test error message'
      },
      fulfilled: {
        type: getIngredients.fulfilled.type,
        payload: ['ingr1', 'ingr2']
      }
    };

    test('Should handle pending ingredient fetch state', () => {
      const state = ingredientSlice.reducer(
        ingredientSlice.getInitialState(),
        actions.pending
      );
      expect(state.data.status).toBe('loading');
      expect(state.data.error).toBe(null);
    });

    test('Should handle rejected ingredient fetch state', () => {
      const state = ingredientSlice.reducer(
        ingredientSlice.getInitialState(),
        actions.rejected
      );
      expect(state.data.status).toBe('failed');
      expect(state.data.error).toBe(actions.rejected.payload);
    });

    test('Should handle successful ingredient fetch state', () => {
      const state = ingredientSlice.reducer(
        ingredientSlice.getInitialState(),
        actions.fulfilled
      );
      expect(state.data.status).toBe('succeeded');
      expect(state.data.items).toEqual(actions.fulfilled.payload);
    });
  });
});
