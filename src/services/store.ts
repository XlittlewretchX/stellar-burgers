import { combineReducers, configureStore } from '@reduxjs/toolkit';
import burgerConstructorSlice from './slices/constructorSlice/constructorSlice';
import orderSlice from './slices/orderSlice/orderSlice';
import orderFeedSlice from './slices/feedSlice/feedSlice';
import profileSlice from './slices/userSlice/userSlice';
import ingredientSlice from './slices/ingredientSlice/ingredientSlice';
import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

export const rootReducer = combineReducers({
  ingredient: ingredientSlice,
  order: orderSlice,
  burgerConstructor: burgerConstructorSlice,
  orderFeed: orderFeedSlice,
  profile: profileSlice
});

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;
export default store;
