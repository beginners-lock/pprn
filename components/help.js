import React, { Component } from 'react';
import { View, Text, Image, Dimensions, TouchableOpacity, TextInput } from 'react-native';
import { ThemeContext } from '../contexts/ThemeContext';
import { colors } from '../config/theme';

class Help extends Component{
    static contextType = ThemeContext;
    state={
        name:'',
        message:'',
    }

    render(){
        return(
            <View style={{height:Dimensions.get('window').height, backgroundColor:colors[this.context.theme.mode].background}}>
                <View style={{display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'flex-start', marginTop:20}}>
                    <TouchableOpacity onPress={()=>{this.props.navigation.navigate('settings');}}>
                    <Image style={{marginLeft:10, width:24, height:24}} source={this.context.theme.mode==='dark'?require('./../assets/gameback-dark.png'):require('./../assets/gameback.png')}></Image>
                    </TouchableOpacity>
                    <Text style={{fontFamily:'Chakra Petch SemiBold', fontSize:24, marginLeft:88, color:colors[this.context.theme.mode].text1}}>{'Help & Support'}</Text>
                </View>
                
                <View style={{width:Dimensions.get('window').width,flexDirection:'column', alignItems:'center', justifyContent:'flex-start'}}>
                    <Text style={{fontFamily:'Chakra Petch SemiBold', fontSize:20, textAlign:'center', marginTop:50, color:colors[this.context.theme.mode].text1}}>Contact Us</Text>
                    
                    <View style={{width:360, marginTop:40}}>
                        <Text style={{fontFamily:'Chakra Petch Regular', fontSize:16, color:colors[this.context.theme.mode].inputlabe1}}>Name</Text>
                        <View style={{marginTop:10, flexDirection:'row', alignItems:'center', justifyContent:'space-between', width:360, flexWrap:'wrap'}}>
                            <TextInput
                                placeholder={'Name'}
                                value={this.state.name}
                                onChangeText={(e)=>{this.setState({name: e});}}
                                style={{width:360, borderRadius:8, height:44, borderWidth:1, borderColor:colors[this.context.theme.mode].inputborder1, fontSize:18, fontFamily:'Chakra Petch Regular', paddingLeft:15, paddingRight:15, color:colors[this.context.theme.mode].text1}}
                            />
                        </View>
                    </View>


                    <View style={{width:360, marginTop:30}}>
                        <Text style={{fontFamily:'Chakra Petch Regular', fontSize:16, color:colors[this.context.theme.mode].inputlabe1}}>Message</Text>
                        <View style={{marginTop:10, flexDirection:'row', alignItems:'center', justifyContent:'space-between', width:360, flexWrap:'wrap'}}>
                            <TextInput
                                editable
                                multiline
                                numberOfLines={6}
                                value={this.state.message}
                                onChangeText={(e)=>{this.setState({message: e});}}
                                style={{width:360, borderRadius:8, borderWidth:1, borderColor:colors[this.context.theme.mode].inputborder1, fontSize:18, fontFamily:'Chakra Petch Regular', padding:15, color:colors[this.context.theme.mode].text1}}
                            />
                        </View>
                    </View>

                    <TouchableOpacity style={{width:Dimensions.get('window').width-36, height:56, flexDirection:'row', alignItems:'center', justifyContent:'center', borderRadius:8, marginTop:90, backgroundColor:colors[this.context.theme.mode].btn1}}>
                        <Text style={{color:'white', fontFamily:'Chakra Petch Regular', fontSize:16}}>Send</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

export default Help;