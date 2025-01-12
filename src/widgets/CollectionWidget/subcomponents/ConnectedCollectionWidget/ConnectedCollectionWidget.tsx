import React, {
  FC,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { TokenInfo } from '@airswap/types';

import SearchInput from '../../../../components/SearchInput/SearchInput';
import { INDEXER_ORDERS_OFFSET } from '../../../../constants/indexer';
import OrdersContainer from '../../../../containers/OrdersContainer/OrdersContainer';
import { filterCollectionTokenBySearchValue } from '../../../../entities/CollectionToken/CollectionTokenHelpers';
import useCollectionTokens from '../../../../hooks/useCollectionTokens';
import useScrollToBottom from '../../../../hooks/useScrollToBottom';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import { getCollectionOrders } from '../../../../redux/stores/collection/collectionApi';
import { reset } from '../../../../redux/stores/collection/collectionSlice';
import getListCallToActionText from '../../helpers/getListCallToActionText';
import CollectionPortrait from '../CollectionPortrait/CollectionPortrait';

interface ConnectedCollectionWidgetProps {
  currencyTokenInfo: TokenInfo;
  className?: string;
}

const ConnectedCollectionWidget: FC<ConnectedCollectionWidgetProps> = ({ currencyTokenInfo, className = '' }) => {
  const dispatch = useAppDispatch();

  const scrolledToBottom = useScrollToBottom();
  const { collectionImage, collectionToken, collectionName } = useAppSelector((state) => state.config);
  const { tokens: userTokens } = useAppSelector((state) => state.balances);
  const {
    hasServerError,
    isLoading,
    isTotalOrdersReached,
    offset,
    orders,
  } = useAppSelector((state) => state.collection);

  const [searchValue, setSearchValue] = useState<string>('');

  const getOrders = () => {
    if (isLoading || isTotalOrdersReached) {
      return;
    }

    dispatch(getCollectionOrders({
      offset,
      limit: INDEXER_ORDERS_OFFSET,
    }));
  };

  useEffect((): () => void => {
    getOrders();

    return () => dispatch(reset());
  }, []);

  useEffect(() => {
    if (scrolledToBottom) {
      getOrders();
    }
  }, [scrolledToBottom]);

  const tokenIds = useMemo(() => orders.map(order => order.signer.id), [orders]);
  const [tokens] = useCollectionTokens(collectionToken, tokenIds);
  const filteredOrders = useMemo(() => (
    orders.filter(order => {
      const orderToken = tokens.find(token => token.id === +order.signer.id);

      return orderToken ? filterCollectionTokenBySearchValue(orderToken, searchValue) : true;
    })), [orders, tokens, searchValue]);
  const listCallToActionText = getListCallToActionText(searchValue, !!userTokens.length, hasServerError);

  return (
    <div className={`collection-widget ${className}`}>
      <CollectionPortrait
        backgroundImage={collectionImage}
        subTitle="Collection"
        title={collectionName}
        className="collection-widget__portrait"
      />
      <div className="collection-widget__content">
        <SearchInput
          placeholder="Search Listings"
          onChange={e => setSearchValue(e.target.value)}
          value={searchValue || ''}
          className="collection-widget__search-input"
        />
        <h2 className="collection-widget__subtitle">
          {searchValue ? 'Search results' : 'All listings'}
        </h2>
        <OrdersContainer
          hasListCallToActionButton={!!userTokens.length && !hasServerError}
          isEndOfOrders={isTotalOrdersReached}
          isLoading={isLoading || offset === 0}
          currencyTokenInfo={currencyTokenInfo}
          listCallToActionText={listCallToActionText}
          orders={filteredOrders}
          tokens={tokens}
          className="collection-widget__nfts-container"
        />
      </div>
    </div>
  );
};

export default ConnectedCollectionWidget;
