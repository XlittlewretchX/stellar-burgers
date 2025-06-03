import { FC, SyntheticEvent, useState } from 'react';
import { RegisterUI } from '@ui-pages';
import { useDispatch, useSelector } from '@store';
import {
  getProfileError,
  registerNewUser
} from '../../services/slices/userSlice/userSlice';
import { useNavigate } from 'react-router-dom';

const RegistrationForm: FC = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const registrationError = useSelector(getProfileError);

  const processRegistration = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(registerNewUser({ email, password, name: userName }));
    navigate('/login');
  };

  return (
    <RegisterUI
      errorText={registrationError?.toString()}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={processRegistration}
    />
  );
};

export const Register = RegistrationForm;
