import React, { Component } from 'react';
import { View, Text, StyleSheet, Dimensions, ActivityIndicator, Image, TouchableOpacity, ScrollView} from 'react-native';
import Header from './header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeContext } from '../contexts/ThemeContext';
import { colors } from '../config/theme';

class MyBets extends Component{
    static contextType = ThemeContext;

    constructor(props){
        super(props);
        this.scrollViewRef = React.createRef();
    }

    state={
        loading:true,
        reqloading: false,
        loadingwarning: '',
        loadingwarning2: '',
        activeTab: 'open',
        userdata: {},
        userid: '',
        gamedetails: {},
        detailtype: '',
    }

    async componentDidMount(){
        let data = await AsyncStorage.getItem('userdata');
        data = JSON.parse(data);
        
        if(data){
            this.state.userid = data.userid;
            this.getallbets('open'); 
        }else{ //We dont know how this person got to this URL so we take them back to first
            await AsyncStorage.multiRemove(['userdata', 'user']);
            router.push({pathname:'/first'})
        }
    }

    getallbets = (arg) => {
        this.state.userdata.gamesplayed = [];
        this.setState({loading:true, loadingwarning:''});
        //A default call to the server to get user details, incase there are any updates
        const defrequest = fetch(
            'https://ppbe01.onrender.com/getallbets',//"http://localhost:3000/getallbets",
            {
                method: 'POST',
                body: JSON.stringify({userid: this.state.userid}),
                headers: { 'Content-Type': 'application/json' }
            }
        ).then(response => {
            return response.json();
        }).then(response => {
            if(response.msg==='success'){
                this.setState({loading:false, userdata: response.data, activeTab: arg});
            }else{
                this.setState({loading:false, loadingwarning: response.msg, activeTab: arg})
            }
        });
    }

    goToWR = async (gameid, bettype) => {
        if(bettype==='h2h'){
            await AsyncStorage.setItem('gameid', gameid);
            this.props.navigation.navigate('waitingroom');
        }else{
            await AsyncStorage.setItem('gameid', gameid);
            this.props.navigation.navigate('waitingroom2');
        }
    }

    goToDR = async (gameid, bettype) => {
        if(bettype==='h2h'){
            console.log(gameid);
            await AsyncStorage.setItem('gameid', gameid);
            this.props.navigation.navigate('decisionroom');
        }else{
            console.log(gameid);
            await AsyncStorage.setItem('gameid', gameid);
            this.props.navigation.navigate('decisionroom2');
        }
    }

    showDetails = (gameid, bettype) => {
        if(bettype === 'h2h'){
            this.scrollViewRef.current?.scrollTo({ x: Dimensions.get('window').width*1, animated: true});
        }else{
            this.scrollViewRef.current?.scrollTo({ x: Dimensions.get('window').width*2, animated: true});
        }
        
        this.setState({gamedetails:{}, reqloading: true, loadingwarning2:'', detailtype:''});
        
        fetch(
            'https://ppbe01.onrender.com/getspecificbetdetails',//"http://localhost:3000/getspecificbetdetails",
            {
                method: 'POST',
                body: JSON.stringify({gameid: gameid}),
                headers: { 'Content-Type': 'application/json' }
            }
        ).then(response => {
            return response.json();
        }).then(response => {
            if(response.msg==='success'){
                console.log(response.gamedetails);
                let type = response.gamedetails.bettype;
                this.setState({gamedetails: response.gamedetails, reqloading: false, detailtype: type});
            }else{
                this.setState({loadingwarning2: response.msg, reqloading: false, detailtype:''});
            }
        });
    }

