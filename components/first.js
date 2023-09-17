//web 63977248527-2te5mmoounboo1ols5f8i372tb7vnk51.apps.googleusercontent.com
//ios 63977248527-nv8t25peabl2m86a4iosu2satk4kf4mp.apps.googleusercontent.com
//android 63977248527-dhjam7h58jk4ltfmd2mm25kkbo0mtceo.apps.googleusercontent.com

import React, { Component } from 'react';
import { View, ImageBackground, Image, StyleSheet, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class First extends Component{
    state = {
        userInfo: {},
        screenmode: ''
    }

    async componentDidMount(){
        let screenmode = await AsyncStorage.getItem('screenmode');
        /*await AsyncStorage.multiRemove(['userdata', 'user', 'screenmode']);
        console.log('removed');*/
        let userinfo = await AsyncStorage.getItem('userdata');
        console.log(userinfo);
        this.setState({userInfo: JSON.parse(userinfo), screenmode:screenmode});
    }

    render(){
        return(
            <View style={{...styles.container, backgroundColor:this.state.screenmode==='dark'?'#181818':'white'}}>
                <ImageBackground style={styles.bg} source={require('./../assets/loadingbg.jpg')} resizeMode="cover">
                    <TouchableOpacity 
                        style={styles.logolink} 
                        onPress={()=>{ this.state.userInfo ? this.props.navigation.navigate('onboarding'): this.props.navigation.navigate('onboarding') /*navigation.navigate('first')*/; }}
                    >
                        <Image style={styles.logo} source={require('./../assets/logo.png')}></Image>
                    </TouchableOpacity>
                    <Image style={{width:180, height:100}} source={require('./../assets/itsamatch.png')}></Image>
                </ImageBackground>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1, flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center',
    },

    bg: { 
        width:'100%', height:'100%', flex: 1, flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center',
    },

    logolink: {
        width:115, height:200, flexDirection:'row', alignItems: 'center', justifyContent: 'center'
    },

    logo: {
        width:115, height:130
    },
})

export default First;