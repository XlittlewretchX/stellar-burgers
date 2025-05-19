import {
  TRegisterData,
  loginUserApi,
  TLoginData,
  getUserApi,
  TAuthResponse,
  getOrdersApi,
  logoutApi,
  updateUserApi,
  registerUserApi
} from '../../../utils/burger-api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { deleteCookie, setCookie } from '../../../utils/cookie';
import { TOrder, TUser } from '@utils-types';

interface IUserProfileState {
  isLoading: boolean;
  errorMessage: string | null;
  authResponse: TUser | null;
  registrationInfo: TRegisterData | null;
  profileData: TUser | null;
  authStatusChecked: boolean;
  isLoggedIn: boolean;
  loginInProgress: boolean;
  orderHistory: TOrder[];
}

const initialProfileState: IUserProfileState = {
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

export const registerNewUser = createAsyncThunk(
  'profile/register',
  async (userData: TRegisterData) => await registerUserApi(userData)
);

export const authenticateUser = createAsyncThunk(
  'profile/login',
  async (credentials: TLoginData) => {
    const response = await loginUserApi(credentials);
    if (!response.success) {
      return response;
    }
    setCookie('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    return response;
  }
);

export const fetchUserProfile = createAsyncThunk('profile/fetch', getUserApi);

export const fetchUserOrders = createAsyncThunk('profile/orders', getOrdersApi);

export const updateUserProfile = createAsyncThunk(
  'profile/update',
  async (profileData: Partial<TRegisterData>) => updateUserApi(profileData)
);

export const terminateSession = createAsyncThunk('profile/logout', async () => {
  await logoutApi();
  localStorage.clear();
  deleteCookie('accessToken');
});

export const profileSlice = createSlice({
  name: 'profile',
  initialState: initialProfileState,
  reducers: {
    clearSession: (state) => {
      state.profileData = null;
      state.isLoggedIn = false;
      state.authStatusChecked = true;
    },
    clearError: (state) => {
      state.errorMessage = null;
    }
  },
  selectors: {
    getProfileState: (state) => state,
    getProfileError: (state) => state.errorMessage
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerNewUser.pending, (state) => {
        state.isLoading = true;
        state.errorMessage = null;
        state.authStatusChecked = true;
      })
      .addCase(registerNewUser.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.error.message as string;
        state.authStatusChecked = true;
        state.isLoggedIn = false;
      })
      .addCase(registerNewUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.errorMessage = null;
        state.authResponse = action.payload.user;
        state.profileData = action.payload.user;
        state.authStatusChecked = true;
        state.isLoggedIn = true;
      })
      .addCase(authenticateUser.pending, (state) => {
        state.loginInProgress = true;
        state.errorMessage = null;
        state.authStatusChecked = true;
      })
      .addCase(authenticateUser.rejected, (state, action) => {
        state.loginInProgress = false;
        state.authStatusChecked = true;
        state.isLoggedIn = false;
        state.errorMessage = action.error.message as string;
      })
      .addCase(authenticateUser.fulfilled, (state, action) => {
        state.errorMessage = null;
        state.loginInProgress = false;
        state.authStatusChecked = true;
        state.isLoggedIn = true;
        state.profileData = action.payload.user;
      })
      .addCase(fetchUserProfile.pending, (state) => {
        state.authStatusChecked = false;
        state.loginInProgress = true;
      })
      .addCase(fetchUserProfile.rejected, (state) => {
        state.isLoggedIn = false;
        state.authStatusChecked = true;
        state.loginInProgress = false;
        state.profileData = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.isLoggedIn = true;
        state.authStatusChecked = true;
        state.loginInProgress = false;
        state.profileData = action.payload.user;
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true;
        state.errorMessage = null;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.error.message as string;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.errorMessage = null;
        state.authResponse = action.payload.user;
        state.profileData = action.payload.user;
      })
      .addCase(terminateSession.pending, (state) => {
        state.isLoading = true;
        state.errorMessage = null;
      })
      .addCase(terminateSession.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.error.message as string;
      })
      .addCase(terminateSession.fulfilled, (state) => {
        state.isLoggedIn = false;
        state.authStatusChecked = true;
        state.errorMessage = null;
        state.isLoading = false;
        state.profileData = null;
      })
      .addCase(fetchUserOrders.pending, (state) => {
        state.errorMessage = null;
        state.isLoading = true;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.errorMessage = action.error.message as string;
        state.isLoading = false;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.errorMessage = null;
        state.isLoading = false;
        state.orderHistory = action.payload;
      });
  }
});

export const { clearSession, clearError } = profileSlice.actions;
export const { getProfileState, getProfileError } = profileSlice.selectors;
export default profileSlice.reducer;
