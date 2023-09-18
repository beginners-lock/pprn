import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Dimensions, ActivityIndicator, Image, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { io } from 'socket.io-client';
import { ThemeContext } from '../contexts/ThemeContext';
import { colors } from '../config/theme';

class DecisionRoom2 extends Component{
    static contextType = ThemeContext;

    constructor(props){
        super(props);
        this.scrollViewRef = React.createRef();
    }

    state={
        myvote: '',
        loading:true,
        reqloading:false,
        details:'hide',
        game: {},
        userdata: {},
        socket:'',
        winner:'',
        adnum: '',
        modal1: 'none',
        modal2: 'none',
        outcomewarning: ''
    }

    async componentDidMount(){
        this.setState({loading: true});
        console.log(this.state.loading);
        let data = await AsyncStorage.getItem('userdata');
        data = JSON.parse(data);

        let gameid = await AsyncStorage.getItem('gameid');
        console.log('gameid>>'+gameid);
        if(gameid && gameid!=='undefined' && gameid!=='null'){
            //If user data is in Async Storage
            if(data && data!==null){
                //Check if user is an imposter in the waiting room and also get userdata
                const defrequest = fetch(
                    'https://ppbe01.onrender.com/drimpostercheck2',//"http://localhost:3000/drimpostercheck2",
                    {
                        method: 'POST',
                        body: JSON.stringify({userid: data.userid, gameid: gameid}),
                        headers: { 'Content-Type': 'application/json' }
                    }
                ).then(response => {
                    return response.json();
                }).then(async response => {
                    if(response.imposter){//User is an imposter or and error happened while loading this screen
                        await AsyncStorage.removeItem('gameid');
                        this.setState({loading: false});
                        this.props.navigation.navigate('home');
                    }else{

                        const socket = io('wss://ppbe01.onrender.com'/*'http://localhost:4000'*/);
                        socket.emit('enterdecisionroom', response.game.gameid);

                        socket.on(response.game.gameid+'gamecancelled', async (arg)=>{
                            await AsyncStorage.removeItem('gameid');
                            this.setState({reqloading:false});
                            this.props.navigation.navigate('home');
                        });

                        socket.on(response.game.gameid+'admindecided', async (arg)=>{
                            console.log('admindecided');
                            await AsyncStorage.removeItem('gameid');
                            this.setState({reqloading:false});
                            this.props.navigation.navigate('home');
                        });
                        
                        this.setState({loading:false, game: response.game, userdata: response.user, socket:socket});
                    }
                });
            }else{
                await AsyncStorage.multiRemove(['userdata', 'user']);
                router.push({pathname:'/first'});
            }

        }else{
            this.props.navigation.navigate('home')
        }
    }

    detailstoggle = (arg) => {
        console.log(arg);
        if(arg==='show'){
            this.scrollViewRef.current?.scrollTo({ x: Dimensions.get('window').width * 1, animated: true});
        }else{
            this.scrollViewRef.current?.scrollTo({ x: 0, animated: true});
        }
    }

    confirmdecision = () => {
        this.setState({modal2: 'none', reqloading:true});

        fetch(
            'https://ppbe01.onrender.com/admindecision',//"http://localhost:3000/admindecision",
            {
                method: 'POST',
                body: JSON.stringify({decision: this.state.adnum, gameid: this.state.game.gameid}),
                headers: { 'Content-Type': 'application/json' }
            }
        ).then(response => {
            return response.json();
        }).then(async response => {
            if(response.msg!=='success'){
                this.setState({reqloading:false, outcomewarning: response.msg})
            }
        });
    }

    cancelgame = () => {
        this.setState({modal1: 'none', reqloading:true, outcomewarning:''});
        fetch(
            'https://ppbe01.onrender.com/cancelgame2',//"http://localhost:3000/cancelgame2",
            {
                method: 'POST',
                body: JSON.stringify({userid: this.state.userdata.userid, gameid: this.state.game.gameid}),
                headers: { 'Content-Type': 'application/json' }
            }
        ).then(response => {
            return response.json();
        }).then(async response => {

        });
    }

