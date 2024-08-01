import { createStackNavigator } from '@react-navigation/stack';

import PreloaderScreen from '@Stack/PreloaderScreen';
import AuthWelcomeScreen from '@Stack/AuthWelcomeScreen';
import AuthFGAScreen from '@Stack/AuthFGAScreen';
import AuthSignUpScreen from '@Stack/AuthSignUpScreen';
import AuthSignInScreen from '@Stack/AuthSignInScreen';
import AuthAccountSetupInterestScreen from '@Stack/AuthAccountSetupInterestScreen';
import AuthAccountSetupDataScreen from '@Stack/AuthAccountSetupDataScreen';
import TabNavigator from '@Tab/TabNavigator';
import AnimeScreen from '@Stack/AnimeScreen';
import AnimeSearchScreen from '@Stack/AnimeSearchScreen';
import AnimeSortScreen from '@Stack/AnimeSortScreen';
import TopHitsAnimeScreen from '@Stack/TopHitsAnimeScreen';
import EditDataScreen from '@Stack/EditDataScreen';
import SubcribeScreen from '@Stack/SubcribeScreen';
import PaymentScreen from '@Stack/PaymentScreen';
import AddNewCardScreen from '@Stack/AddNewCardScreen';
import PrivacyPolicyScreen from '@Stack/PrivacyPolicyScreen';
import ReviewSummaryScreen from '@Stack/ReviewSummaryScreen';
import ForgotPasswordMethodsScreen from '@Stack/ForgotPasswordMethodsScreen';
import ForgotPasswordCodeVerifyScreen from '@Stack/ForgotPasswordCodeVerifyScreen';
import HelpCenterScreen from '@Stack/HelpCenterScreen';
import LanguageScreen from '@Stack/LanguageScreen';

const Stack = createStackNavigator();

const StackNavigator = () => {
    return (
        <Stack.Navigator initialRouteName='Preloader' screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Preloader" component={PreloaderScreen} />
            <Stack.Screen name="AuthWelcome" component={AuthWelcomeScreen} />
            <Stack.Screen name="AuthFGA" component={AuthFGAScreen} />
            <Stack.Screen name="AuthSignUp" component={AuthSignUpScreen} />
            <Stack.Screen name="AuthSignIn" component={AuthSignInScreen} />
            <Stack.Screen name="AuthAccountSetupInterest" component={AuthAccountSetupInterestScreen} />
            <Stack.Screen name="AuthAccountSetupData" component={AuthAccountSetupDataScreen} />
            <Stack.Screen name="HomeScreen" component={TabNavigator}/>
            <Stack.Screen name="AnimeScreen" component={AnimeScreen}/>
            <Stack.Screen name="AnimeSearchScreen" component={AnimeSearchScreen}/>
            <Stack.Screen name="AnimeSortScreen" component={AnimeSortScreen}/>
            <Stack.Screen name="TopHitsAnimeScreen" component={TopHitsAnimeScreen}/>
            <Stack.Screen name="EditDataScreen" component={EditDataScreen}/>
            <Stack.Screen name="SubcribeScreen" component={SubcribeScreen}/>
            <Stack.Screen name="PaymentScreen" component={PaymentScreen}/>
            <Stack.Screen name="AddNewCardScreen" component={AddNewCardScreen}/>
            <Stack.Screen name="PrivacyPolicyScreen" component={PrivacyPolicyScreen}/>
            <Stack.Screen name="ReviewSummaryScreen" component={ReviewSummaryScreen}/>
            <Stack.Screen name="ForgotPasswordMethodsScreen" component={ForgotPasswordMethodsScreen}/>
            <Stack.Screen name="ForgotPasswordCodeVerifyScreen" component={ForgotPasswordCodeVerifyScreen}/>
            <Stack.Screen name="HelpCenterScreen" component={HelpCenterScreen} />
            <Stack.Screen name="LanguageScreen" component={LanguageScreen} />
        </Stack.Navigator>
    );
};

export default StackNavigator;