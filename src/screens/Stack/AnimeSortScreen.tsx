import { useQuery } from '@apollo/client';
import React, { useMemo } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

// Components
import BackButton from '@Components/buttons/Back';
import ApplyButton from '@Components/buttons/Apply';

// Data
import { COLOR_PRIMARY, COLOR_TEXT_PRIMARY } from '@Data/constants';

// GraphQl
import { GET_GENRES } from '@GraphQl/getGenres';

// Utils
import { i18n, isCisLocale } from '@Utils/localization';

// Redux
import { RootState } from '@Redux/store';
import { addFilter, reset } from '@Redux/reducers/sortReducer';


interface GenreItemProps {
    item: { id: string; name: string; russian?: string };
    isSelected: boolean;
    onPress: () => void;
}

const GenreButton = React.memo(({ item, isSelected, onPress }: GenreItemProps) => {
    const genreName = isCisLocale ? (item.russian || item.name) : item.name;

    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.7}
            style={[styles.filterContainer, isSelected && styles.filterContainerEnabled]}
        >
            <Text style={[styles.filterText, isSelected && styles.filterTextEnabled]}>
                {genreName}
            </Text>
        </TouchableOpacity>
    );
}, (prevProps, nextProps) => {
    return prevProps.isSelected === nextProps.isSelected && prevProps.item.id === nextProps.item.id;
});


const AnimeSortScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const { data } = useQuery(GET_GENRES);

    const activeFilters = useSelector((state: RootState) => state.sortReducer.filter);

    const genresAnime = data?.genres ?? [];
    const selectedIds = useMemo(() => new Set(activeFilters.map(i => i.id)), [activeFilters]);

    return (
        <View style={styles.container}>
            <BackButton navigation={navigation} text={i18n.t('sortfilter.sortfilter')} />

            <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                {genresAnime.length ? (
                    <View style={styles.filtersContainer}>
                        {genresAnime.map((item) => {
                            const isSelected = selectedIds.has(item.id);

                            return (
                                <GenreButton
                                    key={item.id}
                                    item={item}
                                    isSelected={isSelected}
                                    onPress={() => dispatch(addFilter({
                                        id: item.id,
                                        text: isCisLocale ? (item.russian || item.name) : item.name
                                    }))} />
                            );
                        })}
                    </View>
                ) : (
                    <Text style={styles.loadingText}>{i18n.t('loading')}</Text>
                )}
            </ScrollView>

            <View style={styles.buttons}>
                <ApplyButton
                    onPress={() => dispatch(reset())}
                    isActiveButton={false}
                    style={styles.cancelButton}
                    text={i18n.t('sortfilter.reset')} />

                <ApplyButton
                    onPress={() => navigation.navigate('AnimeSearchScreen')}
                    isActiveButton={false}
                    style={styles.applyButton}
                    text={i18n.t('sortfilter.apply')} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        paddingBottom: 85,
    },
    cancelButton: {
        width: '40%',
        marginTop: 0,
        backgroundColor: '#35383F',
        elevation: 0,
    },
    applyButton: {
        width: '40%',
        marginTop: 0,
    },
    container: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
    },
    buttons: {
        borderColor: '#35383F',
        borderTopWidth: 1,
        borderRightWidth: 1,
        borderLeftWidth: 1,
        width: '102%',
        height: 117,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 15,
        backgroundColor: '#141414',
    },
    filtersContainer: {
        width: '94%',
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    filterContainerEnabled: {
        backgroundColor: COLOR_PRIMARY,
    },
    filterContainer: {
        marginTop: 21,
        marginLeft: 10,
        paddingRight: 19,
        paddingLeft: 19,
        height: 45,
        borderColor: COLOR_PRIMARY,
        borderWidth: 2,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    filterTextEnabled: {
        color: COLOR_TEXT_PRIMARY,
    },
    filterText: {
        color: COLOR_PRIMARY,
        fontFamily: 'Outfit',
        fontSize: 14,
    },
    loadingText: {
        color: '#888',
        marginTop: 40,
        textAlign: 'center',
    }
});

export default AnimeSortScreen;