import React, { useMemo } from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useDispatch, useSelector } from 'react-redux';

// Components
import BackButton from '@Components/buttons/Back';
import { useAlert } from '@Components/alert/AlertContext';
import ApplyButton from '@Components/buttons/Apply';

// Data
import {
    COLOR_BACKGROUND_PRIMARY, COLOR_BACKGROUND_SECONDARY, COLOR_PRIMARY,
    COLOR_TEXT_PRIMARY, COLOR_TEXT_TERTIARY, USER_DESCRIPTION_MAX_LENGTH,
    USER_FULLNAME_MAX_LENGTH, USER_FULLNAME_MIN_LENGTH,
    USER_NICKNAME_MAX_LENGTH, USER_NICKNAME_MIN_LENGTH
} from '@Data/constants';

// Icons
import PencilIcon from '@Icons/PencilIcon';

// Redux
import { RootState } from '@Redux/store';
import { setUser } from '@Redux/reducers/userReducer';

// Utils
import { saveTokenToStorage } from '@Utils/functions';
import { isPhoneNumber } from '@Utils/validators';
import { i18n } from '@Utils/localization';
import { useFormValidation } from '@Utils/hooks';

// Rest
import useAuthUserInToken from '@Rest/auth/authUserInToken';
import useUpdateUserData from '@Rest/user/userUpdateData';


const EditDataScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const userState = useSelector((state: RootState) => state.userReducer);
    const { authUserInToken } = useAuthUserInToken();
    const { updateUserData } = useUpdateUserData();
    const { showAlert } = useAlert();

    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [form, setForm] = React.useState({
        fullName: userState.profile.fullname,
        nickname: userState.profile.nickname,
        phoneNumber: userState.preferences.phonenumber,
        description: userState.description,
        avatar: null,
    });

    const handleChange = (key: string, value: string) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const formConfig = useMemo(() => ({
        fullName: {
            value: form.fullName,
            initialValue: userState.profile.fullname,
            rules: [
                (v: string) => (v.length < USER_FULLNAME_MIN_LENGTH || v.length > USER_FULLNAME_MAX_LENGTH)
                    ? `Имя должно содержать от ${USER_FULLNAME_MIN_LENGTH} до ${USER_FULLNAME_MAX_LENGTH} символов`
                    : null
            ]
        },
        nickname: {
            value: form.nickname,
            initialValue: userState.profile.nickname,
            rules: [
                (v: string) => (v.length < USER_NICKNAME_MIN_LENGTH || v.length > USER_NICKNAME_MAX_LENGTH)
                    ? `Никнейм должен содержать от ${USER_NICKNAME_MIN_LENGTH} до ${USER_NICKNAME_MAX_LENGTH} символов`
                    : null
            ]
        },
        phoneNumber: {
            value: form.phoneNumber,
            initialValue: userState.preferences.phonenumber,
            rules: [(v: string) => !isPhoneNumber(v) ? 'Введите действительный номер телефона' : null]
        },
        description: {
            value: form.description,
            initialValue: userState.description,
            rules: [
                (v: string) => v.length > USER_DESCRIPTION_MAX_LENGTH
                    ? `Описание не может содержать более ${USER_DESCRIPTION_MAX_LENGTH} символов`
                    : null
            ]
        }
    }), [form, userState]);

    let { errors, activeButton } = useFormValidation(formConfig);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            handleChange("avatar", result.assets[0].uri);
        }
    };

    const update = async () => {
        setIsSubmitting(true);

        try {
            const response = await updateUserData({
                fullName: form.fullName,
                nickname: form.nickname,
                phoneNumber: form.phoneNumber,
                description: form.description,
                avatar: form.avatar,
            });

            if (!response) return;

            saveTokenToStorage(response);
            
            const user = await authUserInToken();
            if (user) {
                dispatch(setUser(user));
                navigation.navigate("HomeScreen");
            }
        } catch (error) {
            console.error("Ошибка при обновлении профиля:", error);
            showAlert("Что-то пошло не так...");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <BackButton navigation={navigation} text={i18n.t('profile.edit')} />
                <View style={styles.avatarContainer}>
                    <TouchableOpacity onPress={pickImage} style={styles.containerImageAvatar}>
                        <Image source={{ uri: form.avatar || userState.profile.avatar }} style={styles.imageAvatar} />
                    </TouchableOpacity>
                    <View style={styles.pencilContainer}>
                        <PencilIcon Color={COLOR_BACKGROUND_PRIMARY} Width={20} Height={20} />
                    </View>
                </View>
                <View style={styles.inputsContainer}>
                    {['fullName', 'nickname', 'phoneNumber', 'description'].map(field => (
                        <View key={field} >
                            <View style={styles.inputSection}>
                                <TextInput
                                    style={styles.input}
                                    placeholderTextColor={COLOR_TEXT_TERTIARY}
                                    placeholder={i18n.t(field)}
                                    value={form[field]}
                                    onChangeText={(text) => handleChange(field, text)} />
                            </View>
                            {errors[field] && <Text style={styles.errorText}>{errors[field]}</Text>}
                        </View>
                    ))}
                </View>
            </View>
            <ApplyButton
                onPress={update}
                isActiveButton={!activeButton && !isSubmitting}
                style={styles.applyButton}
                text={i18n.t('update')} />
            {isSubmitting && (
                <View style={styles.loadingOverlay}>
                    <View style={styles.loadingBox}>
                        <ActivityIndicator size="large" color={COLOR_TEXT_PRIMARY} />
                        <Text style={styles.loadingText}>Сохраняем данные...</Text>
                    </View>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    loadingOverlay: {
        ...StyleSheet.absoluteFill,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
    },
    loadingBox: {
        backgroundColor: COLOR_BACKGROUND_PRIMARY,
        padding: 24,
        borderRadius: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    loadingText: {
        color: COLOR_TEXT_PRIMARY,
        marginTop: 12,
        fontSize: 16,
        fontWeight: '500',
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    content: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
    },
    applyButton: {
        width: '90%',
        marginBottom: 20,
    },
    pencilContainer: {
        backgroundColor: COLOR_PRIMARY,
        borderRadius: 10,
        padding: 8,
        position: 'absolute',
        bottom: 10,
        right: 10,
    },
    avatarContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 30,
        position: 'relative',
    },
    containerImageAvatar: {
        width: 160,
        height: 160,
        backgroundColor: '#464648',
        borderRadius: 80,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageAvatar: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    inputsContainer: {
        width: '90%',
        marginTop: 10
    },
    inputSection: {
        marginTop: 15,
        width: '100%',
        height: 64,
        borderRadius: 20,
        backgroundColor: COLOR_BACKGROUND_SECONDARY,
        justifyContent: 'center',
    },
    input: {
        flex: 1,
        height: '100%',
        color: COLOR_TEXT_PRIMARY,
        fontFamily: 'Outfit',
        marginLeft: 20,
        paddingVertical: 10,
    },
    errorText: {
        marginTop: 5,
        color: 'red',
        fontSize: 10,
        fontFamily: 'Outfit',
        justifyContent: 'center',
        textAlign: 'center',
    },
});

export default EditDataScreen;