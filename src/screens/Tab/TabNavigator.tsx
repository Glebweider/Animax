import { createMaterialTopTabNavigator, MaterialTopTabBar } from "@react-navigation/material-top-tabs";
import { BlurView } from "expo-blur";
import { Dimensions, StyleSheet, View } from "react-native";
import * as ScreenOrientation from 'expo-screen-orientation';
import { useSelector } from "react-redux";

// Utils
import { i18n } from "@Utils/localization";

// Tabs
import HomeScreen from '@Tab/HomeScreen';
import ReleaseScreen from '@Tab/ReleaseScreen';
import MyListScreen from '@Tab/MyListScreen';
import ProfileScreen from '@Tab/ProfileScreen';

// Icons
import ProfileIcon from "@Icons/ProfileIcon";
import HomeIcon from "@Icons/HomeIcon";
import CalendarIcon from "@Icons/CalendarIcon";
import MyListIcon from "@Icons/MyListIcon";

// Redux
import { RootState } from "@Redux/store";

// Data
import { COLOR_PRIMARY, COLOR_TEXT_TERTIARY } from "@Data/constants";


const Tab = createMaterialTopTabNavigator();
const TabNavigator = () => {
    const currentUserStateId = useSelector((state: RootState) => state.userReducer.uuid);
    ScreenOrientation.unlockAsync();

    return (
        <Tab.Navigator
            id="MainTabs"
            tabBarPosition="bottom"
            tabBar={(props) => (
                <View style={styles.tabBarWrapper}>
                    <BlurView
                        intensity={4}
                        tint="dark"
                        style={styles.blurStyle}
                    />
                    <MaterialTopTabBar {...props} />
                </View>
            )}
            screenOptions={{
                tabBarStyle: {
                    backgroundColor: 'transparent',
                    elevation: 0,
                    shadowOpacity: 0,
                    borderTopWidth: 0,
                    height: '100%',
                },
                tabBarIndicatorStyle: {
                    backgroundColor: 'transparent',
                },
                tabBarLabelStyle: {
                    fontSize: 10,
                    textTransform: 'none',
                    margin: 0,
                    padding: 0,
                    width: '100%',
                },
                tabBarItemStyle: {
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 7,
                },
                tabBarActiveTintColor: COLOR_PRIMARY,
                tabBarInactiveTintColor: COLOR_TEXT_TERTIARY,
                tabBarShowIcon: true,
            }}>
            <Tab.Screen
                name='Home'
                component={HomeScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <HomeIcon Color={focused ? COLOR_PRIMARY : COLOR_TEXT_TERTIARY} Style={styles.icon} />
                    ),
                    title: i18n.t('navigation.home'),
                }} />
            <Tab.Screen
                name='Release'
                component={ReleaseScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <CalendarIcon Color={focused ? COLOR_PRIMARY : COLOR_TEXT_TERTIARY} Style={styles.icon} />
                    ),
                    title: i18n.t('navigation.release'),
                }} />
            <Tab.Screen
                name='MyList'
                component={MyListScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <MyListIcon Color={focused ? COLOR_PRIMARY : COLOR_TEXT_TERTIARY} Style={styles.icon} />
                    ),
                    title: i18n.t('navigation.mylist'),
                }} />
            <Tab.Screen
                name='Profile'
                initialParams={{ "userId": currentUserStateId }}
                component={ProfileScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <ProfileIcon Color={focused ? COLOR_PRIMARY : COLOR_TEXT_TERTIARY} Style={styles.icon} />
                    ),
                    title: i18n.t('navigation.profile'),
                }} />
        </Tab.Navigator>
    )
}

const styles = StyleSheet.create({
    icon: {
        width: 25,
        height: 25,
        elevation: 0,
    },
    tabBarWrapper: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: Dimensions.get('window').height * 0.1,
        borderTopLeftRadius: 22,
        borderTopRightRadius: 22,
        overflow: 'hidden',
    },
    blurStyle: {
        ...StyleSheet.absoluteFill,
        backgroundColor: '#222222b3',
    }
})

export default TabNavigator;