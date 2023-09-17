import { colors } from "../config/theme";
import { View, Text, StatusBar, StyleSheet } from "react-native";
import { useContext } from "react";
import { ThemeContext } from "../contexts/ThemeContext";
import { Dimensions } from "react-native";

const RootLayout = ({children, style, ...props}) => {
    //const theme = {mode: 'dark'}
    const { theme } = useContext(ThemeContext);

    return(
        <View style={{backgroundColor:colors[theme.mode].background, ...styles.container}}>
            <Text style={{fontFamily:'Chakra Petch SemiBold', color:colors[theme.mode].text1}}>Open up App.js to start working on your app! HOME</Text>
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