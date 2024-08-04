import React, { useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, TextInput} from 'react-native';

import PasswordIcon from '@Icons/PasswordIcon';
import EyeOnIcon from '@Icons/EyeOnIcon';
import EyeOffIcon from '@Icons/EyeOffIcon';

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
                Color={textPassword ? '#fff' : '#9E9E9E'} 
                Style={styles.icon} />
            <TextInput
                style={styles.passwordInput}
                placeholderTextColor="#9E9E9E"
                placeholder={placeholder}
                secureTextEntry={isVisibledPassword}
                onChangeText={(newText) => setTextPassword(newText)}
                value={textPassword}/>
            <TouchableOpacity onPress={() => isVisibledPassword ? setVisibledPassword(false) : setVisibledPassword(true)}>
                {isVisibledPassword ? 
                    <EyeOffIcon Color={textPassword ? '#fff' : '#9E9E9E'} Style={styles.icon}/> 
                    :
                    <EyeOnIcon Color={textPassword ? '#fff' : '#9E9E9E'} Style={styles.icon}/>  
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
        backgroundColor: '#1F222A',
    },    
    passwordInput: {
        flex: 1,
        height: '100%',
        color: '#fff',
        fontFamily: 'Outfit',
    },
    icon: {
        width: 20,
        height: 20,
        margin: 22, 
    },
});
    
export default PasswordSection;