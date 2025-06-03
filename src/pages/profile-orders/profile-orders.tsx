import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useSelector, useDispatch } from '@store';
import {
  fetchUserOrders,
  getProfileState
} from '../../services/slices/userSlice/userSlice';
import { fetchOrderFeed } from '../../services/slices/feedSlice/feedSlice';
import { Preloader } from '@ui';

const UserOrdersContainer: FC = () => {
  const profileState = useSelector(getProfileState);
  const dispatch = useDispatch();

  const loadOrders = () => {
    dispatch(fetchUserOrders());
    dispatch(fetchOrderFeed());
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const renderContent = () => {
    if (profileState.isLoading) {
      return <Preloader />;
    }

    return <ProfileOrdersUI orders={profileState.orderHistory} />;
  };

  return renderContent();
};

export const ProfileOrders = UserOrdersContainer;
