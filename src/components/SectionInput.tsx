import { useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, KeyboardTypeOptions, Text } from 'react-native';

// Data
import { COLOR_BACKGROUND_SECONDARY, COLOR_TEXT_PRIMARY, COLOR_TEXT_TERTIARY } from '@Data/constants';

// Icons
import EyeOffIcon from './icons/EyeOffIcon';
import EyeOnIcon from './icons/EyeOnIcon';


interface AuthInputProps {
    icon?: React.ReactNode;
    secure?: boolean;
    value: string;
    error?: string;
    placeholder: string;
    keyboardType: KeyboardTypeOptions;
    setValue: (v: string) => void;
}

const SectionInput = ({ placeholder, secure, value, error, icon, keyboardType, setValue }: AuthInputProps) => {
    const [isVisibledPassword, setVisibledPassword] = useState<boolean>(secure);

    return (
        <>
            <Text style={styles.error}>{error}</Text>
            <View style={styles.container}>
                {icon}
                <TextInput
                    style={styles.input}
                    placeholderTextColor={COLOR_TEXT_TERTIARY}
                    placeholder={placeholder}
                    keyboardType={keyboardType}
                    secureTextEntry={isVisibledPassword}
                    onChangeText={(newText) => setValue(newText)}
                    value={value} />
                {secure &&
                    <TouchableOpacity onPress={() => setVisibledPassword(!isVisibledPassword)}>
                        {isVisibledPassword ?
                            <EyeOffIcon
                                Color={value ? COLOR_TEXT_PRIMARY : COLOR_TEXT_TERTIARY}
                                Style={styles.icon} />
                            :
                            <EyeOnIcon
                                Color={value ? COLOR_TEXT_PRIMARY : COLOR_TEXT_TERTIARY}
                                Style={styles.icon} />
                        }
                    </TouchableOpacity>
                }
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 3,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: 64,
        borderRadius: 20,
        backgroundColor: COLOR_BACKGROUND_SECONDARY,
    },
    input: {
        flex: 1,
        height: '100%',
        color: COLOR_TEXT_PRIMARY,
        fontFamily: 'Outfit',
        marginLeft: 20,
    },
    icon: {
        width: 20,
        height: 20,
        margin: 22,
    },
    error: {
        marginTop: 5,
        color: 'red',
        fontSize: 11,
        fontFamily: 'Outfit',
        justifyContent: 'center',
        textAlign: 'center'
    },
});

export default SectionInput;