    render(){
        return(
            <ScrollView ref={this.scrollViewRef} style={{backgroundColor:colors[this.context.theme.mode].background, ...styles.containerView}} horizontal showsHorizontalScrollIndicator={false} decelerationRate={0} snapToInterval={Dimensions.get('window').width} snapToAlignment={"center"} scrollEnabled={true}>  
                <View style={{...styles.mainView}}>
                    <Header
                        username={this.state.userdata.username?this.state.userdata.username:''}
                        profilepic={/*this.state.userdata.profilepic?this.state.userdata.profilepic:*/'https://ppbe01.onrender.com/public/defaultpic.png'}
                    />
                    <View style={styles.navContainer}>
                        <TouchableOpacity style={{width:100, height:42, flexDirection:'row', justifyContent:'center', alignItems:'center', backgroundColor:this.state.activeTab==='open'?'#111111':'rgba(0,0,0,0)', borderRadius:4}} onPress={()=>{this.getallbets('open');}}>
                            <Text style={{color:'white', fontSize:14, fontFamily:'Chakra Petch Regular'}}>Open Bets</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{width:100, height:42, flexDirection:'row', justifyContent:'center', alignItems:'center', backgroundColor:this.state.activeTab==='history'?'#111111':'rgba(0,0,0,0)', borderRadius:4}} onPress={()=>{this.getallbets('history');}}>
                            <Text style={{color:'white', fontSize:14, fontFamily:'Chakra Petch Regular'}}>Bet History</Text>
                        </TouchableOpacity>
                    </View>
                    <ScrollView style={styles.contentScroller}>
                        <ActivityIndicator style={{display:this.state.loading?'flex':'none', position:'absolute', top: Dimensions.get('window').height*0.3,  left: Dimensions.get('window').width*0.48}}></ActivityIndicator>

                        <Text style={{display:this.state.loadingwarning!==''?'flex':'none', color:'red', textAlign:'center', width:Dimensions.get('window').width, fontFamily:'Chakra Petch SemiBold', fontSize:16, padding:24, marginTop:20}}>{this.state.loadingwarning}</Text>
                        {
                            this.state.userdata.gamesplayed?
                            this.state.userdata.gamesplayed.length>0?
                                this.state.activeTab==='open' && this.state.userdata.gamesplayed.filter(x => x.status==='pending' || x.status==='started').length === 0?
                                    <Text style={{display:this.state.loadingwarning==='' && !this.state.loading?'flex':'none', textAlign:'center', justifyContent:'center', width:Dimensions.get('window').width, fontFamily:'Chakra Petch Regular', fontSize:16, padding:24, marginTop:20, color:colors[this.context.theme.mode].text1}}>You currently don't have any open bets</Text>
                                
                                : this.state.activeTab === 'history' && this.state.userdata.gamesplayed.filter(x => x.status==='completed').length === 0?
                                    <Text style={{display:this.state.loadingwarning==='' && !this.state.loading?'flex':'none', textAlign:'center', justifyContent:'center', width:Dimensions.get('window').width, fontFamily:'Chakra Petch Regular', fontSize:16, padding:24, marginTop:20, color:colors[this.context.theme.mode].text1}}>You haven't played any games yet try creating or joining one and play with friends</Text>
                                
                                : this.state.userdata.gamesplayed.reverse().map((game, index)=>{
                                    if(this.state.activeTab==='open'){
                                        if(game.status==='pending' || game.status==='started'){
                                            return(
                                                <TouchableOpacity key={'open'+index} style={{display:this.state.loadingwarning===''?'flex':'none', flexDirection:'row', alignItems:'center', justifyContent:'center'}} onPress={()=>{game.status==='pending'?this.goToWR(game.gameid, game.bettype):this.goToDR(game.gameid, game.bettype)}}>
                                                    <View style={styles.betrow}>
                                                        <Image style={{width:47, height:47}} source={require('./../assets/gamelogo1.png')}/>
                                                        <View style={styles.bettext}>
                                                            <Text style={{fontFamily:'Chakra Petch Regular', fontSize:15, color:colors[this.context.theme.mode].text2}}>{game.bettype==='h2h'?'Head 2 Head':'Admin'}</Text>
                                                            <Text style={{fontFamily:'Chakra Petch Regular', fontSize:14, color:'#1E9E40', marginTop:3}}>{'NGN '+game.stake}</Text>
                                                        </View>
                                                        <Text style={{fontFamily:'Chakra Petch SemiBold', fontSize:15, color:game.status==='pending'?'rgb(220, 180, 100)':'rgb(20, 20, 180)'}}>{game.status.toUpperCase()}</Text>
                                                        <Image style={{width:16, height:16}} source={this.context.theme.color==='dark'?require('./../assets/next-dark.png'):require('./../assets/next.png')}/>
                                                    </View>
                                                </TouchableOpacity>
                                            );
                                        }
                                    }

                                    if(this.state.activeTab==='history'){
                                        if(game.status==='completed'){
                                            return(
                                                <TouchableOpacity key={'open'+index} style={{display:this.state.loadingwarning===''?'flex':'none', flexDirection:'row', alignItems:'center', justifyContent:'center'}} onPress={()=>{this.showDetails(game.gameid, game.bettype);}}>
                                                    <View style={styles.betrow}>
                                                        <Image style={{width:47, height:47}} source={require('./../assets/gamelogo1.png')}/>
                                                        <View style={styles.bettext}>
                                                            <Text style={{fontFamily:'Chakra Petch Regular', fontSize:15, color:colors[this.context.theme.mode].text2}}>{game.bettype==='h2h'?'Head 2 Head':'Admin'}</Text>
                                                            <Text style={{fontFamily:'Chakra Petch Regular', fontSize:14, color:'#1E9E40', marginTop:3}}>{'NGN '+game.stake}</Text>
                                                        </View>
                                                        <Text style={{fontFamily:'Chakra Petch SemiBold', fontSize:15, color:'green'}}>{game.status.toUpperCase()}</Text>
                                                        <Image style={{width:16, height:16}} source={this.context.theme.mode==='dark'?require('./../assets/next-dark.png'):require('./../assets/next.png')}/>
                                                    </View>
                                                </TouchableOpacity>
                                            );
                                        }
                                    }
                                    
                                })
                            :   <Text style={{display:this.state.loadingwarning==='' && !this.state.loading?'flex':'none', textAlign:'center', width:Dimensions.get('window').width, fontFamily:'Chakra Petch Regular', fontSize:16, padding:24, marginTop:20, color:colors[this.context.theme.mode].text1}}>You haven't played any games yet try creating or joining one and play with friends</Text>
                            :   ''
                        }
                    </ScrollView>
                </View>

                
                <View style={{width:Dimensions.get('window').width, height:Dimensions.get('window').height*0.9, alignItems:'center'}}>
                    <View style={{display:!this.state.loading?'flex':'none', flexDirection:'row', alignItems:'center', justifyContent:'flex-start', marginTop:20, width:Dimensions.get('window').width}}>
                        <TouchableOpacity onPress={()=>{this.scrollViewRef.current?.scrollTo({ x: 0, animated: true});}}>
                        <Image style={{width:24, height:24, marginLeft:10}} source={this.context.theme.mode==='dark'?require('./../assets/gameback-dark.png'):require('./../assets/gameback.png')}></Image>
                        </TouchableOpacity>
                        <Text style={{fontFamily:'Chakra Petch SemiBold', fontSize:24, marginLeft:108, color:colors[this.context.theme.mode].text1}}>Game Details</Text>
                    </View>
                    
                    <ActivityIndicator style={{display:this.state.reqloading?'flex':'none', marginTop:Dimensions.get('window').height*0.38}}></ActivityIndicator>
                    
                    <Text style={{display:this.state.loadingwarning2!==''?'flex':'none', color:'red', textAlign:'center', width:Dimensions.get('window').width, fontFamily:'Chakra Petch SemiBold', fontSize:16, padding:24, marginTop:20}}>{this.state.loadingwarning2}</Text>
                    
                    <View style={{display:!this.state.reqloading && this.state.loadingwarning2===''?'flex':'none', marginTop:9, width:Dimensions.get('window').width, alignItems:'center', height:150}}>
                        <View style={{position:'absolute', width:382, height:150, flexDirection:'column', alignItems:'center', justifyContent:'flex-start'}}>
                            <Text style={{marginTop:12, fontSize:16, fontFamily:'Chakra Petch Regular', color:this.state.gamedetails.votes? this.state.gamedetails.votes[0]==='1' && this.state.userdata.userid===this.state.gamedetails.creatorid?'#1E9E40':'red':''}}>{this.state.gamedetails.votes?this.state.gamedetails.votes[0]==='1' && this.state.userdata.userid===this.state.gamedetails.creatorid?'YOU WON':'YOU LOST':''}</Text>
                            <View style={{marginTop:14, flexDirection:'row', alignItems:'center', justifyContent:'space-between', width:320, height:80}}>
                                <View style={{flexDirection:'column', alignItems:'center', justifyContent:'space-between', height:80}}>
                                    <Text style={{color:'white', fontFamily:'Chakra Petch SemiBold', fontSize:18}}>{this.state.gamedetails.bettype ? this.state.gamedetails.bettype==='h2h'? this.state.gamedetails.stakerslist[1].username : ''/*code for admin type*/ : ''}</Text>
                                    <Image style={{width:78, height:42}} source={require('./../assets/player1.png')}/>
                                </View>
                                <View style={{flexDirection:'column', alignItems:'center', justifyContent:'space-between', height:80}}>
                                    <Text style={{color:'white', fontFamily:'Chakra Petch SemiBold', fontSize:18}}>{this.state.gamedetails.bettype ? this.state.gamedetails.bettype==='h2h'? this.state.gamedetails.stakerslist[0].username : ''/*code for admin type*/ : ''}</Text>
                                    <Image style={{width:78, height:42}} source={require('./../assets/player2.png')}/>
                                </View>
                            </View>  
                        </View>
                    </View>

                    <View style={{width:Dimensions.get('window').width*0.85, marginTop:15}}>
                        <Text style={{fontFamily:'Chakra Petch SemiBold', fontSize:18, color:colors[this.context.theme.mode].text1, textAlign:'center'}}>{this.state.gamedetails.gametitle ? this.state.gamedetails.gametitle : ''}</Text>
                        <Text style={{fontFamily:'Chakra Petch Regular', fontSize:16, color:colors[this.context.theme.mode].text1, marginTop:10, textAlign:'center'}}>{this.state.gamedetails.gamedesc ? this.state.gamedetails.gamedesc : ''}</Text>
                    </View>

                    <Text style={{display:!this.state.reqloading && this.state.loadingwarning2===''?'flex':'none', fontFamily:'Chakra Petch Regular', fontSize:18, marginTop:20, color:colors[this.context.theme.mode].text1}}>{this.state.gamedetails.creator?'This game was created by '+this.state.gamedetails.creator.username:''}</Text>

                    <View style={{display:!this.state.reqloading && this.state.loadingwarning2===''?'flex':'none', width:382, height:300, marginTop:20, backgroundColor:'#EDEDED', borderRadius:8, flexDirection:'column', alignItems:'center', justifyContent:'space-between'}}>
                        <View>
                            <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between', width:334, height:50, marginTop:10, borderWidth:1, borderBottomColor:'#C8D1DB', borderLeftColor:'rgba(0,0,0,0)', borderTopColor:'rgba(0,0,0,0)', borderRightColor:'rgba(0,0,0,0)'}}>
                                <Text style={{fontFamily:'Chakra Petch Regular', fontSize:14, color:'#646060'}}>Bet Type</Text>
                                <Text style={{fontFamily:'Chakra Petch SemiBold', fontSize:16, color:'#000000'}}>{this.state.gamedetails.bettype? this.state.gamedetails.bettype==='h2h'? 'Head 2 Head' : 'Admin' :''}</Text>
                            </View>
                            <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between', width:334, height:50, borderWidth:1, borderBottomColor:'#C8D1DB', borderLeftColor:'rgba(0,0,0,0)', borderTopColor:'rgba(0,0,0,0)', borderRightColor:'rgba(0,0,0,0)'}}>
                                <Text style={{fontFamily:'Chakra Petch Regular', fontSize:14, color:'#646060'}}>You staked on</Text>
                                <Text style={{fontFamily:'Chakra Petch SemiBold', fontSize:16, color:'#000000'}}>{this.state.gamedetails.bettype? this.state.gamedetails.bettype==='h2h'? 'You to win' : ''/*this is for the admin type*/ :''}</Text>
                            </View>
                            <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between', width:334, height:50, borderWidth:1, borderBottomColor:'#C8D1DB', borderLeftColor:'rgba(0,0,0,0)', borderTopColor:'rgba(0,0,0,0)', borderRightColor:'rgba(0,0,0,0)'}}>
                                <Text style={{fontFamily:'Chakra Petch Regular', fontSize:14, color:'#646060'}}>Amount staked</Text>
                                <Text style={{fontFamily:'Chakra Petch SemiBold', fontSize:16, color:'#000000'}}>{this.state.gamedetails.stake?'NGN '+this.state.gamedetails.stake:''}</Text>
                            </View>
                            <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between', width:334, height:50, borderWidth:1, borderBottomColor:'#C8D1DB', borderLeftColor:'rgba(0,0,0,0)', borderTopColor:'rgba(0,0,0,0)', borderRightColor:'rgba(0,0,0,0)'}}>
                                <Text style={{fontFamily:'Chakra Petch Regular', fontSize:14, color:'#646060'}}>Total stakes</Text>
                                <Text style={{fontFamily:'Chakra Petch SemiBold', fontSize:16, color:'#000000'}}>{this.state.gamedetails.stake?'NGN '+(parseInt(this.state.gamedetails.stake)*2).toString():''}</Text>
                            </View>
                        </View>

                        <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between', width:334, height:40, marginBottom:15}}>
                            <Text style={{fontFamily:'Chakra Petch SemiBold', fontSize:16, color:'#000000'}}>{this.state.gamedetails.votes? this.state.gamedetails.votes[0]==='1' && this.state.userdata.userid===this.state.gamedetails.creatorid?'You won':'You lost':''}</Text>
                            <Text style={{fontFamily:'Chakra Petch SemiBold', fontSize:20, color:this.state.gamedetails.votes? this.state.gamedetails.votes[0]==='1' && this.state.userdata.userid===this.state.gamedetails.creatorid?'#1E9E40':'red':''}}>
                                {
                                    this.state.gamedetails.bettype?
                                        this.state.gamedetails.bettype==='h2h'?
                                            this.state.gamedetails.votes? this.state.gamedetails.votes[0]==='1' && this.state.userdata.userid===this.state.gamedetails.creatorid?
                                                'NGN '+(this.state.gamedetails.wagersidlist.length*parseInt(this.state.gamedetails.stake)*0.9).toString()
                                            :   'NGN '+(this.state.gamedetails.stake):''
                                            
                                        :''//Do this later for the admin type
                                    :''
                                }
                            </Text>
                        </View>
                    </View>
                </View>

                
                <View style={{display:this.state.detailtype==='admin', width:Dimensions.get('window').width, height:Dimensions.get('window').height*0.9, alignItems:'center'}}>
                    <View style={{display:!this.state.loading?'flex':'none', flexDirection:'row', alignItems:'center', justifyContent:'flex-start', marginTop:20, width:Dimensions.get('window').width}}>
                        <TouchableOpacity onPress={()=>{this.scrollViewRef.current?.scrollTo({ x: 0, animated: true});}}>
                        <Image style={{marginLeft:10, width:24, height:24}} source={this.context.theme.mode==='dark'?require('./../assets/gameback-dark.png'):require('./../assets/gameback.png')}></Image>
                        </TouchableOpacity>
                        <Text style={{fontFamily:'Chakra Petch SemiBold', fontSize:24, marginLeft:108, color:colors[this.context.theme.mode].text1}}>Game Details</Text>
                    </View>

                    <ActivityIndicator style={{display:this.state.reqloading?'flex':'none', marginTop:Dimensions.get('window').height*0.38}}></ActivityIndicator>

                    <Text style={{display:this.state.loadingwarning2!==''?'flex':'none', color:'red', textAlign:'center', width:Dimensions.get('window').width, fontFamily:'Chakra Petch SemiBold', fontSize:16, padding:24, marginTop:20}}>{this.state.loadingwarning2}</Text>

                    <View style={{display:!this.state.reqloading && this.state.loadingwarning2===''?'flex':'none', marginTop:9, width:Dimensions.get('window').width, alignItems:'center', height:150}}>
                        <View style={{position:'absolute', width:382, height:150, flexDirection:'column', alignItems:'center', justifyContent:'flex-start'}}>
                            <Text style={{marginTop:12, fontSize:16, fontFamily:'Chakra Petch Regular', color:this.state.gamedetails.creatorid? this.state.gamedetails.creatorid===this.state.userdata.userid ? 'blue' : this.state.gamedetails.admindecision===this.state.gamedetails.wagerschoices[this.state.gamedetails.wagersidlist.indexOf(this.state.userdata.userid)] ?'#1E9E40':'red':''}}>{this.state.gamedetails.creatorid? this.state.gamedetails.creatorid===this.state.userdata.userid ? 'ADMIN' : this.state.gamedetails.admindecision===this.state.gamedetails.wagerschoices[this.state.gamedetails.wagersidlist.indexOf(this.state.userdata.userid)] ?'YOU WON': 'YOU LOST' :''}</Text>
                            <View style={{marginTop:14, flexDirection:'row', alignItems:'center', justifyContent:'space-between', width:320, height:80}}>
                                <View style={{flexDirection:'column', alignItems:'center', justifyContent:'space-between', height:80}}>
                                    <Text style={{color:'white', fontFamily:'Chakra Petch SemiBold', fontSize:18}}>{this.state.gamedetails.availablewagers && this.state.detailtype==='admin'? this.state.gamedetails.availablewagers[0].slice(0, -5) : ''}</Text>
                                    <Image style={{width:78, height:42}} source={require('./../assets/player1.png')}/>
                                </View>
                                <View style={{flexDirection:'column', alignItems:'center', justifyContent:'space-between', height:80}}>
                                    <Text style={{color:'white', fontFamily:'Chakra Petch SemiBold', fontSize:18}}>{this.state.gamedetails.availablewagers && this.state.detailtype==='admin' ? this.state.gamedetails.availablewagers[1].slice(0, -5) : ''}</Text>
                                    <Image style={{width:78, height:42}} source={require('./../assets/player2.png')}/>
                                </View>
                            </View>  
                        </View>
                    </View>

                    <View style={{width:Dimensions.get('window').width*0.85, marginTop:15}}>
                        <Text style={{fontFamily:'Chakra Petch SemiBold', fontSize:18, color:colors[this.context.theme.mode].text1, textAlign:'center'}}>{this.state.gamedetails.gametitle ? this.state.gamedetails.gametitle : ''}</Text>
                        <Text style={{fontFamily:'Chakra Petch Regular', fontSize:16, color:colors[this.context.theme.mode].text1, marginTop:10, textAlign:'center'}}>{this.state.gamedetails.gamedesc ? this.state.gamedetails.gamedesc : ''}</Text>
                    </View>

                    <Text style={{display:!this.state.reqloading && this.state.loadingwarning2===''?'flex':'none', fontFamily:'Chakra Petch Regular', fontSize:18, marginTop:20, color:colors[this.context.theme.mode].text1}}>{this.state.gamedetails.creator?'This game was created by '+this.state.gamedetails.creator.username:''}</Text>

                    <View style={{display:!this.state.reqloading && this.state.loadingwarning2===''?'flex':'none', width:382, height:300, marginTop:20, backgroundColor:'#EDEDED', borderRadius:8, flexDirection:'column', alignItems:'center', justifyContent:'space-between'}}>
                        <View>
                            <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between', width:334, height:50, marginTop:10, borderWidth:1, borderBottomColor:'#C8D1DB', borderLeftColor:'rgba(0,0,0,0)', borderTopColor:'rgba(0,0,0,0)', borderRightColor:'rgba(0,0,0,0)'}}>
                                <Text style={{fontFamily:'Chakra Petch Regular', fontSize:14, color:'#646060'}}>Bet Type</Text>
                                <Text style={{fontFamily:'Chakra Petch SemiBold', fontSize:16, color:'#000000'}}>{this.state.gamedetails.bettype? this.state.gamedetails.bettype==='h2h'? 'Head 2 Head' : 'Admin' :''}</Text>
                            </View>
                            <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between', width:334, height:50, borderWidth:1, borderBottomColor:'#C8D1DB', borderLeftColor:'rgba(0,0,0,0)', borderTopColor:'rgba(0,0,0,0)', borderRightColor:'rgba(0,0,0,0)'}}>
                                <Text style={{fontFamily:'Chakra Petch Regular', fontSize:14, color:'#646060'}}>You staked on</Text>
                                <Text style={{fontFamily:'Chakra Petch SemiBold', fontSize:16, color:'#000000'}}>{this.state.gamedetails.bettype? this.state.gamedetails.wagersidlist.includes(this.state.userdata.userid) ? this.state.gamedetails.wagerschoices[this.state.gamedetails.wagersidlist.indexOf(this.state.userdata.userid)] : 'Admin'/*this is for the admin type*/ :''}</Text>
                            </View>
                            <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between', width:334, height:50, borderWidth:1, borderBottomColor:'#C8D1DB', borderLeftColor:'rgba(0,0,0,0)', borderTopColor:'rgba(0,0,0,0)', borderRightColor:'rgba(0,0,0,0)'}}>
                                <Text style={{fontFamily:'Chakra Petch Regular', fontSize:14, color:'#646060'}}>Amount staked</Text>
                                <Text style={{fontFamily:'Chakra Petch SemiBold', fontSize:16, color:'#000000'}}>{this.state.gamedetails.stake? this.state.gamedetails.wagersidlist.includes(this.state.userdata.userid) ? 'NGN '+this.state.gamedetails.stake: 'NGN 0 ' : ''}</Text>
                            </View>
                            <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between', width:334, height:50, borderWidth:1, borderBottomColor:'#C8D1DB', borderLeftColor:'rgba(0,0,0,0)', borderTopColor:'rgba(0,0,0,0)', borderRightColor:'rgba(0,0,0,0)'}}>
                                <Text style={{fontFamily:'Chakra Petch Regular', fontSize:14, color:'#646060'}}>Total stakes</Text>
                                <Text style={{fontFamily:'Chakra Petch SemiBold', fontSize:16, color:'#000000'}}>{this.state.gamedetails.stake?'NGN '+(parseInt(this.state.gamedetails.stake)*this.state.gamedetails.wagersidlist.length).toString():''}</Text>
                            </View>
                        </View>

                        <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between', width:334, height:40, marginBottom:15}}>
                            <Text style={{fontFamily:'Chakra Petch SemiBold', fontSize:16, color:'#000000'}}>
                                {
                                    this.state.gamedetails.bettype==='admin'?
                                        this.state.gamedetails.creatorid===this.state.userdata.userid?//If user was the admin
                                            'You received'
                                        : this.state.gamedetails.admindecision === this.state.gamedetails.wagerschoices[this.state.gamedetails.wagersidlist.indexOf(this.state.userdata.userid)]?//Then this is a winner
                                            'You won'
                                        :   'You lost'
                                        
                                    :''
                                }
                            </Text>
                            <Text style={{fontFamily:'Chakra Petch SemiBold', fontSize:20, 
                                color:  this.state.gamedetails.bettype==='admin'?
                                            this.state.gamedetails.creatorid===this.state.userdata.userid?//If user was the admin
                                                '#1E9E40'
                                            : this.state.gamedetails.admindecision === this.state.gamedetails.wagerschoices[this.state.gamedetails.wagersidlist.indexOf(this.state.userdata.userid)]?//Then this is a winner
                                                '#1E9E40'
                                            :   'red'    
                                        :''
                            }}>
                                {
                                    this.state.gamedetails.bettype?
                                        this.state.gamedetails.bettype==='admin'?
                                            this.state.gamedetails.creatorid===this.state.userdata.userid?//If user was the admin
                                                ('NGN '+ ( Math.floor(parseInt(this.state.gamedetails.stake)*this.state.gamedetails.wagersidlist.length*0.05)).toString() )
                                            : this.state.gamedetails.admindecision === this.state.gamedetails.wagerschoices[this.state.gamedetails.wagersidlist.indexOf(this.state.userdata.userid)]?//Then this is a winner
                                                ('NGN '+ (parseInt (Math.floor( ( parseInt(this.state.gamedetails.stake)*this.state.gamedetails.wagersidlist.length*0.9 ) / this.state.gamedetails.wagerschoices.filter(x=>x===this.state.gamedetails.admindecision).length ))).toString() )
                                            :   ('NGN '+ this.state.gamedetails.stake )
                                            
                                        :''
                                    :''
                                }
                            </Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
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

    viewTop: {
        flexDirection:'row', alignItems:'center', justifyContent:'space-between',
        width: Dimensions.get('window').width-30,
    },

    viewTL: {
        flexDirection:'row', alignItems:'center', justifyContent:'flex-start',/* borderWidth:1, borderLeftColor:'black'*/
    },

    navContainer:{
        flexDirection:'row', alignItems:'center', justifyContent: 'space-around', width:Dimensions.get('window').width, height:70,
        backgroundColor:'#80987B', marginTop:15
    },

    contentScroller:{
        width:Dimensions.get('window').width,/* borderWidth:1, borderLeftColor:'black'*/
    },

    dailyrow: {
        width:Dimensions.get('window').width, flexDirection:'column', alignItems:'flex-start', justifyContent:'flex-start', paddingLeft:20, paddingRight:20, marginTop:16
    },

    date:{
        fontSize:14, color:'#928E8E'
    },

    betrow:{
        flexDirection:'row', alignItems:'center', justifyContent:'space-between', width:372, height:85,
        borderWidth:1, borderBottomColor:'#C8D1DB', borderTopColor:'rgba(0,0,0,0)', borderRightColor:'rgba(0,0,0,0)', borderLeftColor:'rgba(0,0,0,0)' 
    },

    bettext:{
        width:Dimensions.get('window').width*0.4, height:40,
    },

    detailsView:{
        width: Dimensions.get('window').width, flex:1, flexDirection: 'column', justifyContent: 'flex-start',
        paddingLeft:15, paddingRight:15, alignItems:'center', paddingTop:20
    }
});

