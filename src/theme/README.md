# Theme System

A comprehensive design token system for the PaperX App, following enterprise-level standards (similar to Material Design, Apple HIG, etc.).

## Overview

The theme system is built with:
- **Design Tokens**: Atomic design values (colors, spacing, typography, etc.)
- **Semantic Tokens**: Purpose-driven token names that map to design tokens
- **Theme Configuration**: Complete theme objects for light/dark modes
- **Type Safety**: Full TypeScript support with strict types

## Architecture

```
theme/
├── tokens/
│   ├── base.ts          # Raw design tokens (base values)
│   ├── semantic.ts      # Semantic tokens (purpose-driven names)
│   └── index.ts         # Token exports
├── config.ts            # Theme configuration (light/dark themes)
├── types.ts             # TypeScript type definitions
├── hooks/
│   └── useTheme.ts      # React hook to access theme
├── index.ts             # Main export point
└── README.md            # This file
```

## Usage

### Basic Usage

```tsx
import { useTheme } from '@theme';

function MyComponent() {
  const theme = useTheme();

  return (
    <View style={{
      backgroundColor: theme.colors.background.primary,
      padding: theme.spacing[4],
      borderRadius: theme.borderRadius.card.md,
    }}>
      <Text style={theme.typography.heading.h1}>
        Hello World
      </Text>
    </View>
  );
}
```

### Using Colors

```tsx
const theme = useTheme();

// Primary colors
theme.colors.primary.DEFAULT        // Main primary color
theme.colors.primary.light          // Light variant
theme.colors.primary.dark           // Dark variant
theme.colors.primary[500]           // Specific shade

// Status colors
theme.colors.status.matching        // Green - Matching status
theme.colors.status.reviewing       // Purple - Reviewing status
theme.colors.status.pending         // Orange - Pending status
theme.colors.status.urgent          // Orange - Urgent
theme.colors.status.approved        // Green - Approved

// Semantic colors
theme.colors.text.primary           // Primary text color
theme.colors.text.secondary         // Secondary text color
theme.colors.background.primary     // Primary background
theme.colors.surface.primary        // Card/surface background
theme.colors.border.primary         // Border color
theme.colors.border.focus           // Focus border color
```

### Using Typography

```tsx
const theme = useTheme();

// Headings
theme.typography.heading.h1         // Largest heading
theme.typography.heading.h2
theme.typography.heading.h3
// ... h4, h5, h6

// Body text
theme.typography.body.large
theme.typography.body.medium
theme.typography.body.small

// Captions
theme.typography.caption.large
theme.typography.caption.medium
theme.typography.caption.small

// Buttons
theme.typography.button.large
theme.typography.button.medium
theme.typography.button.small

// Usage in StyleSheet
const styles = StyleSheet.create({
  title: {
    ...theme.typography.heading.h1,
    color: theme.colors.text.primary,
  },
  body: {
    ...theme.typography.body.medium,
    color: theme.colors.text.secondary,
  },
});
```

### Using Spacing

```tsx
const theme = useTheme();

// Base spacing scale (4px base unit)
theme.spacing[1]    // 4px
theme.spacing[2]    // 8px
theme.spacing[4]    // 16px
theme.spacing[6]    // 24px
theme.spacing[8]    // 32px

// Semantic spacing
theme.spacing.component.padding.md  // 16px
theme.spacing.component.gap.md      // 12px
theme.spacing.layout.container.padding  // 16px
```

### Using Border Radius

```tsx
const theme = useTheme();

// Semantic border radius
theme.borderRadius.button.md        // 8px
theme.borderRadius.card.md          // 12px
theme.borderRadius.input.md         // 8px
theme.borderRadius.modal            // 16px
theme.borderRadius.badge            // 9999 (full)

// Base border radius
theme.borderRadius.sm               // 6px
theme.borderRadius.md               // 8px
theme.borderRadius.lg               // 12px
theme.borderRadius.xl               // 16px
theme.borderRadius.full             // 9999
```

### Using Shadows

```tsx
const theme = useTheme();

// Semantic shadows
theme.shadows.card                  // Card shadow
theme.shadows.cardHover             // Card hover shadow
theme.shadows.modal                 // Modal shadow
theme.shadows.dropdown              // Dropdown shadow
theme.shadows.button                // Button shadow
theme.shadows.inputFocus            // Input focus shadow

// Usage
const styles = StyleSheet.create({
  card: {
    ...theme.shadows.card,
    backgroundColor: theme.colors.surface.primary,
  },
});
```

