import { FC, memo, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { OrderCardProps } from './type';
import { TIngredient } from '@utils-types';
import { OrderCardUI } from '../ui/order-card';
import { useSelector } from '@store';
import { getIngredientState } from '../../services/slices/ingredientSlice/ingredientSlice';

const DISPLAY_LIMIT = 6;

const OrderCard: FC<OrderCardProps> = memo(({ order }) => {
  const location = useLocation();
  const { ingredients } = useSelector(getIngredientState);

  const processOrderData = useMemo(() => {
    if (!ingredients.length) return null;

    const createOrderInfo = () => {
      const findIngredients = () =>
        order.ingredients.reduce<TIngredient[]>((acc, itemId) => {
          const found = ingredients.find((ing) => ing._id === itemId);
          return found ? [...acc, found] : acc;
        }, []);

      const calculateTotals = (items: TIngredient[]) => ({
        total: items.reduce((sum, item) => sum + item.price, 0),
        visibleItems: items.slice(0, DISPLAY_LIMIT),
        remainingCount: Math.max(0, items.length - DISPLAY_LIMIT)
      });

      const ingredientsList = findIngredients();
      const { total, visibleItems, remainingCount } =
        calculateTotals(ingredientsList);

      return {
        ...order,
        ingredientsInfo: ingredientsList,
        ingredientsToShow: visibleItems,
        remains: remainingCount,
        total,
        date: new Date(order.createdAt)
      };
    };

    return createOrderInfo();
  }, [order, ingredients]);

  if (!processOrderData) return null;

  return (
    <OrderCardUI
      orderInfo={processOrderData}
      maxIngredients={DISPLAY_LIMIT}
      locationState={{ background: location }}
    />
  );
});

OrderCard.displayName = 'OrderCard';

export { OrderCard };
