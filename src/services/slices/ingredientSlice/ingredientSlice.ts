import { getIngredientsApi } from '../../../utils/burger-api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';

interface IngredientState {
  data: {
    items: TIngredient[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
  };
}

const initialIngredientState: IngredientState = {
  data: {
    items: [],
    status: 'idle',
    error: null
  }
};

export const getIngredients = createAsyncThunk(
  'ingredient/get',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getIngredientsApi();
      return response;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const ingredientSlice = createSlice({
  name: 'ingredient',
  initialState: initialIngredientState,
  reducers: {
    resetIngredients: (state) => {
      state.data = initialIngredientState.data;
    }
  },
  selectors: {
    selectIngredients: (state) => state.data.items,
    selectIngredientsStatus: (state) => state.data.status,
    selectIngredientsError: (state) => state.data.error,
    getIngredientState: (state) => ({
      ingredients: state.data.items,
      loading: state.data.status === 'loading',
      error: state.data.error
    })
  },
  extraReducers: (builder) => {
    builder
      .addCase(getIngredients.pending, (state) => {
        state.data.status = 'loading';
        state.data.error = null;
      })
      .addCase(
        getIngredients.fulfilled,
        (state, action: PayloadAction<TIngredient[]>) => {
          state.data.status = 'succeeded';
          state.data.items = action.payload;
          state.data.error = null;
        }
      )
      .addCase(getIngredients.rejected, (state, action) => {
        state.data.status = 'failed';
        state.data.error = action.payload as string;
      });
  }
});

export const { resetIngredients } = ingredientSlice.actions;
export const {
  selectIngredients,
  selectIngredientsStatus,
  selectIngredientsError,
  getIngredientState
} = ingredientSlice.selectors;

export default ingredientSlice.reducer;
