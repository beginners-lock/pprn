import { colors } from "../config/theme";
import { View, Text, StatusBar, StyleSheet } from "react-native";
import { useContext } from "react";
import { ThemeContext } from "../contexts/ThemeContext";
import { useEffect } from "react";
import { createContext } from 'react';

const RootLayout = ({children, style, ...props}) => {
    const theme = {mode: 'dark'}
    //const theme = useContext(ThemeContext);
    let activeColors = colors[theme.mode]

    useEffect(()=>{
        const ThemeContext = createContext();
        console.log(ThemeContext.Provider)
    })

    return(
        <View style={{backgroundColor:activeColors.background, ...styles.container}}>
            <Text style={{fontFamily:'Chakra Petch SemiBold', color:activeColors.text1}}>Open up App.js to start working on your app! HOME</Text>
            <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

export default RootLayout;