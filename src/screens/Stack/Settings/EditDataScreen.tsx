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
    const { authUserInToken } = useAuthUserInToken();
    const { showAlert } = useAlert();
    
    const [form, setForm] = React.useState({
        fullName: userState.profile.fullname,
        nickname: userState.profile.nickname,
        phoneNumber: userState.preferences.phonenumber,
        description: userState.description,
        avatar: null,
    });
    
    const [errors, setErrors] = React.useState({
        fullName: "",
        nickname: "",
        phoneNumber: "",
    });
    
    const [isActiveButton, setActiveButton] = React.useState(true);
    
    useEffect(() => {
        const newErrors: any = {};
        
        if (form.fullName.length > 0 && form.fullName.length < 4) {
            newErrors.fullName = 'Полное имя должно содержать не менее 4 символов';
        }
        if (form.nickname.length > 0 && form.nickname.length < 4) {
            newErrors.nickname = 'Никнейм должен содержать не менее 4 символов';
        }
        if (form.phoneNumber.length > 0 && !isPhoneNumber(form.phoneNumber)) {
            newErrors.phoneNumber = 'Введите действительный номер телефона';
        }
        if (form.description.length > 48) {
            newErrors.description = `Описание не может содержать более 48 символов`;
        }
    
        setErrors(newErrors);
        
        setActiveButton(
            Object.keys(newErrors).length > 0 || 
            !form.fullName || 
            !form.nickname || 
            !form.phoneNumber || 
            form.description.length === 0
        );
    }, [form]);
    
    const handleChange = (key: string, value: string) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };
    
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });
    
        if (!result.canceled) {
            handleChange("avatar", result.assets[0].uri);
        }
    };
    
    const update = async () => {
        const token = await getTokenFromStorage();

        let response;
        if (form.avatar) {
            response = await FileSystem.uploadAsync(
                `${process.env.EXPO_PUBLIC_API_URL}/user/update-user-data`, 
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
                        Authorization: token
                    },
                    uploadType: FileSystem.FileSystemUploadType.MULTIPART
                }
            );
        } else {
            response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/user/update-user-data`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
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
    };
    
    return (
        <View style={styles.container}>
            <View style={{ flex: 1, alignItems: 'center', width: '100%' }}>
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
                    {['fullName', 'nickname', 'phoneNumber', 'description'].map((field) => (
                        <>
                            <View key={field} style={styles.inputSection}>
                                <TextInput
                                    style={styles.input}
                                    placeholderTextColor="#9E9E9E"
                                    placeholder={i18n.t(field)}
                                    value={form[field]}
                                    onChangeText={(text) => handleChange(field, text)}
                                />
                            </View>
                            {errors[field] && <Text style={styles.errorText}>{errors[field]}</Text>}
                        </>
                    ))}
                </View>
            </View>
            <TouchableOpacity 
                onPress={update} 
                disabled={isActiveButton}
                style={isActiveButton ? styles.continueButtonDisabled : styles.continueButtonEnabled}>
                <Text style={styles.buttonTitle}>{i18n.t('update')}</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#181A20',
        justifyContent: 'space-between'
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
        marginBottom: 20,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    continueButtonEnabled: {
        backgroundColor: '#06C149',
        width: '90%',
        marginBottom: 20,
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