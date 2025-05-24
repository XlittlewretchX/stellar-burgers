import store, { rootReducer } from './store';
import { expect, test, describe } from '@jest/globals';

describe('Store Tests', () => {
  describe('Root Reducer Tests', () => {
    test('Should initialize with correct state structure', () => {
      const initialState = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });
      
      expect(initialState).toHaveProperty('burgerConstructor');
      expect(initialState).toHaveProperty('ingredient');
      expect(initialState).toHaveProperty('order');
      expect(initialState).toHaveProperty('profile');
      expect(initialState).toHaveProperty('orderFeed');
    });

    test('Should maintain state structure after unknown action', () => {
      const initialState = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });
      const nextState = rootReducer(initialState, { type: 'ANOTHER_UNKNOWN_ACTION' });
      
      expect(nextState).toEqual(initialState);
    });

    test('Should match store initial state', () => {
      const expected = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });
      expect(expected).toEqual(store.getState());
    });
  });
});
