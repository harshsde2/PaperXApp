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

  const getFontFamily = (weight?: FontWeight, variantWeight?: string | number): string => {
    // If explicit fontFamily is provided, use it (highest priority)
    if (fontFamily) return fontFamily;

    // Priority: explicit fontWeight prop > variant fontWeight > default
    // If explicit fontWeight is provided, use it directly
    if (weight) {
      switch (weight) {
        case 'thin':
          return theme.fontFamily.thin;
        case 'extralight':
          return theme.fontFamily.extralight;
        case 'light':
          return theme.fontFamily.light;
        case 'regular':
          return theme.fontFamily.regular;
        case 'medium':
          return theme.fontFamily.medium;
        case 'semibold':
          return theme.fontFamily.semibold;
        case 'bold':
          return theme.fontFamily.bold;
        case 'extrabold':
          return theme.fontFamily.extrabold;
        case 'black':
          return theme.fontFamily.black;
        default:
          return theme.fontFamily.regular;
      }
    }

    // If no explicit fontWeight, check variant's fontWeight
    if (variantWeight) {
      const weightStr = String(variantWeight);
      if (weightStr === '900' || weightStr === 'black') return theme.fontFamily.black;
      if (weightStr === '800' || weightStr === 'extrabold') return theme.fontFamily.extrabold;
      if (weightStr === '700' || weightStr === 'bold') return theme.fontFamily.bold;
      if (weightStr === '600' || weightStr === 'semibold') return theme.fontFamily.semibold;
      if (weightStr === '500' || weightStr === 'medium') return theme.fontFamily.medium;
      if (weightStr === '300' || weightStr === 'light') return theme.fontFamily.light;
      if (weightStr === '200' || weightStr === 'extralight') return theme.fontFamily.extralight;
      if (weightStr === '100' || weightStr === 'thin') return theme.fontFamily.thin;
    }

    // Default to regular
    return theme.fontFamily.regular;
  };

  const getVariantStyle = (variant: string): TextStyle | undefined => {
    const variantStyle = (() => {
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
    })();

    // Process variant style: convert lineHeight multiplier to absolute pixels
    // React Native with custom fonts needs absolute pixel values, not multipliers
    if (variantStyle && variantStyle.fontSize && variantStyle.lineHeight) {
      const fontSize = typeof variantStyle.fontSize === 'number' ? variantStyle.fontSize : 16;
      const lineHeight = variantStyle.lineHeight;
      
      // If lineHeight is a multiplier (less than 5, typically 1.2, 1.5, etc.), convert to pixels
      if (typeof lineHeight === 'number' && lineHeight < 5) {
        return {
          ...variantStyle,
          lineHeight: Math.round(fontSize * lineHeight),
        };
      }
    }

    return variantStyle;
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
      case 'thin':
        return '100';
      case 'extralight':
        return '200';
      case 'light':
        return '300';
      case 'regular':
        return '400';
      case 'medium':
        return '500';
      case 'semibold':
        return '600';
      case 'bold':
        return '700';
      case 'extrabold':
        return '800';
      case 'black':
        return '900';
      default:
        return '400';
    }
  };

  // Get variant style first
  const variantStyle = variant ? getVariantStyle(variant) : null;
  
  // Determine effective fontWeight: explicit prop overrides variant
  const effectiveFontWeight = fontWeight 
    ? getFontWeightValue(fontWeight) 
    : (variantStyle?.fontWeight as string | number | undefined);
  
  // Get fontFamily based on effective fontWeight (explicit prop takes priority)
  // When fontWeight prop is provided, it should override variant's fontFamily
  const finalFontFamily = getFontFamily(
    fontWeight, 
    variantStyle?.fontWeight as string | number | undefined
  );
  
  // Debug: Uncomment to verify fontFamily selection
  // if (fontWeight) {
  //   console.log('Text fontWeight:', fontWeight, '-> fontFamily:', finalFontFamily);
  // }
  
  // Override variant fontSize with size prop if provided
  const finalFontSize = size ? size : (variantStyle?.fontSize as number | undefined);
  
  // Always apply fontWeight style when we have an effective fontWeight.
  // On Android, even with custom fonts like Montserrat-Bold, the fontWeight style
  // is sometimes needed alongside the fontFamily for proper rendering.
  const fontWeightStyle = effectiveFontWeight 
    ? { fontWeight: effectiveFontWeight } 
    : null;
  
  const fontSizeStyle = finalFontSize ? { fontSize: finalFontSize } : null;
  const alignStyle = align ? { textAlign: align } : null;

  // Build variant style without fontSize, fontWeight, and fontFamily (we handle those separately)
  // This ensures explicit props (size, fontWeight) and our fontFamily selection take priority
  const variantStyleCleaned = variantStyle 
    ? {
        ...variantStyle,
        fontSize: undefined,
        fontWeight: undefined,
        fontFamily: undefined, // Remove fontFamily from variant to use our selected one
      }
    : null;

  const textStyle: StyleProp<TextStyle> = [
    textStyles.text,
    variantStyleCleaned,
    { color: getTextColor() },
    { fontFamily: finalFontFamily }, // Apply fontFamily before fontWeight to ensure correct font is used
    fontWeightStyle,
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

