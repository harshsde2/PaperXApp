import React from 'react';
import { Provider } from 'react-redux';
import { QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { store } from './src/store';
import { queryClient } from './src/services/api/queryClient';
import AppNavigator from './src/navigation/AppNavigator';
import { BottomSheetProvider } from '@shared/components/BottomSheet';

function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <BottomSheetProvider>
            <SafeAreaProvider>
              <AppNavigator />
            </SafeAreaProvider>
          </BottomSheetProvider>
        </GestureHandlerRootView>
      </QueryClientProvider>
    </Provider>
  );
}

export default App;
