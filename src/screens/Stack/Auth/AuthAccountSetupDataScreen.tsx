import React, { useMemo } from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity, TextInput } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { useDispatch, useSelector } from 'react-redux';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import { registerForPushNotificationsAsync } from 'notification-config';

// Components
import BackButton from '@Components/buttons/Back';
import ApplyButton from '@Components/buttons/Apply';
import { useAlert } from '@Components/alert/AlertContext';

// Modals
import ConfigModal from '@Modal/ConfigModal';

// Icons
import PencilIcon from '@Icons/PencilIcon';

// Utils
import { isPhoneNumber } from '@Utils/validators';
import { saveTokenToStorage } from '@Utils/functions';
import { useFormValidation } from '@Utils/hooks';

// Redux
import { RootState } from '@Redux/store';
import { setUser } from '@Redux/reducers/userReducer';

// Rest
import useCheckFieldAvailability from '@Rest/auth/useCheckFieldAvailability';
import useAuthUserInToken from '@Rest/auth/authUserInToken';


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

    const { checkFieldAvailability } = useCheckFieldAvailability();
    const { authUserInToken } = useAuthUserInToken();
    const { showAlert } = useAlert();

    const formConfig = useMemo(() => ({
        fullName: {
            value: textFullName,
            rules: [
                (v) => v.length < 3 ? "Full name must be at least 3 characters" : null,
            ],
        },
        nickname: {
            value: textNickname,
            rules: [
                (v) => v.length < 4 ? "Nickname must be at least 4 characters" : null,
            ],
        },
        phone: {
            value: textPhoneNumber,
            rules: [
                (v) => !isPhoneNumber(v) ? "Please enter a valid phone number" : null,
            ],
        },
    }), [textFullName, textNickname, textPhoneNumber]);

    const { errors, activeButton } = useFormValidation(formConfig);

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
        const checkPhoneNumber = await checkFieldAvailability("phonenumber", textPhoneNumber);
        const checkNickname = await checkFieldAvailability("nickname", textNickname);

        if (checkPhoneNumber && checkNickname) {
            const pushToken = await registerForPushNotificationsAsync();
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
                    pushToken: pushToken
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
            showAlert('Please enter a valid phone number');
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
                    {avatar ?
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
                        value={textFullName} />
                </View>
                {errors.fullname && <Text style={styles.errorMessage}>{errors.fullname}</Text>}

                <View style={styles.nicknameSection}>
                    <TextInput
                        style={styles.nicknameInput}
                        placeholderTextColor="#9E9E9E"
                        placeholder="Nickname"
                        onChangeText={(newText) => setTextNickname(newText)}
                        value={textNickname} />
                </View>
                {errors.nickname && <Text style={styles.errorMessage}>{errors.nickname}</Text>}

                <View style={styles.phoneNumberSection}>
                    <TextInput
                        style={styles.phoneNumberInput}
                        placeholderTextColor="#9E9E9E"
                        placeholder="Phone Number"
                        keyboardType="phone-pad"
                        onChangeText={(newText) => setTextPhoneNumber(newText)}
                        value={textPhoneNumber} />
                </View>
                {errors.phone && <Text style={styles.errorMessage}>{errors.phone}</Text>}

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
            <ApplyButton
                onPress={registation}
                isActiveButton={isActiveButton && activeButton}
                style={{}}
                text={'Continue'} />

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
    errorMessage: {
        marginTop: 5,
        color: 'red',
        fontSize: 11,
        fontFamily: 'Outfit',
        justifyContent: 'center',
        textAlign: 'center'
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
        height: '52%'
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
    }
});

export default AuthAccountSetupDataScreen;