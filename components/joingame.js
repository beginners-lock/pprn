import React, { Component }  from 'react';
import { View, Text, ScrollView, ActivityIndicator, Image, TextInput, TouchableOpacity, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeContext } from '../contexts/ThemeContext';
import { colors } from '../config/theme';

class JoinGame extends Component{
    static contextType = ThemeContext;

    state={
        loading:true,
        gameid:'',
        gameidwarning:'',
        userdata: {},
        reqloading: false,
        gameloaded: false,
        stakereqloading: false,
        game:{},
        loadgamewarning:'',
        joingamewarning:'',
        mystake: '',
        mystakewarning: '',
        mystakecolor: ''
    }

    async componentDidMount(){
        this.setState({loading:true});
        let data = await AsyncStorage.getItem('userdata');
        data = JSON.parse(data);
        //If user data is in Async Storage
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
                console.log(response.data);
                this.setState({userdata: response.data, loading:false}); 
            });
        
        }else{ //We dont know how this person got to this URL so we take them back to first
            await AsyncStorage.multiRemove(['userdata', 'user']);
            router.push({pathname:'/first'})
        }
    }

    loadGame = () => {
        this.setState({idinputwarning:'', loadgamewarning:'', gameloaded:false, joingamewarning:''});
        if(this.state.gameid){
            this.setState({reqloading: true});

            fetch(
                'https://ppbe01.onrender.com/loadgame',//"http://localhost:3000/loadgame",
                {
                    method: 'POST',
                    body: JSON.stringify({gameid: this.state.gameid}),
                    headers: { 'Content-Type': 'application/json' }
                }
            ).then(response => {
                return response.json();
            }).then(async response => {
                console.log(response);
                if(response.msg === 'success'){
                    //For head 2 head games
                    if(response.game.bettype==='h2h'){
                        if(response.game.wagersidlist.length>1){
                            this.setState({joingamewarning: 'This is a Head 2 Head game and there are already 2 stakes'});
                        }

                        if(response.game.wagersidlist.includes(this.state.userdata.userid)){
                            this.setState({joingamewarning: 'You have already staked in this game'});
                            await AsyncStorage.setItem('gameid', this.state.gameid);
                            this.props.navigation.navigate('waitingroom');
                        }

                        if(parseInt(response.game.stake)>parseInt(this.state.userdata.wallet)){
                            this.setState({joingamewarning: 'Your wallet balance is insufficient to stake in this game'});
                        }

                        this.setState({game: response.game, reqloading:false, gameloaded:true});
                    }
                    
                    if(response.game.bettype === 'admin'){
                        if(response.game.creatorid === this.state.userdata.userid){
                            this.setState({joingamewarning: 'You are the admin in this game'});
                            await AsyncStorage.setItem('gameid', this.state.gameid);
                            this.props.navigation.navigate('waitingroom2');
                        }

                        if(response.game.wagersidlist.includes(this.state.userdata.userid)){
                            this.setState({joingamewarning: 'You have already staked in this game'});
                            await AsyncStorage.setItem('gameid', this.state.gameid);
                            this.props.navigation.navigate('waitingroom2');
                        }

                        if(parseInt(response.game.stake)>parseInt(this.state.userdata.wallet)){
                            this.setState({joingamewarning: 'Your wallet balance is insufficient to stake in this game'});
                        }

                        this.setState({game: response.game, reqloading:false, gameloaded:true});
                    }
                }else{
                    this.setState({loadgamewarning: response.msg, reqloading:false});
                }
            });
        }else{
            this.setState({idinputwarning:'This field cannot be empty'});
        }
    }

    stake = () => {
        if(this.state.game.bettype==='h2h'){ //If the game loaded is a head 2 head game
            this.setState({stakereqloading: true});

            fetch(
                'https://ppbe01.onrender.com/stake',//"http://localhost:3000/stake",
                {
                    method: 'POST',
                    body: JSON.stringify({gameid: this.state.gameid, userid: this.state.userdata.userid, username: this.state.userdata.username, mystake:this.state.mystake}),
                    headers: { 'Content-Type': 'application/json' }
                }
            ).then(response => {
                return response.json();
            }).then(async response => {
                if(response.msg === 'success'){
                    await AsyncStorage.setItem('gameid', this.state.gameid);
                    this.props.navigation.navigate('waitingroom');
                }else{
                    this.setState({stakereqloading: false, joingamewarning:response.msg});                
                }
            });
        }else{ //If the game loaded is an admin type game
            
            this.setState({mystakewarning: ''});
            if(this.state.mystake!==''){
                this.setState({stakereqloading: true});
    
                fetch(
                    'https://ppbe01.onrender.com/stake',//"http://localhost:3000/stake",
                    {
                        method: 'POST',
                        body: JSON.stringify({gameid: this.state.gameid, userid: this.state.userdata.userid, username: this.state.userdata.username, mystake:this.state.mystake}),
                        headers: { 'Content-Type': 'application/json' }
                    }
                ).then(response => {
                    return response.json();
                }).then(async response => {
                    if(response.msg === 'success'){
                        await AsyncStorage.setItem('gameid', this.state.gameid);
                        this.props.navigation.navigate('waitingroom2');
                    }else{
                        this.setState({stakereqloading: false, joingamewarning:response.msg});                
                    }
                });
    
            }else{
                this.setState({mystakewarning: 'A wager option must be selected in order to stake on this game.'})
            }   
        }
    }

    render(){
        return(
            <View style={{flexDirection:'column', alignItems:'flex-start', justifyContent:'flex-start', backgroundColor:colors[this.context.theme.mode].background, width:Dimensions.get('window').width, height:Dimensions.get('window').height}}>
                <ActivityIndicator style={{display:this.state.loading?'flex':'none', position:'absolute', top: Dimensions.get('window').height*0.45,  left: Dimensions.get('window').width*0.48}}></ActivityIndicator>
                <View style={{display:!this.state.loading?'flex':'none', flexDirection:'row', alignItems:'center', justifyContent:'flex-start', marginTop:20}}>
                    <TouchableOpacity onPress={()=>{this.props.navigation.navigate('home');}}>
                    <Image style={{marginLeft:10, width:24, height:24}} source={this.context.theme.mode==='dark' ? require('./../assets/gameback-dark.png') : require('./../assets/gameback.png')}></Image>
                    </TouchableOpacity>
                    <Text style={{fontFamily:'Chakra Petch SemiBold', fontSize:24, marginLeft:108, color:colors[this.context.theme.mode].text1}}>Join Game</Text>
                </View>
                <ScrollView style={{display:!this.state.loading?'flex':'none', marginTop:20, width: Dimensions.get('window').width, maxHeight: Dimensions.get('window').height*0.84, paddingBottom:40}}>
                    <View style={{paddingLeft:24, paddingRight:24, width: Dimensions.get('window').width, marginTop:20}}>
                        <Text style={{fontFamily:'Chakra Petch Regular', color:colors[this.context.theme.mode].inputlabel1, fontSize:16}}>Input the code of the game you want to stake on</Text>
                        <TextInput
                            placeholder={'Game ID'}
                            value={this.state.gameid}
                            onChangeText={(e)=>{this.setState({gameid: e});}}
                            style={{marginTop:20, width:362, borderRadius:8, height:56, borderWidth:1, borderColor:colors[this.context.theme.mode].inputborder1, fontSize:24, fontFamily:'Chakra Petch SemiBold', paddingLeft:15, paddingRight:15, color:colors[this.context.theme.mode].text1}}
                        />
                        <Text style={{color:'red', fontFamily:'Chakra Petch Regular', fontSize:14, marginTop:5}}>{this.state.idinputwarning}</Text>

                        <TouchableOpacity style={{flexDirection:'row', alignItems:'center', justifyContent:'center', backgroundColor:colors[this.context.theme.mode].btn2, width:362, height:56, borderRadius:6, marginTop:25}} onPress={()=>{!this.state.reqloading? this.loadGame() : '';}}>
                            <ActivityIndicator style={{display:this.state.reqloading?'flex':'none'}} color='white'/>
                            <Text style={{display:!this.state.reqloading?'flex':'none', color:'white', fontFamily:'Chakra Petch Regular', fontSize:15}}>Proceed</Text>
                        </TouchableOpacity>

                        <View style={{borderWidth:1, borderTopColor:'#C8D1DB', borderBottomColor:'rgba(0,0,0,0)', borderLeftColor:'rgba(0,0,0,0)', borderRightColor:'rgba(0,0,0,0)', marginTop:20, width:362, flexDirection:'column', alignItems:'center', justifyContent:'center'}}>
                            <ActivityIndicator style={{display:this.state.reqloading?'flex':'none', marginTop:40}}/>
                            
                            <Text style={{color:'red', fontFamily:'Chakra Petch Regular', fontSize:14, marginTop:20}}>{this.state.loadgamewarning}</Text>

                            <View style={{display:this.state.gameloaded?'flex':'none', width:362}}>
                                <Text style={{fontFamily:'Chakra Petch Regular', fontSize:18, color:colors[this.context.theme.mode].text1}}>{'Creator: '+(this.state.game.creatorname?this.state.game.creatorname:'')}</Text>

                                <Text style={{fontFamily:'Chakra Petch Regular', fontSize:16, color:colors[this.context.theme.mode].inputborder1, marginTop:15}}>Game Title</Text>
                                <Text style={{marginTop:3, fontFamily:'Chakra Petch SemiBold', fontSize:18, color:colors[this.context.theme.mode].text1}}>{this.state.game.gametitle?this.state.game.gametitle:''}</Text>

                                <Text style={{marginTop:15, fontFamily:'Chakra Petch SemiBold', fontSize:18, color:colors[this.context.theme.mode].text1}}>{'Number of stakes: '+(this.state.game.wagersidlist ? this.state.game.wagersidlist.length : '')}</Text>

                                <Text style={{marginTop:15, fontFamily:'Chakra Petch SemiBold', fontSize:18, color:colors[this.context.theme.mode].text1}}>{this.state.game.bettype? this.state.game.bettype==='h2h'?'Head 2 Head':'Admin' :''}</Text>

                                <Text style={{fontFamily:'Chakra Petch Regular', fontSize:16, color:colors[this.context.theme.mode].inputborder1, marginTop:15}}>Stake</Text>
                                <Text style={{marginTop:3, fontFamily:'Chakra Petch SemiBold', fontSize:24, color:this.context.theme.mode==='dark'?'rgb(40, 120, 20)':'#124D07'}}>{'NGN '+(this.state.game.stake?this.state.game.stake:'')}</Text>
 
                                <Text style={{fontFamily:'Chakra Petch Regular', fontSize:16, color:colors[this.context.theme.mode].inputborder1, marginTop:15}}>Staked on</Text>
                                <Text style={{marginTop:3, fontFamily:'Chakra Petch SemiBold', fontSize:24, color:this.state.mystakecolor}}>{this.state.mystake}</Text>
                                <Text style={{display:this.state.mystake==='' && this.state.mystakewarning!==''?'flex':'none', marginTop:3, fontFamily:'Chakra Petch Regular', fontSize:14, color:'red'}}>{this.state.mystakewarning}</Text>

                                <View style={{display:this.state.game.bettype==='admin'?'flex':'none', marginTop:20, width:Dimensions.get('window').width*0.9, flexDirection:'row', alignItem:'center', justifyContent:'space-around', flexWrap:'wrap'}}>
                                    {
                                        this.state.game.availablewagers?
                                            this.state.game.availablewagers.map((opt, index) => {
                                                if(index===0){
                                                    return(
                                                        <TouchableOpacity key={'wager'+index} style={{ backgroundColor:'rgba(15,25,166,0.3)', borderRadius:6, padding:10, paddingLeft:15, paddingRight:15, paddingTop:8, paddingBottom:8, marginTop:10}} onPress={()=>{ this.setState({mystake: opt, mystakecolor:this.context.theme.mode==='dark'?'rgb(60,100,255)':'#0F19A6'}); }}>
                                                            <Text style={{fontFamily:'Chakra Petch Regular', fontSize:16, color:this.context.theme.mode==='dark'?'rgb(60,100,255)':'#0F19A6'}}>{opt}</Text>
                                                        </TouchableOpacity>
                                                    );
                                                }

                                                if(index===1){
                                                    return(
                                                        <TouchableOpacity key={'wager'+index} style={{backgroundColor:'rgba(244,25,25,0.3)', borderRadius:6, padding:10, paddingLeft:15, paddingRight:15, paddingTop:8, paddingBottom:8,  marginTop:10}} onPress={()=>{ this.setState({mystake: opt, mystakecolor:this.context.theme.mode==='dark'?'rgb(255,80,80)':'#F41919'}); }}>
                                                            <Text style={{fontFamily:'Chakra Petch Regular', fontSize:16, color:this.context.theme.mode==='dark'?'rgb(255,80,80)':'#F41919'}}>{opt}</Text>
                                                        </TouchableOpacity>
                                                    );
                                                }

                                                if(index===2){
                                                    return(
                                                        <TouchableOpacity key={'wager'+index} style={{backgroundColor:'rgba(146,142,142,0.3)', borderRadius:6, padding:10, paddingLeft:15, paddingRight:15, paddingTop:8, paddingBottom:8, marginTop:10}} onPress={()=>{ this.setState({mystake: opt, mystakecolor:'#928E8E'}); }}>
                                                            <Text style={{fontFamily:'Chakra Petch Regular', fontSize:16, color:'#928E8E'}}>{opt}</Text>
                                                        </TouchableOpacity>
                                                    );
                                                }
                                            })
                                        :''
                                    }
                                </View>
                                
                                <View>
                                    <Text style={{display:this.state.joingamewarning===''?'none':'flex', marginTop:30, color:'red', fontFamily:'Chakra Petch Regular', fontSize:14}}>{this.state.joingamewarning}</Text>
                                    <TouchableOpacity style={{display:this.state.joingamewarning===''?'flex':'none', flexDirection:'row', alignItems:'center', justifyContent:'center', backgroundColor:colors[this.context.theme.mode].btn2, width:362, height:56, borderRadius:6, marginTop:30}} onPress={()=>{this.stake();}}>
                                        <ActivityIndicator style={{display:this.state.stakereqloading?'flex':'none'}} color='white'/>
                                        <Text style={{display:!this.state.stakereqloading?'flex':'none', color:'white', fontFamily:'Chakra Petch Regular', fontSize:15}}>Stake</Text>
                                    </TouchableOpacity>  
                                </View>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    }
}

export default JoinGame;
//64f25f1f73c3829657fe7678