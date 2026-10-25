import React from 'react';
import globalStyles from '@Styles/index';
import { View, Text, StyleSheet, Image, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';

// Data
import { COLOR_BACKGROUND_SECONDARY, COLOR_PRIMARY, DEFAULT_POSTER } from '@Data/constants';

// Interface
import { IAnimeCard } from '@Interfaces/AnimeCard.interface';


interface AnimeCardSkeletonProps {
	width?: number;
	height?: number;
	style?: StyleProp<ViewStyle>;
}

interface AnimeCardProps {
	navigation?: any;
	onPress?: () => void;
	item: IAnimeCard;
	width?: number;
	height?: number;
	style?: StyleProp<ViewStyle>;
}

export const AnimeCardSkeleton: React.FC<AnimeCardSkeletonProps> = ({ width = 174, height = 242, style }) => {
	return (
		<View style={[styles.container, { width, height }, style]}>
			<View style={styles.posterSkeleton} />
			<View style={styles.scoreSkeleton} />
		</View>
	);
};

export const AnimeCard: React.FC<AnimeCardProps> = ({
	navigation,
	onPress,
	item,
	style,
	width = 174,
	height = 242,
}) => {
	return (
		<TouchableOpacity
			onPress={() => onPress
				? onPress()
				: navigation.navigate('AnimeScreen', { animeId: item.id })
			}
			style={[styles.container, { width, height }, style]} >
			<View style={styles.scoreBadge}>
				<Text style={styles.scoreText}>{Number(item.score).toFixed(1)}</Text>
			</View>
			{(item.rating === 'r_plus' || item.rating === 'rx') && (
				<View style={styles.ratingBadge}>
					<Text style={styles.ratingText}>18+</Text>
				</View>
			)}
			<Image
				source={item.poster?.originalUrl ? { uri: item.poster.originalUrl } : DEFAULT_POSTER}
				style={styles.posterImage} />
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	container: {
		margin: 0,
		marginHorizontal: 6,
		borderRadius: 15,
		flexDirection: 'row',
		backgroundColor: COLOR_BACKGROUND_SECONDARY
	},
	scoreBadge: {
		...globalStyles.Center,
		zIndex: 2,
		borderRadius: 6,
		width: 33,
		height: 24,
		backgroundColor: COLOR_PRIMARY,
		margin: 12
	},
	scoreText: {
		...globalStyles.TextPrimary,
		fontSize: 11
	},
	posterImage: {
		...globalStyles.FullSize,
		borderRadius: 10,
		position: 'absolute',
		zIndex: 1
	},
	ratingBadge: {
		...globalStyles.Center,
		zIndex: 2,
		borderRadius: 6,
		width: 33,
		height: 24,
		borderColor: 'red',
		borderWidth: 2,
		margin: 12,
		position: 'absolute',
		right: 0
	},
	ratingText: {
		color: 'red',
		fontFamily: 'Outfit',
		fontSize: 11
	},
	posterSkeleton: {
		...globalStyles.FullSize,
		flex: 1,
		borderRadius: 10,
		backgroundColor: '#20232cff',
		position: 'absolute',
		zIndex: 1
	},
	scoreSkeleton: {
		width: 33,
		height: 24,
		borderRadius: 6,
		backgroundColor: '#2a2d38ff',
		position: 'absolute',
		top: 12,
		left: 12,
		zIndex: 2
	}
});