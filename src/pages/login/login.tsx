import { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { useDispatch, useSelector } from '@store';
import { Navigate } from 'react-router-dom';
import {
  getProfileError,
  getProfileState,
  authenticateUser
} from '../../services/slices/userSlice/userSlice';

const AuthenticationForm: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const profileState = useSelector(getProfileState);
  const authError = useSelector(getProfileError);
  const dispatch = useDispatch();

  const processLogin = (e: SyntheticEvent) => {
    e.preventDefault();

    if (email && password) {
      dispatch(authenticateUser({ email, password }));
    }
  };

  if (profileState.isLoggedIn) {
    return <Navigate to='/' replace />;
  }

  return (
    <LoginUI
      errorText={authError?.toString()}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={processLogin}
    />
  );
};

export const Login = AuthenticationForm;
