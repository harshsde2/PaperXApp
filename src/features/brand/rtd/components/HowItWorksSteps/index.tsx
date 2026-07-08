import React from 'react';
import { View } from 'react-native';
import { Text } from '@shared/components/Text';
import { AppIcon } from '@assets/svgs';
import { useTheme } from '@theme/index';
import type { HowItWorksStep, HowItWorksStepsProps } from './@types';
import { createStyles } from './styles';

const STEPS: HowItWorksStep[] = [
  {
    icon: AppIcon.Order,
    title: 'Request Order',
    description: 'Your request goes to the converter. No payment is taken now.',
  },
  {
    icon: AppIcon.TickCheckedBox,
    title: 'Converter Accepts',
    description: 'The converter confirms availability & price within the deadline.',
  },
  {
    icon: AppIcon.Wallet,
    title: 'Pay Platform Fee to Zupply',
    description: 'You pay only the small platform fee — never the product price.',
  },
  {
    icon: AppIcon.Messages,
    title: 'Get Connected',
    description:
      "Converter's contact details unlock. Pay them directly and arrange delivery.",
  },
];

export const HowItWorksSteps: React.FC<HowItWorksStepsProps> = ({
  title = 'How it works',
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      {STEPS.map((step, index) => {
        const Icon = step.icon;
        const isLast = index === STEPS.length - 1;
        return (
          <View key={step.title} style={styles.stepRow}>
            <View style={styles.stepLeft}>
              <View style={styles.iconCircle}>
                <Icon width={18} height={18} color={theme.colors.primary.DEFAULT} />
              </View>
              {!isLast && <View style={styles.connector} />}
            </View>
            <View style={[styles.stepBody, isLast && styles.stepBodyLast]}>
              <Text style={styles.stepNumber}>Step {index + 1}</Text>
              <Text style={styles.stepTitle}>{step.title}</Text>
              <Text style={styles.stepDescription}>{step.description}</Text>
            </View>
          </View>
        );
      })}
    </View>
  );
};

export default HowItWorksSteps;
