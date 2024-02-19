import { createStackNavigator } from '@react-navigation/stack';

import PreloaderScreen from './PreloaderScreen';
import AuthWelcomeScreen from './AuthWelcomeScreen';
import AuthFGAScreen from './AuthFGAScreen';
import AuthSignUpScreen from './AuthSignUpScreen';
import AuthSignInScreen from './AuthSignInScreen';
import AuthAccountSetupInterestScreen from './AuthAccountSetupInterestScreen';
import AuthAccountSetupDataScreen from './AuthAccountSetupDataScreen';
import TabNavigator from '../Tab/TabNavigator';
import AnimeScreen from './AnimeScreen';
import AnimeSearchScreen from './AnimeSearchScreen';
import AnimeSortScreen from './AnimeSortScreen';
import TopHitsAnimeScreen from './TopHitsAnimeScreen';
import EditDataScreen from './EditDataScreen';
import SubcribeScreen from './SubcribeScreen';
import PaymentScreen from './PaymentScreen';
import AddNewCardScreen from './AddNewCardScreen';

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
        </Stack.Navigator>
    );
};

export default StackNavigator;