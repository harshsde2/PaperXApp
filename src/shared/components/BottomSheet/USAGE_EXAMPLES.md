# BottomSheet Usage Examples

The BottomSheet component can be used in two ways:

## 1. Standalone (Without Provider) - Recommended for Single Instance

Use this when you have a single BottomSheet in your screen/component.

```tsx
import React, { useRef } from 'react';
import { View, Button, Text } from 'react-native';
import { BottomSheet, IBottomSheetRef } from '@shared/components/BottomSheet';

const MyScreen = () => {
  const bottomSheetRef = useRef<IBottomSheetRef>(null);

  const handleOpenSheet = () => {
    bottomSheetRef.current?.open();
  };

  const handleCloseSheet = () => {
    bottomSheetRef.current?.close();
  };

  const handleExpand = () => {
    bottomSheetRef.current?.expand();
  };

  const handleCollapse = () => {
    bottomSheetRef.current?.collapse();
  };

  const handleSnapToIndex = (index: number) => {
    bottomSheetRef.current?.snapToIndex(index);
  };

  return (
    <View style={{ flex: 1 }}>
      <Button title="Open Bottom Sheet" onPress={handleOpenSheet} />
      <Button title="Close" onPress={handleCloseSheet} />
      <Button title="Expand" onPress={handleExpand} />
      <Button title="Collapse" onPress={handleCollapse} />
      <Button title="Snap to Index 1" onPress={() => handleSnapToIndex(1)} />

      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={['25%', '50%', '90%']}
        initialSnapIndex={1}
        enableDrag={true}
        enableBackdropPress={true}
        backdropOpacity={0.5}
        onOpen={() => console.log('Bottom sheet opened')}
        onClose={() => console.log('Bottom sheet closed')}
        onChange={(index) => console.log('Snapped to index:', index)}
      >
        <View>
          <Text>Bottom Sheet Content</Text>
          <Text>You can put any content here</Text>
        </View>
      </BottomSheet>
    </View>
  );
};

export default MyScreen;
```

## 2. With Provider (Context-based) - Recommended for Multiple Instances

Use this when you want to open BottomSheets from anywhere in your app without passing refs around.

### Step 1: Wrap your app with BottomSheetProvider

```tsx
// App.tsx or your root component
import { BottomSheetProvider } from '@shared/components/BottomSheet';

const App = () => {
  return (
    <BottomSheetProvider>
      {/* Your app content */}
    </BottomSheetProvider>
  );
};
```

### Step 2: Use the hook anywhere in your app

```tsx
import React from 'react';
import { View, Button, Text } from 'react-native';
import { useBottomSheet } from '@shared/components/BottomSheet';

const MyScreen = () => {
  const { open, close, expand, collapse, snapToIndex } = useBottomSheet();

  const handleOpenSheet = () => {
    open(
      <View>
        <Text>Bottom Sheet Content</Text>
        <Text>This content is passed when opening</Text>
      </View>,
      {
        snapPoints: ['25%', '50%', '90%'],
        initialSnapIndex: 1,
        enableDrag: true,
        enableBackdropPress: true,
        backdropOpacity: 0.5,
        onOpen: () => console.log('Opened'),
        onClose: () => console.log('Closed'),
        onChange: (index) => console.log('Changed to:', index),
      }
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <Button title="Open Bottom Sheet" onPress={handleOpenSheet} />
      <Button title="Close" onPress={close} />
      <Button title="Expand" onPress={expand} />
      <Button title="Collapse" onPress={collapse} />
      <Button title="Snap to Index 1" onPress={() => snapToIndex(1)} />
    </View>
  );
};
```

## Props Reference

### BottomSheet Component Props (Standalone)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | Content to display in the bottom sheet |
| `snapPoints` | `(number \| string)[]` | `['50%']` | Array of snap points (e.g., `['25%', '50%', '90%']` or `[200, 400, 600]`) |
| `initialSnapIndex` | `number` | `0` | Initial snap point index |
| `enableDrag` | `boolean` | `true` | Enable drag gesture |
| `enableBackdropPress` | `boolean` | `true` | Close on backdrop press |
| `backdropOpacity` | `number` | `0.5` | Backdrop opacity (0-1) |
| `handleIndicatorStyle` | `StyleProp<ViewStyle>` | - | Custom style for handle indicator |
| `containerStyle` | `StyleProp<ViewStyle>` | - | Custom style for container |
| `contentContainerStyle` | `StyleProp<ViewStyle>` | - | Custom style for content container |
| `onOpen` | `() => void` | - | Callback when sheet opens |
| `onClose` | `() => void` | - | Callback when sheet closes |
| `onChange` | `(index: number) => void` | - | Callback when snap point changes |

### Ref Methods (Standalone)

| Method | Description |
|-------|-------------|
| `open()` | Open the bottom sheet to initial snap point |
| `close()` | Close the bottom sheet |
| `snapToIndex(index)` | Snap to a specific snap point index |
| `expand()` | Expand to the largest snap point |
| `collapse()` | Collapse to the smallest snap point |
| `isOpen` | Boolean indicating if sheet is open |

### useBottomSheet Hook Methods (With Provider)

| Method | Description |
|-------|-------------|
| `open(content, config?)` | Open bottom sheet with content and optional config |
| `close()` | Close the bottom sheet |
| `snapToIndex(index)` | Snap to a specific snap point index |
| `expand()` | Expand to the largest snap point |
| `collapse()` | Collapse to the smallest snap point |
| `isOpen` | Boolean indicating if sheet is open |

## Snap Points

Snap points can be specified as:
- **Percentage strings**: `'25%'`, `'50%'`, `'90%'` (relative to screen height)
- **Numbers**: `200`, `400`, `600` (absolute pixel values)

Example:
```tsx
snapPoints={['25%', '50%', '90%']}  // 25%, 50%, 90% of screen height
snapPoints={[200, 400, 600]}         // 200px, 400px, 600px from bottom
```

## Tips

1. **Use Standalone** when you have a single BottomSheet per screen
2. **Use Provider** when you need to open BottomSheets from multiple places or deep in component tree
3. Snap points are automatically sorted from smallest to largest
4. The sheet closes when dragged below 50% of the minimum snap point or with sufficient velocity
5. Backdrop opacity animates based on sheet position

