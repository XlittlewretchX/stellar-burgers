import { FC } from 'react';
import { useDispatch } from '@store';
import { useLocation } from 'react-router-dom';
import { insertIngredient } from '../../services/slices/constructorSlice/constructorSlice';
import { BurgerIngredientUI } from '../ui/burger-ingredient';
import { TIngredient } from '@utils-types';

interface IBurgerIngredientProps {
  ingredient: TIngredient;
  count: number;
}

export const BurgerIngredient: FC<IBurgerIngredientProps> = ({
  ingredient,
  count
}) => {
  const dispatch = useDispatch();
  const location = useLocation();

  const handleAdd = () => {
    dispatch(insertIngredient(ingredient));
  };

  return (
    <BurgerIngredientUI
      ingredient={ingredient}
      count={count}
      locationState={{ background: location }}
      handleAdd={handleAdd}
    />
  );
};
