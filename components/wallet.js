import React, { Component } from 'react';
import { View, Text, StyleSheet, Dimensions, ActivityIndicator, Image, TouchableOpacity} from 'react-native';
import Header from './header';
import VirtualCard from './virtualcard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeContext } from '../contexts/ThemeContext';
import { colors } from '../config/theme';

class Wallet extends Component{
    static contextType = ThemeContext;

    state={
        loading:true,
        userdata: {},
    }

    async componentDidMount(){
        let data = await AsyncStorage.getItem('userdata');
        data = JSON.parse(data);
        
        if(data){
            //A default call to the server to get user details, incase there are any updates
            const defrequest = fetch(
                'https://ppbe01.onrender.com/getuserdata',//"http://localhost:3000/getuserdata",
                {
                    method: 'POST',
                    body: JSON.stringify({userid: data.userid}),
                    headers: { 'Content-Type': 'application/json' }
                }
            ).then(response => {
                return response.json();
            }).then(response => {
                this.setState({userdata: response.data, loading:false}); 
            });
        
        }else{ //We dont know how this person got to this URL so we take them back to first
            await AsyncStorage.multiRemove(['userdata', 'user']);
            router.push({pathname:'/first'})
        }
    }
    
    render(){
        return(
            <View style={{...styles.containerView, backgroundColor:colors[this.context.theme.mode].background}}>
                <ActivityIndicator style={{display:this.state.loading?'flex':'none', position:'absolute', top: Dimensions.get('window').height*0.45,  left: Dimensions.get('window').width*0.48}}></ActivityIndicator>
                <View style={{display:!this.state.loading?'flex':'none', ...styles.mainView}}>
                    <Header
                        navigation={this.props.navigation}
                        username={this.state.userdata.username}
                        profilepic={/*this.state.userdata.profilepic?this.state.userdata.profilepic:*/'https://ppbe01.onrender.com/public/defaultpic.png'/*'http://localhost:3000/public/defaultpic.png'*/}
                    />

                    <Text style={{display:this.state.userdata.email?'none':'flex', marginTop:10, fontFamily:'Chakra Petch SemiBold', fontSize:16, paddingTop:8, paddingBottom:8, paddingLeft:15, paddingRight:15, color:'red', borderRadius:8, borderWidth:2, borderLeftColor:'red', borderRightColor:'red', borderTopColor:'red', borderBottomColor:'red', textAlign:'center'}}>The 'wallet tab' is not accesible to you until you have a verified email</Text>
                    
                    <VirtualCard
                        wallet={this.state.userdata.wallet}
                    />

                    <View style={{flexDirection:'column', alignItems:'flex-start', justifyContent:'flex-start', marginTop:55}}>
                        <TouchableOpacity onPress={()=>{ this.state.userdata.email? this.props.navigation.navigate('deposit') :''; }} style={{width:366, height:80, flexDirection:'row', alignItems:'center', justifyContent:'space-between', borderWidth:1, borderLeftColor:'rgba(0,0,0,0)', borderTopColor:'rgba(0,0,0,0)', borderRightColor:'rgba(0,0,0,0)', borderBottomColor:'#C8D1DB'}}>
                            <View style={{flexDirection:'row', alignItems:'center', justifyContent:'flex-start'}}>
                                <Image style={{marginRight:12, width:40, height:40}} source={this.context.theme.mode==='dark'?require('./../assets/deposit-dark.png'):require('./../assets/deposit.png')}/>
                                <Text style={{fontFamily:'Chakra Petch Regular', color:colors[this.context.theme.mode].text5, fontSize:18}}>Deposit</Text>
                            </View>
                            <Image style={{width:16, height:16}} source={this.context.theme.mode==='dark'?require('./../assets/next-dark.png'):require('./../assets/next.png')}/>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>{ this.state.userdata.email? this.props.navigation.navigate('withdraw') :'';}} style={{width:366, height:80, flexDirection:'row', alignItems:'center', justifyContent:'space-between', borderWidth:1, borderLeftColor:'rgba(0,0,0,0)', borderTopColor:'rgba(0,0,0,0)', borderRightColor:'rgba(0,0,0,0)', borderBottomColor:'#C8D1DB'}}>
                            <View style={{flexDirection:'row', alignItems:'center', justifyContent:'flex-start'}}>
                                <Image style={{marginRight:12, width:40, height:40}} source={this.context.theme.mode==='dark'?require('./../assets/withdraw-dark.png'):require('./../assets/withdraw.png')}/>
                                <Text style={{fontFamily:'Chakra Petch Regular', fontSize:18, color:colors[this.context.theme.mode].text5}}>Withdraw</Text>
                            </View>
                            <Image style={{width:16, height:16}} source={this.context.theme.mode==='dark'?require('./../assets/next-dark.png'):require('./../assets/next.png')}/>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>{ this.state.userdata.email? this.props.navigation.navigate('billpayment') :'';}} style={{width:366, height:80, flexDirection:'row', alignItems:'center', justifyContent:'space-between', borderWidth:1, borderLeftColor:'rgba(0,0,0,0)', borderTopColor:'rgba(0,0,0,0)', borderRightColor:'rgba(0,0,0,0)', borderBottomColor:'#C8D1DB'}}>
                            <View style={{flexDirection:'row', alignItems:'center', justifyContent:'flex-start'}}>
                                <Image style={{marginRight:12, width:40, height:40}} source={this.context.theme.mode==='dark'?require('./../assets/bills-dark.png'):require('./../assets/bills.png')}/>
                                <Text style={{fontFamily:'Chakra Petch Regular', color:colors[this.context.theme.mode].text5, fontSize:18}}>Bill Payments</Text>
                            </View>
                            <Image style={{width:16, height:16}} source={this.context.theme.mode==='dark'?require('./../assets/next-dark.png'):require('./../assets/next.png')}/>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>{ this.state.userdata.email? this.props.navigation.navigate('transactions') :'';}} style={{width:366, height:80, flexDirection:'row', alignItems:'center', justifyContent:'space-between', borderWidth:1, borderLeftColor:'rgba(0,0,0,0)', borderTopColor:'rgba(0,0,0,0)', borderRightColor:'rgba(0,0,0,0)', borderBottomColor:'rgba(0,0,0,0)'}}>
                            <View style={{flexDirection:'row', alignItems:'center', justifyContent:'flex-start'}}>
                                <Image style={{marginRight:12, width:40, height:40}} source={this.context.theme.mode==='dark'?require('./../assets/bills-dark.png'):require('./../assets/bills.png')}/>
                                <Text style={{fontFamily:'Chakra Petch Regular', color:colors[this.context.theme.mode].text5, fontSize:18}}>Transactions</Text>
                            </View>
                            <Image style={{width:16, height:16}} source={this.context.theme.mode==='dark'?require('./../assets/next-dark.png'):require('./../assets/next.png')}/>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    containerView: {
        width: Dimensions.get('window').width, height: Dimensions.get('window').height,
    },

    mainView: {
        width: Dimensions.get('window').width, flex:1, flexDirection: 'column', justifyContent: 'flex-start',
        paddingLeft:15, paddingRight:15, alignItems:'center', paddingTop:20
    },
});

export default Wallet;