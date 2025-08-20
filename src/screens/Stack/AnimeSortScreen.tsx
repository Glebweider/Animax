import { useQuery } from '@apollo/client';
import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

//Components
import BackButton from '@Components/buttons/Back';
import ApplyButton from '@Components/buttons/Apply';

//Utils
import { GET_GENRES } from '@Utils/api/graphql/getGenres';
import { i18n } from '@Utils/localization';

//Redux
import { RootState } from '@Redux/store';
import { addFilter, reset } from '@Redux/reducers/sortReducer';


const AnimeSortScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const { data } = useQuery(GET_GENRES);
    const [genresAnime, setGenresAnime] = useState([]);
    const FilterState = useSelector((state: RootState) => state.sortReducer);

    useEffect(() => {
        if (data) {
            setGenresAnime(data.genres);
        }
    }, [data]);

    const renderItems = useMemo(() =>
        genresAnime.map((data) => (
            <TouchableOpacity
                key={data.id}
                onPress={() => dispatch(addFilter({
                    id: data.id, text: (i18n.locale === 'ru' || i18n.locale === 'uk')
                        ? data.russian
                        : data.name
                }))}
                style={FilterState.filter.some((i) => i.id === data.id)
                    ? styles.filterContainerEnabled
                    : styles.filterContainerDisabled}>
                <Text style={FilterState.filter.some((i) => i.id === data.id)
                    ? styles.filterTextEnabled
                    : styles.filterTextDisabled}>{(i18n.locale === 'ru' || i18n.locale === 'uk')
                        ? data.russian
                        : data.name}
                </Text>
            </TouchableOpacity>
        )
        ), [genresAnime, FilterState.filter]);

    return (
        <View style={styles.container}>
            <BackButton navigation={navigation} text={i18n.t('sortfilter.sortfilter')} />
            <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                {genresAnime.length >= 1 ?
                    <View style={styles.filtersContainer}>
                        {renderItems}
                    </View>
                    :
                    <Text>{i18n.t('loading')}</Text>
                }
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
        backgroundColor: '#181A20',
    },
    buttons: {
        backgroundColor: '#181A20',
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
        gap: 15
    },
    filtersContainer: {
        width: '94%',
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    filterContainerEnabled: {
        marginTop: 21,
        marginLeft: 10,
        paddingRight: 19,
        paddingLeft: 19,
        height: 45,
        backgroundColor: '#06C149',
        borderRadius: 50,
        borderColor: '#06C149',
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    filterContainerDisabled: {
        marginTop: 21,
        marginLeft: 10,
        paddingRight: 19,
        paddingLeft: 19,
        height: 45,
        borderColor: '#06C149',
        borderWidth: 2,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    filterTextEnabled: {
        color: '#fff',
        fontFamily: 'Outfit',
        fontSize: 14,
    },
    filterTextDisabled: {
        color: '#06C149',
        fontFamily: 'Outfit',
        fontSize: 14,
    },
});

export default AnimeSortScreen;