import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useSelector, useDispatch } from '@store';
import {
  getOrderFeedState,
  fetchOrderFeed
} from '../../services/slices/feedSlice/feedSlice';

const OrderFeedContainer: FC = () => {
  const feedState = useSelector(getOrderFeedState);
  const dispatch = useDispatch();

  const refreshFeed = () => dispatch(fetchOrderFeed());

  useEffect(() => {
    refreshFeed();
  }, []);

  const renderContent = () => {
    if (feedState.isLoading) {
      return <Preloader />;
    }

    return <FeedUI orders={feedState.orderList} handleGetFeeds={refreshFeed} />;
  };

  return renderContent();
};

export const Feed = OrderFeedContainer;
