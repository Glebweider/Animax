import React from 'react';
import { StyleSheet, View, TouchableOpacity, TextInput } from 'react-native';

// Styles
import globalStyles from '@Styles/index';

// Icons
import PasswordIcon from '@Icons/PasswordIcon';
import EyeOnIcon from '@Icons/EyeOnIcon';
import EyeOffIcon from '@Icons/EyeOffIcon';

// Data
import { COLOR_TEXT_PRIMARY, COLOR_TEXT_TERTIARY } from '@Data/constants';


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
                Style={styles.SectionInputIcon} />
            <TextInput
                style={globalStyles.Input}
                placeholderTextColor={COLOR_TEXT_TERTIARY}
                placeholder={placeholder}
                secureTextEntry={isVisibledPassword}
                onChangeText={(newText) => setTextPassword(newText)}
                value={textPassword} />
            <TouchableOpacity onPress={() => isVisibledPassword ? setVisibledPassword(false) : setVisibledPassword(true)}>
                {isVisibledPassword ?
                    <EyeOffIcon
                        Color={textPassword ? COLOR_TEXT_PRIMARY : COLOR_TEXT_TERTIARY}
                        Style={styles.SectionInputIcon} />
                    :
                    <EyeOnIcon
                        Color={textPassword ? COLOR_TEXT_PRIMARY : COLOR_TEXT_TERTIARY}
                        Style={styles.SectionInputIcon} />
                }
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
	...globalStyles,
    passwordSection: {
		...globalStyles.Section,
        marginTop: 20,
        width: '100%',
        height: 64,
        borderRadius: 20,
    }
});

export default PasswordSection;