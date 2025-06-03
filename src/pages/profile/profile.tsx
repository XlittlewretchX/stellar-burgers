import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useSelector, useDispatch } from '@store';
import {
  fetchUserProfile,
  getProfileState,
  updateUserProfile
} from '../../services/slices/userSlice/userSlice';
import { Preloader } from '@ui';

const UserProfileContainer: FC = () => {
  const profileState = useSelector(getProfileState);
  const dispatch = useDispatch();

  const defaultUserData = {
    name: profileState.profileData?.name || '',
    email: profileState.profileData?.email || '',
    password: ''
  };

  const [userForm, setUserForm] = useState(defaultUserData);

  useEffect(() => {
    const { name, email } = profileState.profileData || {};
    setUserForm((prev) => ({
      ...prev,
      name: name || '',
      email: email || ''
    }));
  }, [profileState.profileData]);

  const hasChanges = () => {
    const { name, email } = profileState.profileData || {};
    return (
      userForm.name !== name ||
      userForm.email !== email ||
      userForm.password !== ''
    );
  };

  const resetForm = (e: SyntheticEvent) => {
    e.preventDefault();
    setUserForm(defaultUserData);
  };

  const updateForm = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const saveChanges = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(updateUserProfile(userForm));
    dispatch(fetchUserProfile());
  };

  if (profileState.isLoading) {
    return <Preloader />;
  }

  return (
    <ProfileUI
      formValue={userForm}
      isFormChanged={hasChanges()}
      handleCancel={resetForm}
      handleSubmit={saveChanges}
      handleInputChange={updateForm}
    />
  );
};

export const Profile = UserProfileContainer;
