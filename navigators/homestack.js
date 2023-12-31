import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../components/home';
import Profile from '../components/profile';
import CreateGame from '../components/creategame';
import JoinGame from '../components/joingame';
import WaitingRoom from '../components/waitingroom';
import DecisionRoom from '../components/decisionroom';
import WaitingRoom2 from '../components/waitingroom2';
import DecisionRoom2 from '../components/decisionroom2';
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
            <Stack.Screen name="waitingroom" component={WaitingRoom}/>
            <Stack.Screen name="decisionroom" component={DecisionRoom}/>
            <Stack.Screen name="waitingroom2" component={WaitingRoom2}/>
            <Stack.Screen name="decisionroom2" component={DecisionRoom2}/>
        </Stack.Navigator>
    );
}