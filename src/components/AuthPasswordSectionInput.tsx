import React from 'react';

// Styles
import globalStyles from '@Styles/index';

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
				Style={globalStyles.SectionInputIcon} />
			}
			value={value}
			error={error}
			placeholder={'Password'}
			keyboardType={'default'}
			setValue={(v) => setValue(v)} />
	);
};

export default AuthPasswordSectionInput;