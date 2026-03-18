import React, { FC } from 'react';
import styles from './profile-menu.module.css';
import { NavLink } from 'react-router-dom';
import { ProfileMenuUIProps } from './type';

export const ProfileMenuUI: FC<ProfileMenuUIProps> = ({
  pathname,
  handleLogout
}) => (
  <>
    <nav className={styles.nav}>
      <NavLink
        to={'/profile'}
        className={({ isActive }) =>
          `text text_type_main-medium text_color_inactive ${styles.link} ${
            isActive ? styles.link_active : ''
          }`
        }
        end
      >
        Профиль
      </NavLink>
      <NavLink
        to={'/profile/orders'}
        className={({ isActive }) =>
          `text text_type_main-medium text_color_inactive ${styles.link} ${
            isActive ? styles.link_active : ''
          }`
        }
      >
        История заказов
      </NavLink>
      <button
        className={`text text_type_main-medium text_color_inactive ${styles.button}`}
        type='button'
        onClick={handleLogout}
      >
        Выход
      </button>
    </nav>
    <p
      className={`${styles.hint} text text_type_main-default text_color_inactive`}
    >
      {pathname === '/profile'
        ? 'В этом разделе вы можете изменить свои персональные данные'
        : 'В этом разделе вы можете просмотреть свою историю заказов'}
    </p>
  </>
);