    render(){
        return(
            <View style={{width:Dimensions.get('window').width, height:Dimensions.get('window').height, backgroundColor:colors[this.context.theme.mode].background}}>
                <ActivityIndicator style={{display:this.state.loading?'flex':'none', marginTop:Dimensions.get('window').height*0.45}}></ActivityIndicator>
                <View style={{display:!this.state.loading?'flex':'none', flexDirection:'row', alignItems:'center', justifyContent:'flex-start', marginTop:20}}>
                    <TouchableOpacity onPress={async ()=>{ this.state.socket.emit('leavedecisionroom', this.state.game.gameid); await AsyncStorage.removeItem('gameid');  this.props.navigation.navigate('home');}}>
                    <Image style={{marginLeft:10, width:24, height:24}} source={this.context.theme.mode==='dark'?require('./../assets/gameback-dark.png'):require('./../assets/gameback.png')}></Image>
                    </TouchableOpacity>
                    <Text style={{fontFamily:'Chakra Petch SemiBold', fontSize:24, marginLeft:88, color:colors[this.context.theme.mode].text1}}>Decision Room</Text>
                </View>
                
                <ScrollView ref={this.scrollViewRef} style={{ overflowX: 'none', maxHeight:Dimensions.get('window').height*0.9, backgroundColor:colors[this.context.theme.mode].background}} 
                    showsHorizontalScrollIndicator={false} horizontal decelerationRate={0} snapToInterval={Dimensions.get('window').width} snapToAlignment={"center"} scrollEnabled={false}>

                    <View style={{display:this.state.game.creatorid? !this.state.loading && this.state.game.creatorid===this.state.userdata.userid ?'flex':'none':'none', backgroundColor:colors[this.context.theme.mode].background, width:Dimensions.get('window').width, height:Dimensions.get('window').height*0.9, padding:24}}>
                        <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between', width:Dimensions.get('window').width*0.9}}>
                            <Text style={{fontFamily:'Chakra Petch SemiBold', fontSize:22, color:colors[this.context.theme.mode].text1}}>
                                Admin Decision
                            </Text>
                            <TouchableOpacity onPress={()=>{this.detailstoggle('show');}}>
                                <Text style={{fontSize:14, fontFamily:'Chakra Petch Regular', color:'#4285F4'}}>Game Details</Text>
                            </TouchableOpacity>
                        </View>   

                        <Text style={{fontFamily:'Chakra Petch Regular', fontSize:18, color:colors[this.context.theme.mode].text1, marginTop:15}}>
                            What was the outcome of the game?
                        </Text>

                        <Text style={{display:this.state.game.creatorid?this.state.game.creatorid===this.state.userdata.userid?'flex':'none':'none', color:'red', fontFamily:'Chakra Petch Regular', fontSize:16, marginTop:10, textAlign:'center' }}>
                            As the game admin, it is your duty to input the final outcome of the game which would decide the winners and losers. Please be impartial and completely fair in your choice.
                        </Text> 

                        <View style={{flexDirection:'column', alignItems:'center', justifyContent:'space-around', width:Dimensions.get('window').width-48}}>
                            <TouchableOpacity style={{ backgroundColor:'rgba(15,25,166,0.3)', borderRadius:6, padding:14, marginTop:15, width:320, alignItems:'center', borderWidth:1, borderColor:this.state.adnum===1?'yellow':'rgba(0,0,0,0)'}} onPress={()=>{ this.setState({adnum:1}); }}>
                                <Text style={{fontFamily:'Chakra Petch Regular', fontSize:18, color:this.context.theme.mode==='dark'?'rgb(60,100,255)':'#0F19A6'}}>{this.state.game.availablewagers?this.state.game.availablewagers[0].slice(0, -4)+'won':''}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{backgroundColor:'rgba(244,25,25,0.3)', borderRadius:6, padding:14, marginTop:15, width:320, alignItems:'center', borderWidth:1, borderColor:this.state.adnum===2?'yellow':'rgba(0,0,0,0)'}} onPress={()=>{ this.setState({adnum:2}); }}>
                                <Text style={{fontFamily:'Chakra Petch Regular', fontSize:18, color:this.context.theme.mode==='dark'?'rgb(255,80,80)':'#F41919'}}>{this.state.game.availablewagers?this.state.game.availablewagers[1].slice(0, -4)+'won':''}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{display:this.state.game.availablewagers?this.state.game.availablewagers.length>2?'flex':'none':'none', backgroundColor:'rgba(146,142,142,0.3)', borderRadius:6, padding:14, marginTop:15, width:320, alignItems:'center', borderWidth:1, borderColor:this.state.adnum===3?'yellow':'rgba(0,0,0,0)'}} onPress={()=>{ this.setState({adnum:3}); }}>
                                <Text style={{fontFamily:'Chakra Petch Regular', fontSize:18, color:'#928E8E'}}>{this.state.game.availablewagers?this.state.game.availablewagers.length>2?'Ended as draw':'':''}</Text>
                            </TouchableOpacity>
                        </View>  

