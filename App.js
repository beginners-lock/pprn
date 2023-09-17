import 'react-native-gesture-handler';
import { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { ThemeContext } from './contexts/ThemeContext';
import First from './components/first';
import LoginAcc from './components/loginacc';
import CreateAcc from './components/createacc';
import Onboarding from './components/onboarding';
import UserStack from './navigators/userstack';
import { colors } from './config/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const Stack = createNativeStackNavigator();
  const [theme, setTheme] = useState({mode: "dark"});

  useEffect(()=>{
    async function themeChecker(){
      let themeMode = await AsyncStorage.getItem('PacPlayThemeMode');
      if(themeMode){
          setTheme({mode: themeMode});
      }else{
          setTheme({mode: 'light'})
      }
      
    }
    themeChecker();

  }, [setTheme]);

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
        <NavigationContainer theme={theme.mode==='dark'?{dark: true, colors: {background:'#181818'}}:{dark: false, colors: {background:'white'}} }>
          <Stack.Navigator screenOptions={{headerShown: false, contentStyle: {backgroundColor: colors[theme.mode].background}}}>
            <Stack.Screen name="first" component={First}/>
            <Stack.Screen name="onboarding" component={Onboarding}/>
            <Stack.Screen name="loginacc" component={LoginAcc}/>
            <Stack.Screen name="createacc" component={CreateAcc}/>
            <Stack.Screen name="user" component={UserStack}/>
          </Stack.Navigator>
        </NavigationContainer>
    </ThemeContext.Provider>
  );
}

