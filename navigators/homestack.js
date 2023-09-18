import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../components/home';
import Profile from '../components/profile';
import CreateGame from '../components/creategame';
import JoinGame from '../components/joingame';
import { ThemeContext } from '../contexts/ThemeContext';
import { colors } from '../config/theme';
import { useContext } from 'react';

export default function HomeStack() {
    const Stack = createNativeStackNavigator();
    const { theme } = useContext(ThemeContext);

    return(
        <Stack.Navigator screenOptions={{headerShown: false, contentStyle: {backgroundColor: colors[theme.mode].background}}}>
            <Stack.Screen name="home" component={Home}/>
            <Stack.Screen name="profile" component={Profile}/>
            <Stack.Screen name="creategame" component={CreateGame}/>
            <Stack.Screen name="joingame" component={JoinGame}/>
        </Stack.Navigator>
    );
}