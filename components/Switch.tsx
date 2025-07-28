import React, { useEffect, useRef } from 'react';
import {
    Animated,
    StyleSheet,
    TouchableOpacity,
    ViewStyle
} from 'react-native';
import { useTheme } from '../hooks/useTheme';

interface SwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
  trackColorOn?: string;
  trackColorOff?: string;
  thumbColor?: string;
  style?: ViewStyle;
  testID?: string;
}

const SWITCH_SIZES = {
  small: { width: 40, height: 24, thumbSize: 20, padding: 2 },
  medium: { width: 51, height: 31, thumbSize: 27, padding: 2 },
  large: { width: 60, height: 36, thumbSize: 32, padding: 2 },
};

export const Switch: React.FC<SwitchProps> = ({
  value,
  onValueChange,
  disabled = false,
  size = 'medium',
  trackColorOn,
  trackColorOff,
  thumbColor,
  style,
  testID,
}) => {
  const { colors, isDarkMode } = useTheme();
  const animatedValue = useRef(new Animated.Value(value ? 1 : 0)).current;
  
  const switchSize = SWITCH_SIZES[size];
  const thumbPosition = switchSize.width - switchSize.thumbSize - switchSize.padding * 2;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [value, animatedValue]);

  const handlePress = () => {
    if (!disabled) {
      onValueChange(!value);
    }
  };

  // Default colors based on iOS design
  const getTrackColorOn = () => {
    if (trackColorOn) return trackColorOn;
    return '#34C759'; // iOS green
  };

  const getTrackColorOff = () => {
    if (trackColorOff) return trackColorOff;
    return isDarkMode ? '#39393D' : '#E9E9EA'; // iOS gray
  };

  const getThumbColor = () => {
    if (thumbColor) return thumbColor;
    return '#FFFFFF'; // iOS white thumb
  };

  // Animated styles
  const trackColorInterpolation = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [getTrackColorOff(), getTrackColorOn()],
  });

  const thumbPositionInterpolation = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [switchSize.padding, thumbPosition],
  });

  const thumbScaleInterpolation = animatedValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 0.95, 1],
  });

  const containerStyle = [
    styles.container,
    {
      width: switchSize.width,
      height: switchSize.height,
      opacity: disabled ? 0.5 : 1,
    },
    style,
  ];

  const animatedTrackStyle = {
    backgroundColor: trackColorInterpolation,
  };

  const thumbStyle = [
    styles.thumb,
    {
      width: switchSize.thumbSize,
      height: switchSize.thumbSize,
      backgroundColor: getThumbColor(),
      transform: [
        { translateX: thumbPositionInterpolation },
        { scale: thumbScaleInterpolation },
      ],
    },
  ];

  return (
    <TouchableOpacity
      style={containerStyle}
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.8}
      testID={testID}
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
      accessibilityLabel="Switch"
    >
      <Animated.View style={[StyleSheet.absoluteFill, styles.animatedTrack, animatedTrackStyle]} />
      <Animated.View style={thumbStyle} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 1000,
    justifyContent: 'center',
    // iOS-style shadow
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 1.5,
    elevation: 2,
  },
  animatedTrack: {
    borderRadius: 1000,
  },
  thumb: {
    borderRadius: 1000,
    position: 'absolute',
    // iOS-style thumb shadow
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.3,
    shadowRadius: 1,
    elevation: 3,
  },
});

export default Switch;
