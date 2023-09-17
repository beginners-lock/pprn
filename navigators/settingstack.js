import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Settings from '../components/settings';
import { ThemeContext } from '../contexts/ThemeContext';
import { colors } from '../config/theme';
import { useContext } from 'react';
import Terms from '../components/terms';
import Help from '../components/help';
import Privacy from '../components/privacy';

export default function SettingStack() {
    const Stack = createNativeStackNavigator();
    const { theme } = useContext(ThemeContext);

    return(
        <Stack.Navigator screenOptions={{headerShown: false, contentStyle: {backgroundColor: colors[theme.mode].background}}}>
            <Stack.Screen name="settings" component={Settings}/>
            <Stack.Screen name="privacy" component={Privacy}/>
            <Stack.Screen name="help" component={Help}/>
            <Stack.Screen name="terms" component={Terms}/>
        </Stack.Navigator>
    );
}