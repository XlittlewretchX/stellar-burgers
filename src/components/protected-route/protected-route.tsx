import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from '@store';
import { Preloader } from '../ui/preloader';
import { getProfileState } from '../../services/slices/userSlice/userSlice';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ onlyUnAuth }) => {
  const location = useLocation();
  const { authStatusChecked, isLoggedIn } = useSelector(getProfileState);

  if (!authStatusChecked) {
    return <Preloader />;
  }

  if (!onlyUnAuth && !isLoggedIn) {
    return <Navigate replace to='/login' state={{ from: location }} />;
  }

  if (onlyUnAuth && isLoggedIn) {
    const defaultPath = { pathname: '/' };
    const redirectPath = location.state?.from || defaultPath;
    return <Navigate replace to={redirectPath} />;
  }

  return <Outlet />;
};

ProtectedRoute.displayName = 'ProtectedRoute';

export { ProtectedRoute };
