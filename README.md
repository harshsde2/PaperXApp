This is a new [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

# Getting Started

> **Note**: Make sure you have completed the [Set Up Your Environment](https://reactnative.dev/docs/set-up-your-environment) guide before proceeding.

## Step 1: Start Metro

First, you will need to run **Metro**, the JavaScript build tool for React Native.

To start the Metro dev server, run the following command from the root of your React Native project:

```sh
# Using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Build and run your app

With Metro running, open a new terminal window/pane from the root of your React Native project, and use one of the following commands to build and run your Android or iOS app:

### Android

```sh
# Using npm
npm run android

# OR using Yarn
yarn android
```

### iOS

For iOS, remember to install CocoaPods dependencies (this only needs to be run on first clone or after updating native deps).

The first time you create a new project, run the Ruby bundler to install CocoaPods itself:

```sh
bundle install
```

Then, and every time you update your native dependencies, run:

```sh
bundle exec pod install
```

For more information, please visit [CocoaPods Getting Started guide](https://guides.cocoapods.org/using/getting-started.html).

```sh
# Using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up correctly, you should see your new app running in the Android Emulator, iOS Simulator, or your connected device.

This is one way to run your app — you can also build it directly from Android Studio or Xcode.

## Step 3: Modify your app

Now that you have successfully run the app, let's make changes!

Open `App.tsx` in your text editor of choice and make some changes. When you save, your app will automatically update and reflect these changes — this is powered by [Fast Refresh](https://reactnative.dev/docs/fast-refresh).

When you want to forcefully reload, for example to reset the state of your app, you can perform a full reload:

- **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Dev Menu**, accessed via <kbd>Ctrl</kbd> + <kbd>M</kbd> (Windows/Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (macOS).
- **iOS**: Press <kbd>R</kbd> in iOS Simulator.

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [docs](https://reactnative.dev/docs/getting-started).

# Troubleshooting

If you're having issues getting the above steps to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.

---

# PaperX App - Caching Strategy & Best Practices

## Overview

This app uses **React Query (TanStack Query)** for API data fetching and **MMKV** for local storage. Due to the real-time, time-sensitive nature of the B2B marketplace, we follow a **selective caching strategy**.

## ⚠️ Important: What NOT to Cache

### ❌ Do NOT persist/cache these data types:

1. **Active Sessions**
   - Sessions expire quickly (24 hours to 7 days)
   - Time-sensitive and dynamic
   - Always fetch fresh data

2. **Matches & Matchmaking Data**
   - Discovery windows are short (minutes to hours)
   - Match status changes frequently
   - Cached matches can become outdated

3. **Chat Messages**
   - Real-time via WebSocket
   - Always use WebSocket for live updates
   - Don't cache message history from API

4. **Active Posts/Inquiries**
   - Frequently updated
   - Responses change in real-time
   - Users need latest data

5. **Notifications**
   - Real-time only
   - Time-sensitive
   - Fetch fresh on app open

### Query Configuration for Time-Sensitive Data:

```typescript
// ✅ Correct: Always fetch fresh
const useActiveSessions = () => {
  return useQuery({
    queryKey: queryKeys.matches.activeSessions(),
    queryFn: fetchActiveSessions,
    staleTime: 0,        // Always consider stale
    gcTime: 0,           // Don't keep in cache
    refetchOnMount: true,
    refetchOnReconnect: true,
  });
};
```

## ✅ What TO Cache (Selective Caching)

### Cache these data types (in-memory only):

1. **User Profile**
   - Doesn't change frequently
   - Used across the app
   - Good candidate for short-term caching

2. **Material Catalog / Reference Data**
   - Static or semi-static data
   - Material types, categories, specifications
   - Changes rarely

3. **Company Details**
   - Relatively stable data
   - Updated infrequently

### Query Configuration for Cacheable Data:

```typescript
// ✅ Correct: Cache with appropriate stale time (in-memory only)
const useUserProfile = () => {
  return useQuery({
    queryKey: queryKeys.user.profile(),
    queryFn: fetchUserProfile,
    staleTime: 10 * 60 * 1000,  // 10 minutes - considered fresh
    gcTime: 30 * 60 * 1000,     // Keep in cache for 30 minutes
  });
};
```

## Storage Strategy

### MMKV Usage (Persistent Storage):

- ✅ **Auth Tokens** - Stored in MMKV (secure, persistent)
- ✅ **User Data** - Stored in MMKV (persistent login state)
- ✅ **App Preferences** - Stored in MMKV
- ❌ **API Cache** - React Query in-memory only (not persisted)

### Why No Cache Persistence?

- Most data is **time-sensitive** (sessions expire in hours/days)
- **Real-time features** require fresh data (WebSocket for chat/notifications)
- **B2B users** need current opportunities, not stale data
- **Simpler architecture** - no cache invalidation complexity
- **Better UX** - users always see fresh, accurate data

## Architecture Summary

```
┌─────────────────────────────────────────┐
│         React Query (In-Memory)         │
│  • Fast API data caching                │
│  • Lost on app restart (by design)      │
│  • Perfect for time-sensitive data      │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│         MMKV (Persistent Storage)       │
│  • Auth tokens                          │
│  • User preferences                     │
│  • App configuration                    │
│  • NOT for API cache                    │
└─────────────────────────────────────────┘
```

## Best Practices

1. **Always use appropriate `staleTime`** - Set to 0 for time-sensitive data
2. **Set `gcTime: 0`** for data that should never be cached
3. **Use WebSocket** for real-time data (chat, notifications, sessions)
4. **Fetch fresh on mount** for critical data (sessions, matches)
5. **Keep MMKV for auth only** - Don't store API responses in MMKV

## Example: Time-Sensitive Query

```typescript
// ❌ WRONG - Don't cache active sessions
const useActiveSessions = () => {
  return useQuery({
    queryKey: queryKeys.matches.activeSessions(),
    queryFn: fetchActiveSessions,
    staleTime: 5 * 60 * 1000, // ❌ Too long - sessions change quickly
  });
};

// ✅ CORRECT - Always fetch fresh
const useActiveSessions = () => {
  return useQuery({
    queryKey: queryKeys.matches.activeSessions(),
    queryFn: fetchActiveSessions,
    staleTime: 0,           // ✅ Always stale
    gcTime: 0,              // ✅ Don't cache
    refetchOnMount: true,   // ✅ Fetch on every mount
  });
};
```
