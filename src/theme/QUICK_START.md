# Theme System - Quick Start Guide

## 🚀 Quick Start

### 1. Import the hook

```tsx
import { useTheme } from '@theme';
```

### 2. Use in your component

```tsx
function MyComponent() {
  const theme = useTheme();

  return (
    <View style={{
      backgroundColor: theme.colors.background.primary,
      padding: theme.spacing[4],
    }}>
      <Text style={theme.typography.heading.h1}>
        Hello World
      </Text>
    </View>
  );
}
```

## 📋 Common Patterns

### Colors
```tsx
theme.colors.primary.DEFAULT        // Primary blue
theme.colors.text.primary           // Main text color
theme.colors.background.primary     // White background
theme.colors.status.matching        // Green for matching status
theme.colors.status.reviewing       // Purple for reviewing
theme.colors.status.pending         // Orange for pending
```

### Typography
```tsx
theme.typography.heading.h1         // Largest heading
theme.typography.body.medium        // Body text
theme.typography.caption.medium     // Small text
theme.typography.button.medium      // Button text
```

### Spacing
```tsx
theme.spacing[4]                    // 16px
theme.spacing[6]                    // 24px
theme.spacing.component.padding.md  // 16px
```

### Border Radius
```tsx
theme.borderRadius.button.md        // 8px
theme.borderRadius.card.md          // 12px
theme.borderRadius.input.md         // 8px
```

### Shadows
```tsx
theme.shadows.card                  // Card shadow
theme.shadows.modal                 // Modal shadow
```

## 🎯 In StyleSheet Files

```tsx
// styles.ts
import { StyleSheet } from 'react-native';
import { useTheme } from '@theme';

// Note: useTheme() can't be called outside component
// So create a function that returns styles
export const createStyles = (theme: ReturnType<typeof useTheme>) => 
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background.primary,
      padding: theme.spacing[4],
      borderRadius: theme.borderRadius.card.md,
      ...theme.shadows.card,
    },
    title: {
      ...theme.typography.heading.h2,
      color: theme.colors.text.primary,
      marginBottom: theme.spacing[2],
    },
    text: {
      ...theme.typography.body.medium,
      color: theme.colors.text.secondary,
    },
  });

// In component
function MyComponent() {
  const theme = useTheme();
  const styles = createStyles(theme);
  
  return <View style={styles.container}>...</View>;
}
```

## 📚 Full Documentation

See [README.md](./README.md) for complete documentation.

