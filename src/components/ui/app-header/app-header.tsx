import React, { FC, useEffect, useRef, useState } from 'react';
import styles from './app-header.module.css';
import { TAppHeaderUIProps } from './type';
import {
  CloseIcon,
  MenuIcon
} from '@zlden/react-developer-burger-ui-components';
import { Link, NavLink, useLocation } from 'react-router-dom';

export const AppHeaderUI: FC<TAppHeaderUIProps> = ({
  userName,
  isAuthenticated
}) => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const lastScrollYRef = useRef(0);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const isScrollingDown = currentScrollY > lastScrollYRef.current;
      const isScrollingUp = currentScrollY < lastScrollYRef.current;

      if (currentScrollY <= 10) {
        setIsHeaderVisible(true);
      } else if (isScrollingDown && !isMenuOpen) {
        setIsHeaderVisible(false);
      } else if (isScrollingUp) {
        setIsHeaderVisible(true);
      }

      lastScrollYRef.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isMenuOpen]);

  useEffect(() => {
    if (isMenuOpen) {
      setIsHeaderVisible(true);
    }
  }, [isMenuOpen]);

  useEffect(() => {
    const handleEscape = (evt: KeyboardEvent) => {
      if (evt.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleEscape);

    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, []);

  return (
    <>
      <header
        className={`${styles.header} ${!isHeaderVisible ? styles.headerHidden : ''}`}
      >
        <div className={styles.bar}>
          <Link to='/' className={styles.logo} aria-label='На главную'>
            stellar burgers
          </Link>
          <button
            className={styles.menuButton}
            type='button'
            aria-label={isMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((prevState) => !prevState)}
          >
            {isMenuOpen ? (
              <CloseIcon type='primary' />
            ) : (
              <MenuIcon type='primary' />
            )}
          </button>
        </div>
      </header>

      <div
        className={`${styles.overlay} ${isMenuOpen ? styles.overlayVisible : ''}`}
        onClick={() => setIsMenuOpen(false)}
      />

      <aside
        className={`${styles.drawer} ${isMenuOpen ? styles.drawerOpen : ''}`}
      >
        <nav className={styles.drawerMenu}>
          <NavLink
            to='/'
            end
            className={({ isActive }) =>
              `${styles.drawerLink} text text_type_main-medium ${
                isActive ? styles.drawerLinkActive : ''
              }`
            }
          >
            Конструктор
          </NavLink>
          <NavLink
            to='/feed'
            className={({ isActive }) =>
              `${styles.drawerLink} text text_type_main-medium ${
                isActive ? styles.drawerLinkActive : ''
              }`
            }
          >
            Лента заказов
          </NavLink>
          {isAuthenticated ? (
            <NavLink
              to='/profile'
              className={({ isActive }) =>
                `${styles.drawerLink} text text_type_main-medium ${
                  isActive ? styles.drawerLinkActive : ''
                }`
              }
            >
              {userName || 'Личный кабинет'}
            </NavLink>
          ) : (
            <NavLink
              to='/login'
              className={({ isActive }) =>
                `${styles.drawerLink} text text_type_main-medium ${
                  isActive ? styles.drawerLinkActive : ''
                }`
              }
            >
              Войти
            </NavLink>
          )}
        </nav>
      </aside>
    </>
  );
};
