import React from 'react';
import { StyleSheet } from 'react-native';

// Component
import SectionInput from './SectionInput';

// Icons
import EmailIcon from './icons/EmailIcon';

// Data
import { COLOR_TEXT_PRIMARY, COLOR_TEXT_TERTIARY } from '@Data/constants';


interface AuthEmailSectionInputProps {
    error: string;
    value: string;
    setValue: (v: string) => void;
}

const AuthEmailSectionInput = ({ error, value, setValue }: AuthEmailSectionInputProps) => {
    return (
        <SectionInput
            icon={<EmailIcon
                Color={value ? COLOR_TEXT_PRIMARY : COLOR_TEXT_TERTIARY}
                Style={styles.icon} />
            }
            value={value}
            error={error}
            placeholder={'Email'}
            keyboardType={'email-address'}
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

export default AuthEmailSectionInput;