### Using Opacity

```tsx
const theme = useTheme();

theme.opacity[50]   // 0.5
theme.opacity[75]   // 0.75
theme.opacity[100]  // 1.0

// Usage
const styles = StyleSheet.create({
  overlay: {
    backgroundColor: theme.colors.background.overlay,
    opacity: theme.opacity[80],
  },
});
```

### Using Z-Index

```tsx
const theme = useTheme();

theme.zIndex.dropdown   // 1000
theme.zIndex.modal      // 1400
theme.zIndex.tooltip    // 1700
theme.zIndex.toast      // 1800
```

## Design Token Categories

### Colors

- **Primary**: Brand primary color (blue)
- **Secondary**: Secondary brand color (gray)
- **Status Colors**: Success, Warning, Error, Info
- **Status-Specific**: Matching, Reviewing, Pending, Urgent, Approved, etc.
- **Semantic Colors**: Background, Surface, Text, Border, Divider

### Typography

- **Headings**: h1-h6
- **Body**: Large, Medium, Small
- **Caption**: Large, Medium, Small
- **Button**: Large, Medium, Small
- **Overline**: Uppercase small text

### Spacing

- **Base Scale**: 4px base unit (1 = 4px, 2 = 8px, etc.)
- **Component Spacing**: Padding and gap values for components
- **Layout Spacing**: Container and section spacing

### Border Radius

- **Semantic**: Button, Card, Input, Modal, Badge, Image
- **Base**: xs, sm, md, lg, xl, 2xl, 3xl, full

### Shadows

- **Semantic**: Card, Modal, Dropdown, Button, Input
- **Base**: none, sm, md, lg, xl, 2xl

## Theme Modes

Currently, only the **light theme** is implemented. The dark theme structure is prepared for future implementation.

To switch themes in the future:

```tsx
// This will be implemented when dark mode is needed
const theme = useTheme(); // Returns theme based on current mode
```

## Best Practices

1. **Always use semantic tokens** instead of direct color values
   ```tsx
   // ✅ Good
   color: theme.colors.text.primary
   
   // ❌ Bad
   color: '#1F2937'
   ```

2. **Use theme.spacing for all spacing values**
   ```tsx
   // ✅ Good
   padding: theme.spacing[4]
   
   // ❌ Bad
   padding: 16
   ```

3. **Use typography tokens for text styles**
   ```tsx
   // ✅ Good
   ...theme.typography.heading.h1
   
   // ❌ Bad
   fontSize: 32,
   fontWeight: 'bold'
   ```

4. **Use semantic border radius**
   ```tsx
   // ✅ Good
   borderRadius: theme.borderRadius.card.md
   
   // ❌ Bad
   borderRadius: 12
   ```

5. **Keep styles in styles.ts files** (following project structure)
   ```tsx
   // styles.ts
   import { useTheme } from '@theme';
   
   export const styles = StyleSheet.create({
     container: {
       backgroundColor: theme.colors.background.primary,
       padding: theme.spacing[4],
     },
   });
   ```

## Migration from Legacy Theme

If you're using the old theme exports (`colors`, `spacing`, `typography`, `borderRadius`), they're still available for backward compatibility but are marked as deprecated. Migrate to the new system:

```tsx
// Old way (deprecated)
import { colors, spacing } from '@theme';

// New way (recommended)
import { useTheme } from '@theme';
const theme = useTheme();
```

## Type Safety

All theme values are fully typed. TypeScript will help you discover available tokens:

```tsx
const theme = useTheme();

// TypeScript autocomplete will show all available colors
theme.colors.primary. // Shows: DEFAULT, light, dark, 50-900

// TypeScript will catch errors
theme.colors.primary.invalid // ❌ Type error
```

## Extending the Theme

To add new tokens:

1. Add base tokens in `tokens/base.ts`
2. Map to semantic tokens in `tokens/semantic.ts`
3. Include in theme config in `config.ts`
4. Add types in `types.ts` if needed

## References

This theme system follows industry standards from:
- Material Design 3
- Apple Human Interface Guidelines
- Tailwind CSS Design Tokens
- Enterprise design systems

