import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useQuery } from '@apollo/client';
import { useDispatch, useSelector } from 'react-redux';

//Components
import BackButton from '@Components/buttons/Back';
import ApplyButton from '@Components/buttons/Apply';

//Redux
import { RootState } from '@Redux/store';
import { addInterest } from '@Redux/reducers/authReducer';

//Utils
import { GET_GENRES } from '@Utils/api/graphql/getGenres';


const AuthAccountSetupInterestScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const [isActiveButton, setActiveButton] = React.useState<boolean>(true);
    const InterestsState = useSelector((state: RootState) => state.authReducer);
    const { data } = useQuery(GET_GENRES);
    const [genresAnime, setGenresAnime] = useState([]);

    useEffect(() => {
        if (data) {
            setGenresAnime(data.genres);
        }
    }, [data]);

    useEffect(() => {
        setActiveButton(true);
        if (InterestsState.interests.length > 0) {
            setActiveButton(false);
        }
    }, [InterestsState.interests]);

    const renderItems = () =>
        genresAnime.map((data) => (
            <TouchableOpacity
                key={data.id}
                onPress={() => dispatch(addInterest({ id: data.id, text: data.russian }))}
                style={InterestsState.interests.some((i) => i.id === data.id)
                    ? styles.interestContainerEnabled
                    : styles.interestContainerDisabled}>
                <Text style={styles.interestText}>{data.russian}</Text>
            </TouchableOpacity>
        ));

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                <BackButton navigation={navigation} text="Choose Your Interest" />
                <View style={styles.titleContainer}>
                    <Text style={styles.titleText}>Choose your interests and get the best anime recommendations. Don't worry, you can always change it later.</Text>
                </View>
                {genresAnime.length >= 1 ?
                    <View style={styles.interestsContainer}>
                        {renderItems()}
                    </View>
                    :
                    <Text style={{ color: '#fff' }}>Загрузка</Text>
                }
            </ScrollView>
            <View style={styles.buttonsContainer}>

                <ApplyButton
                    onPress={() => navigation.navigate('AuthAccountSetupData')}
                    isActiveButton={false}
                    style={styles.buttonSkip}
                    text={'Skip'} />

                <ApplyButton
                    onPress={() => navigation.navigate('AuthAccountSetupData')}
                    isActiveButton={isActiveButton}
                    style={styles.applyButton}
                    text={'Continue'} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        paddingBottom: 85,
    },
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#181A20',
    },
    applyButton: {
        width: '48%',
        marginTop: 0
    },
    buttonSkip: {
        width: '48%',
        backgroundColor: '#35383F',
        marginTop: 0
    },
    interestContainerEnabled: {
        marginTop: 24,
        marginLeft: 12,
        paddingRight: 25,
        paddingLeft: 25,
        height: 45,
        backgroundColor: '#06C149',
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    interestContainerDisabled: {
        marginTop: 24,
        marginLeft: 12,
        paddingRight: 25,
        paddingLeft: 25,
        height: 45,
        borderColor: '#06C149',
        borderWidth: 1,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    interestText: {
        color: '#fff',
        fontFamily: 'Outfit',
        fontSize: 14,
    },
    titleContainer: {
        width: '90%',
    },
    titleText: {
        color: '#fff',
        fontFamily: 'Outfit',
        fontSize: 14,
    },
    interestsContainer: {
        width: '94%',
        height: '72%',
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    buttonsContainer: {
        width: '90%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
        marginTop: 15
    },
});

export default AuthAccountSetupInterestScreen;