                        <View style={{width:Dimensions.get('window').width-48, alignItems:'center', marginTop:60}}>
                            <Text style={{color:'red', width:Dimensions.get('window').width-48, textAlign:'center', fontFamily:'Chakra Petch Regular'}}>{this.state.outcomewarning}</Text>
                            <TouchableOpacity style={{width:Dimensions.get('window').width*0.8, height:56, flexDirection:'row', alignItems:'center', justifyContent:'center', borderRadius:6, backgroundColor:this.state.adnum!==''?'#1E9E40':'#928E8E', marginTop:10}} onPress={()=>{ this.state.adnum!=='' && !this.state.reqloading ? this.setState({modal2:'flex', outcomewarning:''}) : this.setState({outcomewarning:'An outcome must be selected to decide the winner(s)'}); }}>
                                <ActivityIndicator style={{display:this.state.reqloading?'flex':'none'}} color='white'></ActivityIndicator>
                                <Text style={{display:!this.state.reqloading?'flex':'none', color:'white', fontFamily:'Chakra Petch Regular', fontSize:16}}>Confirm Decision</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{width:Dimensions.get('window').width*0.8, height:56, flexDirection:'row', alignItems:'center', justifyContent:'center', borderRadius:6, backgroundColor:'red', marginTop:15}} onPress={()=>{!this.state.reqloading ? this.setState({modal1:'flex'}):'';}}>
                                <ActivityIndicator style={{display:this.state.reqloading?'flex':'none'}} color='white'></ActivityIndicator>
                                <Text style={{display:!this.state.reqloading?'flex':'none', color:'white', fontFamily:'Chakra Petch Regular', fontSize:16}}>Cancel Game</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={{display:this.state.game.creatorid? !this.state.loading && this.state.game.creatorid!==this.state.userdata.userid ?'flex':'none':'none', backgroundColor:colors[this.context.theme.mode].background, width:Dimensions.get('window').width, height:Dimensions.get('window').height*0.9, padding:24}}>
                            <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between', width:Dimensions.get('window').width*0.9}}>
                                <Text style={{fontFamily:'Chakra Petch SemiBold', fontSize:17, color:colors[this.context.theme.mode].text1, width:250 }}>
                                    
                                </Text>
                                <TouchableOpacity onPress={()=>{this.detailstoggle('show');}}>
                                    <Text style={{fontSize:14, fontFamily:'Chakra Petch Regular', color:'#4285F4'}}>Game Details</Text>
                                </TouchableOpacity>
                            </View> 
                            
                            <Text style={{fontFamily:'Chakra Petch Regular', fontSize:18, color:colors[this.context.theme.mode].text1, textAlign:'center', width:Dimensions.get('window').width-48, marginTop:Dimensions.get('window').height*0.28}}>Awaiting the decision of the game admin. Please be patient...</Text>
                    </View>

                    <View style={{display:!this.state.loading?'flex':'none', backgroundColor:colors[this.context.theme.mode].background, width:Dimensions.get('window').width, height:Dimensions.get('window').height*0.9}}>
                        <View style={{width:Dimensions.get('window').width, padding:24, flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
                            <Text style={{fontFamily:'Chakra Petch SemiBold', fontSize:18, color:colors[this.context.theme.mode].text1}}>Game Details</Text>
                            <TouchableOpacity onPress={()=>{this.detailstoggle('hide');}}>
                                <Text style={{fontFamily:'Chakra Petch Regular', fontSize:14, color:'#4285F4'}}>Hide Details</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{paddingLeft:24, paddingRight:24, paddingTop:20, borderTopColor:'#928E8E', borderLeftColor:'rgba(0,0,0,0)', borderRightColor:'rgba(0,0,0,0)', borderBottomColor:'rgba(0,0,0,0)', borderWidth:1}}>
                            <Text style={{fontFamily:'Chakra Petch SemiBold', fontSize:18, color:colors[this.context.theme.mode].text1}}>{this.state.game.gameid ? 'Game ID: '+this.state.game.gameid : 'Game ID:'}</Text>
                            <Text style={{fontFamily:'Chakra Petch SemiBold', fontSize:20, color:colors[this.context.theme.mode].text1, marginTop:20}}>Game Title</Text>
                            <Text style={{fontFamily:'Chakra Petch Regular', fontSize:18, color:colors[this.context.theme.mode].text1, marginTop:8}}>{this.state.game.gametitle ? this.state.game.gametitle : ''}</Text>
                            <Text style={{fontFamily:'Chakra Petch SemiBold', fontSize:20, color:colors[this.context.theme.mode].text1, marginTop:20}}>Game Description</Text>
                            <Text style={{fontFamily:'Chakra Petch Regular', fontSize:16, color:colors[this.context.theme.mode].text1, marginTop:8}}>{this.state.game.gamedesc ? this.state.game.gamedesc : ''}</Text>
                            <Text style={{fontFamily:'Chakra Petch SemiBold', fontSize:20, color:colors[this.context.theme.mode].text1, marginTop:20}}>{this.state.game.bettype==='h2h' ? 'Head 2 Head' : 'Admin'}</Text>
                            <Text style={{fontFamily:'Chakra Petch SemiBold', fontSize:22, color:this.context.theme.mode==='dark'?'rgb(40, 120, 20)':'#124D07', marginTop:20}}>{'NGN '+this.state.game.stake}</Text>
                        </View> 

                        <Text style={{fontFamily:'Chakra Petch Regular', color:colors[this.context.theme.mode].text1, fontSize:18, paddingLeft:24, marginTop:10, marginBottom:15}}>
                            {this.state.game.wagersidlist? ('Number of stakers: '+ this.state.game.wagersidlist.length) : ''}
                        </Text>

                        <View style={{flexDirection:'row', alignItems:'flex-start', justifyContent:'space-around'}}>
                            <TouchableOpacity style={{ backgroundColor:'rgba(15,25,166,0.3)', borderRadius:6, padding:10, paddingLeft:15, paddingRight:15, paddingTop:8, paddingBottom:8, marginTop:10}}>
                                <Text style={{fontFamily:'Chakra Petch Regular', fontSize:16, color:this.context.theme.mode==='dark'?'rgb(60,100,255)':'#0F19A6'}}>{this.state.game.availablewagers?this.state.game.availablewagers[0]:''}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{backgroundColor:'rgba(244,25,25,0.3)', borderRadius:6, padding:10, paddingLeft:15, paddingRight:15, paddingTop:8, paddingBottom:8,  marginTop:10}}>
                                <Text style={{fontFamily:'Chakra Petch Regular', fontSize:16, color:this.context.theme.mode==='dark'?'rgb(255,80,80)':'#F41919'}}>{this.state.game.availablewagers?this.state.game.availablewagers[1]:''}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{display:this.state.game.availablewagers?this.state.game.availablewagers.length>2?'flex':'none':'none', backgroundColor:'rgba(146,142,142,0.3)', borderRadius:6, padding:10, paddingLeft:15, paddingRight:15, paddingTop:8, paddingBottom:8, marginTop:10}}>
                                <Text style={{fontFamily:'Chakra Petch Regular', fontSize:16, color:'#928E8E'}}>{this.state.game.availablewagers?this.state.game.availablewagers.length>2?this.state.game.availablewagers[2]:'':''}</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={{marginTop:25, paddingLeft:24}}>
                            <Text style={{fontFamily:'Chakra Petch Regular', fontSize:18, color:'white'}}>My Stake</Text>
                            <Text style={{fontFamily:'Chakra Petch Regular', fontSize:22, color:'white', marginTop:8}}>{this.state.game.wagersidlist? this.state.game.wagerschoices[this.state.game.wagersidlist.indexOf(this.state.userdata.userid)] : ''}</Text>
                        </View>   
                    </View>
                </ScrollView>

                <View style={{display:this.state.modal1, position:'absolute', top:0, left:0, width:Dimensions.get('window').width, height:Dimensions.get('window').height, backgroundColor:'rgba(0,0,0,0.8)', flexDirection:'column', alignItems:'center'}}>
                    <View style={{marginTop:Dimensions.get('window').height*0.35, backgroundColor:'rgb(30, 30, 30)', width:Dimensions.get('window').width*0.8, borderRadius:8, padding:24, flexDirection:'column', alignItems:'center'}}>
                        <Text style={{textAlign:'center', fontFamily:'Chakra Petch Regular', fontSize:16, color:'white'}}>
                            {'Are you sure you want to cancel this game?'}
                        </Text>
                        <View style={{marginTop:30, width:Dimensions.get('window').width*0.6, flexDirection:'row', alignItems:'center', justifyContent:'space-between' }}>
                            <TouchableOpacity style={{borderRadius:6, paddingTop:8, paddingBottom:8,paddingLeft:25,paddingRight:25, backgroundColor:'#1E9E40'}} onPress={()=>{this.cancelgame();}}>
                                <Text style={{color:'white', fontSize:16, fontFamily:'Chakra Petch Regular'}}>Yes</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{borderRadius:6, paddingTop:8, paddingBottom:8,paddingLeft:25,paddingRight:25, backgroundColor:'red'}} onPress={()=>{this.setState({modal1:'none'})}}>
                                <Text style={{color:'white', fontSize:16, fontFamily:'Chakra Petch Regular'}}>No</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                <View style={{display:this.state.modal2, position:'absolute', top:0, left:0, width:Dimensions.get('window').width, height:Dimensions.get('window').height, backgroundColor:'rgba(0,0,0,0.8)', flexDirection:'column', alignItems:'center'}}>
                    <View style={{marginTop:Dimensions.get('window').height*0.35, backgroundColor:'rgb(30, 30, 30)', width:Dimensions.get('window').width*0.8, borderRadius:8, padding:24, flexDirection:'column', alignItems:'center'}}>
                        <Text style={{textAlign:'center', fontFamily:'Chakra Petch Regular', fontSize:16, color:'white'}}>
                            {'Are you sure this was the outcome of the game?\nThis action cannot be undone and would decide the winner of this game'}
                        </Text>
                        <View style={{marginTop:30, width:Dimensions.get('window').width*0.6, flexDirection:'row', alignItems:'center', justifyContent:'space-between' }}>
                            <TouchableOpacity style={{borderRadius:6, paddingTop:8, paddingBottom:8,paddingLeft:25,paddingRight:25, backgroundColor:'#1E9E40'}} onPress={()=>{this.confirmdecision();}}>
                                <Text style={{color:'white', fontSize:16, fontFamily:'Chakra Petch Regular'}}>Yes</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{borderRadius:6, paddingTop:8, paddingBottom:8,paddingLeft:25,paddingRight:25, backgroundColor:'red'}} onPress={()=>{this.setState({modal2:'none'})}}>
                                <Text style={{color:'white', fontSize:16, fontFamily:'Chakra Petch Regular'}}>No</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        );
    }
}

export default DecisionRoom2;