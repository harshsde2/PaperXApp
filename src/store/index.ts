import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import roleReducer from './slices/roleSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    role: roleReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types for serialization checks
        // Useful when storing non-serializable values like React components
        ignoredActions: ['ui/openBottomSheet'],
        ignoredPaths: ['ui.bottomSheet.content'],
      },
    }),
  devTools: __DEV__, // Enable Redux DevTools only in development
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
