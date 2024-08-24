import React, { useEffect } from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity, TextInput} from 'react-native';
import * as FileSystem from 'expo-file-system';
import { useDispatch, useSelector } from 'react-redux';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';

//Components
import BackButton from '@Components/BackButton';

//Modals
import ConfigModal from '@Modal/ConfigModal';

//Icons
import PencilIcon from '@Icons/PencilIcon';

//Utils
import { isPhoneNumber } from '@Utils/validator';
import { saveTokenToStorage } from '@Utils/token'; 

//Redux
import { RootState } from '@Redux/store';
import { setUser } from '@Redux/reducers/userReducer';
import useCheckPhoneNumberAvailability from '@Utils/fetch/authCheckPhoneNumberAvailability';
import useCheckNicknameAvailability from '@Utils/fetch/authCheckNicknameAvailability';
import useAuthUserInToken from '@Utils/fetch/authUserInToken';
import { useAlert } from '@Components/AlertContext';


const AuthAccountSetupDataScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const authState = useSelector((state: RootState) => state.authReducer);
    
    const [isActiveButton, setActiveButton] = React.useState<boolean>(true);
    const [isOpenModal, setOpenModal] = React.useState<boolean>(false);

    const [textFullName, setTextFullName] = React.useState<string>('');
    const [textNickname, setTextNickname] = React.useState<string>('');
    const [textPhoneNumber, setTextPhoneNumber] = React.useState<string>('');
    const [selectedGender, setSelectedGender] = React.useState<string>('');
    const [avatar, setAvatar] = React.useState<any>(null);

    const [fullNameError, setFullNameError] = React.useState<string | null>(null);
    const [nicknameError, setNicknameError] = React.useState<string | null>(null);
    const [phoneNumberError, setPhoneNumberError] = React.useState<string | null>(null);

    const [isFullNameVerify, setFullNameVerify] = React.useState<boolean>(false);
    const [isNicknameVerify, setNicknameVerify] = React.useState<boolean>(false);
    const [isPhoneNumberVerify, setPhoneNumberVerify] = React.useState<boolean>(false);

    const { checkPhoneNumberAvailability } = useCheckPhoneNumberAvailability();
    const { checkNicknameAvailability } = useCheckNicknameAvailability();
    const { authUserInToken } = useAuthUserInToken();
    const { showAlert } = useAlert();

    const requestPermissions = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            showAlert('Permission denied!');
        }
    };

    useEffect(() => {
        if (textFullName.length >= 1) {
            if (textFullName.length < 3) {
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
    
        if (textFullName.length >= 3 && textNickname.length >= 4 && isPhoneNumber(textPhoneNumber) && avatar) {
            if (isFullNameVerify && isNicknameVerify && isPhoneNumberVerify && avatar) {
                setActiveButton(false);                
            }
        } else {
            setActiveButton(true);
        }
    }, [textFullName, textNickname, textPhoneNumber, avatar]);

    requestPermissions();
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setAvatar(result.assets[0]);
        }
    };

    const registation = async () => {
        const checkPhoneNumber = await checkPhoneNumberAvailability(textPhoneNumber);
        const checkNickname = await checkNicknameAvailability(textNickname);

        if (checkPhoneNumber && checkNickname) {
            const response = await FileSystem.uploadAsync(`${process.env.EXPO_PUBLIC_API_URL}/auth/register`, avatar.uri, {
                fieldName: 'avatar',
                httpMethod: 'POST',
                parameters: {
                    email: authState.email,
                    password: authState.password,
                    interests: JSON.stringify(authState.interests),
                    fullname: textFullName,
                    nickname: textNickname,
                    phonenumber: textPhoneNumber,
                },
                uploadType: FileSystem.FileSystemUploadType.MULTIPART
            })

            if (response.status == 200) {
                    setOpenModal(true);
                    setTimeout(async () => {
                        const user = await authUserInToken(response.body);
                        if (user) {
                            saveTokenToStorage(response.body);
                            dispatch(setUser(user));
                            navigation.navigate('HomeScreen');
                        } else {
                            setOpenModal(false); 
                        }
                    }, 5000);                          
            } else {
                setOpenModal(false); 
                showAlert(response.body);
            }

        } else {
            setPhoneNumberError('Введите действительный номер телефона');
            setActiveButton(true);
        }
    };

    return (
        <View style={styles.container}>
            <BackButton navigation={navigation} text="Fill Your Profile" />
            <View style={styles.avatarContainer}>
                <TouchableOpacity 
                    onPress={() => pickImage()}
                    style={styles.containerImageAvatar}>
                    { avatar ? 
                    <Image 
                        source={{ uri: avatar.uri }} 
                        style={styles.imageAvatar} />   
                    :
                    <Image 
                        source={require('../../../../assets/avatar.png')} 
                        style={styles.imageNullAvatar} />   
                    }
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
                        placeholder="Full Name"
                        onChangeText={(newText) => setTextFullName(newText)}
                        value={textFullName}/>
                </View>
                {fullNameError && <Text style={styles.fullNameError}>{fullNameError}</Text>}
                <View style={styles.nicknameSection}>
                    <TextInput
                        style={styles.nicknameInput}
                        placeholderTextColor="#9E9E9E"
                        placeholder="Nickname"
                        onChangeText={(newText) => setTextNickname(newText)}
                        value={textNickname}/>
                </View>
                {nicknameError && <Text style={styles.nicknameError}>{nicknameError}</Text>}    
                <View style={styles.phoneNumberSection}>
                    <TextInput
                        style={styles.phoneNumberInput}
                        placeholderTextColor="#9E9E9E"
                        placeholder="Phone Number"
                        keyboardType="phone-pad"
                        onChangeText={(newText) => setTextPhoneNumber(newText)}
                        value={textPhoneNumber}/>
                </View>
                {phoneNumberError && <Text style={styles.phoneNumberError}>{phoneNumberError}</Text>}     
                <View style={styles.genderSection}>
                    <Picker
                        style={styles.genderPicker}
                        selectedValue={selectedGender}
                        prompt='Gender'
                        mode='dropdown'
                        dropdownIconColor={'#fff'}
                        onValueChange={(value) => setSelectedGender(value)}>
                            <Picker.Item label="Male" value="male" />
                            <Picker.Item label="Female" value="female" />
                            <Picker.Item label="Other" value="other" />
                    </Picker>
                </View>    
            </View>
            <TouchableOpacity 
                onPress={() => registation()} 
                disabled={isActiveButton}
                style={isActiveButton ? styles.continueButtonDisabled : styles.continueButtonEnabled}>
                <Text style={styles.buttonTitle}>Continue</Text>
            </TouchableOpacity>
            <ConfigModal 
                visible={isOpenModal} 
                setVisible={setOpenModal} />
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
    },
    containerImageAvatar: {
        width: 160,
        height: 160,
        backgroundColor: '#464648',
        borderRadius: 100,
        overflow: 'hidden'
    },
    imageNullAvatar: {
        width: '100%',
        height: '100%',
        marginTop: 8
    },
    imageAvatar: {
        width: '100%',
        height: '100%',
    },
    inputsContainer: {
        width: '90%',
        height: '55%'
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
    genderSection: {
        marginTop: 25,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: 64,
        borderRadius: 20,
        backgroundColor: '#1F222A',
        color: '#fff',
    },
    genderPicker: {
        flex: 1,
        color: '#fff',
        fontFamily: 'Outfit',
        height: '100%',
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
    
export default AuthAccountSetupDataScreen;