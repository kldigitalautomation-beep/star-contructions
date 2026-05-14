import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { theme } from '../styles/theme';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger' | 'accent';
type ButtonSize = 'sm' | 'md' | 'lg';

interface AppButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export function AppButton({ label, onPress, variant = 'primary', size = 'md', disabled = false, icon, fullWidth = true }: AppButtonProps) {
  const content = (
    <>
      {icon ? <View style={styles.iconWrap}>{icon}</View> : null}
      <Text
        style={[
          styles.text,
          size === 'sm' ? styles.textSm : size === 'lg' ? styles.textLg : undefined,
          variant === 'secondary' ? styles.textSecondary : variant === 'outline' ? styles.textOutline : undefined,
          variant === 'danger' ? styles.textDanger : undefined,
          variant === 'accent' ? styles.textAccent : undefined,
        ]}
      >
        {label}
      </Text>
    </>
  );

  const usesGradient = variant === 'primary' || variant === 'danger' || variant === 'accent';
  const gradientColors =
    variant === 'danger'
      ? theme.gradients.dangerButton
      : variant === 'accent'
      ? theme.gradients.accentButton
      : theme.gradients.primaryButton;

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        fullWidth ? styles.fullWidth : styles.inline,
        variant === 'primary' || variant === 'accent' ? styles.primaryShadow : undefined,
        variant === 'secondary' ? styles.secondaryShadow : undefined,
        variant === 'outline' ? styles.outlineShadow : undefined,
        variant === 'danger' ? styles.dangerShadow : undefined,
        pressed && !disabled ? styles.pressed : undefined,
        disabled ? styles.disabled : undefined,
      ]}
    >
      {usesGradient ? (
        <LinearGradient
          colors={gradientColors}
          end={{ x: 1, y: 1 }}
          start={{ x: 0, y: 0 }}
          style={[styles.fill, styles.fillSolid, sizeStyles[size]]}
        >
          {content}
        </LinearGradient>
      ) : (
        <View style={[styles.fill, variant === 'secondary' ? styles.secondaryFill : styles.outlineFill, sizeStyles[size]]}>{content}</View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: theme.radius.md,
    overflow: 'hidden',
  },
  fullWidth: {
    alignSelf: 'stretch',
  },
  inline: {
    alignSelf: 'flex-start',
  },
  fill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.md,
  },
  fillSolid: {
    borderWidth: 0,
  },
  primaryShadow: {
    ...theme.control.shadow.md,
  },
  dangerShadow: {
    ...theme.control.shadow.md,
  },
  secondaryShadow: {
    ...theme.control.shadow.sm,
  },
  outlineShadow: {
    ...theme.control.shadow.sm,
  },
  secondaryFill: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1.5,
    borderColor: theme.brand.navy,
  },
  outlineFill: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: theme.brand.navy,
  },
  text: {
    fontSize: theme.typography.body,
    fontWeight: '800',
    color: theme.colors.textInverse,
    letterSpacing: 0.1,
  },
  textSm: {
    fontSize: theme.typography.small,
  },
  textLg: {
    fontSize: theme.typography.subtitle,
  },
  textSecondary: {
    color: theme.brand.navy,
  },
  textOutline: {
    color: theme.brand.navy,
  },
  textDanger: {
    color: theme.colors.textInverse,
  },
  textAccent: {
    color: '#FFFFFF',
  },
  iconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.88,
    transform: [{ scale: 0.97 }],
  },
  disabled: {
    opacity: 0.45,
  },
});

const sizeStyles = StyleSheet.create({
  sm: {
    minHeight: 40,
    paddingHorizontal: 14,
  },
  md: {
    minHeight: 50,
    paddingHorizontal: theme.spacing.md,
  },
  lg: {
    minHeight: 56,
    paddingHorizontal: theme.spacing.lg,
  },
});