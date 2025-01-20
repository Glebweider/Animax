import React, { useEffect } from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity, TextInput } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useDispatch, useSelector } from 'react-redux';
import * as FileSystem from 'expo-file-system';

import BackButton from '@Components/BackButton';
import PencilIcon from '@Icons/PencilIcon';

//Redux
import { RootState } from '@Redux/store';
import { setUser } from '@Redux/reducers/userReducer';

//Utils
import { getTokenFromStorage, saveTokenToStorage } from '@Utils/token';
import { isPhoneNumber } from '@Utils/validator';
import { i18n } from '@Utils/localization';
import useAuthUserInToken from '@Utils/fetch/authUserInToken';
import { useAlert } from '@Components/AlertContext';


const EditDataScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const userState = useSelector((state: RootState) => state.userReducer);
    const [isActiveButton, setActiveButton] = React.useState<boolean>(true);

    const [textFullName, setTextFullName] = React.useState<string>(userState.profile.fullname);
    const [textNickname, setTextNickname] = React.useState<string>(userState.profile.nickname);
    const [textPhoneNumber, setTextPhoneNumber] = React.useState<string>(userState.preferences.phonenumber);
    const [avatar, setAvatar] = React.useState<any>(null);

    const [fullNameError, setFullNameError] = React.useState<string | null>(null);
    const [nicknameError, setNicknameError] = React.useState<string | null>(null);
    const [phoneNumberError, setPhoneNumberError] = React.useState<string | null>(null);

    const [isFullNameVerify, setFullNameVerify] = React.useState<boolean>(false);
    const [isNicknameVerify, setNicknameVerify] = React.useState<boolean>(false);
    const [isPhoneNumberVerify, setPhoneNumberVerify] = React.useState<boolean>(false);

    const { authUserInToken } = useAuthUserInToken();
    const { showAlert } = useAlert();

    useEffect(() => {
        if (textFullName.length >= 1) {
            if (textFullName.length < 4) {
                setFullNameError('Полное имя должно содержать не менее 4 символов');
                setFullNameVerify(false);
            } else {
                setFullNameError(null);
                setFullNameVerify(true);
            }
        } else {
            setFullNameError(null);
            setFullNameVerify(false);
        }
    
        if (textNickname.length >= 3) {
            if (textNickname.length < 4) {
                setNicknameError('Никнейм должен содержать не менее 4 символов');
                setNicknameVerify(false);
            } else {
                setNicknameError(null);
                setNicknameVerify(true);
            }            
        } else {
            setNicknameError(null);
            setNicknameVerify(false);
        }

        if (textPhoneNumber.length >= 3) {
            if (!isPhoneNumber(textPhoneNumber)) {
                setPhoneNumberError('Введите действительный номер телефона');
                setPhoneNumberVerify(false);
            } else {
                setPhoneNumberError(null);
                setPhoneNumberVerify(true);
            }            
        } else {
            setPhoneNumberError(null);
            setPhoneNumberVerify(false);
        }
    
        if (textFullName.length >= 6 && textNickname.length >= 4 && isPhoneNumber(textPhoneNumber) && avatar) {
            if (isFullNameVerify && isNicknameVerify && isPhoneNumberVerify && avatar) {
                setActiveButton(false);                
            }
        } else {
            setActiveButton(true);
        }
    }, [textFullName, textNickname, textPhoneNumber, avatar]);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setAvatar(result.assets[0].uri);
        }
    };

    const update = async () => {
            const token = await getTokenFromStorage();
            const response = await FileSystem.uploadAsync(`${process.env.EXPO_PUBLIC_API_URL}/user/update-user-data`, avatar, {
                fieldName: 'avatar',
                httpMethod: 'POST',
                parameters: {
                    fullname: textFullName,
                    nickname: textNickname,
                    phonenumber: textPhoneNumber,
                },
                headers: {
                    Authorization: token
                },
                uploadType: FileSystem.FileSystemUploadType.MULTIPART
            });

            if (response.status == 200) {
                    const user = await authUserInToken(response.body);
                    if (user) {
                        saveTokenToStorage(response.body);
                        dispatch(setUser(user));
                        navigation.navigate('HomeScreen');
                    }              
            } else {
                showAlert(response.body);
            }
    };

    return (
        <View style={styles.container}>
            <BackButton navigation={navigation} text={i18n.t('profile.edit')} />
            <View style={styles.avatarContainer}>
                <TouchableOpacity 
                    onPress={() => pickImage()}
                    style={styles.containerImageAvatar}>
                    <Image 
                        source={{ uri: avatar && userState.profile.avatar}} 
                        style={styles.imageAvatar} />   
                </TouchableOpacity>
                <View style={styles.pencilContainer}>
                    <PencilIcon Color={"#181A20"} Width={20} Height={20} />
                </View>
            </View>
            <View style={styles.inputsContainer}>
                <View style={styles.fullNameSection}>
                    <TextInput
                        style={styles.fullNameInput}
                        placeholderTextColor="#9E9E9E"
                        placeholder={i18n.t('fullName')}
                        value={textFullName}
                        onChangeText={(newText) => setTextFullName(newText)}/>
                </View>
                {fullNameError && <Text style={styles.fullNameError}>{fullNameError}</Text>}
                <View style={styles.nicknameSection}>
                    <TextInput
                        style={styles.nicknameInput}
                        placeholderTextColor="#9E9E9E"
                        value={textNickname}
                        placeholder={i18n.t('nickname')}
                        onChangeText={(newText) => setTextNickname(newText)}/>
                </View>
                {nicknameError && <Text style={styles.nicknameError}>{nicknameError}</Text>}    
                <View style={styles.phoneNumberSection}>
                    <TextInput
                        style={styles.phoneNumberInput}
                        placeholderTextColor="#9E9E9E"
                        placeholder={i18n.t('phoneNumber')}
                        value={textPhoneNumber}
                        keyboardType="phone-pad"
                        onChangeText={(newText) => setTextPhoneNumber(newText)}/>
                </View>
                {phoneNumberError && <Text style={styles.phoneNumberError}>{phoneNumberError}</Text>}       
            </View>
            <TouchableOpacity 
                onPress={() => update()} 
                disabled={isActiveButton}
                style={isActiveButton ? styles.continueButtonDisabled : styles.continueButtonEnabled}>
                <Text style={styles.buttonTitle}>{i18n.t('update')}</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#181A20',
    },
    pencilContainer: {
        backgroundColor: "#06C149",
        borderRadius: 10,
        padding: 8,
        left: 50,
        bottom: 35,
    },
    avatarContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 5,
    },
    containerImageAvatar: {
        width: 160,
        height: 160,
        backgroundColor: '#464648',
        borderRadius: 100,
        overflow: 'hidden',
    },
    imageAvatar: {
        width: '100%',
        height: '100%',
    },
    inputsContainer: {
        width: '90%',
        height: '35%'
    },
    fullNameSection: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: 64,
        borderRadius: 20,
        backgroundColor: '#1F222A',
    },
    fullNameInput: {
        flex: 1,
        height: '100%',
        color: '#fff',
        fontFamily: 'Outfit',
        marginLeft: 20,
    },
    fullNameError: {
        marginTop: 5,
        color: 'red',
        fontSize: 11,
        fontFamily: 'Outfit',
        justifyContent: 'center',
        textAlign: 'center'
    },
    nicknameSection: {
        marginTop: 25,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: 64,
        borderRadius: 20,
        backgroundColor: '#1F222A',
    },
    nicknameInput: {
        flex: 1,
        height: '100%',
        color: '#fff',
        fontFamily: 'Outfit',
        marginLeft: 20,
    },
    nicknameError: {
        marginTop: 5,
        color: 'red',
        fontSize: 11,
        fontFamily: 'Outfit',
        justifyContent: 'center',
        textAlign: 'center'
    },
    phoneNumberSection: {
        marginTop: 25,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: 64,
        borderRadius: 20,
        backgroundColor: '#1F222A',
    },
    phoneNumberInput: {
        flex: 1,
        height: '100%',
        color: '#fff',
        fontFamily: 'Outfit',
        marginLeft: 20,
    },
    phoneNumberError: {
        marginTop: 5,
        color: 'red',
        fontSize: 11,
        fontFamily: 'Outfit',
        justifyContent: 'center',
        textAlign: 'center'
    },
    titleContainer: {
        width: '90%',
    },
    titleText: {
        color: '#fff',
        fontFamily: 'Outfit',
        fontSize: 14,
    },
    continueButtonDisabled: {
        backgroundColor: '#0E9E42',
        width: '90%',
        height: 60,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    continueButtonEnabled: {
        backgroundColor: '#06C149',
        width: '90%',
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
    
export default EditDataScreen;