# FloatingBottomContainer

A reusable component that creates a floating container at the bottom of the screen. It automatically handles safe area insets and allows content to scroll above it.

## Features

- ✅ Fixed at bottom of screen
- ✅ Automatic safe area inset handling
- ✅ Shadow/elevation support
- ✅ Customizable padding and styling
- ✅ Works with ScrollView, SectionList, and FlatList
- ✅ Accepts any children content

## Usage

### Basic Example

```tsx
import { FloatingBottomContainer } from '@shared/components/FloatingBottomContainer';

<ScreenWrapper scrollable>
  {/* Your scrollable content */}
  <View>
    <Text>Scrollable content here</Text>
  </View>

  {/* Floating button at bottom */}
  <FloatingBottomContainer>
    <TouchableOpacity style={styles.button}>
      <Text>Save & Continue</Text>
    </TouchableOpacity>
  </FloatingBottomContainer>
</ScreenWrapper>
```

### With Custom Styling

```tsx
<FloatingBottomContainer
  backgroundColor="#FFFFFF"
  paddingHorizontal={16}
  paddingVertical={12}
  borderRadius={16}
  shadow={true}
>
  <TouchableOpacity style={styles.button}>
    <Text>Custom Button</Text>
  </TouchableOpacity>
</FloatingBottomContainer>
```

### With Multiple Buttons

```tsx
<FloatingBottomContainer>
  <View style={{ flexDirection: 'row', gap: 12 }}>
    <TouchableOpacity style={[styles.button, styles.secondaryButton]}>
      <Text>Cancel</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.button}>
      <Text>Save</Text>
    </TouchableOpacity>
  </View>
</FloatingBottomContainer>
```

### Important: Add Bottom Padding to Scrollable Content

When using `FloatingBottomContainer`, you need to add bottom padding to your scrollable content so it doesn't get hidden behind the floating container:

```tsx
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const insets = useSafeAreaInsets();
const buttonHeight = 60; // Your button height
const bottomPadding = buttonHeight + theme.spacing[4] * 2 + insets.bottom;

<ScreenWrapper
  scrollable
  contentContainerStyle={{ paddingBottom: bottomPadding }}
>
  {/* Content */}
</ScreenWrapper>
```

Or with SectionList/FlatList:

```tsx
<SectionList
  contentContainerStyle={{ paddingBottom: bottomPadding }}
  // ... other props
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | **required** | Content to render inside the container |
| `style` | `StyleProp<ViewStyle>` | `undefined` | Custom style for the container |
| `backgroundColor` | `string` | `theme.colors.background.primary` | Background color |
| `paddingHorizontal` | `number` | `theme.spacing[4]` | Horizontal padding |
| `paddingVertical` | `number` | `theme.spacing[4]` | Vertical padding |
| `paddingTop` | `number` | `paddingVertical` | Top padding |
| `paddingBottom` | `number` | `paddingVertical + safeArea` | Bottom padding (includes safe area) |
| `safeArea` | `boolean` | `true` | Whether to include safe area insets |
| `shadow` | `boolean` | `true` | Whether to show shadow/elevation |
| `borderRadius` | `number` | `0` | Border radius for top corners |

## Notes

- The component uses `position: 'absolute'` to float at the bottom
- Safe area insets are automatically added to bottom padding
- Shadow/elevation is applied for iOS and Android respectively
- The component has `zIndex: 1000` to ensure it stays above other content

