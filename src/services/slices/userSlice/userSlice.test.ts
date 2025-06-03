import profileSlice, {
  registerNewUser,
  authenticateUser,
  fetchUserProfile,
  fetchUserOrders,
  updateUserProfile,
  terminateSession
} from './userSlice';
import { expect, test, describe } from '@jest/globals';

describe('User Profile Reducer Tests', () => {
  const initialState = {
    isLoading: false,
    errorMessage: null,
    authResponse: null,
    registrationInfo: null,
    profileData: null,
    authStatusChecked: false,
    isLoggedIn: false,
    loginInProgress: false,
    orderHistory: []
  };

  describe('User Registration Tests', () => {
    const actions = {
      pending: {
        type: registerNewUser.pending.type,
        payload: null
      },
      rejected: {
        type: registerNewUser.rejected.type,
        error: { message: 'Test error message' }
      },
      fulfilled: {
        type: registerNewUser.fulfilled.type,
        payload: { user: { name: 'Test User', email: 'test@example.com' } }
      }
    };

    test('Should handle pending registration state', () => {
      const state = profileSlice(initialState, actions.pending);
      expect(state.isLoading).toBe(true);
      expect(state.errorMessage).toBe(null);
      expect(state.authStatusChecked).toBe(true);
    });

    test('Should handle rejected registration state', () => {
      const state = profileSlice(initialState, actions.rejected);
      expect(state.isLoading).toBe(false);
      expect(state.errorMessage).toBe(actions.rejected.error.message);
      expect(state.authStatusChecked).toBe(true);
      expect(state.isLoggedIn).toBe(false);
    });

    test('Should handle successful registration state', () => {
      const state = profileSlice(initialState, actions.fulfilled);
      expect(state.isLoading).toBe(false);
      expect(state.errorMessage).toBe(null);
      expect(state.authResponse).toEqual(actions.fulfilled.payload.user);
      expect(state.profileData).toEqual(actions.fulfilled.payload.user);
      expect(state.authStatusChecked).toBe(true);
      expect(state.isLoggedIn).toBe(true);
    });
  });

  describe('User Authentication Tests', () => {
    const actions = {
      pending: {
        type: authenticateUser.pending.type,
        payload: null
      },
      rejected: {
        type: authenticateUser.rejected.type,
        error: { message: 'Test error message' }
      },
      fulfilled: {
        type: authenticateUser.fulfilled.type,
        payload: { user: { name: 'Test User', email: 'test@example.com' } }
      }
    };

    test('Should handle pending authentication state', () => {
      const state = profileSlice(initialState, actions.pending);
      expect(state.loginInProgress).toBe(true);
      expect(state.errorMessage).toBe(null);
      expect(state.authStatusChecked).toBe(true);
    });

    test('Should handle rejected authentication state', () => {
      const state = profileSlice(initialState, actions.rejected);
      expect(state.loginInProgress).toBe(false);
      expect(state.authStatusChecked).toBe(true);
      expect(state.isLoggedIn).toBe(false);
      expect(state.errorMessage).toBe(actions.rejected.error.message);
    });

    test('Should handle successful authentication state', () => {
      const state = profileSlice(initialState, actions.fulfilled);
      expect(state.errorMessage).toBe(null);
      expect(state.loginInProgress).toBe(false);
      expect(state.authStatusChecked).toBe(true);
      expect(state.isLoggedIn).toBe(true);
      expect(state.profileData).toEqual(actions.fulfilled.payload.user);
    });
  });

  describe('User Profile Fetch Tests', () => {
    const actions = {
      pending: {
        type: fetchUserProfile.pending.type,
        payload: null
      },
      rejected: {
        type: fetchUserProfile.rejected.type,
        error: { message: 'Test error message' }
      },
      fulfilled: {
        type: fetchUserProfile.fulfilled.type,
        payload: { user: { name: 'Test User', email: 'test@example.com' } }
      }
    };

    test('Should handle pending profile fetch state', () => {
      const state = profileSlice(initialState, actions.pending);
      expect(state.authStatusChecked).toBe(false);
      expect(state.loginInProgress).toBe(true);
    });

    test('Should handle rejected profile fetch state', () => {
      const state = profileSlice(initialState, actions.rejected);
      expect(state.isLoggedIn).toBe(false);
      expect(state.authStatusChecked).toBe(true);
      expect(state.loginInProgress).toBe(false);
      expect(state.profileData).toBe(null);
    });

    test('Should handle successful profile fetch state', () => {
      const state = profileSlice(initialState, actions.fulfilled);
      expect(state.isLoggedIn).toBe(true);
      expect(state.authStatusChecked).toBe(true);
      expect(state.loginInProgress).toBe(false);
      expect(state.profileData).toEqual(actions.fulfilled.payload.user);
    });
  });

  describe('User Profile Update Tests', () => {
    const actions = {
      pending: {
        type: updateUserProfile.pending.type,
        payload: null
      },
      rejected: {
        type: updateUserProfile.rejected.type,
        error: { message: 'Test error message' }
      },
      fulfilled: {
        type: updateUserProfile.fulfilled.type,
        payload: { user: { name: 'Updated User', email: 'updated@example.com' } }
      }
    };

    test('Should handle pending profile update state', () => {
      const state = profileSlice(initialState, actions.pending);
      expect(state.isLoading).toBe(true);
      expect(state.errorMessage).toBe(null);
    });

    test('Should handle rejected profile update state', () => {
      const state = profileSlice(initialState, actions.rejected);
      expect(state.isLoading).toBe(false);
      expect(state.errorMessage).toBe(actions.rejected.error.message);
    });

    test('Should handle successful profile update state', () => {
      const state = profileSlice(initialState, actions.fulfilled);
      expect(state.isLoading).toBe(false);
      expect(state.errorMessage).toBe(null);
      expect(state.authResponse).toEqual(actions.fulfilled.payload.user);
      expect(state.profileData).toEqual(actions.fulfilled.payload.user);
    });
  });

  describe('User Logout Tests', () => {
    const actions = {
      pending: {
        type: terminateSession.pending.type,
        payload: null
      },
      rejected: {
        type: terminateSession.rejected.type,
        error: { message: 'Test error message' }
      },
      fulfilled: {
        type: terminateSession.fulfilled.type,
        payload: null
      }
    };

    test('Should handle pending logout state', () => {
      const state = profileSlice(initialState, actions.pending);
      expect(state.isLoading).toBe(true);
      expect(state.errorMessage).toBe(null);
    });

    test('Should handle rejected logout state', () => {
      const state = profileSlice(initialState, actions.rejected);
      expect(state.isLoading).toBe(false);
      expect(state.errorMessage).toBe(actions.rejected.error.message);
    });

    test('Should handle successful logout state', () => {
      const state = profileSlice(initialState, actions.fulfilled);
      expect(state.isLoggedIn).toBe(false);
      expect(state.authStatusChecked).toBe(true);
      expect(state.errorMessage).toBe(null);
      expect(state.isLoading).toBe(false);
      expect(state.profileData).toBe(null);
    });
  });

  describe('User Orders Fetch Tests', () => {
    const actions = {
      pending: {
        type: fetchUserOrders.pending.type,
        payload: null
      },
      rejected: {
        type: fetchUserOrders.rejected.type,
        error: { message: 'Test error message' }
      },
      fulfilled: {
        type: fetchUserOrders.fulfilled.type,
        payload: ['order1', 'order2']
      }
    };

    test('Should handle pending orders fetch state', () => {
      const state = profileSlice(initialState, actions.pending);
      expect(state.errorMessage).toBe(null);
      expect(state.isLoading).toBe(true);
    });

    test('Should handle rejected orders fetch state', () => {
      const state = profileSlice(initialState, actions.rejected);
      expect(state.errorMessage).toBe(actions.rejected.error.message);
      expect(state.isLoading).toBe(false);
    });

    test('Should handle successful orders fetch state', () => {
      const state = profileSlice(initialState, actions.fulfilled);
      expect(state.errorMessage).toBe(null);
      expect(state.isLoading).toBe(false);
      expect(state.orderHistory).toEqual(actions.fulfilled.payload);
    });
  });
});
