import { forwardRef, useMemo } from 'react';
import { TIngredientsCategoryProps } from './type';
import { TIngredient } from '@utils-types';
import { IngredientsCategoryUI } from '../ui/ingredients-category';
import { useSelector } from '@store';
import { selectConstructorState } from '../../services/slices/constructorSlice/constructorSlice';

const IngredientsCategory = forwardRef<
  HTMLUListElement,
  TIngredientsCategoryProps
>(({ title, titleRef, ingredients }, ref) => {
  const { burger } = useSelector(selectConstructorState);

  const calculateIngredientCounts = useMemo(() => {
    const createCounters = () => {
      const counterMap = new Map<string, number>();

      const processIngredients = (items: TIngredient[]) => {
        items.forEach((item) => {
          const currentCount = counterMap.get(item._id) || 0;
          counterMap.set(item._id, currentCount + 1);
        });
      };

      processIngredients(burger.ingredients);

      if (burger.bun) {
        counterMap.set(burger.bun._id, 2);
      }

      return Object.fromEntries(counterMap);
    };

    return createCounters();
  }, [burger]);

  return (
    <IngredientsCategoryUI
      title={title}
      titleRef={titleRef}
      ingredients={ingredients}
      ingredientsCounters={calculateIngredientCounts}
      ref={ref}
    />
  );
});

IngredientsCategory.displayName = 'IngredientsCategory';

export { IngredientsCategory };
