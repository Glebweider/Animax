import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { BlurView } from "expo-blur";
import { StyleSheet } from "react-native";

import HomeScreen from './HomeScreen';
import ReleaseScreen from './ReleaseScreen';
import MyListScreen from './MyListScreen';
import ProfileScreen from './ProfileScreen';

import ProfileIcon from "../../components/icons/ProfileIcon";
import HomeIcon from "../../components/icons/HomeIcon";
import CalendarIcon from "../../components/icons/CalendarIcon";
import MyListIcon from "../../components/icons/MyListIcon";

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
    return (
        <Tab.Navigator screenOptions={{ 
            headerShown: false,
            tabBarBackground: () => <BlurView 
                intensity={30} 
                tint="dark"
                style={{
                    ...StyleSheet.absoluteFillObject,
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                    overflow: 'hidden',
                }} />,
            tabBarStyle: {
                position: 'absolute',
                height: '9%',
                borderTopWidth: 0,
                backgroundColor: 'transparent'
            },
            tabBarIconStyle: {
                marginTop: 15,
            },
            tabBarLabelStyle: {
                elevation: 0,
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                marginBottom: 13,
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
                    unmountOnBlur: false
                }} />
            <Tab.Screen 
            name='Release' 
            component={ReleaseScreen}
            options={{
                    tabBarIcon: ({ focused }) => (
                        <CalendarIcon Color={focused ? '#06C149' : '#9E9E9E'} Style={styles.icon}/>
                    ),
                    unmountOnBlur: true
                }}  />
            <Tab.Screen 
                name='MyList' 
                component={MyListScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <MyListIcon Color={focused ? '#06C149' : '#9E9E9E'} Style={styles.icon}/>
                    ),
                    unmountOnBlur: true
                }}  />
            <Tab.Screen 
                name='Profile' 
                component={ProfileScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <ProfileIcon Color={focused ? '#06C149' : '#9E9E9E'} Width={25} Height={25}/>
                    ),
                    unmountOnBlur: false
                }}  />
        </Tab.Navigator>  
    )
}

const styles = StyleSheet.create({
    icon: {
        width: 25,
        height: 25,
        elevation: 0,
    },
})

export default TabNavigator;