import React, { useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, TextInput } from 'react-native';

// Icons
import PasswordIcon from '@Icons/PasswordIcon';
import EyeOnIcon from '@Icons/EyeOnIcon';
import EyeOffIcon from '@Icons/EyeOffIcon';

// Data
import { COLOR_BACKGROUND_SECONDARY, COLOR_TEXT_PRIMARY, COLOR_TEXT_TERTIARY } from '@Data/constants';


interface PasswordSectionProps {
    placeholder: string;
    textPassword: string;
    setTextPassword: (string: string) => void;
}

const PasswordSection = ({ placeholder, textPassword, setTextPassword }: PasswordSectionProps) => {
    const [isVisibledPassword, setVisibledPassword] = React.useState<boolean>(true);
    return (
        <View style={styles.passwordSection}>
            <PasswordIcon
                Color={textPassword ? COLOR_TEXT_PRIMARY : COLOR_TEXT_TERTIARY}
                Style={styles.icon} />
            <TextInput
                style={styles.passwordInput}
                placeholderTextColor={COLOR_TEXT_TERTIARY}
                placeholder={placeholder}
                secureTextEntry={isVisibledPassword}
                onChangeText={(newText) => setTextPassword(newText)}
                value={textPassword} />
            <TouchableOpacity onPress={() => isVisibledPassword ? setVisibledPassword(false) : setVisibledPassword(true)}>
                {isVisibledPassword ?
                    <EyeOffIcon
                        Color={textPassword ? COLOR_TEXT_PRIMARY : COLOR_TEXT_TERTIARY}
                        Style={styles.icon} />
                    :
                    <EyeOnIcon
                        Color={textPassword ? COLOR_TEXT_PRIMARY : COLOR_TEXT_TERTIARY}
                        Style={styles.icon} />
                }
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    passwordSection: {
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: 64,
        borderRadius: 20,
        backgroundColor: COLOR_BACKGROUND_SECONDARY,
    },
    passwordInput: {
        flex: 1,
        height: '100%',
        color: COLOR_TEXT_PRIMARY,
        fontFamily: 'Outfit',
    },
    icon: {
        width: 20,
        height: 20,
        margin: 22,
    },
});

export default PasswordSection;