import React, { useEffect } from 'react';
import { StyleSheet, View, Image, Text, Button, TouchableOpacity} from 'react-native';
import BackButton from '../../components/BackButton';
import getInterests from '../../utils/fetch/getInterests';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { addInterest } from '../../redux/reducers/authReducer';

const AuthAccountSetupInterestScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const [isActiveButton, setActiveButton] = React.useState<boolean>(true);
    const [interestsArray, setInterestsArray] = React.useState<{ id: number; text: string }[]>([]);
    const InterestsState = useSelector((state: RootState) => state.authReducer);
    const [isLoading, setLoading] = React.useState<boolean>(true);

    useEffect(() => {
        if (interestsArray.length > 0) {
            return
        } else {
            const fetchData = async () => {
                setInterestsArray(await getInterests());
                setLoading(false);
            };        
            fetchData();            
        }
    },[]);

    useEffect(() => {
        setActiveButton(true);
        if (InterestsState.interests.length > 0) {
            setActiveButton(false);
        }
    }, [InterestsState.interests]);

    const renderItems = () =>
        interestsArray.map((data) => (
        <TouchableOpacity
            key={data.id}
            onPress={() => dispatch(addInterest({ id: data.id, text: data.text }))}
            style={InterestsState.interests.some((i) => i.id === data.id)
            ? styles.interestContainerEnabled
            : styles.interestContainerDisabled}>
            <Text style={styles.interestText}>{data.text}</Text>
        </TouchableOpacity>
    ));

    return (
        <View style={styles.container}>
            <BackButton navigation={navigation} text="Choose Your Interest" />
            <View style={styles.titleContainer}>
                <Text style={styles.titleText}>Choose your interests and get the best anime recommendations. Don't worry, you can always change it later.</Text>
            </View>
            {isLoading ? 
                <Text style={{color: '#fff'}}>Загрузка</Text>
                :
                <View style={styles.interestsContainer}>
                    {renderItems()}
                </View>                
            }
            <View style={styles.buttonsContainer}>
                <TouchableOpacity 
                    onPress={() => navigation.navigate('AuthFGA')} 
                    style={styles.buttonSkip}>
                    <Text style={styles.buttonTitle}>Skip</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    onPress={() => navigation.navigate('AuthAccountSetupData')} 
                    disabled={isActiveButton}
                    style={isActiveButton ? styles.continueButtonDisabled : styles.continueButtonEnabled}>
                    <Text style={styles.buttonTitle}>Continue</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};
    
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#181A20',
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
        justifyContent: 'space-between'
    },
    buttonSkip: {
        backgroundColor: '#35383F',
        width: '48%',
        height: 60,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    continueButtonDisabled: {
        backgroundColor: '#0E9E42',
        width: '48%',
        height: 60,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    continueButtonEnabled: {
        backgroundColor: '#06C149',
        width: '48%',
        height: 60,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: 'rgba(6, 193, 73, 0.4)',
        shadowOffset: { width: 4, height: 8 },
        shadowOpacity: 0.24,
        shadowRadius: 4,
        elevation: 8, 
    },
    buttonTitle: {
        color: '#fff',
        fontSize: 15,
        fontFamily: 'Outfit',
    },
});
    
export default AuthAccountSetupInterestScreen;