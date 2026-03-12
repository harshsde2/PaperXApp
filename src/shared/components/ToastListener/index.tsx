import { useEffect } from 'react';
import { View } from 'react-native';
import { Toast } from 'toastify-react-native';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { hideToast } from '@store/slices/uiSlice';
import type { ToastListenerProps } from './@types';
import { styles } from './styles';

export const ToastListener = ({ disabled }: ToastListenerProps) => {
  const dispatch = useAppDispatch();
  const toast = useAppSelector((state) => state.ui.toast);

  useEffect(() => {
    if (disabled || !toast.message || !toast.type) {
      return;
    }

    const position: 'top' | 'center' | 'bottom' = 'top';

    if (toast.type === 'success') {
      Toast.success(toast.message, position);
    } else if (toast.type === 'error') {
      Toast.error(toast.message, position);
    } else if (toast.type === 'info') {
      Toast.info(toast.message, position);
    } else if (toast.type === 'warning') {
      Toast.warn(toast.message, position);
    }

    dispatch(hideToast());
  }, [toast.message, toast.type, disabled, dispatch]);

  return <View style={styles.hidden} />;
};

