import React from 'react';
import { StyleSheet } from 'react-native';

// Component
import SectionInput from './SectionInput';

// Icons
import PasswordIcon from './icons/PasswordIcon';

// Data
import { COLOR_TEXT_PRIMARY, COLOR_TEXT_TERTIARY } from '@Data/constants';


interface AuthPasswordSectionInputProps {
    error: string;
    value: string;
    setValue: (v: string) => void;
}

const AuthPasswordSectionInput = ({ error, value, setValue }: AuthPasswordSectionInputProps) => {
    return (
        <SectionInput
            secure
            icon={<PasswordIcon
                Color={value ? COLOR_TEXT_PRIMARY : COLOR_TEXT_TERTIARY}
                Style={styles.icon} />
            }
            value={value}
            error={error}
            placeholder={'Password'}
            keyboardType={'default'}
            setValue={(v) => setValue(v)} />
    );
};

const styles = StyleSheet.create({
    icon: {
        width: 20,
        height: 20,
        marginLeft: 22,
    }
});

export default AuthPasswordSectionInput;