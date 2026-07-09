/**
 * @format
 */

import { AppRegistry } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import notifee, { EventType } from '@notifee/react-native';
import App from './App';
import { name as appName } from './app.json';

/**
 * Background / quit-state FCM handler.
 * MUST be registered here (outside the React tree) so the OS can invoke it
 * when the app is not in the foreground. On Android this renders a notifee
 * notification for data-only messages; on iOS the system displays the alert.
 */
messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  // Lazy-import to avoid pulling the React-heavy module graph into the
  // headless task any earlier than necessary.
  const { displayNotification } = require('./src/services/notifications');
  await displayNotification(remoteMessage);
});

/**
 * Background tap on a notifee-displayed notification. The actual navigation is
 * performed when the app comes to the foreground via getInitialNotification /
 * the foreground event; here we only need to acknowledge the event exists.
 */
notifee.onBackgroundEvent(async ({ type, detail }) => {
  if (type === EventType.PRESS) {
    // No-op: handled on foreground by handleInitialNotification().
    // Kept to satisfy notifee's requirement of a registered background handler.
    void detail;
  }
});

AppRegistry.registerComponent(appName, () => App);
