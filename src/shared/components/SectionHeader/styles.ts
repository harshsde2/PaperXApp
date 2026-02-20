import { StyleSheet } from 'react-native';
import { fontWeightForPlatform } from '@shared/utils/fontWeightForPlatform';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: fontWeightForPlatform('700'),
    color: '#000000',
  },
  actionText: {
    fontSize: 14,
    fontWeight: fontWeightForPlatform('600'),
    color: '#007AFF',
  },
});

