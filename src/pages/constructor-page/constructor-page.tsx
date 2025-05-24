import { FC } from 'react';
import { useSelector } from '@store';
import styles from './constructor-page.module.css';
import { BurgerIngredients, BurgerConstructor } from '../../components';
import { Preloader } from '../../components/ui';
import { getIngredientState } from '../../services/slices/ingredientSlice/ingredientSlice';

const ConstructorPage: FC = () => {
  const { loading: isIngredientsLoading } = useSelector(getIngredientState);

  const renderContent = () => {
    if (isIngredientsLoading) {
      return <Preloader />;
    }

    return (
      <main className={styles.containerMain}>
        <h1
          className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}
        >
          Соберите бургер
        </h1>
        <div className={`${styles.main} pl-5 pr-5`}>
          <BurgerIngredients />
          <BurgerConstructor />
        </div>
      </main>
    );
  };

  return renderContent();
};

export default ConstructorPage;
