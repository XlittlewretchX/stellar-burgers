import styles from './constructor-page.module.css';

import { BurgerIngredients } from '../../components';
import { BurgerConstructor } from '../../components';
import { Preloader } from '../../components/ui';
import { FC, TouchEvent, useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from '@store';
import { getIngredientState } from '../../services/slices/ingredientSlice/ingredientSlice';
import { getConstructorState } from '../../services/slices/constructorSlice/constructorSlice';
import {
  Button,
  CurrencyIcon
} from '@zlden/react-developer-burger-ui-components';
import { TConstructorIngredient } from '@utils-types';

export const ConstructorPage: FC = () => {
  const isIngredientsLoading = useSelector(getIngredientState).loading;
  const { constructorItems, orderRequest, orderModalData } =
    useSelector(getConstructorState);
  const [isConstructorOpen, setIsConstructorOpen] = useState(false);
  const [isMobileLayout, setIsMobileLayout] = useState(false);
  const [drawerOffset, setDrawerOffset] = useState(0);
  const [isDrawerDragging, setIsDrawerDragging] = useState(false);
  const hasOrderModal = Boolean(orderRequest || orderModalData);
  const swipeStartYRef = useRef<number | null>(null);

  const totalPrice = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (sum: number, item: TConstructorIngredient) => sum + item.price,
        0
      ),
    [constructorItems]
  );

  const onMobileOrderClick = () => setIsConstructorOpen(true);
  const closeConstructorDrawer = () => {
    setIsConstructorOpen(false);
    setDrawerOffset(0);
    setIsDrawerDragging(false);
    swipeStartYRef.current = null;
  };

  const handleDrawerSwipeStart = (event: TouchEvent<HTMLDivElement>) => {
    if (!isConstructorOpen || hasOrderModal) {
      return;
    }

    swipeStartYRef.current = event.touches[0].clientY;
    setIsDrawerDragging(true);
  };

  const handleDrawerSwipeMove = (event: TouchEvent<HTMLDivElement>) => {
    if (
      swipeStartYRef.current === null ||
      !isConstructorOpen ||
      hasOrderModal
    ) {
      return;
    }

    const swipeDelta = event.touches[0].clientY - swipeStartYRef.current;
    setDrawerOffset(Math.max(0, Math.min(swipeDelta, 320)));
  };

  const handleDrawerSwipeEnd = () => {
    if (swipeStartYRef.current === null) {
      return;
    }

    const closeBySwipeThreshold = 120;
    const shouldClose = drawerOffset > closeBySwipeThreshold;

    if (shouldClose) {
      closeConstructorDrawer();
      return;
    }

    setDrawerOffset(0);
    setIsDrawerDragging(false);
    swipeStartYRef.current = null;
  };

  const constructorDrawerStyle =
    isConstructorOpen && !hasOrderModal
      ? {
          transform: `translateY(${drawerOffset}px)`,
          transition: isDrawerDragging ? 'none' : undefined
        }
      : undefined;

  useEffect(() => {
    const mobileBreakpoint = 1024;

    const handleResize = () => {
      const isMobile = window.innerWidth <= mobileBreakpoint;
      setIsMobileLayout(isMobile);

      if (!isMobile) {
        closeConstructorDrawer();
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      {isIngredientsLoading ? (
        <Preloader />
      ) : (
        <main className={styles.containerMain}>
          <h1
            className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}
          >
            Соберите бургер
          </h1>
          <div className={`${styles.main} pl-5 pr-5`}>
            <BurgerIngredients />
            {isMobileLayout && (
              <div className={styles.mobileOrderPanel}>
                <div className={styles.mobileOrderPrice}>
                  <p className={`text ${styles.mobileOrderPriceValue} mr-2`}>
                    {totalPrice}
                  </p>
                  <CurrencyIcon type='primary' />
                </div>
                <div className={styles.mobileOrderButton}>
                  <Button
                    htmlType='button'
                    type='primary'
                    size='large'
                    children='Оформить заказ'
                    onClick={onMobileOrderClick}
                    data-cy='order-button-mobile'
                  />
                </div>
              </div>
            )}
            {!isMobileLayout && <BurgerConstructor />}
          </div>

          {isMobileLayout && (
            <>
              {isConstructorOpen && !hasOrderModal && (
                <button
                  className={styles.constructorBackdrop}
                  type='button'
                  onClick={closeConstructorDrawer}
                  aria-label='Закрыть состав'
                />
              )}
              <section
                className={`${styles.constructorDrawer} ${
                  isConstructorOpen ? styles.constructorDrawerOpen : ''
                }`}
                style={constructorDrawerStyle}
              >
                <div
                  className={styles.constructorDrawerSwipe}
                  onTouchStart={handleDrawerSwipeStart}
                  onTouchMove={handleDrawerSwipeMove}
                  onTouchEnd={handleDrawerSwipeEnd}
                  onTouchCancel={handleDrawerSwipeEnd}
                >
                  <span className={styles.constructorDrawerSwipeLine} />
                </div>
                <div className={styles.constructorDrawerHeader}>
                  <p className='text text_type_main-medium'>Состав бургера</p>
                  <button
                    className={styles.constructorDrawerClose}
                    type='button'
                    onClick={closeConstructorDrawer}
                  >
                    Закрыть
                  </button>
                </div>
                <BurgerConstructor />
              </section>

              {!isConstructorOpen && !hasOrderModal && (
                <button
                  className={styles.constructorToggle}
                  type='button'
                  onClick={() => setIsConstructorOpen(true)}
                >
                  Состав бургера
                </button>
              )}
            </>
          )}
        </main>
      )}
    </>
  );
};
