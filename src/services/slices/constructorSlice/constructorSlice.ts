import { orderBurgerApi } from '../../../utils/burger-api';
import {
  PayloadAction,
  createAsyncThunk,
  createSlice,
  nanoid
} from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient, TOrder } from '@utils-types';

interface IBurgerConstructor {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
}

interface IConstructorState {
  isLoading: boolean;
  burger: IBurgerConstructor;
  isOrdering: boolean;
  orderDetails: TOrder | null;
  errorMessage: string | null;
}

const defaultState: IConstructorState = {
  isLoading: false,
  burger: {
    bun: null,
    ingredients: []
  },
  isOrdering: false,
  orderDetails: null,
  errorMessage: null
};

export const createOrder = createAsyncThunk(
  'constructor/createOrder',
  async (ingredients: string[]) => {
    const response = await orderBurgerApi(ingredients);
    return response;
  }
);

export const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState: defaultState,
  selectors: {
    selectConstructorState: (state) => state
  },
  reducers: {
    insertIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        const { type } = action.payload;
        if (type === 'bun') {
          state.burger.bun = action.payload;
        } else {
          state.burger.ingredients.push(action.payload);
        }
      },
      prepare: (ingredient: TIngredient) => ({
        payload: { ...ingredient, id: nanoid() }
      })
    },
    deleteIngredient: (state, action: PayloadAction<string>) => {
      state.burger.ingredients = state.burger.ingredients.filter(
        (item) => item.id !== action.payload
      );
    },
    shiftIngredientUp: (state, action: PayloadAction<number>) => {
      const { ingredients } = state.burger;
      const currentIndex = action.payload;
      if (currentIndex > 0) {
        const temp = ingredients[currentIndex];
        ingredients[currentIndex] = ingredients[currentIndex - 1];
        ingredients[currentIndex - 1] = temp;
      }
    },
    shiftIngredientDown: (state, action: PayloadAction<number>) => {
      const { ingredients } = state.burger;
      const currentIndex = action.payload;
      if (currentIndex < ingredients.length - 1) {
        const temp = ingredients[currentIndex];
        ingredients[currentIndex] = ingredients[currentIndex + 1];
        ingredients[currentIndex + 1] = temp;
      }
    },
    toggleOrdering: (state, action: PayloadAction<boolean>) => {
      state.isOrdering = action.payload;
    },
    clearOrderDetails: (state) => {
      state.orderDetails = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
        state.isOrdering = true;
        state.errorMessage = null;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.isOrdering = false;
        state.errorMessage = action.error.message || 'Failed to create order';
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isOrdering = false;
        state.errorMessage = null;
        state.orderDetails = action.payload.order;
        state.burger = {
          bun: null,
          ingredients: []
        };
      });
  }
});

export const {
  insertIngredient,
  deleteIngredient,
  shiftIngredientUp,
  shiftIngredientDown,
  toggleOrdering,
  clearOrderDetails
} = burgerConstructorSlice.actions;

export const { selectConstructorState } = burgerConstructorSlice.selectors;

export default burgerConstructorSlice.reducer;
