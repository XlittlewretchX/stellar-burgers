import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';
import '../../index.css';
import styles from './app.module.css';

import { AppHeader, IngredientDetails, Modal, OrderInfo } from '@components';
import { Route, Routes, useLocation } from 'react-router-dom';
import { ProtectedRoute } from '../protected-route/protected-route';
import { useDispatch } from '@store';
import { useEffect } from 'react';
import { fetchUserProfile } from '../../services/slices/userSlice/userSlice';
import { getIngredients } from '../../services/slices/ingredientSlice/ingredientSlice';
import { CenteringComponent } from '../centering-component/centering-component';

const MainRoutes = ({ location }: { location: any }) => (
  <Routes location={location}>
    <Route path='/' element={<ConstructorPage />} />
    <Route
      path='/ingredients/:id'
      element={
        <CenteringComponent title={'Детали ингредиента'}>
          <IngredientDetails />
        </CenteringComponent>
      }
    />
    <Route path='/feed' element={<Feed />} />
    <Route
      path='/feed/:number'
      element={
        <CenteringComponent title={`#${location.pathname.match(/\d+/)}`}>
          <OrderInfo />
        </CenteringComponent>
      }
    />
    <Route element={<ProtectedRoute onlyUnAuth />}>
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
      <Route path='/forgot-password' element={<ForgotPassword />} />
      <Route path='/reset-password' element={<ResetPassword />} />
    </Route>
    <Route element={<ProtectedRoute onlyUnAuth={false} />}>
      <Route path='/profile' element={<Profile />} />
      <Route path='/profile/orders' element={<ProfileOrders />} />
      <Route
        path='/profile/orders/:number'
        element={
          <CenteringComponent title={`#${location.pathname.match(/\d+/)}`}>
            <OrderInfo />
          </CenteringComponent>
        }
      />
    </Route>
    <Route path='*' element={<NotFound404 />} />
  </Routes>
);

const ModalRoutes = ({ location }: { location: any }) => (
  <Routes>
    <Route
      path='/ingredients/:id'
      element={
        <Modal
          title={'Детали ингредиента'}
          onClose={() => {
            history.back();
          }}
        >
          <IngredientDetails />
        </Modal>
      }
    />
    <Route
      path='/feed/:number'
      element={
        <Modal
          title={`#${location.pathname.match(/\d+/)}`}
          onClose={() => {
            history.back();
          }}
        >
          <OrderInfo />
        </Modal>
      }
    />
    <Route element={<ProtectedRoute onlyUnAuth={false} />}>
      <Route
        path='/profile/orders/:number'
        element={
          <Modal
            title={`#${location.pathname.match(/\d+/)}`}
            onClose={() => {
              history.back();
            }}
          >
            <OrderInfo />
          </Modal>
        }
      />
    </Route>
  </Routes>
);

const App = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const background = location.state?.background;

  useEffect(() => {
    const initializeApp = () => {
      dispatch(fetchUserProfile());
      dispatch(getIngredients());
    };
    initializeApp();
  }, [dispatch]);

  return (
    <div className={styles.app}>
      <AppHeader />
      <MainRoutes location={background || location} />
      {background && <ModalRoutes location={location} />}
    </div>
  );
};

export default App;
