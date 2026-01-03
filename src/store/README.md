# Redux Store Setup

## Overview

This directory contains the Redux store configuration and slices for global state management in the PaperX app.

## Structure

```
store/
├── index.ts           # Store configuration
├── hooks.ts           # Typed hooks (useAppDispatch, useAppSelector)
└── slices/
    ├── authSlice.ts   # Authentication state
    ├── roleSlice.ts   # Role management (primary/secondary/active role)
    └── uiSlice.ts     # UI state (loading, modals, toasts, bottom sheets)
```

## Available Slices

### 1. Auth Slice (`authSlice.ts`)

Manages authentication state:

- `isAuthenticated`: Whether user is logged in
- `user`: User object with id, mobile, roles, etc.
- `token`: JWT token
- `isLoading`: Loading state for auth operations
- `error`: Error message if any
- `otpSent`: Whether OTP has been sent
- `otpVerified`: Whether OTP has been verified

**Actions:**
- `setCredentials({ user, token })`: Set user and token after successful login
- `setLoading(boolean)`: Set loading state
- `setError(string | null)`: Set error message
- `clearError()`: Clear error message
- `setOTPSent(boolean)`: Mark OTP as sent
- `setOTPVerified(boolean)`: Mark OTP as verified
- `logout()`: Clear all auth data
- `updateUser(partialUser)`: Update user data

**Usage:**
```typescript
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { setCredentials, logout } from '@store/slices/authSlice';

// In component
const dispatch = useAppDispatch();
const { isAuthenticated, user } = useAppSelector((state) => state.auth);

dispatch(setCredentials({ user, token }));
```

### 2. Role Slice (`roleSlice.ts`)

Manages user roles and role switching:

- `primaryRole`: User's primary role
- `secondaryRole`: User's secondary role (optional)
- `activeRole`: Currently active role
- `availableRoles`: Array of all available roles

**Actions:**
- `setRoles({ primaryRole, secondaryRole? })`: Set user's roles
- `setActiveRole(role)`: Set the active role
- `switchRole()`: Toggle between primary and secondary
- `clearRoles()`: Clear all role data

**Usage:**
```typescript
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { setRoles, switchRole } from '@store/slices/roleSlice';

const dispatch = useAppDispatch();
const { activeRole, availableRoles } = useAppSelector((state) => state.role);

dispatch(setRoles({ primaryRole: 'dealer', secondaryRole: 'converter' }));
dispatch(switchRole()); // Toggle between primary and secondary
```

### 3. UI Slice (`uiSlice.ts`)

Manages UI state (loading, modals, toasts, bottom sheets):

- `isLoading`: Global loading state
- `loadingMessage`: Loading message to display
- `modal`: Modal state (type, props, isOpen)
- `toast`: Toast notification state
- `bottomSheet`: Bottom sheet state

**Actions:**
- `setLoading({ isLoading, message? })`: Set global loading state
- `openModal({ type, props? })`: Open a modal
- `closeModal()`: Close the modal
- `showToast({ message, type })`: Show a toast notification
- `hideToast()`: Hide the toast
- `openBottomSheet(content)`: Open bottom sheet with content
- `closeBottomSheet()`: Close bottom sheet

**Usage:**
```typescript
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { setLoading, showToast } from '@store/slices/uiSlice';

const dispatch = useAppDispatch();
const { isLoading } = useAppSelector((state) => state.ui);

dispatch(setLoading({ isLoading: true, message: 'Loading...' }));
dispatch(showToast({ message: 'Success!', type: 'success' }));
```

## Typed Hooks

Always use the typed hooks instead of plain Redux hooks:

```typescript
import { useAppDispatch, useAppSelector } from '@store/hooks';

// Instead of:
// import { useDispatch, useSelector } from 'react-redux';

const dispatch = useAppDispatch(); // Typed with AppDispatch
const user = useAppSelector((state) => state.auth.user); // Typed with RootState
```

## Type Safety

The store is fully typed with TypeScript:

```typescript
import type { RootState, AppDispatch } from '@store';

// RootState gives you type for the entire state tree
type AuthState = RootState['auth'];

// AppDispatch gives you type for dispatch function
const dispatch: AppDispatch = useAppDispatch();
```

## Future Slices (To be added)

Based on the project structure, these slices will be added later:

- `chatSlice.ts`: Chat messages and conversations
- `sessionSlice.ts`: Active matchmaking sessions
- `matchSlice.ts`: Match data
- `notificationSlice.ts`: Notifications
- `paymentSlice.ts`: Payment state

## Best Practices

1. **Use typed hooks**: Always use `useAppDispatch` and `useAppSelector`
2. **Keep slices focused**: Each slice should manage one domain of state
3. **Immutable updates**: Redux Toolkit uses Immer, so you can write "mutating" logic
4. **Action creators**: Use the generated action creators from slices
5. **Selector functions**: Extract complex selectors to separate functions for reusability

## Example: Complete Usage

```typescript
import React from 'react';
import { View, Button } from 'react-native';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { setCredentials, logout } from '@store/slices/authSlice';
import { setRoles, switchRole } from '@store/slices/roleSlice';
import { showToast } from '@store/slices/uiSlice';

const ExampleScreen = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const { activeRole } = useAppSelector((state) => state.role);

  const handleLogin = () => {
    dispatch(setCredentials({
      user: { id: '1', mobile: '1234567890', primaryRole: 'dealer', isVerified: true },
      token: 'jwt-token-here'
    }));
    dispatch(setRoles({ primaryRole: 'dealer', secondaryRole: 'converter' }));
    dispatch(showToast({ message: 'Logged in successfully!', type: 'success' }));
  };

  const handleLogout = () => {
    dispatch(logout());
    dispatch(showToast({ message: 'Logged out', type: 'info' }));
  };

  return (
    <View>
      {isAuthenticated ? (
        <>
          <Text>Welcome {user?.mobile}</Text>
          <Text>Active Role: {activeRole}</Text>
          <Button title="Switch Role" onPress={() => dispatch(switchRole())} />
          <Button title="Logout" onPress={handleLogout} />
        </>
      ) : (
        <Button title="Login" onPress={handleLogin} />
      )}
    </View>
  );
};
```

## Integration with TanStack Query

When you add TanStack Query (React Query) later:
- Use TanStack Query for **server state** (API calls, caching, refetching)
- Use Redux for **client state** (UI state, user preferences, local data)
- Both can coexist in the same app
- Redux can dispatch actions based on TanStack Query mutations/queries

