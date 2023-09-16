import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { useState } from 'react';
import RootStack from './navigators/rootstack';

import { ThemeContext } from './contexts/ThemeContext';

export default function App() {
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
        <RootStack/>
    </ThemeContext.Provider>
  );
}

