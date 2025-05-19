import { FC, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { Params, useParams } from 'react-router-dom';
import { useSelector } from '@store';
import { getIngredientState } from '../../services/slices/ingredientSlice/ingredientSlice';

const IngredientDetails: FC = () => {
  const { ingredients } = useSelector(getIngredientState);
  const { id } = useParams<Params>();

  const ingredientData = useMemo(() => {
    const findIngredient = () =>
      ingredients.find((ingredient) => ingredient._id === id);

    return findIngredient();
  }, [ingredients, id]);

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};

IngredientDetails.displayName = 'IngredientDetails';

export { IngredientDetails };
