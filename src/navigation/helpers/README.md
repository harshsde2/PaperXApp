# Navigation Helpers

Type-safe navigation utility functions for React Navigation.

## Usage

### Basic Usage with NavigationHelper Class

```typescript
import { useNavigation } from '@react-navigation/native';
import { createNavigationHelper, RootNavigationProp } from '@navigation/helpers';
import { SCREENS } from '@navigation/constants';

const MyComponent = () => {
  const navigation = useNavigation<RootNavigationProp>();
  const nav = createNavigationHelper(navigation);

  // Navigate to a screen
  const handleNavigate = () => {
    nav.navigate(SCREENS.MAIN.PROFILE);
  };

  // Navigate with params
  const handleNavigateWithParams = () => {
    nav.navigate(SCREENS.AUTH.OTP_VERIFICATION, {
      mobile: '+1234567890',
      purpose: 'login',
    });
  };

  // Push a new screen
  const handlePush = () => {
    nav.push(SCREENS.MAIN.DASHBOARD);
  };

  // Replace current screen
  const handleReplace = () => {
    nav.replace(SCREENS.AUTH.LOGIN);
  };

  // Reset navigation stack
  const handleReset = () => {
    nav.resetTo(SCREENS.MAIN.DASHBOARD);
  };

  // Go back
  const handleGoBack = () => {
    nav.goBack();
  };

  // Check if can go back
  if (nav.canGoBack()) {
    // Show back button
  }

  return (
    // Your component JSX
  );
};
```

### Direct Usage (Simpler)

```typescript
import { useNavigation } from '@react-navigation/native';
import { useNavigationHelpers, RootNavigationProp } from '@navigation/helpers';
import { SCREENS } from '@navigation/constants';

const MyComponent = () => {
  const navigation = useNavigation<RootNavigationProp>();
  const nav = useNavigationHelpers(navigation);

  // Use nav methods directly
  nav.navigate(SCREENS.MAIN.PROFILE);
  nav.push(SCREENS.MAIN.DASHBOARD);
  nav.resetTo(SCREENS.AUTH.LOGIN);
};
```

## Available Methods

### `navigate(screenName, params?)`
Navigate to a screen. If the screen is already in the stack, it will navigate to it instead of pushing a new one.

```typescript
nav.navigate(SCREENS.MAIN.PROFILE);
nav.navigate(SCREENS.AUTH.OTP_VERIFICATION, { mobile: '+1234567890', purpose: 'login' });
```

### `push(screenName, params?)`
Push a new screen onto the stack, even if it already exists.

```typescript
nav.push(SCREENS.MAIN.DASHBOARD);
```

### `replace(screenName, params?)`
Replace the current screen with a new one.

```typescript
nav.replace(SCREENS.AUTH.LOGIN);
```

### `reset(routes)`
Reset the navigation state to a new state with multiple routes.

```typescript
nav.reset([
  { name: SCREENS.AUTH.LOGIN },
  { name: SCREENS.AUTH.OTP_VERIFICATION, params: { mobile: '+1234567890', purpose: 'login' } },
]);
```

### `resetTo(screenName, params?)`
Reset navigation to a single screen (clears entire stack).

```typescript
nav.resetTo(SCREENS.MAIN.DASHBOARD);
nav.resetTo(SCREENS.AUTH.LOGIN);
```

### `goBack()`
Go back to the previous screen. Only works if there's a previous screen.

```typescript
nav.goBack();
```

### `canGoBack()`
Check if navigation can go back.

```typescript
if (nav.canGoBack()) {
  // Show back button
}
```

### `pop(count?)`
Pop a specific number of screens from the stack.

```typescript
nav.pop(); // Pop 1 screen
nav.pop(2); // Pop 2 screens
```

### `popToTop()`
Pop to the top of the stack (first screen).

```typescript
nav.popToTop();
```

### `getCurrentRouteName()`
Get the current route name.

```typescript
const currentRoute = nav.getCurrentRouteName();
```

### `getCurrentRouteParams<T>()`
Get the current route params with type safety.

```typescript
const params = nav.getCurrentRouteParams<{ mobile: string; purpose: 'login' | 'signup' }>();
```

## Type Safety

All navigation methods are fully type-safe. TypeScript will:
- Autocomplete screen names
- Validate params for each screen
- Show errors if wrong params are passed
- Provide IntelliSense for all available screens

## Best Practices

1. **Always use SCREENS constants** instead of string literals:
   ```typescript
   // ✅ Good
   nav.navigate(SCREENS.MAIN.PROFILE);
   
   // ❌ Bad
   nav.navigate('Profile');
   ```

2. **Use resetTo for authentication flows**:
   ```typescript
   // After logout
   nav.resetTo(SCREENS.AUTH.LOGIN);
   ```

3. **Use navigate for normal navigation**:
   ```typescript
   // Normal screen navigation
   nav.navigate(SCREENS.MAIN.DASHBOARD);
   ```

4. **Use push when you need multiple instances**:
   ```typescript
   // When you need multiple instances of the same screen
   nav.push(SCREENS.MAIN.DASHBOARD);
   ```

5. **Check canGoBack before showing back button**:
   ```typescript
   {nav.canGoBack() && <BackButton onPress={nav.goBack} />}
   ```

