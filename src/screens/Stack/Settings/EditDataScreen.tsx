import React, { useMemo } from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system/legacy';
import { useDispatch, useSelector } from 'react-redux';

// Components
import BackButton from '@Components/buttons/Back';
import { useAlert } from '@Components/alert/AlertContext';
import ApplyButton from '@Components/buttons/Apply';

// Icons
import PencilIcon from '@Icons/PencilIcon';

// Redux
import { RootState } from '@Redux/store';
import { setUser } from '@Redux/reducers/userReducer';

// Utils
import { getTokenFromStorage, saveTokenToStorage } from '@Utils/functions';
import { isPhoneNumber } from '@Utils/validators';
import { i18n } from '@Utils/localization';
import { useFormValidation } from '@Utils/hooks';

// Rest
import useAuthUserInToken from '@Rest/auth/authUserInToken';


const EditDataScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const userState = useSelector((state: RootState) => state.userReducer);
    const { authUserInToken } = useAuthUserInToken();
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
            rules: [(v: string) => v.length < 4 ? 'Полное имя должно содержать не менее 4 символов' : null]
        },
        nickname: {
            value: form.nickname,
            initialValue: userState.profile.nickname,
            rules: [(v: string) => v.length < 4 ? 'Никнейм должен содержать не менее 4 символов' : null]
        },
        phoneNumber: {
            value: form.phoneNumber,
            initialValue: userState.preferences.phonenumber,
            rules: [(v: string) => !isPhoneNumber(v) ? 'Введите действительный номер телефона' : null]
        },
        description: {
            value: form.description,
            initialValue: userState.description,
            rules: [(v: string) => v.length > 48 ? 'Описание не может содержать более 48 символов' : null]
        }
    }), [form]);

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
        const token = await getTokenFromStorage();

        try {
            let response;
            if (form.avatar) {
                response = await FileSystem.uploadAsync(
                    `${process.env.EXPO_PUBLIC_API_URL}/api/user/user-data`,
                    form.avatar,
                    {
                        fieldName: 'avatar',
                        httpMethod: 'POST',
                        parameters: {
                            fullname: form.fullName,
                            nickname: form.nickname,
                            phonenumber: form.phoneNumber,
                            description: form.description,
                        },
                        headers: {
                            Authorization: token,
                            "Content-Type": 'application/json',
                            "Accept": 'application/json',
                        },
                        uploadType: FileSystem.FileSystemUploadType.MULTIPART
                    }
                );
            } else {
                response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/user/user-data`, {
                    method: 'POST',
                    headers: {
                        "Content-Type": 'application/json',
                        "Accept": 'application/json',
                        Authorization: token
                    },
                    body: JSON.stringify({
                        fullname: form.fullName,
                        nickname: form.nickname,
                        phonenumber: form.phoneNumber,
                        description: form.description,
                    })
                });

                response = {
                    status: response.status,
                    body: await response.text()
                };
            }

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
                        <PencilIcon Color={"#181A20"} Width={20} Height={20} />
                    </View>
                </View>
                <View style={styles.inputsContainer}>
                    {['fullName', 'nickname', 'phoneNumber', 'description'].map(field => (
                        <View key={field} >
                            <View style={styles.inputSection}>
                                <TextInput
                                    style={styles.input}
                                    placeholderTextColor="#9E9E9E"
                                    placeholder={i18n.t(field)}
                                    value={form[field]}
                                    maxLength={field == 'fullName' || 'nickname' ? 26 : 64}
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
                        <ActivityIndicator size="large" color="#FFFFFF" />
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
        backgroundColor: '#181A20',
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
        color: '#FFFFFF',
        marginTop: 12,
        fontSize: 16,
        fontWeight: '500',
    },
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#181A20',
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
        backgroundColor: "#06C149",
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
        backgroundColor: '#1F222A',
        justifyContent: 'center',
    },
    input: {
        flex: 1,
        height: '100%',
        color: '#fff',
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