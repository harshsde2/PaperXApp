import React, { useState } from 'react';
import { Provider } from 'react-redux';
import { QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { store } from './src/store';
import { queryClient } from './src/services/api/queryClient';
import AppNavigator from './src/navigation/AppNavigator';
import { BottomSheetProvider } from '@shared/components/BottomSheet';
import { ThemeProvider } from './src/theme';
import ToastManager, { Toast } from 'toastify-react-native';
import { ToastBanner } from '@shared/components/Toast';
import { ToastListener } from '@shared/components/ToastListener';
import AnimatedSplash from '@shared/components/AnimatedSplash';

function App() {
  const [splashVisible, setSplashVisible] = useState(true);

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <ThemeProvider>
            <BottomSheetProvider>
              <SafeAreaProvider>
                <ToastManager
                  width="90%"
                  position="top"
                  theme="light"
                  showCloseIcon
                  showProgressBar={false}
                  useModal={false}
                  config={{
                    success: (props) => (
                      <ToastBanner
                        type="success"
                        title={props.text1 || ''}
                        message={props.text2}
                        onClose={props.hide}
                      />
                    ),
                    info: (props) => (
                      <ToastBanner
                        type="info"
                        title={props.text1 || ''}
                        message={props.text2}
                        onClose={props.hide}
                      />
                    ),
                    warn: (props) => (
                      <ToastBanner
                        type="warning"
                        title={props.text1 || ''}
                        message={props.text2}
                        onClose={props.hide}
                      />
                    ),
                    error: (props) => (
                      <ToastBanner
                        type="error"
                        title={props.text1 || ''}
                        message={props.text2}
                        onClose={props.hide}
                      />
                    ),
                  }}
                />
                <ToastListener />
                <AppNavigator />
                {splashVisible && (
                  <AnimatedSplash
                    onAnimationEnd={() => setSplashVisible(false)}
                  />
                )}
              </SafeAreaProvider>
            </BottomSheetProvider>
          </ThemeProvider>
        </GestureHandlerRootView>
      </QueryClientProvider>
    </Provider>
  );
}

export default App;
