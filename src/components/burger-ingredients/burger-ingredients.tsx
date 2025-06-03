import { useState, useRef, useEffect, FC, useMemo, useCallback } from 'react';
import { useInView } from 'react-intersection-observer';
import { TTabMode } from '@utils-types';
import { BurgerIngredientsUI } from '../ui/burger-ingredients';
import { useSelector } from '@store';
import { getIngredientState } from '../../services/slices/ingredientSlice/ingredientSlice';

const BurgerIngredients: FC = () => {
  const { ingredients } = useSelector(getIngredientState);

  const ingredientCategories = useMemo(
    () => ({
      buns: ingredients.filter((i) => i.type === 'bun'),
      mains: ingredients.filter((i) => i.type === 'main'),
      sauces: ingredients.filter((i) => i.type === 'sauce')
    }),
    [ingredients]
  );

  const [currentTab, setCurrentTab] = useState<TTabMode>('bun');

  const refs = {
    titleBun: useRef<HTMLHeadingElement>(null),
    titleMain: useRef<HTMLHeadingElement>(null),
    titleSauces: useRef<HTMLHeadingElement>(null)
  };

  const [bunsRef, inViewBuns] = useInView({ threshold: 0 });
  const [mainsRef, inViewFilling] = useInView({ threshold: 0 });
  const [saucesRef, inViewSauces] = useInView({ threshold: 0 });

  const scrollToSection = useCallback(
    (tab: string) => {
      const refMap = {
        bun: refs.titleBun,
        main: refs.titleMain,
        sauce: refs.titleSauces
      };

      refMap[tab as keyof typeof refMap]?.current?.scrollIntoView({
        behavior: 'smooth'
      });
    },
    [refs]
  );

  const onTabClick = useCallback(
    (tab: string) => {
      setCurrentTab(tab as TTabMode);
      scrollToSection(tab);
    },
    [scrollToSection]
  );

  useEffect(() => {
    const tabVisibilityMap = {
      bun: inViewBuns,
      sauce: inViewSauces,
      main: inViewFilling
    };

    const visibleTab = Object.entries(tabVisibilityMap).find(
      ([_, isVisible]) => isVisible
    )?.[0] as TTabMode;

    if (visibleTab) {
      setCurrentTab(visibleTab);
    }
  }, [inViewBuns, inViewFilling, inViewSauces]);

  return (
    <BurgerIngredientsUI
      currentTab={currentTab}
      buns={ingredientCategories.buns}
      mains={ingredientCategories.mains}
      sauces={ingredientCategories.sauces}
      titleBunRef={refs.titleBun}
      titleMainRef={refs.titleMain}
      titleSaucesRef={refs.titleSauces}
      bunsRef={bunsRef}
      mainsRef={mainsRef}
      saucesRef={saucesRef}
      onTabClick={onTabClick}
    />
  );
};

BurgerIngredients.displayName = 'BurgerIngredients';

export { BurgerIngredients };
