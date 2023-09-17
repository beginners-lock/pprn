import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { ThemeContext } from '../contexts/ThemeContext';
import { colors } from '../config/theme';

class Header extends Component{
    static contextType = ThemeContext;

    state={
        
    }
    
    render(){
        return(
            <View style={{...styles.viewTop}}>
                <TouchableOpacity style={{...styles.viewTL}} onPress={()=>{ /*navigation.navigate('/user/home/profile');*/ }}>
                    <Image style={{width:40, height:40, borderRadius:'50%', marginRight:10}} source={{uri: this.props.profilepic}}></Image>
                    <Text style={{fontFamily:'Chakra Petch SemiBold', fontSize:18, color:colors[this.context.theme.mode].text1}}>{this.props.username}</Text>
                </TouchableOpacity>
                
            </View>
        );
    }
}

const styles = StyleSheet.create({
    viewTop: {
        flexDirection:'row', alignItems:'center', justifyContent:'space-between',
        width: Dimensions.get('window').width-30
    },

    viewTL: {
        flexDirection:'row', alignItems:'center', justifyContent:'flex-start',/* borderWidth:1, borderLeftColor:'black'*/
    },
});

export default Header;



/*
    Notification Component

    <TouchableOpacity style={{flexDirection:'row', alignItems:'flex-start', justifyContent:'flex-end', backgroundColor:this.props.screenmode==='dark'?'#828384':'rgba(0,0,0,0)', padding:5, borderRadius:8}} onPress={()=>{navigation.navigate('/user/home/notifications');}}>
                    <Image source={require('./../assets/notification.png')}></Image>
                    <Image style={{position:'absolute', right:5}} source={require('./../assets/reddot.png')}></Image>
                </TouchableOpacity>
*/