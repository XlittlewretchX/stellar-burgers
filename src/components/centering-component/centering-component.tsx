import { FC, memo, useEffect, useState, useCallback } from 'react';
import { CenteringComponentUI } from '../ui/centering-component';
import { TCentering } from './type';
import { useLocation } from 'react-router-dom';

const CenteringComponent: FC<TCentering> = memo(({ title, children }) => {
  const location = useLocation();
  const [titleStyle, setTitleStyle] = useState('text_type_main-large');

  const determineTitleStyle = useCallback(() => {
    const styleMap = {
      feed: 'text_type_digits-default',
      profile: 'text_type_digits-default',
      default: 'text_type_main-large'
    };

    const path = location.pathname.toLowerCase();
    const matchedStyle = Object.entries(styleMap).find(([key]) =>
      path.includes(key)
    )?.[1];

    return matchedStyle || styleMap.default;
  }, [location.pathname]);

  useEffect(() => {
    const newStyle = determineTitleStyle();
    setTitleStyle(newStyle);
  }, [determineTitleStyle]);

  return (
    <CenteringComponentUI
      title={title}
      titleStyle={titleStyle}
      children={children}
    />
  );
});

CenteringComponent.displayName = 'CenteringComponent';

export { CenteringComponent };
