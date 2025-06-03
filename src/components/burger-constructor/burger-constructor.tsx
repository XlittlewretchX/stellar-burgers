import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '@store';
import { useNavigate } from 'react-router-dom';
import {
  selectConstructorState,
  createOrder,
  toggleOrdering,
  clearOrderDetails
} from '../../services/slices/constructorSlice/constructorSlice';
import { getProfileState } from '../../services/slices/userSlice/userSlice';

export const BurgerConstructor: FC = () => {
  const navigation = useNavigate();
  const { burger, orderDetails, isOrdering } = useSelector(
    selectConstructorState
  );
  const { isLoggedIn } = useSelector(getProfileState);

  const dispatchAction = useDispatch();

  const prepareOrderIngredients = () => {
    const ingredientIds = burger.ingredients.map((item) => item._id);

    if (!burger.bun) {
      return [];
    }

    const bunId = burger.bun._id;
    return [bunId, ...ingredientIds, bunId];
  };

  const handleOrderSubmission = () => {
    const orderIngredients = prepareOrderIngredients();

    if (isLoggedIn && burger.bun) {
      dispatchAction(toggleOrdering(true));
      dispatchAction(createOrder(orderIngredients));
    } else if (isLoggedIn && !burger.bun) {
      return;
    } else if (!isLoggedIn) {
      navigation('/login');
    }
  };

  const handleModalClose = () => {
    dispatchAction(toggleOrdering(false));
    dispatchAction(clearOrderDetails());
  };

  const calculateTotalPrice = useMemo(() => {
    const bunPrice = burger.bun ? burger.bun.price * 2 : 0;
    const ingredientsPrice = burger.ingredients.reduce(
      (total: number, item: TConstructorIngredient) => total + item.price,
      0
    );
    return bunPrice + ingredientsPrice;
  }, [burger]);

  return (
    <BurgerConstructorUI
      price={calculateTotalPrice}
      orderRequest={isOrdering}
      constructorItems={burger}
      orderModalData={orderDetails}
      onOrderClick={handleOrderSubmission}
      closeOrderModal={handleModalClose}
    />
  );
};
