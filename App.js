import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { useState } from 'react';
//import RootStack from './navigators/rootstack';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { ThemeContext } from './contexts/ThemeContext';
import First from './components/first';
import LoginAcc from './components/loginacc';
import CreateAcc from './components/createacc';
import Onboarding from './components/onboarding';
import RootLayout from './components/root';

export default function App() {
  const Stack = createNativeStackNavigator();

  const [theme, setTheme] = useState({mode: "dark"});

  const updateTheme = (newTheme) => {
    let mode;
    if(!newTheme){
      mode = theme.mode === 'dark' ? 'light' : 'dark';
      newTheme = {mode};
    }
    setTheme(newTheme);
  }

  return (
    <ThemeContext.Provider value={{theme, updateTheme}}>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name="first" component={First}/>
            <Stack.Screen name="onboarding" component={Onboarding}/>
            <Stack.Screen name="loginacc" component={LoginAcc}/>
            <Stack.Screen name="createacc" component={CreateAcc}/>
            <Stack.Screen name="home" component={RootLayout}/>
          </Stack.Navigator>
        </NavigationContainer>
    </ThemeContext.Provider>
  );
}

