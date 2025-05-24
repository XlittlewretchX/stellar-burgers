import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { useSelector } from '@store';
import { getProfileState } from '../../services/slices/userSlice/userSlice';

export const AppHeader: FC = () => {
  const { profileData } = useSelector(getProfileState);
  return <AppHeaderUI userName={profileData?.name ?? ''} />;
};
