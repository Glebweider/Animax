import React from 'react';

// Styles
import globalStyles from '@Styles/index';

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
                Style={globalStyles.SectionInputIcon} />
            }
            value={value}
            error={error}
            placeholder={'Email'}
            keyboardType={'email-address'}
            setValue={(v) => setValue(v)} />
    );
};

export default AuthEmailSectionInput;