export default MyBets;

/**
 * <View style={{display:!this.state.loading?'flex':'none', ...styles.detailsView}}>
                    <View style={{display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'flex-start', marginTop:20, width:Dimensions.get('window').width}}>
                        <Image style={{marginLeft:10}} source={require('./../assets/gameback.png')}></Image>
                        <Text style={{fontFamily:'Chakra Petch SemiBold', fontSize:24, marginLeft:108}}>Bet Details</Text>
                    </View>

                    <View style={{marginTop:9, width:382, height:198}}>
                        <Image source={require('./../assets/gamebg.png')}/>
                        <View style={{position:'absolute', width:382, height:198, flexDirection:'column', alignItems:'center', justifyContent:'flex-start'}}>
                        <Text style={{marginTop:23, color:'#1E9E40', fontSize:16, fontFamily:'Chakra Petch Regular'}}>Won</Text>
                            <Text style={{marginTop:5, color:'white', fontSize:16, fontFamily:'Chakra Petch Regular'}}>Today</Text>
                            <View style={{marginTop:20, flexDirection:'row', alignItems:'center', justifyContent:'space-between', width:362, height:80}}>
                                <View style={{flexDirection:'column', alignItems:'center', justifyContent:'space-between', height:80}}>
                                    <Text style={{color:'white', fontFamily:'Chakra Petch SemiBold', fontSize:18}}>Player1</Text>
                                    <Image source={require('./../assets/player1.png')}/>
                                </View>
                                <Text style={{fontFamily:'Chakra Petch SemiBold', color:'white', fontSize:24}}>3</Text>
                                <Text style={{color:'white', fontFamily:'Chakra Petch SemiBold', fontSize:24}}>VS</Text>
                                <Text style={{fontFamily:'Chakra Petch SemiBold', color:'white', fontSize:24}}>2</Text>
                                <View style={{flexDirection:'column', alignItems:'center', justifyContent:'space-between', height:80}}>
                                    <Text style={{color:'white', fontFamily:'Chakra Petch SemiBold', fontSize:18}}>Player2</Text>
                                    <Image source={require('./../assets/player2.png')}/>
                                </View>
                            </View>  
                        </View>
                    </View>

                    <Text style={{fontFamily:'Chakra Petch Regular', fontSize:18, marginTop:20}}>This game was created by @demilade12</Text>

                    <View style={{width:382, height:280, marginTop:20, backgroundColor:'#EDEDED', borderRadius:8, flexDirection:'column', alignItems:'center', justifyContent:'space-between'}}>
                        <View>
                            <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between', width:334, height:50, marginTop:10, borderWidth:1, borderBottomColor:'#C8D1DB', borderLeftColor:'rgba(0,0,0,0)', borderTopColor:'rgba(0,0,0,0)', borderRightColor:'rgba(0,0,0,0)'}}>
                                <Text style={{fontFamily:'Chakra Petch Regular', fontSize:14, color:'#646060'}}>You staked on</Text>
                                <Text style={{fontFamily:'Chakra Petch SemiBold', fontSize:16, color:'#000000'}}>Player1 to win</Text>
                            </View>
                            <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between', width:334, height:50, borderWidth:1, borderBottomColor:'#C8D1DB', borderLeftColor:'rgba(0,0,0,0)', borderTopColor:'rgba(0,0,0,0)', borderRightColor:'rgba(0,0,0,0)'}}>
                                <Text style={{fontFamily:'Chakra Petch Regular', fontSize:14, color:'#646060'}}>Amount staked</Text>
                                <Text style={{fontFamily:'Chakra Petch SemiBold', fontSize:16, color:'#000000'}}>NGN 400</Text>
                            </View>
                        </View>

                        <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between', width:334, height:40, marginBottom:15}}>
                            <Text style={{fontFamily:'Chakra Petch SemiBold', fontSize:16, color:'#000000'}}>You received</Text>
                            <Text style={{fontFamily:'Chakra Petch SemiBold', fontSize:20, color:'#000000'}}>NGN 2000</Text>
                        </View>
                    </View>
                </View>
 */



