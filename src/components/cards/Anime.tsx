import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

interface AnimeItem {
    id: string;
    score: number;
    rating: string;
    poster: {
        originalUrl: string;
    };
}

interface AnimeCardProps {
    navigation?: any;
    onPress?: () => void;
    item: AnimeItem;
    width?: number;
    height?: number;
    isLoading?: boolean;
}

const AnimeCard: React.FC<AnimeCardProps> = ({ navigation, onPress, item, width = 174, height = 242, isLoading = false }) => {
    if (isLoading) {
        return (
            <View style={[styles.container, { width, height }]}>
                <View style={styles.posterSkeleton} />
                <View style={styles.scoreSkeleton} />
            </View>
        );
    }

    if (!item) return null;

    return (
        <TouchableOpacity
            onPress={() =>
                onPress
                    ? onPress()
                    : navigation.navigate('AnimeScreen', { animeId: item.id })
            }
            style={[styles.container, { width, height }]} >
            <View style={styles.scoreBadge}>
                <Text style={styles.scoreText}>{item.score.toFixed(1)}</Text>
            </View>

            {(item.rating === 'r_plus' || item.rating === 'rx') && (
                <View style={styles.ratingBadge}>
                    <Text style={styles.ratingText}>18+</Text>
                </View>
            )}

            <Image
                source={{ uri: item.poster.originalUrl }}
                style={styles.posterImage} />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        gap: 12,
        marginHorizontal: 6,
        borderRadius: 15,
        flexDirection: 'row',
        backgroundColor: '#1F222A',
    },
    scoreBadge: {
        zIndex: 2,
        borderRadius: 6,
        width: 33,
        height: 24,
        backgroundColor: '#06C149',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 12
    },
    scoreText: {
        color: '#fff',
        fontSize: 11,
        fontFamily: 'Outfit',
    },
    posterImage: {
        width: '100%',
        height: '100%',
        borderRadius: 10,
        position: 'absolute',
        zIndex: 1
    },
    ratingBadge: {
        zIndex: 2,
        borderRadius: 6,
        width: 33,
        height: 24,
        borderColor: 'red',
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 12,
        position: 'absolute',
        right: 0
    },
    ratingText: {
        color: 'red',
        fontFamily: 'Outfit',
        fontSize: 11,
    },
    posterSkeleton: {
        flex: 1,
        borderRadius: 10,
        backgroundColor: '#20232cff',
        position: 'absolute',
        width: '100%',
        height: '100%',
        zIndex: 1,
    },
    scoreSkeleton: {
        width: 33,
        height: 24,
        borderRadius: 6,
        backgroundColor: '#2a2d38ff',
        position: 'absolute',
        top: 12,
        left: 12,
        zIndex: 2,
    },
    shimmer: {
        position: 'absolute',
        top: 0,
        left: 0,
        backgroundColor: 'rgba(255,255,255,0.2)',
        zIndex: 3,
    },
});

export default AnimeCard;