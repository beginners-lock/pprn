import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../components/home';
import { ThemeContext } from '../contexts/ThemeContext';
import { colors } from '../config/theme';
import { useContext } from 'react';

export default function HomeStack() {
    const Stack = createNativeStackNavigator();
    const { theme } = useContext(ThemeContext);

    return(
        <Stack.Navigator screenOptions={{headerShown: false, contentStyle: {backgroundColor: colors[theme.mode].background}}}>
            <Stack.Screen name="home" component={Home}/>
        </Stack.Navigator>
    );
}