/*
    <View style={styles.dailyrow}>
                            <Text style={{ fontFamily:'Chakra Petch Regular', ...styles.date}}>Today</Text>
                            
                            <View style={styles.betrow}>
                                <Image source={require('./../assets/gamelogo1.png')}/>
                                <View style={styles.bettext}>
                                    <Text style={{fontFamily:'Chakra Petch Regular', fontSize:15, color:'#646060'}}>Player1 VS Player2</Text>
                                    <Text style={{fontFamily:'Chakra Petch Regular', fontSize:14, color:'#1E9E40', marginTop:3}}>Won</Text>
                                </View>
                                <Image source={require('./../assets/next.png')}/>
                            </View>
                        
                            <View style={styles.betrow}>
                                <Image source={require('./../assets/gamelogo2.png')}/>
                                <View style={styles.bettext}>
                                    <Text style={{fontFamily:'Chakra Petch Regular', fontSize:15, color:'#646060'}}>Player1 VS Player2</Text>
                                    <Text style={{fontFamily:'Chakra Petch Regular', fontSize:14, color:'#0F19A6', marginTop:3}}>NGN 150</Text>
                                </View>
                                <Image source={require('./../assets/next.png')}/>
                            </View>
                        
                            <View style={styles.betrow}>
                                <Image source={require('./../assets/gamelogo3.png')}/>
                                <View style={styles.bettext}>
                                    <Text style={{fontFamily:'Chakra Petch Regular', fontSize:15, color:'#646060'}}>Player1 VS Player2</Text>
                                    <Text style={{fontFamily:'Chakra Petch Regular', fontSize:14, color:'#0F19A6', marginTop:3}}>NGN 200</Text>
                                </View>
                                <Image source={require('./../assets/next.png')}/>
                            </View>
                        
                            <View style={styles.betrow}>
                                <Image source={require('./../assets/gamelogo4.png')}/>
                                <View style={styles.bettext}>
                                    <Text style={{fontFamily:'Chakra Petch Regular', fontSize:15, color:'#646060'}}>Player1 VS Player2</Text>
                                    <Text style={{fontFamily:'Chakra Petch Regular', fontSize:14, color:'#E82828', marginTop:3}}>Lost</Text>
                                </View>
                                <Image source={require('./../assets/next.png')}/>
                            </View>
                        
                        </View>
*/