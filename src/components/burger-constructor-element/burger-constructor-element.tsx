import { FC } from 'react';
import { useDispatch } from '@store';
import {
  deleteIngredient,
  shiftIngredientUp,
  shiftIngredientDown
} from '../../services/slices/constructorSlice/constructorSlice';
import { BurgerConstructorElementUI } from '../ui/burger-constructor-element';
import { TConstructorIngredient } from '@utils-types';

interface IBurgerConstructorElementProps {
  ingredient: TConstructorIngredient;
  index: number;
  totalItems: number;
}

export const BurgerConstructorElement: FC<IBurgerConstructorElementProps> = ({
  ingredient,
  index,
  totalItems
}) => {
  const dispatch = useDispatch();

  return (
    <BurgerConstructorElementUI
      ingredient={ingredient}
      index={index}
      totalItems={totalItems}
      handleMoveUp={() => dispatch(shiftIngredientUp(index))}
      handleMoveDown={() => dispatch(shiftIngredientDown(index))}
      handleClose={() => dispatch(deleteIngredient(ingredient.id))}
    />
  );
};
