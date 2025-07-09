import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { BlurView } from "expo-blur";
import { StyleSheet } from "react-native";
import * as ScreenOrientation from 'expo-screen-orientation';

import { i18n } from "@Utils/localization";

import HomeScreen from '@Tab/HomeScreen';
import ReleaseScreen from '@Tab/ReleaseScreen';
import MyListScreen from '@Tab/MyListScreen';
import ProfileScreen from '@Tab/ProfileScreen';

import ProfileIcon from "@Icons/ProfileIcon";
import HomeIcon from "@Icons/HomeIcon";
import CalendarIcon from "@Icons/CalendarIcon";
import MyListIcon from "@Icons/MyListIcon";
import { RootState } from "@Redux/store";
import { useSelector } from "react-redux";


const Tab = createBottomTabNavigator();

const TabNavigator = () => {
    const currentUserStateId = useSelector((state: RootState) => state.userReducer.uuid);
    ScreenOrientation.unlockAsync();

    return (
        <Tab.Navigator 
        screenOptions={{ 
            headerShown: false,
            tabBarBackground: () => <BlurView 
                intensity={4} 
                tint="dark"
                style={{
                    ...StyleSheet.absoluteFillObject,
                    borderTopLeftRadius: 22,
                    borderTopRightRadius: 22,
                    overflow: 'hidden',
                    backgroundColor: '#222222b3',
                    borderBottomWidth: 0,
                }} />,
            tabBarStyle: {
                position: 'absolute',
                height: '9%',
                borderTopWidth: 0,
                backgroundColor: 'transparent',
            },
            tabBarLabelStyle: {
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                marginBottom: 13,
            },
            tabBarIconStyle: {
                marginTop: 15,
            },
            tabBarActiveTintColor: '#06C149',
            tabBarInactiveTintColor: '#9E9E9E'
        }}>
            <Tab.Screen 
                name='Home'
                component={HomeScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <HomeIcon Color={focused ? '#06C149' : '#9E9E9E'} Style={styles.icon}/>
                    ),
                    title: i18n.t('navigation.home'),
                }} />
            <Tab.Screen 
                name='Release'
                component={ReleaseScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <CalendarIcon Color={focused ? '#06C149' : '#9E9E9E'} Style={styles.icon}/>
                    ),
                    title: i18n.t('navigation.release'),
                }}  />
            <Tab.Screen 
                name='MyList'  
                component={MyListScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <MyListIcon Color={focused ? '#06C149' : '#9E9E9E'} Style={styles.icon}/>
                    ),
                    title: i18n.t('navigation.mylist'),
                }}  />
            <Tab.Screen 
                name='Profile'
                initialParams={{ "userId": currentUserStateId }}
                component={ProfileScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <ProfileIcon Color={focused ? '#06C149' : '#9E9E9E'} Style={styles.icon}/>
                    ),
                    title: i18n.t('navigation.profile'),
                }}  />
        </Tab.Navigator>  
    )
}

const styles = StyleSheet.create({
    icon: {
        width: 25,
        height: 25,
        elevation: 0,
    }
})

export default TabNavigator;