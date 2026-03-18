import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { useSelector } from '@store';
import { getUserState } from '../../services/slices/userSlice/userSlice';

export const AppHeader: FC = () => {
  const { userData, isAuthenticated } = useSelector(getUserState);

  return (
    <AppHeaderUI
      userName={userData?.name ?? ''}
      isAuthenticated={isAuthenticated}
    />
  );
};
