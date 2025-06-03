import { FC, useEffect, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useSelector, useDispatch } from '@store';
import { useParams } from 'react-router-dom';
import {
  fetchOrderByNumber,
  selectCurrentOrder,
  selectOrderStatus
} from '../../services/slices/orderSlice/orderSlice';
import { getIngredientState } from '../../services/slices/ingredientSlice/ingredientSlice';

type TIngredientsWithCount = {
  [key: string]: TIngredient & { count: number };
};

const OrderInfo: FC = () => {
  const orderNumber = Number(useParams().number);
  const { ingredients } = useSelector(getIngredientState);
  const currentOrder = useSelector(selectCurrentOrder);
  const { isLoading } = useSelector(selectOrderStatus);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchOrderByNumber(orderNumber));
  }, [dispatch, orderNumber]);

  const processOrderData = useMemo(() => {
    if (!currentOrder || !ingredients.length) return null;

    const createOrderInfo = () => {
      const calculateIngredientCounts = () =>
        currentOrder.ingredients.reduce<TIngredientsWithCount>(
          (acc, itemId) => {
            const existingItem = acc[itemId];

            if (existingItem) {
              existingItem.count++;
              return acc;
            }

            const foundIngredient = ingredients.find(
              (ing) => ing._id === itemId
            );
            if (foundIngredient) {
              acc[itemId] = { ...foundIngredient, count: 1 };
            }

            return acc;
          },
          {}
        );

      const calculateTotal = (items: TIngredientsWithCount) =>
        Object.values(items).reduce(
          (sum, item) => sum + item.price * item.count,
          0
        );

      const ingredientsWithCounts = calculateIngredientCounts();
      const orderTotal = calculateTotal(ingredientsWithCounts);

      return {
        ...currentOrder,
        ingredientsInfo: ingredientsWithCounts,
        date: new Date(currentOrder.createdAt),
        total: orderTotal
      };
    };

    return createOrderInfo();
  }, [currentOrder, ingredients]);

  if (!processOrderData || isLoading) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={processOrderData} />;
};

OrderInfo.displayName = 'OrderInfo';

export { OrderInfo };
