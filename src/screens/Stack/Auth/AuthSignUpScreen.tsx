import React, { useMemo } from 'react';
import globalStyles from '@Styles/index';
import { StyleSheet, View, Image, Text, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

// Components
import BackButton from '@Components/buttons/Back';
import AuthEmailSectionInput from '@Components/AuthEmailSectionInput';
import AuthPasswordSectionInput from '@Components/AuthPasswordSectionInput';
import ApplyButton from '@Components/buttons/Apply';
import AuthMethods from '@Components/AuthMethods';
import AuthRedirect from '@Components/AuthRedirect';
import AuthDivider from '@Components/AuthDivider';

// Data
import { ICON_APP, USER_PASSWORD_MAX_LENGTH, USER_PASSWORD_MIN_LENGTH } from '@Data/constants';

// Utils
import { useFormValidation } from '@Utils/hooks';
import { isEmail } from '@Utils/validators';

// Rest
import useCheckFieldAvailability from '@Rest/auth/useCheckFieldAvailability';

// Redux
import { setEmailAndPasswordUser } from '@Redux/reducers/authReducer';
import { RootState } from '@Redux/store';


const AuthSignUpScreen = ({ navigation }: any) => {
	const dispatch = useDispatch();
	const authState = useSelector((state: RootState) => state.authReducer);

	const [textEmail, setTextEmail] = React.useState<string>(authState.email);
	const [textPassword, setTextPassword] = React.useState<string>(authState.password);
	const [isActiveButton, setActiveButton] = React.useState<boolean>(true);
	const { checkFieldAvailability } = useCheckFieldAvailability();

	const formConfig = useMemo(() => ({
		email: {
			value: textEmail,
			rules: [
				(v) => (!isEmail(v) && v.length > 0) ? "Please enter a valid email" : null
			]
		},
		password: {
			value: textPassword,
			rules: [
				(v) => (v.length > 0 && (v.length < USER_PASSWORD_MIN_LENGTH || v.length > USER_PASSWORD_MAX_LENGTH))
					? `Password must be between ${USER_PASSWORD_MIN_LENGTH} and ${USER_PASSWORD_MAX_LENGTH} characters`
					: null
			]
		}
	}), [textEmail, textPassword]);

	const { errors, activeButton } = useFormValidation(formConfig);

	const registration = async () => {
		const checkEmail = await checkFieldAvailability("email", textEmail);
		if (checkEmail) {
			dispatch(setEmailAndPasswordUser({ email: textEmail, password: textPassword }));

			navigation.navigate('AuthAccountSetupInterest');
		} else {
			setActiveButton(true);
		}
	}

	return (
		<ScrollView contentContainerStyle={globalStyles.AuthScreen} showsVerticalScrollIndicator={false}>
			<BackButton onPress={() => navigation.navigate('AuthMethods')} />
			<View style={styles.titleContainer}>
				<Image source={ICON_APP} style={globalStyles.AuthTitleImage} />
				<Text style={globalStyles.AuthTitle}>Create Your Account</Text>
			</View>
			<View style={globalStyles.AuthContainer}>
				<AuthEmailSectionInput
					error={errors.email}
					value={textEmail}
					setValue={(v) => setTextEmail(v)} />

				<AuthPasswordSectionInput
					error={errors.password}
					value={textPassword}
					setValue={(v) => setTextPassword(v)} />

				<ApplyButton
					onPress={registration}
					isActiveButton={isActiveButton && activeButton}
					style={{ marginTop: 30, marginBottom: 42 }}
					text={'Sign up'} />

				<AuthDivider text='or continue with' />

				<AuthMethods />

				<AuthRedirect
					text={"Already have an account?"}
					clicableText={'Sign in'}
					style={{ marginTop: 40 }}
					onPress={() => navigation.navigate('AuthSignIn')} />
			</View>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	titleContainer: {
		...globalStyles.AuthTitleContainer,
		marginTop: 5
	}
});

export default AuthSignUpScreen;