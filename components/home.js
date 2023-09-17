import React, { Component } from 'react';
import { View, Text, Image, ScrollView, ActivityIndicator, Dimensions, StyleSheet, TouchableOpacity} from 'react-native';
import Header from './header';
import VirtualCard from './virtualcard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../config/theme';
import { ThemeContext } from '../contexts/ThemeContext';

/* 
    AsyncStorage Structures
    userdata<<<<
    -userid
    -email
    -username
    -fullname
    -wallet
    -picture

*/

class Home extends Component {
    static contextType = ThemeContext;

    state={
        loading: true,
        userdata: {},
    }

    async componentDidMount(){
        //const socket = io('http://localhost:4000');
        let data = await AsyncStorage.getItem('userdata');
        data = JSON.parse(data);
        

        console.log(data && data!==null);
        //If user data is in Async Storage
        if(data && data!==null){
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
                console.log(response.data);
                this.setState({userdata: response.data, loading:false}); 
            });
        
        }else{ //We dont know how this person got to this URL so we take them back to first
            await AsyncStorage.multiRemove(['userdata', 'user']);
            this.props.navigation.navigate('loginacc');
        }
    }

    render(){
        return(
            <ScrollView style={{...styles.mainScrollView, backgroundColor:colors[this.context.theme.mode].background}} contentContainerStyle={{justifyContent:'center', alignItems:'center'}}>
                <ActivityIndicator style={{display:this.state.loading?'flex':'none', position:'absolute', top: Dimensions.get('window').height*0.45,  left: Dimensions.get('window').width*0.48}}></ActivityIndicator>
                <View style={{display:!this.state.loading?'flex':'none', ...styles.mainView}}>
                    <Header
                        username={this.state.userdata.username?this.state.userdata.username:''}
                        profilepic={/*this.state.userdata.profilepic?this.state.userdata.profilepic:*/'https://ppbe01.onrender.com/public/defaultpic.png'}//'http://localhost:3000/public/defaultpic.png'
                    />
                    
                    <VirtualCard
                        wallet={this.state.userdata.wallet?this.state.userdata.wallet:''}
                    />
                    
                    <View style={{width:400, height:80, marginTop:70, flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
                        <TouchableOpacity onPress={()=>{ navigation.navigate('/user/wallet/deposit'); }}>
                        <View style={{width:90, height:80, flexDirection:'column', alignItems:'center', justifyContent:'space-around'}}>
                            <Image style={{width:44, height:44}} source={this.context.theme.mode==='dark'?require('./../assets/deposit-dark.png') : require('./../assets/deposit.png')}></Image>
                            <Text style={{fontFamily:'Chakra Petch Regular', fontSize:12, color:colors[this.context.theme.mode].text2}}>Fund Wallet</Text>
                        </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>{ navigation.navigate('/user/wallet/withdraw'); }}>
                        <View style={{width:90, height:80, flexDirection:'column', alignItems:'center', justifyContent:'space-around'}}>
                            <Image style={{width:44, height:44}} source={this.context.theme.mode==='dark'?require('./../assets/withdraw-dark.png'):require('./../assets/withdraw.png')}></Image>
                            <Text style={{fontFamily:'Chakra Petch Regular', fontSize:12, color:colors[this.context.theme.mode].text2}}>Withdraw Funds</Text>
                        </View>
                        </TouchableOpacity>
                        <TouchableOpacity>
                        <View style={{width:90, height:80, flexDirection:'column', alignItems:'center', justifyContent:'space-around'}}>
                            <Image style={{width:44, height:44}} source={this.context.theme.mode==='dark'?require('./../assets/invite-dark.png'):require('./../assets/invite.png')}></Image>
                            <Text style={{fontFamily:'Chakra Petch Regular', fontSize:12, color:colors[this.context.theme.mode].text2}}>Invite Friends</Text>
                        </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>{ navigation.navigate('/user/wallet/billpayment'); }}>
                        <View style={{width:90, height:80, flexDirection:'column', alignItems:'center', justifyContent:'space-around'}}>
                            <Image style={{width:44, height:44}} source={this.context.theme.mode==='dark'?require('./../assets/bills-dark.png'):require('./../assets/bills.png')}></Image>
                            <Text style={{fontFamily:'Chakra Petch Regular', fontSize:12, color:colors[this.context.theme.mode].text2}}>Bill Payments</Text>
                        </View>
                        </TouchableOpacity>
                    </View>
                    
                    <View style={{marginTop:24, width:382, height:60, flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
                        <TouchableOpacity style={{width:182, height:60, borderRadius:8, backgroundColor:'black', flexDirection:'row', alignItems:'center', justifyContent:'center', borderWidth:1, borderColor:this.context.theme.mode==='dark'?'white':'rgba(0,0,0,0)'}} onPress={()=>{ navigation.navigate('/user/home/creategame'); }}>
                            <Image style={{width:24, height:24}} source={require('./../assets/creategame.png')}></Image>
                            <Text style={{fontFamily:'Chakra Petch Regular', fontSize:14, color:'white', marginLeft:8}}>Create Game</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{width:182, height:60, borderRadius:8, backgroundColor:'#9BF08B', flexDirection:'row', alignItems:'center', justifyContent:'center'}} onPress={()=>{ navigation.navigate('/user/home/joingame'); }}>
                            <Image style={{width:24, height:24}} source={require('./../assets/joingame.png')}></Image>
                            <Text style={{fontFamily:'Chakra Petch Regular', fontSize:14, color:'black', marginLeft:8}}>Join Game</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{marginTop:40, width:383}}>
                        <Text style={{fontFamily:'Chakra Petch Regular', fontSize:16, color:'#928E8E', marginBottom:7}}>Transactions</Text>
                        <View style={{marginTop:15, flexDirection:'column', alignItems:'flex-start', justifyContent:'flex-start'}}>
                            <Text style={{color:'#928E8E', fontFamily:'Chakra Petch Regular', fontSize:12}}>Today</Text>
                            <View style={{ width:383, height:83, flexDirection:'row', justifyContent:'space-between', alignItems:'center', borderWidth:1, borderBottomColor:'#E6F1FE', borderTopColor:'white', borderLeftColor:'white', borderRightColor:'white', }}>
                                <View style={{flexDirection:'row', alignItems:'center', justifyContent:'flex-start'}}>
                                    <Image style={{marginRight:8, width:47, height:47}} source={require('./../assets/staketrans.png')}></Image>
                                    <View style={{flexDirection:'column', alignItems:'flex-start', justifyContent:'center'}}>
                                        <Text style={{fontFamily:'Chakra Petch Regular', fontSize:14, color:colors[this.context.theme.mode].text1}}>Bet Transaction</Text>
                                        <Text style={{fontFamily:'Chakra Petch Regular', fontSize:13, marginTop:3, color:'#4285F4'}}>Staked NGN 50</Text>
                                    </View>
                                </View>
                                <Text style={{fontFamily:'Chakra Petch Regular', color:'#928E8E', fontSize:12}}>11:59</Text>
                            </View>
                        </View>
                        <View style={{marginTop:15, flexDirection:'column', alignItems:'flex-start', justifyContent:'flex-start'}}>
                            <Text style={{color:'#928E8E', fontFamily:'Chakra Petch Regular', fontSize:12}}>27/07/2023</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    mainScrollView: {
        width: Dimensions.get('window').width, height: Dimensions.get('window').height,
    },

    mainView: {
        width: Dimensions.get('window').width, flex:1, flexDirection: 'column', justifyContent: 'flex-start',
        paddingLeft:15,  paddingRight:15, alignItems:'center', paddingTop:20
    },

    viewTop: {
        flexDirection:'row', alignItems:'center', justifyContent:'space-between',
        width: Dimensions.get('window').width-30,
    },

    viewTL: {
        flexDirection:'row', alignItems:'center', justifyContent:'flex-start',/* borderWidth:1, borderLeftColor:'black'*/
    },

    dates: {

    },
});

export default Home;