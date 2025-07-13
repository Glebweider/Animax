import { createStackNavigator } from '@react-navigation/stack';

import PreloaderScreen from '@Stack/PreloaderScreen';
import AuthWelcomeScreen from '@Stack/Auth/AuthWelcomeScreen';
import AuthFGAScreen from '@Stack/Auth/AuthFGAScreen';
import AuthSignUpScreen from '@Stack/Auth/AuthSignUpScreen';
import AuthSignInScreen from '@Stack/Auth/AuthSignInScreen';
import AuthAccountSetupInterestScreen from '@Stack/Auth/AuthAccountSetupInterestScreen';
import AuthAccountSetupDataScreen from '@Stack/Auth/AuthAccountSetupDataScreen';
import TabNavigator from '@Tab/TabNavigator';
import AnimeScreen from '@Stack/AnimeScreen';
import AnimeSearchScreen from '@Stack/AnimeSearchScreen';
import AnimeSortScreen from '@Stack/AnimeSortScreen';
import TopHitsAnimeScreen from '@Stack/TopHitsAnimeScreen';
import EditDataScreen from '@Stack/Settings/EditDataScreen';
import SubcribeScreen from '@Stack/Premium/SubcribeScreen';
import PaymentScreen from '@Stack/Premium/PaymentScreen';
import PrivacyPolicyScreen from '@Stack/Settings/PrivacyPolicyScreen';
import ReviewSummaryScreen from '@Stack/Premium/ReviewSummaryScreen';
import ForgotPasswordMethodsScreen from '@Stack/ForgotPassword/ForgotPasswordMethodsScreen';
import ForgotPasswordCodeVerifyScreen from '@Stack/ForgotPassword/ForgotPasswordCodeVerifyScreen';
import HelpCenterScreen from '@Stack/Settings/HelpCenterScreen';
import LanguageScreen from '@Stack/Settings/LanguageScreen';
import ForgotPasswordResetPasswordScreen from '@Stack/ForgotPassword/ForgotPasswordResetPasswordScreen';
import RecomendationsAnimeScreen from '@Stack/RecomendationsAnimeScreen';
import NotificationScreen from '@Stack/Settings/NotificationScreen';
import SettingsScreen from '@Stack/Settings/SettingsScreen';
import ReportScreen from '@Stack/ReportScreen';
import SecurityScreen from '@Stack/Settings/SecurityScreen';
import CommentsScreen from '@Stack/CommentsScreen';

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
            <Stack.Screen name="RecomendationsAnimeScreen" component={RecomendationsAnimeScreen}/>
            <Stack.Screen name="EditDataScreen" component={EditDataScreen}/>
            <Stack.Screen name="NotificationScreen" component={NotificationScreen}/>
            <Stack.Screen name="SubcribeScreen" component={SubcribeScreen}/>
            <Stack.Screen name="PaymentScreen" component={PaymentScreen}/>
            <Stack.Screen name="PrivacyPolicyScreen" component={PrivacyPolicyScreen}/>
            <Stack.Screen name="ReviewSummaryScreen" component={ReviewSummaryScreen}/>
            <Stack.Screen name="ForgotPasswordMethodsScreen" component={ForgotPasswordMethodsScreen}/>
            <Stack.Screen name="ForgotPasswordCodeVerifyScreen" component={ForgotPasswordCodeVerifyScreen}/>
            <Stack.Screen name="ForgotPasswordResetPasswordScreen" component={ForgotPasswordResetPasswordScreen}/>
            <Stack.Screen name="HelpCenterScreen" component={HelpCenterScreen} />
            <Stack.Screen name="LanguageScreen" component={LanguageScreen} />
            <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
            <Stack.Screen name="ReportScreen" component={ReportScreen} />
            <Stack.Screen name="CommentsScreen" component={CommentsScreen}/>
            {/* <Stack.Screen name="SecurityScreen" component={SecurityScreen} /> */}
        </Stack.Navigator>
    );
};

export default StackNavigator;