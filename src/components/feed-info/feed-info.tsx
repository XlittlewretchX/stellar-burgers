import { FC, useMemo } from 'react';
import { TOrder } from '@utils-types';
import { FeedInfoUI } from '../ui/feed-info';
import { useSelector } from '@store';
import { getOrderFeedState } from '../../services/slices/feedSlice/feedSlice';

const FeedInfo: FC = () => {
  const { orderList, totalOrders, todayOrders } =
    useSelector(getOrderFeedState);

  const processOrders = useMemo(() => {
    const orderProcessor = (status: string): number[] =>
      orderList
        .filter((order) => order.status === status)
        .map((order) => order.number)
        .slice(0, 20);

    return {
      ready: orderProcessor('done'),
      pending: orderProcessor('pending')
    };
  }, [orderList]);

  const feedData = useMemo(
    () => ({
      orders: orderList,
      total: totalOrders,
      totalToday: todayOrders
    }),
    [orderList, totalOrders, todayOrders]
  );

  return (
    <FeedInfoUI
      readyOrders={processOrders.ready}
      pendingOrders={processOrders.pending}
      feed={feedData}
    />
  );
};

FeedInfo.displayName = 'FeedInfo';
export { FeedInfo };
