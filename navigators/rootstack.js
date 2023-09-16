import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { colors } from "../config/theme";
import { useContext } from 'react';
import { ThemeContext } from "../contexts/ThemeContext";
import RootLayout from '../components/root';
import RootLayout2 from '../components/root2';

const Tab = createBottomTabNavigator();

const RootStack = () => {
    const { theme } = useContext(ThemeContext);
    let activeColors = colors[theme.mode];

    return (
        <NavigationContainer>
            <Tab.Navigator>
                <Tab.Screen name="Home" component={RootLayout}>

                </Tab.Screen>
                <Tab.Screen name="MyBets" component={RootLayout2}>

                </Tab.Screen>
            </Tab.Navigator>
        </NavigationContainer>
    );
}

export default RootStack;