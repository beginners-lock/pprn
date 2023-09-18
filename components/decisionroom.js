import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Dimensions, ActivityIndicator, Image, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { io } from 'socket.io-client';
import { ThemeContext } from '../contexts/ThemeContext';
import { colors } from '../config/theme';

class DecisionRoom extends Component{
    static contextType = ThemeContext;

    constructor(props){
        super(props);
        this.scrollViewRef = React.createRef();
    }

    state={
        recordedvote:'',
        myvote: '',
        loading:true,
        reqloading:false,
        details:'hide',
        game: {},
        userdata: {},
        socket:'',
        votewarning:'',
        winner:'',
        agreementwarning: ''
    }

    async componentDidMount(){
        this.setState({loading: true});
        
        let data = await AsyncStorage.getItem('userdata');
        data = JSON.parse(data);

        let gameid = await AsyncStorage.getItem('gameid');
        console.log('gameid>>'+gameid);
        if(gameid && gameid!=='undefined' && gameid!=='null'){
            //If user data is in Async Storage
            if(data && data!==null){
                //Check if user is an imposter in the waiting room and also get userdata
                const defrequest = fetch(
                    'https://ppbe01.onrender.com/drimpostercheck',//"http://localhost:3000/drimpostercheck",
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
                        socket.on(response.game.gameid+'voteupdate', (arg)=>{
                            console.log(JSON.parse(arg));
                            this.setState({game: JSON.parse(arg).game})
                        });

                        socket.on(response.game.gameid+'winner', (winner)=>{
                            console.log('I entereed winner'+winner);
                            this.setState({winner: winner});
                            
                            //then scroll to the winner agree page
                            this.showWinnerPage();
                        });

                        socket.on(response.game.gameid+'disagreement', (arg)=>{
                            this.scrollViewRef.current?.scrollTo({ x: 0, animated: true});
                        });

                        socket.on(response.game.gameid+'complete', async (arg)=>{
                            await AsyncStorage.removeItem('game');
                            this.props.navigation.navigate('home');
                        });

                        let myvote = '';
                        console.log('votes>>>'+response.game.votes);
                        if(response.game.creatorid === response.user.userid){//If you're a creator
                            if(response.game.votes[0]){
                                if(response.game.votes[0]==='1'){ myvote='I won'; }
                                if(response.game.votes[0]==='2'){ myvote='Opponent won'; }
                                if(response.game.votes[0]==='3'){ myvote='Draw'; }
                            }
                        }else{
                            if(response.game.votes[0]){
                                if(response.game.votes[1]==='1'){ myvote='Opponent won'; }
                                if(response.game.votes[1]==='2'){ myvote='I won'; }
                                if(response.game.votes[1]==='3'){ myvote='Draw'; }
                            }
                        }
                        
                        this.setState({loading:false, game: response.game, userdata: response.user, socket:socket, myvote: myvote, recordedvote:myvote, votewarning:response.votewarning, winner:response.winner});
                        console.log('!!!'+response.winner);
                        if(response.winner!==''){
                            this.showWinnerPage();
                            //The stuff refuses to scroll think of sometheing to do here
                        }
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

    showWinnerPage = () => {
        console.log(this.scrollViewRef.current);
        this.scrollViewRef.current?.scrollTo({ x: Dimensions.get('window').width * 2, animated: true});
        console.log('Yeah yeah i paid');
    }

    detailstoggle = (arg) => {
        console.log(arg);
        if(arg==='show'){
            this.scrollViewRef.current?.scrollTo({ x: Dimensions.get('window').width * 1, animated: true});
        }else{
            this.scrollViewRef.current?.scrollTo({ x: 0, animated: true});
        }
    }

    vote = (arg) => {
        // 1 is for the creator, 2 is for the second person and 3 is for a draw
        this.setState({reqloading:true, votewarning:''});
        fetch(
            'https://ppbe01.onrender.com/vote',//"http://localhost:3000/vote",
            {
                method: 'POST',
                body: JSON.stringify({userid: this.state.userdata.userid, gameid: this.state.game.gameid, vote: arg}),
                headers: { 'Content-Type': 'application/json' }
            }
        ).then(response => {
            return response.json();
        }).then(async response => {
            if(response.msg === 'success'){
                console.log('pre');
                console.log(this.state.game);
                console.log(response.game);
                this.setState({recordedvote:arg, game:response.game, reqloading:false, votewarning:response.votewarning});
                console.log(response.votewarning);
                this.state.socket.emit('DRvote', JSON.stringify({gameid:this.state.game.gameid, game:response.game}));
                
                //If both choices are the same go to the winner page
                if(response.votewarning === 'We have a winner'){
                    console.log('check>>>'+this.state.game.gameid);
                    this.state.socket.emit('wehaveawinner', JSON.stringify({winner:response.winner, gameid:this.state.game.gameid}));
                }
            }
            this.setState({reqloading:false});
        });
    }

    cancelvote = () => {
        this.setState({reqloading:true, votewarning:''});
        fetch(
            'https://ppbe01.onrender.com/cancelvote',//"http://localhost:3000/cancelvote",
            {
                method: 'POST',
                body: JSON.stringify({userid: this.state.userdata.userid, gameid: this.state.game.gameid}),
                headers: { 'Content-Type': 'application/json' }
            }
        ).then(response => {
            return response.json();
        }).then(async response => {
            if(response.msg==='success'){
                this.setState({recordedvote:'', myvote:'', game:response.game, reqloading:false, winner: ''});
                
                this.state.socket.emit('DRvote', JSON.stringify({gameid:this.state.game.gameid, game:response.game}));
            }
            this.setState({reqloading:false});
        });
    } 

    disagree = () => {
        this.cancelvote();
        fetch(
            'https://ppbe01.onrender.com/disagree',//"http://localhost:3000/disagree",
            {
                method: 'POST',
                body: JSON.stringify({userid: this.state.userdata.userid, gameid: this.state.game.gameid}),
                headers: { 'Content-Type': 'application/json' }
            }
        );
        //this.scrollViewRef.current?.scrollTo({ x: 0, animated: true});
    }

    final = () => {
        this.setState({reqloading: true});
        fetch(
            'https://ppbe01.onrender.com/agree',//"http://localhost:3000/agree",
            {
                method: 'POST',
                body: JSON.stringify({userid: this.state.userdata.userid, gameid: this.state.game.gameid}),
                headers: { 'Content-Type': 'application/json' }
            }
        ).then(response => {
            return response.json();
        }).then(async response => {
            if(response.msg==='complete'){
                this.state.socket.emit('gamecomplete', this.state.game.gameid);
                await AsyncStorage.removeItem('game');
                this.props.navigation.navigate('home');
                this.setState({reqloading: false})
            }

            if(response.msg==='incomplete'){
                this.setState({agreementwarning: 'Waiting for an agreement from your opponent...'});
            }
        })
    }

    render(){
        return(
            <View style={{width:Dimensions.get('window').width, height:Dimensions.get('window').height, backgroundColor:colors[this.context.theme.mode].background}}>
                <View style={{display:!this.state.loading?'flex':'none', flexDirection:'row', alignItems:'center', justifyContent:'flex-start', marginTop:20}}>
                    <TouchableOpacity onPress={async ()=>{ this.state.socket.emit('leavedecisionroom', this.state.game.gameid); await AsyncStorage.removeItem('gameid');  this.props.navigation.navigate('home');}}>
                    <Image style={{marginLeft:10, width:24, height:24}} source={this.context.theme.mode==='dark'?require('./../assets/gameback-dark.png'):require('./../assets/gameback.png')}></Image>
                    </TouchableOpacity>
                    <Text style={{fontFamily:'Chakra Petch SemiBold', fontSize:24, marginLeft:88, color:colors[this.context.theme.mode].text1}}>Decision Room</Text>
                </View>
                
                <ScrollView ref={this.scrollViewRef} style={{ overflowX: 'none', maxHeight:Dimensions.get('window').height*0.9, backgroundColor:colors[this.context.theme.mode].background}} 
                    showsHorizontalScrollIndicator={false} horizontal decelerationRate={0} snapToInterval={Dimensions.get('window').width} snapToAlignment={"center"} scrollEnabled={false}>
                    
                    <View style={{width:Dimensions.get('window').width, padding:24}}>
                        <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between', width:Dimensions.get('window').width*0.9}}>
                            <Text style={{fontFamily:'Chakra Petch SemiBold', fontSize:22, color:colors[this.context.theme.mode].text1}}>
                                My Vote
                            </Text>
                            <TouchableOpacity onPress={()=>{this.detailstoggle('show');}}>
                                <Text style={{fontSize:14, fontFamily:'Chakra Petch Regular', color:'#4285F4'}}>Game Details</Text>
                            </TouchableOpacity>
                        </View>

                        <Text style={{fontFamily:'Chakra Petch Regular', fontSize:18, color:colors[this.context.theme.mode].text1, marginTop:8}}>
                            What was the winner of the game?
                        </Text>

                        <View style={{width:Dimensions.get('window').width*0.9, flexDirection:'row', alignItems:'center', justifyContent:'space-around', marginTop:30}}>
                            <TouchableOpacity style={{borderRadius:8, backgroundColor:this.state.myvote==='I won'? this.context.theme.mode==='dark'? '#1E9E40' : '#4285F4' : 'rgb(50,50,50)', flexDirection:'row', alignItems:'center', justifyContent:'center', width:160, height:180, flexDirection:'row', alignItems:'center', justifyContent:'center'}} onPress={()=>{this.setState({myvote:'I won'});}}>
                                <Text style={{color:'white', fontFamily:'Chakra Petch Regular', fontSize:18}}>I won</Text>

                            </TouchableOpacity>
                            
                            <TouchableOpacity style={{borderRadius:8, backgroundColor:this.state.myvote==='Opponent won'? this.context.theme.mode==='dark'? '#1E9E40' : '#4285F4' : '#928E8E', width:160, height:180, flexDirection:'row', alignItems:'center', justifyContent:'center'}} onPress={()=>{this.setState({myvote:'Opponent won'});}}>
                                <Text style={{color:'white', fontFamily:'Chakra Petch Regular', fontSize:18}}>Opponent won</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={{flexDirection:'row', alignItems:'center', justifyContent:'center', width:Dimensions.get('window').width*0.9, marginTop:20}}>
                            <TouchableOpacity style={{borderRadius:6, backgroundColor:this.state.myvote==='Draw'? this.context.theme.mode==='dark'? '#1E9E40' : '#4285F4' : '#928E8E', height:56, width: Dimensions.get('window').width*0.5,  flexDirection:'row', alignItems:'center', justifyContent:'center'}} onPress={()=>{this.setState({myvote:'Draw'});}}>
                                <Text style={{color:'white', fontFamily:'Chakra Petch Regular', fontSize:16}}>End as a draw</Text>
                            </TouchableOpacity>
                        </View>

                        <Text style={{width:Dimensions.get('window').width*0.9, textAlign:'center', color:colors[this.context.theme.mode].text1, marginTop:15, fontFamily:'Chakra Petch Regular', fontSize:18}}>{this.state.game.votes ? this.state.game.votes.filter(x=>x!=='').length+' out of '+this.state.game.wagersidlist.length+' votes confirmed' : ''}</Text>

                        <Text style={{width:Dimensions.get('window').width*0.9, textAlign:'center',color:this.state.votewarning==='We have a winner'?'green':'red', fontFamily:'Chakra Petch Regular', fontSize:16, marginTop:30}}>{this.state.votewarning}</Text>
                        <View style={{flexDirection:'column', alignItems:'center', justifyContent:'center', width:Dimensions.get('window').width*0.9, marginTop:8}}>
                            <TouchableOpacity style={{width:Dimensions.get('window').width*0.8, height:56, flexDirection:'row', alignItems:'center', justifyContent:'center', borderRadius:6, backgroundColor:this.state.myvote!==this.state.recordedvote?'#1E9E40':'#928E8E'}} onPress={()=>{this.state.myvote!==this.state.recordedvote?this.vote(this.state.myvote):'';}}>
                                <ActivityIndicator style={{display:this.state.reqloading?'flex':'none'}} color='white'></ActivityIndicator>
                                <Text style={{display:!this.state.reqloading?'flex':'none', color:'white', fontFamily:'Chakra Petch Regular', fontSize:16}}>Confirm Decision</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{width:Dimensions.get('window').width*0.8, height:56, flexDirection:'row', alignItems:'center', justifyContent:'center', borderRadius:6, backgroundColor:this.state.recordedvote!==''?'red':'#928E8E', marginTop:15}} onPress={()=>{this.state.recordedvote!==''?this.cancelvote():'';}}>
                                <ActivityIndicator style={{display:this.state.reqloading?'flex':'none'}} color='white'></ActivityIndicator>
                                <Text style={{display:!this.state.reqloading?'flex':'none', color:'white', fontFamily:'Chakra Petch Regular', fontSize:16}}>Cancel Decision</Text>
                            </TouchableOpacity>
                        </View>
                    </View>


                    <View style={{backgroundColor:colors[this.context.theme.mode].background, width:Dimensions.get('window').width, height:Dimensions.get('window').height*0.9}}>
                        <View style={{width:Dimensions.get('window').width, padding:24, flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
                            <Text style={{fontFamily:'Chakra Petch SemiBold', fontSize:18, color:colors[this.context.theme.mode].text1}}>Game Details</Text>
                            <TouchableOpacity onPress={()=>{this.detailstoggle('hide');}}>
                                <Text style={{fontFamily:'Chakra Petch Regular', fontSize:14, color:'#4285F4'}}>Hide Details</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{paddingLeft:24, paddingRight:24, paddingTop:20, borderTopColor:'#928E8E', borderLeftColor:'rgba(0,0,0,0)', borderRightColor:'rgba(0,0,0,0)', borderBottomColor:'rgba(0,0,0,0)', borderWidth:1}}>
                            <Text style={{fontFamily:'Chakra Petch SemiBold', fontSize:18, color:colors[this.context.theme.mode].text1}}>{this.state.game.gameid ? 'Game ID: '+this.state.game.gameid : 'Game ID:'}</Text>
                            <Text style={{fontFamily:'Chakra Petch SemiBold', fontSize:22, color:colors[this.context.theme.mode].text1, marginTop:25}}>Game Title</Text>
                            <Text style={{fontFamily:'Chakra Petch SemiBold', fontSize:20, color:colors[this.context.theme.mode].text1, marginTop:8}}>{this.state.game.gametitle ? this.state.game.gametitle : ''}</Text>
                            <Text style={{fontFamily:'Chakra Petch SemiBold', fontSize:22, color:colors[this.context.theme.mode].text1, marginTop:25}}>Game Description</Text>
                            <Text style={{fontFamily:'Chakra Petch Regular', fontSize:18, color:colors[this.context.theme.mode].text1, marginTop:8}}>{this.state.game.gamedesc ? this.state.game.gamedesc : ''}</Text>
                            <Text style={{fontFamily:'Chakra Petch SemiBold', fontSize:24, color:colors[this.context.theme.mode].text1, marginTop:25}}>{this.state.game.bettype==='h2h' ? 'Head 2 Head' : 'Admin'}</Text>
                            <Text style={{fontFamily:'Chakra Petch SemiBold', fontSize:26, color:this.context.theme.mode==='dark'?'rgb(40, 120, 20)':'#124D07', marginTop:25}}>{'NGN '+this.state.game.stake}</Text>
                        </View>    
                    </View>
                    
                    
                    <View style={{width:Dimensions.get('window').width, height:Dimensions.get('window').height, paddingTop:24, paddingBottom:24, paddingLeft:32, paddingRight:32, alignItems:'center'}}>
                        <Text style={{fontFamily:'Chakra Petch SemiBold', fontSize:20, color:colors[this.context.theme.mode].text1, textAlign:'center', marginTop:5}}>Final Agreement</Text>
                        <Text style={{display:this.state.winner==='draw'?'flex':'none', fontFamily:'Chakra Petch Regular', fontSize:18, color:colors[this.context.theme.mode].text1, textAlign:'center', marginTop:15}}>Do you agree to a draw?</Text>
                        <Text style={{display:this.state.winner!=='draw'?'flex':'none', fontFamily:'Chakra Petch Regular', fontSize:18, color:colors[this.context.theme.mode].text1, textAlign:'center', marginTop:15}}>{'Do you agree to '+(this.state.winner===''?'':this.state.winner)+' winning the bet?'}</Text>
                        <Text style={{fontFamily:'Chakra Petch SemiBold', fontSize:18, color:'red', textAlign:'center', marginTop:25}}>THIS DECISION CANNOT BE UNDONE AND IS THE FINAL STAGE FOR DECIDING THE WINNER</Text>
                        
                        <Text style={{fontFamily:'Chakra Petch SemiBold', fontSize:16, color:colors[this.context.theme.mode].text1, marginTop:35, textAlign:'center'}}>{this.state.agreementwarning}</Text>
                        <TouchableOpacity style={{width:Dimensions.get('window').width*0.8, height:56, flexDirection:'row', alignItems:'center', justifyContent:'center', borderRadius:6, backgroundColor:'#1E9E40', marginTop:10}} onPress={()=>{!this.state.reqloading?this.final():'';}}>
                            <ActivityIndicator style={{display:this.state.reqloading?'flex':'none'}} color="white"></ActivityIndicator>
                            <Text style={{display:!this.state.reqloading?'flex':'none', color:'white', fontFamily:'Chakra Petch Regular', fontSize:16}}>I Agree</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{width:Dimensions.get('window').width*0.8, height:56, flexDirection:'row', alignItems:'center', justifyContent:'center', borderRadius:6, backgroundColor:'red', marginTop:10}}  onPress={()=>{!this.state.reqloading?this.disagree():'';}}>
                            <ActivityIndicator style={{display:this.state.reqloading?'flex':'none'}} color="white"></ActivityIndicator>
                            <Text style={{display:!this.state.reqloading?'flex':'none', color:'white', fontFamily:'Chakra Petch Regular', fontSize:16}}>Go back</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>

                <View style={{display:this.state.loading?'flex':'none', position:'absolute', top:50, left:0, height:Dimensions.get('window').height*0.9, width:Dimensions.get('window').width, backgroundColor:colors[this.context.theme.mode].background, borderColor:'white', boderWidth:1, flexDirection:'column', alignItems:'center', justifyContent:'flex-start'}}>
                    <ActivityIndicator style={{marginTop:Dimensions.get('window').height*0.40}}></ActivityIndicator>
                </View>
            </View>
        );
    }
}

export default DecisionRoom;