import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';

// Components
import { AnimeCard, AnimeCardSkeleton } from '@Components/cards/Anime';

// Data
import { COLOR_PRIMARY_DARK, COLOR_TEXT_PRIMARY } from '@Data/constants';

// Utils
import { i18n } from '@Utils/localization';

// Interface
import { IAnimeMedium } from '@Interfaces/HomeScreen.interface';


interface TopAnimeListsProps {
    data: IAnimeMedium[];
    text: string;
    limit?: number;
    selectAnime: (value: React.SetStateAction<IAnimeMedium>) => void;
    navigate: () => void;
}

const TopAnimeLists = ({ data, text, limit, selectAnime, navigate }: TopAnimeListsProps) => {
    const WIDTH = 150;
    const HEIGHT = 200;

    return (
        <View style={styles.container}>
            <View style={styles.dataContainer}>
                <Text style={styles.text}>{i18n.t(text)}</Text>
                <TouchableOpacity onPress={navigate}>
                    <Text style={styles.textSeeAll}>{i18n.t('home.seeall')}</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={data}
                horizontal
                nestedScrollEnabled={true}
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }: any) => (
                    <AnimeCard
                        onPress={() => selectAnime(item)}
                        item={item}
                        width={WIDTH}
                        height={HEIGHT} />
                )}
                ListEmptyComponent={() =>
                    Array.from({ length: limit }).map((_, i) => (
                        <AnimeCardSkeleton
                            key={i}
                            width={WIDTH}
                            height={HEIGHT} />
                    ))
                }
                contentContainerStyle={{ paddingHorizontal: 10, marginTop: 10 }} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 255,
        alignItems: 'center',
    },
    dataContainer: {
        flexDirection: 'row',
        width: '90%',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    text: {
        color: COLOR_TEXT_PRIMARY,
        fontSize: 15,
        fontFamily: 'Outfit',
    },
    textSeeAll: {
        color: COLOR_PRIMARY_DARK,
        fontSize: 12,
        fontFamily: 'Outfit',
    },
});

export default TopAnimeLists;