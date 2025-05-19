import { FC, useMemo } from 'react';
import { OrderStatusProps } from './type';
import { OrderStatusUI } from '@ui';

const OrderStatus: FC<OrderStatusProps> = ({ status }) => {
  const statusConfig = useMemo(() => {
    const statusMessages = {
      pending: 'Готовится',
      done: 'Выполнен',
      created: 'Создан'
    } as const;

    const statusColors = {
      pending: '#E52B1A',
      done: '#00CCCC',
      created: '#F2F2F3'
    } as const;

    return {
      message:
        statusMessages[status as keyof typeof statusMessages] ||
        statusMessages.created,
      color:
        statusColors[status as keyof typeof statusColors] ||
        statusColors.created
    };
  }, [status]);

  return (
    <OrderStatusUI textStyle={statusConfig.color} text={statusConfig.message} />
  );
};

OrderStatus.displayName = 'OrderStatus';

export { OrderStatus };
