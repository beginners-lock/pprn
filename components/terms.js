import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions, CheckBox } from 'react-native';
import { ThemeContext } from '../contexts/ThemeContext';
import { colors } from '../config/theme';

class Terms extends Component{
    static contextType = ThemeContext;
    state={
        agree: false,
    }

    render(){
        return(
            <View style={{height:Dimensions.get('window').height, backgroundColor:colors[this.context.theme.mode].background}}>
                <View style={{display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'flex-start', marginTop:20}}>
                    <TouchableOpacity onPress={()=>{this.props.navigation.navigate('settings');}}>
                    <Image style={{marginLeft:10, width:24, height:24}} source={this.context.theme.mode==='dark'?require('./../assets/gameback-dark.png'):require('./../assets/gameback.png')}></Image>
                    </TouchableOpacity>
                    <Text style={{fontFamily:'Chakra Petch SemiBold', fontSize:24, marginLeft:88, color:this.context.theme.mode==='dark'?'white':'black'}}>{'Terms & Policies'}</Text>
                </View>
                <View style={{marginTop:50, flexDirection:'column', alignItems:'center', justifyContent:'flex-start', width:Dimensions.get('window').width, paddingLeft:24, paddingRight:24}}>
                    <Text style={{textAlign:'center', fontFamily:'Chakra Petch Regular', color:colors[this.context.theme.mode].inputlabel1}}>
                        Dorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur tempus urna at turpis condimentum lobortis.
                    </Text>

                    <View style={{flexDirection:'row', alignItems:'center', justifyContent:'flex-start', marginTop:50}}>
                        <CheckBox
                            value={this.state.agree}
                            onValueChange={e=>{this.setState({agree:e});}}
                        />
                        <Text style={{fontFamily:'Chakra Petch Regular', fontSize:16, marginLeft:8, color:colors[this.context.theme.mode].text1}}>I agree to the terms and policies</Text>
                    </View>


                    <TouchableOpacity style={{width:Dimensions.get('window').width-36, height:56, flexDirection:'row', alignItems:'center', justifyContent:'center', borderRadius:8, marginTop:120, backgroundColor:this.context.theme.mode==='dark'?'#1E9E40':'rgba(11,11,11,0.4)'}}>
                        <Text style={{color:'white', fontFamily:'Chakra Petch Regular', fontSize:16}}>Done</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

export default Terms;