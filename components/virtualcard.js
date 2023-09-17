import React, { Component } from 'react';
import { View, Text, Image } from 'react-native';

class VirtualCard extends Component{
    state={
        
    }

    render(){
        return(
            <View style={{position:'relative', flexDirection:'column', alignItems:'center', justifyContent:'flex-start', marginTop:30}}>
                <Image style={{width:360, height:120}} source={require('./../assets/homecard2.png')}></Image>
                <View style={{position: 'absolute', top:20}}>
                    <Image style={{width:380, height:150}} source={require('./../assets/homecard1.png')}></Image>
                    <View style={{position:'absolute', width:382, height:150, flexDirection:'column', alignItems:'center', justifyContent:'flex-start'}}>
                        <Text style={{width:322, marginTop:20, marginBottom:49, fontFamily:'Chakra Petch Regular', fontSize:12, color:'white'}}>Your Wallet</Text>
                        <View style={{width:322, flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
                            <Text style={{fontFamily:'Chakra Petch SemiBold', fontSize:24, color:'white'}}>{'NGN '+this.props.wallet}</Text>
                            <Image style={{width:18, height:23}} source={require('./../assets/homecardwifi.png')}></Image>
                        </View>
                    </View>
                </View>
            </View>
        );
    }
}

export default VirtualCard