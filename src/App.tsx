import React from 'react';

import { Web3ReactProvider } from '@web3-react/core';

import Routes from './compositions/Routes/Routes';
import { setLibrary } from './helpers/ethers';
import useMapWeb3ReactToStore from './hooks/useMapWeb3ReactToStore';
import useSwitchChain from './hooks/useSwitchChain';
import DebugPage from './pages/DebugPage/DebugPage';
import { useAppSelector } from './redux/hooks';
import { useConfig } from './redux/stores/config/configHooks';
import { useIndexers } from './redux/stores/indexer/indexerHooks';
import { useMetadata } from './redux/stores/metadata/metadataHooks';
import { useTransactions } from './redux/stores/transactions/transactionsHooks';
import ToastsWidget from './widgets/ToastsWidget/ToastsWidget';

const ConnectedApp = () => {
  const { isFailed } = useAppSelector(state => state.config);

  useConfig();
  useMapWeb3ReactToStore();
  useTransactions();
  useMetadata();
  useIndexers();
  useSwitchChain();

  if (isFailed) {
    return (
      <DebugPage />
    );
  }

  return (
    <Routes />
  );
};

const App = () => (
  <Web3ReactProvider getLibrary={setLibrary}>
    <ConnectedApp />
    <ToastsWidget />
  </Web3ReactProvider>
);

export default App;
