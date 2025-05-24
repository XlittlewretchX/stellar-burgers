import { burgerConstructorSlice, createOrder } from './constructorSlice';
import { expect, test, describe } from '@jest/globals';

describe('Burger Constructor Reducer Tests', () => {
  describe('Ingredient Addition Tests', () => {
    const defaultState = {
      isLoading: false,
      burger: {
        bun: null,
        ingredients: []
      },
      isOrdering: false,
      orderDetails: null,
      errorMessage: null
    };

    const expectedBurgerState = {
      ...defaultState,
      burger: {
        bun: {
          _id: '643d69a5c3f7b9001cfa093c',
          name: 'Краторная булка N-200i',
          type: 'bun',
          proteins: 80,
          fat: 24,
          carbohydrates: 53,
          calories: 420,
          price: 1255,
          image: 'https://code.s3.yandex.net/react/code/bun-02.png',
          image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
          image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
        },
        ingredients: [
          {
            _id: '643d69a5c3f7b9001cfa0943',
            name: 'Соус фирменный Space Sauce',
            type: 'sauce',
            proteins: 50,
            fat: 22,
            carbohydrates: 11,
            calories: 14,
            price: 80,
            image: 'https://code.s3.yandex.net/react/code/sauce-04.png',
            image_mobile: 'https://code.s3.yandex.net/react/code/sauce-04-mobile.png',
            image_large: 'https://code.s3.yandex.net/react/code/sauce-04-large.png'
          }
        ]
      }
    };

    test('Should add ingredient to ingredients array', () => {
      const newState = burgerConstructorSlice.reducer(
        defaultState,
        burgerConstructorSlice.actions.insertIngredient({
          _id: '643d69a5c3f7b9001cfa0943',
          name: 'Соус фирменный Space Sauce',
          type: 'sauce',
          proteins: 50,
          fat: 22,
          carbohydrates: 11,
          calories: 14,
          price: 80,
          image: 'https://code.s3.yandex.net/react/code/sauce-04.png',
          image_mobile: 'https://code.s3.yandex.net/react/code/sauce-04-mobile.png',
          image_large: 'https://code.s3.yandex.net/react/code/sauce-04-large.png'
        })
      );

      const addedIngredient = newState.burger.ingredients[0];
      const expectedIngredient = expectedBurgerState.burger.ingredients[0];

      expect(addedIngredient).toEqual({
        ...expectedIngredient,
        id: expect.any(String)
      });
    });

    test('Should add bun to empty bun slot', () => {
      const newState = burgerConstructorSlice.reducer(
        defaultState,
        burgerConstructorSlice.actions.insertIngredient({
          _id: '643d69a5c3f7b9001cfa093c',
          name: 'Краторная булка N-200i',
          type: 'bun',
          proteins: 80,
          fat: 24,
          carbohydrates: 53,
          calories: 420,
          price: 1255,
          image: 'https://code.s3.yandex.net/react/code/bun-02.png',
          image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
          image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
        })
      );

      const addedBun = newState.burger.bun;
      const expectedBun = expectedBurgerState.burger.bun;

      expect(addedBun).toEqual({
        ...expectedBun,
        id: expect.any(String)
      });
    });

    test('Should replace existing bun with new one', () => {
      const stateWithBun = {
        ...defaultState,
        burger: {
          bun: {
            _id: '643d69a5c3f7b9001cfa093c',
            name: 'Краторная булка N-200i',
            type: 'bun',
            proteins: 80,
            fat: 24,
            carbohydrates: 53,
            calories: 420,
            id: 'existing-bun-id',
            price: 1255,
            image: 'https://code.s3.yandex.net/react/code/bun-02.png',
            image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
            image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
          },
          ingredients: []
        }
      };

      const newState = burgerConstructorSlice.reducer(
        stateWithBun,
        burgerConstructorSlice.actions.insertIngredient({
          _id: '643d69a5c3f7b9001cfa093d',
          name: 'Флюоресцентная булка R2-D3',
          type: 'bun',
          proteins: 44,
          fat: 26,
          carbohydrates: 85,
          calories: 643,
          price: 988,
          image: 'https://code.s3.yandex.net/react/code/bun-01.png',
          image_mobile: 'https://code.s3.yandex.net/react/code/bun-01-mobile.png',
          image_large: 'https://code.s3.yandex.net/react/code/bun-01-large.png'
        })
      );

      const updatedBun = newState.burger.bun;
      expect(updatedBun).toEqual({
        _id: '643d69a5c3f7b9001cfa093d',
        name: 'Флюоресцентная булка R2-D3',
        type: 'bun',
        proteins: 44,
        fat: 26,
        carbohydrates: 85,
        calories: 643,
        price: 988,
        image: 'https://code.s3.yandex.net/react/code/bun-01.png',
        image_mobile: 'https://code.s3.yandex.net/react/code/bun-01-mobile.png',
        image_large: 'https://code.s3.yandex.net/react/code/bun-01-large.png',
        id: expect.any(String)
      });
    });
  });

  describe('Ingredient Removal Tests', () => {
    const stateWithIngredient = {
      isLoading: false,
      burger: {
        bun: null,
        ingredients: [
          {
            id: 'test-ingredient-id',
            _id: '643d69a5c3f7b9001cfa0944',
            name: 'Соус традиционный галактический',
            type: 'sauce',
            proteins: 42,
            fat: 24,
            carbohydrates: 42,
            calories: 99,
            price: 15,
            image: 'https://code.s3.yandex.net/react/code/sauce-03.png',
            image_mobile: 'https://code.s3.yandex.net/react/code/sauce-03-mobile.png',
            image_large: 'https://code.s3.yandex.net/react/code/sauce-03-large.png'
          }
        ]
      },
      isOrdering: false,
      orderDetails: null,
      errorMessage: null
    };

    test('Should remove ingredient from constructor', () => {
      const newState = burgerConstructorSlice.reducer(
        stateWithIngredient,
        burgerConstructorSlice.actions.deleteIngredient('test-ingredient-id')
      );

      expect(newState.burger.ingredients).toHaveLength(0);
    });
  });

  describe('Ingredient Movement Tests', () => {
    const stateWithMultipleIngredients = {
      isLoading: false,
      burger: {
        bun: {
          id: 'bun-id',
          _id: '643d69a5c3f7b9001cfa093c',
          name: 'Краторная булка N-200i',
          type: 'bun',
          proteins: 80,
          fat: 24,
          carbohydrates: 53,
          calories: 420,
          price: 1255,
          image: 'https://code.s3.yandex.net/react/code/bun-02.png',
          image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
          image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
        },
        ingredients: [
          {
            id: 'ingredient-1',
            _id: '643d69a5c3f7b9001cfa0944',
            name: 'Соус традиционный галактический',
            type: 'sauce',
            proteins: 42,
            fat: 24,
            carbohydrates: 42,
            calories: 99,
            price: 15,
            image: 'https://code.s3.yandex.net/react/code/sauce-03.png',
            image_mobile: 'https://code.s3.yandex.net/react/code/sauce-03-mobile.png',
            image_large: 'https://code.s3.yandex.net/react/code/sauce-03-large.png'
          },
          {
            id: 'ingredient-2',
            _id: '643d69a5c3f7b9001cfa0946',
            name: 'Хрустящие минеральные кольца',
            type: 'main',
            proteins: 808,
            fat: 689,
            carbohydrates: 609,
            calories: 986,
            price: 300,
            image: 'https://code.s3.yandex.net/react/code/mineral_rings.png',
            image_mobile: 'https://code.s3.yandex.net/react/code/mineral_rings-mobile.png',
            image_large: 'https://code.s3.yandex.net/react/code/mineral_rings-large.png'
          },
          {
            id: 'ingredient-3',
            _id: '643d69a5c3f7b9001cfa0947',
            name: 'Плоды Фалленианского дерева',
            type: 'main',
            proteins: 20,
            fat: 5,
            carbohydrates: 55,
            calories: 77,
            price: 874,
            image: 'https://code.s3.yandex.net/react/code/sp_1.png',
            image_mobile: 'https://code.s3.yandex.net/react/code/sp_1-mobile.png',
            image_large: 'https://code.s3.yandex.net/react/code/sp_1-large.png'
          }
        ]
      },
      isOrdering: false,
      orderDetails: null,
      errorMessage: null
    };

    test('Should move ingredient up in the list', () => {
      const newState = burgerConstructorSlice.reducer(
        stateWithMultipleIngredients,
        burgerConstructorSlice.actions.shiftIngredientUp(2)
      );

      expect(newState.burger.ingredients[1].id).toBe('ingredient-3');
      expect(newState.burger.ingredients[2].id).toBe('ingredient-2');
    });

    test('Should move ingredient down in the list', () => {
      const newState = burgerConstructorSlice.reducer(
        stateWithMultipleIngredients,
        burgerConstructorSlice.actions.shiftIngredientDown(1)
      );

      expect(newState.burger.ingredients[1].id).toBe('ingredient-3');
      expect(newState.burger.ingredients[2].id).toBe('ingredient-2');
    });
  });

  describe('Order Creation Tests', () => {
    const actions = {
      pending: {
        type: createOrder.pending.type,
        payload: null
      },
      rejected: {
        type: createOrder.rejected.type,
        error: { message: 'Test error message' }
      },
      fulfilled: {
        type: createOrder.fulfilled.type,
        payload: { order: { number: 404 } }
      }
    };

    test('Should handle pending order state', () => {
      const state = burgerConstructorSlice.reducer(
        burgerConstructorSlice.getInitialState(),
        actions.pending
      );
      expect(state.isLoading).toBe(true);
      expect(state.errorMessage).toBe(null);
    });

    test('Should handle rejected order state', () => {
      const state = burgerConstructorSlice.reducer(
        burgerConstructorSlice.getInitialState(),
        actions.rejected
      );
      expect(state.isLoading).toBe(false);
      expect(state.errorMessage).toBe(actions.rejected.error.message);
      expect(state.orderDetails).toBe(null);
    });

    test('Should handle fulfilled order state', () => {
      const state = burgerConstructorSlice.reducer(
        burgerConstructorSlice.getInitialState(),
        actions.fulfilled
      );
      expect(state.isLoading).toBe(false);
      expect(state.errorMessage).toBe(null);
      expect(state.orderDetails?.number).toBe(actions.fulfilled.payload.order.number);
    });
  });
});
