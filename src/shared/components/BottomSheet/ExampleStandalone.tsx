/**
 * Example: Using BottomSheet without Provider (Standalone)
 * 
 * This example shows how to use the BottomSheet component directly
 * without wrapping your app in BottomSheetProvider.
 */

import React, { useRef } from 'react';
import { View, Button, Text, StyleSheet } from 'react-native';
import { BottomSheet, IBottomSheetRef } from './index';
import { useTheme } from '@theme/index';

const ExampleStandalone = () => {
  const theme = useTheme();
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

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: theme.spacing[4],
      backgroundColor: theme.colors.background.primary,
    },
    buttonContainer: {
      gap: theme.spacing[2],
      marginBottom: theme.spacing[4],
    },
    content: {
      padding: theme.spacing[4],
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.colors.text.primary,
      marginBottom: theme.spacing[2],
    },
    text: {
      fontSize: 16,
      color: theme.colors.text.secondary,
      marginBottom: theme.spacing[1],
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>BottomSheet Standalone Example</Text>
      
      <View style={styles.buttonContainer}>
        <Button title="Open Bottom Sheet" onPress={handleOpenSheet} />
        <Button title="Close" onPress={handleCloseSheet} />
        <Button title="Expand" onPress={handleExpand} />
        <Button title="Collapse" onPress={handleCollapse} />
        <Button title="Snap to Index 1" onPress={() => handleSnapToIndex(1)} />
        <Button title="Snap to Index 2" onPress={() => handleSnapToIndex(2)} />
      </View>

      <Text style={styles.text}>
        Check if open: {bottomSheetRef.current?.isOpen ? 'Yes' : 'No'}
      </Text>

      {/* BottomSheet Component - No Provider needed! */}
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
        <View style={styles.content}>
          <Text style={styles.title}>Bottom Sheet Content</Text>
          <Text style={styles.text}>
            This is a standalone BottomSheet component.
          </Text>
          <Text style={styles.text}>
            You can put any content here!
          </Text>
          <Text style={styles.text}>
            Snap points: 25%, 50%, 90%
          </Text>
          <Button title="Close from inside" onPress={handleCloseSheet} />
        </View>
      </BottomSheet>
    </View>
  );
};

export default ExampleStandalone;

