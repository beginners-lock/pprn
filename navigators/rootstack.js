import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image } from 'react-native';
import { colors } from "../config/theme";
import { useContext } from 'react';
import { ThemeContext } from "../contexts/ThemeContext";
import RootLayout from '../components/root';
import RootLayout2 from '../components/root2';

const Tab = createBottomTabNavigator();

const RootStack = () => {
    const { theme } = useContext(ThemeContext);

    return (
            <Tab.Navigator screenOptions={{
                headerShown: false,
                tabBarShowLabel: false,
                tabBarStyle: [
                    {
                        display: "flex", 
                        ...colors[theme.mode+'Tab'],
                        height:70,
                        borderWidth:1, borderTopLeftRadius:24, borderTopRightRadius:24,
                    },
                    null
                ]
            }}>
                <Tab.Screen name="home" component={RootLayout} options={{
                    tabBarIcon: ({focused}) => {
                        if(focused){
                            if(theme.mode==='dark'){
                                return(<Image style={{width:24, height:24}} source={require('./../assets/home-dark.png')}/>);
                            }else{
                                return(<Image style={{width:24, height:24}} source={require('./../assets/home1.png')}/>);
                            }
                        }else{
                            return(<Image style={{width:24, height:24}} source={require('./../assets/home.png')}/>);
                        }   
                    }
                }}>

                </Tab.Screen>
                <Tab.Screen name="mybets" component={RootLayout2} options={{
                    tabBarIcon: ({focused}) => {
                        if(focused){
                            if(theme.mode==='dark'){
                                return(<Image style={{width:24, height:24}} source={require('./../assets/game-dark.png')}/>);
                            }else{
                                return(<Image style={{width:24, height:24}} source={require('./../assets/game.png')}/>);
                            }
                        }else{
                            return(<Image style={{width:24, height:24}} source={require('./../assets/game.png')}/>);
                        }   
                    }
                }}>
                </Tab.Screen>
            </Tab.Navigator>
    );
}

export default RootStack;