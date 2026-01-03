import { FC } from 'react';
import { StyleProp, Text as RNText, TextStyle } from 'react-native';
import { useTheme } from '../../../theme';
import { textStyles } from './styles';
import { TextProps, FontWeight } from './types';

const Text: FC<TextProps> = ({
  children,
  style,
  variant,
  align,
  fontFamily,
  size,
  color,
  fontWeight,
  useThemeColor = true,
  ...props
}) => {
  const theme = useTheme();

  const getFontFamily = (weight?: FontWeight): string => {
    if (fontFamily) return fontFamily;

    if (weight) {
      switch (weight) {
        case 'regular':
          return theme.fontFamily.regular;
        case 'medium':
          return theme.fontFamily.medium;
        case 'semibold':
          return theme.fontFamily.semibold;
        case 'bold':
          return theme.fontFamily.bold;
        default:
          return theme.fontFamily.regular;
      }
    }

    // If variant is provided, get fontFamily from variant style
    if (variant) {
      const variantStyle = getVariantStyle(variant);
      if (variantStyle?.fontWeight) {
        const weight = variantStyle.fontWeight as string;
        if (weight === '700' || weight === 'bold') return theme.fontFamily.bold;
        if (weight === '600' || weight === 'semibold') return theme.fontFamily.semibold;
        if (weight === '500' || weight === 'medium') return theme.fontFamily.medium;
      }
    }

    return theme.fontFamily.regular;
  };

  const getVariantStyle = (variant: string): TextStyle | undefined => {
    switch (variant) {
      case 'h1':
        return theme.typography.heading.h1;
      case 'h2':
        return theme.typography.heading.h2;
      case 'h3':
        return theme.typography.heading.h3;
      case 'h4':
        return theme.typography.heading.h4;
      case 'h5':
        return theme.typography.heading.h5;
      case 'h6':
        return theme.typography.heading.h6;
      case 'bodyLarge':
        return theme.typography.body.large;
      case 'bodyMedium':
        return theme.typography.body.medium;
      case 'bodySmall':
        return theme.typography.body.small;
      case 'captionLarge':
        return theme.typography.caption.large;
      case 'captionMedium':
        return theme.typography.caption.medium;
      case 'captionSmall':
        return theme.typography.caption.small;
      case 'buttonLarge':
        return theme.typography.button.large;
      case 'buttonMedium':
        return theme.typography.button.medium;
      case 'buttonSmall':
        return theme.typography.button.small;
      case 'overline':
        return theme.typography.overline;
      default:
        return undefined;
    }
  };

  const getTextColor = (): string | undefined => {
    if (color) return color;

    if (useThemeColor) {
      return theme.colors.text.primary;
    }

    return theme.colors.text.primary;
  };

  const getFontWeightValue = (weight?: FontWeight): TextStyle['fontWeight'] => {
    if (!weight) return undefined;
    
    // Map our FontWeight type to React Native fontWeight values
    switch (weight) {
      case 'regular':
        return '400';
      case 'medium':
        return '500';
      case 'semibold':
        return '600';
      case 'bold':
        return '700';
      default:
        return '400';
    }
  };

  // When using specific font files (like Poppins-Bold), we don't need fontWeight
  // as the weight is already in the font file name
  const finalFontFamily = getFontFamily(fontWeight);
  const needsFontWeight = !fontFamily && !finalFontFamily.includes('-');
  const fontWeightStyle = needsFontWeight && fontWeight ? { fontWeight: getFontWeightValue(fontWeight) } : null;
  const fontSizeStyle = size ? { fontSize: size } : null;
  const alignStyle = align ? { textAlign: align } : null;

  const textStyle: StyleProp<TextStyle> = [
    textStyles.text,
    variant && getVariantStyle(variant),
    { color: getTextColor() },
    fontWeightStyle,
    { fontFamily: finalFontFamily },
    fontSizeStyle,
    alignStyle,
    style,
  ];

  return (
    <RNText style={textStyle} {...props}>
      {children}
    </RNText>
  );
};

export default Text;

