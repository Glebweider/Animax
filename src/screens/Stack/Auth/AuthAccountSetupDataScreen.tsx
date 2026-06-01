import React, { useMemo } from 'react';
import { StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import { registerForPushNotificationsAsync } from 'notification-config';

// Components
import BackButton from '@Components/buttons/Back';
import ApplyButton from '@Components/buttons/Apply';
import SectionInput from '@Components/SectionInput';

// Data
import {
    COLOR_BACKGROUND_PRIMARY, COLOR_BACKGROUND_SECONDARY,
    COLOR_PRIMARY, COLOR_TEXT_PRIMARY, DEFAULT_AVATAR,
    USER_FULLNAME_MAX_LENGTH, USER_FULLNAME_MIN_LENGTH,
    USER_NICKNAME_MAX_LENGTH, USER_NICKNAME_MIN_LENGTH
} from '@Data/constants';

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
import useAuthSignUp from '@Rest/auth/authUserSignUp';


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
    const { authSignUp } = useAuthSignUp();

    const formConfig = useMemo(() => ({
        fullName: {
            value: textFullName,
            rules: [(v) => (v.length > 0 && (v.length < USER_FULLNAME_MIN_LENGTH || v.length > USER_FULLNAME_MAX_LENGTH))
                ? `Full name must be between ${USER_FULLNAME_MIN_LENGTH} and ${USER_FULLNAME_MAX_LENGTH} characters`
                : null
            ],
        },
        nickname: {
            value: textNickname,
            rules: [(v) => (v.length > 0 && (v.length < USER_NICKNAME_MIN_LENGTH || v.length > USER_NICKNAME_MAX_LENGTH))
                ? `Nickname must be between ${USER_NICKNAME_MIN_LENGTH} and ${USER_NICKNAME_MAX_LENGTH} characters`
                : null
            ],
        },
        phone: {
            value: textPhoneNumber,
            rules: [(v) => (v.length > 0 && !isPhoneNumber(v)) ? "Please enter a valid phone number" : null],
        },
    }), [textFullName, textNickname, textPhoneNumber]);

    const { errors, activeButton } = useFormValidation(formConfig);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
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

        if (!checkPhoneNumber || !checkNickname) {
            setActiveButton(true);
            return;
        }

        const pushToken = await registerForPushNotificationsAsync();

        const response = await authSignUp({
            email: authState.email,
            password: authState.password,
            interests: JSON.stringify(authState.interests),
            fullName: textFullName,
            nickname: textNickname,
            phoneNumber: textPhoneNumber,
            avatarUri: avatar.uri,
            pushToken,
        });

        if (!response) {
            setOpenModal(false);
            return;
        }

        setOpenModal(true);
        setTimeout(async () => {
            saveTokenToStorage(response);

            const user = await authUserInToken();
            if (user) {
                dispatch(setUser(user));
                navigation.replace("HomeScreen");
            } else {
                setOpenModal(false);
            }
        }, 5000);
    };

    return (
        <View style={styles.container}>
            <BackButton
                onPress={() => navigation.navigate('AuthAccountSetupInterest')}
                text="Fill Your Profile" />
            <View style={styles.avatarContainer}>
                <TouchableOpacity
                    onPress={() => pickImage()}
                    style={styles.containerImageAvatar}>
                    <Image
                        source={avatar ? { uri: avatar.uri } : DEFAULT_AVATAR}
                        style={[{ width: '100%', height: '100%' }, !avatar && { marginTop: 8 }]} />
                </TouchableOpacity>
                <View style={styles.pencilContainer}>
                    <PencilIcon Color={COLOR_BACKGROUND_PRIMARY} Width={20} Height={20} />
                </View>
            </View>
            <View style={styles.inputsContainer}>
                <SectionInput
                    value={textFullName}
                    placeholder={'Full Name'}
                    keyboardType={'default'}
                    error={errors.fullName}
                    setValue={(v) => setTextFullName(v)} />

                <SectionInput
                    value={textNickname}
                    placeholder={'Nickname'}
                    keyboardType={'default'}
                    error={errors.nickname}
                    setValue={(v) => setTextNickname(v)} />

                <SectionInput
                    value={textPhoneNumber}
                    placeholder={'Phone Number'}
                    keyboardType={'phone-pad'}
                    error={errors.phone}
                    setValue={(v) => setTextPhoneNumber(v)} />

                <View style={styles.genderSection}>
                    <Picker
                        style={styles.genderPicker}
                        selectedValue={selectedGender}
                        prompt='Gender'
                        mode='dropdown'
                        dropdownIconColor={COLOR_TEXT_PRIMARY}
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
        backgroundColor: COLOR_PRIMARY,
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
        backgroundColor: COLOR_BACKGROUND_SECONDARY,
    },
    fullNameInput: {
        flex: 1,
        height: '100%',
        color: COLOR_TEXT_PRIMARY,
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
        backgroundColor: COLOR_BACKGROUND_SECONDARY,
    },
    nicknameInput: {
        flex: 1,
        height: '100%',
        color: COLOR_TEXT_PRIMARY,
        fontFamily: 'Outfit',
        marginLeft: 20,
    },
    genderSection: {
        marginTop: 25,
        paddingLeft: 15,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: 64,
        borderRadius: 20,
        backgroundColor: COLOR_BACKGROUND_SECONDARY,
        color: COLOR_TEXT_PRIMARY,
    },
    genderPicker: {
        flex: 1,
        color: COLOR_TEXT_PRIMARY,
        fontFamily: 'Outfit',
        height: '100%',
    }
});

export default AuthAccountSetupDataScreen;