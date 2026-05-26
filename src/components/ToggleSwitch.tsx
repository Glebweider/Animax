import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet, Animated } from 'react-native';

// Data
import { COLOR_PRIMARY, COLOR_TEXT_PRIMARY } from '@Data/constants';


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
		outputRange: [1, 27],
	});

	const backgroundColor = toggleAnim.interpolate({
		inputRange: [0, 1],
		outputRange: ['#35383F', COLOR_PRIMARY],
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
		width: 58,
		height: 30,
		borderRadius: 17,
		justifyContent: 'center',
		paddingHorizontal: 2,
	},
	circle: {
		width: 26,
		height: 25,
		borderRadius: 15,
		backgroundColor: COLOR_TEXT_PRIMARY,
	},
});

export default ToggleSwitch;
