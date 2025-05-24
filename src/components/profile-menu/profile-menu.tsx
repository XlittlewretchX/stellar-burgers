import { FC, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ProfileMenuUI } from '@ui';
import { useDispatch } from '@store';
import { terminateSession } from '../../services/slices/userSlice/userSlice';

const ProfileMenu: FC = () => {
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = useCallback(() => {
    const performLogout = () => {
      dispatch(terminateSession());
      navigate('/');
    };

    performLogout();
  }, [dispatch, navigate]);

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};

ProfileMenu.displayName = 'ProfileMenu';

export { ProfileMenu };
