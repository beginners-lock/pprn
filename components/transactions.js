import React, { Component } from 'react';
import { View, Text, Image, ScrollView, Dimensions, ActivityIndicator, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { ThemeContext } from '../contexts/ThemeContext';
import { colors } from '../config/theme';

class Transactions extends Component{
    static contextType = ThemeContext;

    state = {
        loading: true,
        transactions: [],
        transactiontab: 'Deposit',
        transactionerror: '',
        userdata: []
    }

    async componentDidMount(){
        let userdata = await AsyncStorage.getItem('userdata');
        this.setState({transactiontab: 'Deposit', userdata: userdata});
        this.getTransHistory('Deposit');
    }

    getTransHistory = (tab) => {
        this.setState({transactionerror:'', loading:true, transactiontab: tab})
        let url = tab==='Deposit' ? 'https://ppbe01.onrender.com/deposithistory' : 'https://ppbe01.onrender.com/withdrawalhistory';//"http://localhost:3000/deposithistory" : "http://localhost:3000/withdrawalhistory";
        fetch(
            url,
            {
                method: 'POST',
                body: JSON.stringify({userid: this.state.userdata.userid}),
                headers: { 'Content-Type': 'application/json' }
            }
        ).then(response => {
            return response.json();
        }).then(response => {
            if(response.msg === 'success'){
                this.setState({transactions: response.data, loading:false });
            }else{
                this.setState({transactionerror: response.msg, transactions: []});
            }
        });
    }

    render(){
        return(
            <View style={{backgroundColor:colors[this.context.theme.mode].background, width:Dimensions.get('window').width, height:Dimensions.get('window').height*0.94, padding:24,  borderWidth:1, borderColor:'black', alignItems:'center'}}>
                <View style={{display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'flex-start', width:Dimensions.get('window').width*0.9}}>
                    <TouchableOpacity onPress={()=>{this.props.navigation.navigate('wallet');}}>
                        <Image style={{marginLeft:10, width:24, height:24}} source={this.context.theme.mode==='dark'?require('./../assets/gameback-dark.png'):require('./../assets/gameback.png')}></Image>
                    </TouchableOpacity>
                    <Text style={{fontFamily:'Chakra Petch SemiBold', marginLeft:88, fontSize:20, width:Dimensions.get('window').width*0.9, color:colors[this.context.theme.mode].text1}}>Transactions</Text>
                </View>
                <View style={{width:Dimensions.get('window').width*0.9, flexDirection:'row', alignItems:'center', justifyContent:'space-around', marginTop:20}}>
                    <TouchableOpacity onPress={()=>{this.getTransHistory('Deposit')}}>
                        <Text style={{width:Dimensions.get('window').width*0.3, textAlign:'center', paddingBottom:5, fontFamily:'Chakra Petch SemiBold', fontSize:16, color:this.state.transactiontab==='Deposit'?'#1E9E40':'rgb(200, 200, 200)', borderWidth:3, borderLeftColor:'rgba(0,0,0,0)', borderRightColor:'rgba(0,0,0,0)', borderTopColor:'rgba(0,0,0,0)', borderBottomColor:this.state.transactiontab==='Deposit'?'#1E9E40':'rgba(0,0,0,0)'}}>Deposits</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>{this.getTransHistory('Withdrawal')}}>
                        <Text style={{width:Dimensions.get('window').width*0.3, textAlign:'center', paddingBottom:5, fontFamily:'Chakra Petch SemiBold', fontSize:16, color:this.state.transactiontab==='Withdrawal'?'#1E9E40':'rgb(200, 200, 200)', borderWidth:3, borderLeftColor:'rgba(0,0,0,0)', borderRightColor:'rgba(0,0,0,0)', borderTopColor:'rgba(0,0,0,0)', borderBottomColor:this.state.transactiontab==='Withdrawal'?'#1E9E40':'rgba(0,0,0,0)'}}>Withdrawals</Text>
                    </TouchableOpacity>
                </View>
                <ActivityIndicator style={{display:this.state.loading?'flex':'none', marginTop:Dimensions.get('window').height*0.3}}></ActivityIndicator>
                <Text style={{display:this.state.transactionerror!=='' && !this.state.loading?'flex':'none', color:'red', fontFamily:'Chakra Petch Regular', fontSize:16, marginTop:10}}></Text>
                <ScrollView style={{display:this.state.transactionerror==='' && !this.state.loading?'flex':'none', marginTop:10, width:Dimensions.get('window').width, paddingLeft:20, paddingRight:20, display:!this.state.loading?'flex':'none'}} contentContainerStyle={{alignItems:'center'}}>
                    {
                        this.state.transactions.length===0?
                            <Text style={{fontFamily:'Chakra Petch SemiBold', fontSize:18, marginTop:20, color:colors[this.context.theme.mode].text1}}>{"You don't have any "+this.state.transactiontab.toLowerCase()+" transactions"}</Text>
                        :   this.state.transactions.map((transaction, index) => {
                                return(
                                    <View key={this.state.transactiontab+index} style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between', width: Dimensions.get('window').width*0.9, height:50, borderWidth:1, borderLeftColor:'rgba(0,0,0,0)', borderTopColor:'rgba(0,0,0,0)', borderRightColor:'rgba(0,0,0,0)', borderBottomColor:'#C8D1DB'}}>
                                        <Text style={{width:Dimensions.get('window').width*0.3, color:'grey', fontFamily:'Chakra Petch SemiBold'}}>{transaction.timesent?transaction.timesent:'01 Jan 2023 00:00'}</Text>
                                        <Text style={{width:Dimensions.get('window').width*0.3, textAlign:'center', color:'#4285F4', fontFamily:'Chakra Petch SemiBold'}}>{'NGN '+transaction.amount}</Text>
                                        <Text style={{width:Dimensions.get('window').width*0.25, textAlign:'center',  paddingTop:5, paddingBottom:5, borderRadius:40, fontFamily:'Chakra Petch SemiBold',
                                            backgroundColor:transaction.status==='pending'?'rgba(220, 180, 0, 0.2)': transaction.status==='cancelled'?'rgba(200, 50, 50, 0.2)':'rgba(50, 200, 100, 0.3)', 
                                            color:transaction.status==='pending'?'rgb(220, 180, 100)': transaction.status==='cancelled'?'rgb(200, 50, 50)':'rgb(50, 200, 100)'}}>{transaction.status}</Text>
                                    </View>
                                );
                            })
                    }
                </ScrollView>
            </View>
        );
    }
}

export default Transactions;