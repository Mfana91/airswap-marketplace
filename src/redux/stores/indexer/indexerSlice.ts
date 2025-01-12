import { FullOrder } from '@airswap/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { initialize } from './indexerApi';

export interface IndexerState {
  isInitialized: boolean;
  isLoading: boolean;
  lastFailedOrder?: FullOrder;
  lastSentOrder?: FullOrder;
  urls: string[];
}

const initialState: IndexerState = {
  isInitialized: false,
  isLoading: false,
  urls: [],
};

export const indexerSlice = createSlice({
  name: 'indexer',
  initialState,
  reducers: {
    setLastFailedOrder: (state: IndexerState, action: PayloadAction<FullOrder>): IndexerState => ({
      ...state,
      lastFailedOrder: action.payload,
    }),
    setLastSentOrder: (state: IndexerState, action: PayloadAction<FullOrder>): IndexerState => ({
      ...state,
      lastSentOrder: action.payload,
    }),
  },
  extraReducers: (builder) => {
    builder.addCase(initialize.fulfilled, (state, action: PayloadAction<string[]>): IndexerState => ({
      ...state,
      isInitialized: true,
      urls: action.payload,
    }));
  },
});

export const { setLastFailedOrder, setLastSentOrder } = indexerSlice.actions;

export default indexerSlice.reducer;
