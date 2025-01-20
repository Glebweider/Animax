import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Animated } from 'react-native';

const ToggleSwitch = ({ isOn, onToggle }) => {
  const [isActive, setIsActive] = useState(isOn);
  const toggleAnim = new Animated.Value(isActive ? 1 : 0);

  const toggleSwitch = () => {
    const newIsActive = !isActive;
    setIsActive(newIsActive);
    onToggle(newIsActive);

    Animated.timing(toggleAnim, {
      toValue: newIsActive ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const translateX = toggleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 30],
  });

  const backgroundColor = toggleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#35383F', '#06C149'],
  });

  return (
    <TouchableOpacity style={styles.container} onPress={toggleSwitch}>
      <Animated.View style={[styles.switchContainer, { backgroundColor }]}>
        <Animated.View style={[styles.circle, { transform: [{ translateX }] }]} />
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  switchContainer: {
    width: 64,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  circle: {
    width: 28,
    height: 28,
    borderRadius: 15,
    backgroundColor: '#fff',
  },
});

export default ToggleSwitch;
