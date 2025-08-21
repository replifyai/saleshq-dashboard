/**
 * Redux Store Configuration
 * Central store for application state management
 */

import { configureStore } from '@reduxjs/toolkit';
import { organizationSlice } from './slices/organizationSlice';
import { chatSlice } from './slices/chatSlice';

export const store = configureStore({
  reducer: {
    organization: organizationSlice.reducer,
    chat: chatSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
  devTools: process.env.DEV,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;