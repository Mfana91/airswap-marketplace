import React, { FC, useCallback } from 'react';

import { FullOrder, TokenInfo } from '@airswap/types';
import { NavLink } from 'react-router-dom';

import Button from '../../../../components/Button/Button';
import { AppRoutes } from '../../../../routes';
import { ListNftState } from '../ConnectedListNftWidget/ConnectedListNftWidget';

import './ListActionButtons.scss';

interface ActionButtonsProps {
  hasInsufficientAmount: boolean;
  hasInsufficientExpiryAmount: boolean;
  hasNoCollectionTokenApproval: boolean;
  currencyToken: TokenInfo;
  fullOrder?: FullOrder;
  state: ListNftState;
  onActionButtonClick: () => void;
  className?: string;
}

const ListActionButtons: FC<ActionButtonsProps> = ({
  hasInsufficientAmount,
  hasInsufficientExpiryAmount,
  hasNoCollectionTokenApproval,
  currencyToken,
  fullOrder,
  state,
  onActionButtonClick,
  className = '',
}) => {
  const getReviewButtonText = () => {
    if (hasNoCollectionTokenApproval) {
      return 'Approve NFT';
    }

    return 'Sign Transaction';
  };

  const getDisabledButtonText = () => {
    if (hasInsufficientExpiryAmount) {
      return 'Fill in expiry';
    }

    return 'Fill in amount';
  };

  const getActionButton = useCallback((): JSX.Element | null => {
    if (hasInsufficientAmount) {
      return (
        <Button
          disabled
          text={getDisabledButtonText()}
          className="list-action-buttons__action-button"
        />
      );
    }

    if (state === ListNftState.details) {
      return (
        <Button
          text="List NFT"
          onClick={onActionButtonClick}
          className="list-action-buttons__action-button"
        />
      );
    }

    if (state === ListNftState.review) {
      return (
        <Button
          text={getReviewButtonText()}
          onClick={onActionButtonClick}
          className="list-action-buttons__action-button"
        />
      );
    }

    if (state === ListNftState.sign) {
      return (
        <NavLink
          to="/"
          className="list-action-buttons__action-button"
        >
          Sign transaction
        </NavLink>
      );
    }

    if (state === ListNftState.listing) {
      return (
        <NavLink
          to="/"
          className="list-action-buttons__action-button"
        >
          Back to collection
        </NavLink>
      );
    }

    if (state === ListNftState.success) {
      const tokenId = fullOrder?.signer.id;

      return (
        <NavLink
          to={`/${AppRoutes.nftDetail}/${tokenId}/buy`}
          className="list-action-buttons__action-button"
        >
          View listing
        </NavLink>
      );
    }

    if (state === ListNftState.failed) {
      return (
        <NavLink
          to={`/${AppRoutes.nftDetail}/1`}
          className="list-action-buttons__action-button"
        >
          Go back
        </NavLink>
      );
    }

    return null;
  }, [
    hasInsufficientAmount,
    hasInsufficientExpiryAmount,
    hasNoCollectionTokenApproval,
    currencyToken,
    state,
  ]);

  return (
    <div className={`list-action-buttons ${className}`}>
      {getActionButton()}
    </div>
  );
};

export default ListActionButtons;