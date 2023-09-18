import React, { Component }  from 'react';
import { View, Text, ScrollView, ActivityIndicator, Image, TextInput, TouchableOpacity, Dimensions, CheckBox } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Switch } from 'react-native-switch';
import { ThemeContext } from '../contexts/ThemeContext';
import { colors } from '../config/theme';

class CreateGame extends Component{
    static contextType = ThemeContext;

    state={
        psnid: '',
        gametitle: '',
        gametitlewarning: '',
        stake: '',
        userdata: {},
        name1: '',
        name2: '',
        gametype: 'PVP',
        gamedesc: '',
        gamedescwarning: '',
        includeDraw: false,
        loading: false,
        bettype: 'h2h',
        wagerstructure: 'default',
        reqloading: false,
        h2hwarning: '',
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

    faultFree = () => {
        if(this.state.gametitle && this.state.gamedesc && this.state.bettype && this.state.stake && parseInt(this.state.stake)<=parseInt(this.state.userdata.wallet) ){
            return true;
        }else{
            if(this.state.gametitle===''){
                this.setState({gametitlewarning: 'This field cannot be empty'});
            }

            if(this.state.gamedesc===''){
                this.setState({gamedescwarning: 'This field cannot be empty'});
            }

            if(this.state.stake===''){
                this.setState({stakewarning: 'This field cannot be empty'});
            }else{
                if( !(parseInt(this.state.stake)<=parseInt(this.state.userdata.wallet)) ){
                    this.setState({stakewarning: 'Insufficient funds in wallet for this stake'})
                }
            }

            return false;
        }
    }

    h2h = () => {
        this.setState({gametitlewarning:'', gamedescwarning:'', stakewarning:'', h2hwarning:''});
        if( this.faultFree() ){
            this.setState({reqloading:true});
            let payload = {
                creatorid: this.state.userdata.userid,
                creator: this.state.userdata.username,
                gametitle: this.state.gametitle,
                gamedesc: this.state.gamedesc,
                bettype: this.state.bettype,
                stake: this.state.stake,
            }

            fetch(
                'https://ppbe01.onrender.com/creategame',//"http://localhost:3000/creategame",
                {
                    method: 'POST',
                    body: JSON.stringify(payload),
                    headers: { 'Content-Type': 'application/json' }
                }
            ).then(response => {
                return response.json();
            }).then(async response => {
                console.log(response);
                if(response.msg==='success'){
                    await AsyncStorage.setItem('gameid', response.gameid);
                    this.setState({reqloading:false});
                    this.props.navigation.navigate('waitingroom');
                }else{
                    this.setState({h2hwarning: 'An error occurred, please try again later.', reqloading:false});
                }
            });
        }
    }

    admin = () => {
        this.setState({gametitlewarning:'', gamedescwarning:'', stakewarning:'', h2hwarning:''});
        if(this.faultFree()){
            this.setState({reqloading:true});
            let payload = {
                creatorid: this.state.userdata.userid,
                creator: this.state.userdata.username,
                gametitle: this.state.gametitle,
                gamedesc: this.state.gamedesc,
                bettype: this.state.bettype,
                stake: this.state.stake,
                pvtnames: [this.state.name1, this.state.name2],
                availablewagers: this.state.includeDraw ? [ this.state.name1!=='' ? (this.state.name1+' wins') : this.state.gametype==='PVP'?'Player1 wins':'Team1 wins', this.state.name2!==''?this.state.name2+' wins': this.state.gametype==='PVP'?'Player2 wins':'Team2 wins', 'Ends a draw'] : [ this.state.name1!=='' ? (this.state.name1+' wins') : this.state.gametype==='PVP'?'Player1 wins':'Team1 wins', this.state.name2!==''?this.state.name2+' wins': this.state.gametype==='PVP'?'Player2 wins':'Team2 wins' ]
            }

            fetch(
                'https://ppbe01.onrender.com/creategame2',//"http://localhost:3000/creategame2",
                {
                    method: 'POST',
                    body: JSON.stringify(payload),
                    headers: { 'Content-Type': 'application/json' }
                }
            ).then(response => {
                return response.json();
            }).then(async response => {
                console.log(response);
                if(response.msg==='success'){
                    await AsyncStorage.setItem('gameid', response.gameid);
                    this.setState({reqloading:false});
                    this.props.navigation.navigate('waitingroom2');
                }else{
                    this.setState({h2hwarning: 'An error occurred, please try again later.', reqloading:false});
                }
            });
        }
    }

    render(){
        return(
            <View style={{flexDirection:'column', alignItems:'flex-start', justifyContent:'flex-start', backgroundColor:colors[this.context.theme.mode].background}}>
                <ActivityIndicator style={{display:this.state.loading?'flex':'none', position:'absolute', top: Dimensions.get('window').height*0.45,  left: Dimensions.get('window').width*0.48}}></ActivityIndicator>
                <View style={{display:!this.state.loading?'flex':'none', flexDirection:'row', alignItems:'center', justifyContent:'flex-start', marginTop:20}}>
                    <TouchableOpacity onPress={()=>{this.props.navigation.navigate('home')}}>
                    <Image style={{marginLeft:10, width:24, height:24}} source={this.context.theme.mode==='dark'?require('./../assets/gameback-dark.png'):require('./../assets/gameback.png')}></Image>
                    </TouchableOpacity>
                    <Text style={{fontFamily:'Chakra Petch SemiBold', fontSize:24, marginLeft:108, color:colors[this.context.theme.mode].text1}}>Create Game</Text>
                </View>
                
                <ScrollView  style={{display:!this.state.loading?'flex':'none', paddingLeft:24, paddingRight:24, width: Dimensions.get('window').width, height:Dimensions.get('window').height*0.9, marginTop:20}}>
                    <Text style={{fontFamily:'Chakra Petch Regular', fontSize:18, display:this.state.userdata.username?'flex':'none', color:colors[this.context.theme.mode].text1}}>
                        {'Creator: @'+this.state.userdata.username}
                    </Text>

                    <View style={{marginTop:10,}}>
                    <TextInput
                        placeholder='Game Title'
                        value={this.state.gametitle}
                        onChangeText={e=>{this.setState({gametitle: e});}}
                        style={{width:Dimensions.get('window').width*0.9, fontFamily:'Chakra Petch Regular', fontSize:18, borderWidth:1, borderColor:colors[this.context.theme.mode].inputborder1, paddingLeft:10, paddingRight:10, paddingTop:10, paddingBottom:10, borderRadius:8, color:colors[this.context.theme.mode].text1}}
                    />
                    <Text style={{color:'red', fontFamily:'Chakra Petch Regular', fontSize:14, marginTop:5}}>{this.state.gametitlewarning}</Text>
                    </View>

                    <View style={{marginTop:25,}}>
                    <TextInput
                        multiline
                        placeholder={'Game description...'}
                        value={this.state.gamedesc}
                        onChangeText={ e=>{this.setState({gamedesc: e}); }}
                        style={{width:Dimensions.get('window').width*0.9, height:148, borderWidth:1, borderColor:colors[this.context.theme.mode].inputborder1, fontFamily:'Chakra Petch Regular', fontSize:18, padding:10, borderRadius:8, color:colors[this.context.theme.mode].text1}}
                    />
                    <Text style={{color:'red', fontFamily:'Chakra Petch Regular', fontSize:14, marginTop:5}}>{this.state.gamedescwarning}</Text>
                    </View>

                    <View style={{width:372, flexDirection:'row', alignItems:'center', justifyContent:'space-between', paddingTop:20, paddingBottom:20, marginTop:20, borderWidth:1, borderBottomColor:'#C8D1DB', borderTopColor:'#C8D1DB', borderRightColor:'rgba(0,0,0,0)', borderLeftColor:'rgba(0,0,0,0)'}}>
                        <Text style={{fontFamily:'Chakra Petch Regular', fontSize:20, marginLeft:10, color:colors[this.context.theme.mode].text1}}>Decider</Text>
                        <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between', }}>
                            <Text style={{fontSize:16, fontFamily:'Chakra Petch Regular', color:this.state.bettype==='h2h'? colors[this.context.theme.mode].text3 : '#C8D1DB', marginRight:12}}>Head 2 Head</Text>
                            <Switch
                                value={this.state.bettype==='h2h'?false:true}
                                onValueChange={(e)=>{ e ? this.setState({bettype:'admin'}) : this.setState({bettype:'h2h'}); }}
                                inActiveText=''
                                activeText=''
                                backgroundActive={colors[this.context.theme.mode].text3}
                                backgroundInactive={colors[this.context.theme.mode].text3}
                                circleActiveColor={this.context.theme.mode==='dark'?'#343434':'#928E8E'}
                                circleInActiveColor={this.context.theme.mode==='dark'?'#343434':'#928E8E'}
                                circleBorderActiveColor={colors[this.context.theme.mode].text3}
                                circleBorderInactiveColor={colors[this.context.theme.mode].text3}
                                circleBorderWidth={4}
                            />
                            <Text style={{fontSize:16, fontFamily:'Chakra Petch Regular',  color:this.state.bettype==='admin'? colors[this.context.theme.mode].text3 : '#C8D1DB', marginLeft:12}}>Admin</Text>
                        </View>
                    </View>

                    <View>
                    <View style={{marginTop:20, flexDirection:'row', alignItems:'center', justifyContent:'flex-start', width:Dimensions.get('window').width*0.9, height:50, borderWidth:1, borderColor:colors[this.context.theme.mode].text1, borderRadius:8, paddingRight:15}}>
                        <TouchableOpacity style={{backgroundColor:'#D3D4D7', paddingTop:12, paddingBottom:12, paddingLeft:20, paddingRight:20, borderTopLeftRadius:7, borderBottomLeftRadius:7 }}>
                            <Image style={{width:24, height:24}} source={require('./../assets/naira.png')} />
                        </TouchableOpacity>
                        <TextInput
                            onChangeText={(e)=>{this.setState({stake: e});}}
                            value={this.state.stake}
                            keyboardType='numeric'
                            style={{marginLeft:10, height:50, width:358, outlineStyle:'none', fontSize:28, fontFamily:'Chakra Petch SemiBold', color:colors[this.context.theme.mode].text1}}
                        />
                    </View>
                    <Text style={{color:'red', fontFamily:'Chakra Petch Regular', fontSize:14, marginTop:5}}>{this.state.stakewarning}</Text>
                    </View>
                    
                    <Text style={{color:'red', fontFamily:'Chakra Petch Regular', fontSize:14, marginTop:5}}>{this.state.h2hwarning}</Text>
                    <TouchableOpacity style={{display:this.state.bettype==='h2h'?'flex':'none', flexDirection:'row', alignItems:'center', justifyContent:'center', backgroundColor:this.context.theme.mode==='dark'?'#1E9E40':'#928E8E', width:362, height:56, borderRadius:6, marginTop:50, marginBottom:10}} onPress={()=>{!this.state.reqloading ? this.h2h() : '';}}>
                        <ActivityIndicator style={{display:this.state.reqloading?'flex':'none'}} color='white'></ActivityIndicator>
                        <Text style={{display:!this.state.reqloading?'flex':'none', color:'white', fontFamily:'Chakra Petch Regular', fontSize:15}}>Proceed</Text>
                    </TouchableOpacity>
                    
                    <View style={{display:this.state.bettype==='admin'?'flex':'none'}}>
                        <View style={{display:this.state.wagerstructure==='default'?'flex':'none'}}>
                            <View style={{width:Dimensions.get('window').width*0.9, marginTop:25, flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
                                <TouchableOpacity style={{borderRadius:6, backgroundColor:this.context.theme.mode==='dark'? this.state.gametype==='PVP'?'#1E9E40':'rgba(200, 200, 200, 0.7)' : this.state.gametype==='PVP'?'black':'rgba(200, 200, 200, 0.7)', width:140, height:45, flexDirection:'row', alignItems:'center', justifyContent:'center'}} onPress={()=>{this.setState({gametype: 'PVP'});}}>
                                    <Text style={{color:'white', fontFamily:'Chakra Petch Regular', fontSize:16}}>Single Match</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{borderRadius:6, backgroundColor:this.context.theme.mode==='dark'? this.state.gametype==='TVT'?'#1E9E40':'rgba(200, 200, 200, 0.7)' : this.state.gametype==='TVT'?'black':'rgba(200, 200, 200, 0.7)', width:140, height:45, flexDirection:'row', alignItems:'center', justifyContent:'center'}} onPress={()=>{this.setState({gametype: 'TVT'});}}>
                                    <Text style={{color:'white', fontFamily:'Chakra Petch Regular', fontSize:16}}>Team Match</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={{flexDirection:'column', alignItems:'center', justifyContent:'flex-start', marginTop:25, width:Dimensions.get('window').width*0.9, paddingLeft:24, paddingRight:24}}>
                                <Text style={{fontFamily:'Chakra Petch Regular', fontSize:20, width:Dimensions.get('window').width*0.9, color:colors[this.context.theme.mode].text1}}>Contestants</Text>
                                <View style={{flexDirection:'row', alignItems:'flex-start', justifyContent:'center', width:Dimensions.get('window').width*0.9, marginTop:10, boxSizing:'border-box'}}>
                                    <View style={{width:190, flexDirection:'column', justifyContent:'flex-start', alignItems:'flex-start', /*borderWidth:1, borderLeftColor:'black'*/}}>
                                        <TextInput  
                                            value={this.state.name1}
                                            onChangeText={e=>{ this.setState({name1: e}); }}
                                            placeholder={this.state.gametype==='PVP'?'Player 1':'Team 1'}
                                            style={{width:180, fontFamily:'Chakra Petch Regular', fontSize:18, color:this.context.theme.mode==='dark'?'rgb(60,100,255)':'#0F19A6', borderWidth:1, borderColor:this.context.theme.mode==='dark'?'rgb(60,100,255)':'#0F19A6', outlineStyle:'none', paddingLeft:5, paddingRight:5, paddingTop:8, paddingBottom:8, borderRadius:6, marginTop:5}}
                                        />
                                    </View>
                                    <View style={{width:190, flexDirection:'column', justifyContent:'flex-start', alignItems:'flex-end', /*borderWidth:1, borderLeftColor:'black'*/}}>
                                        <TextInput
                                            value={this.state.name2}
                                            onChangeText={e=>{ this.setState({name2: e}); }}
                                            placeholder={this.state.gametype==='PVP'?'Player 2':'Team 2'}
                                            style={{width:180, fontFamily:'Chakra Petch Regular', color:this.context.theme.mode==='dark'?'rgb(255,80,80)':'#F41919', fontSize:18, borderWidth:1, borderColor:this.context.theme.mode==='dark'?'rgb(255,80,80)':'#F41919', outlineStyle:'none', paddingLeft:5, paddingRight:5, paddingTop:8, paddingBottom:8, borderRadius:6, marginTop:5}}
                                        />
                                    </View>
                                </View>
                            </View>

                            <View style={{marginTop:25, width:Dimensions.get('window').width*0.9, flexDirection:'column', justifyContent:'flex-start', alignItems:'center'}}>
                                <Text style={{fontFamily:'Chakra Petch Regular', fontSize:20, width:Dimensions.get('window').width*0.9, color:colors[this.context.theme.mode].text1}}>Available Wagers</Text>

                                <View style={{marginTop:15, width:Dimensions.get('window').width*0.95, flexDirection:'row', alignItems:'center', justifyContent:'space-around', flexWrap:'wrap'}}>
                                    <TouchableOpacity style={{backgroundColor:'rgba(15,25,166,0.3)', borderRadius:6, padding:10, marginTop:10}}>
                                        <Text style={{fontFamily:'Chakra Petch Regular', fontSize:16, color:this.context.theme.mode==='dark'?'rgb(60,100,255)':'#0F19A6'}}>{this.state.name1!==''? (this.state.name1+' wins') : this.state.gametype==='PVP'?'Player1 wins':'Team1 wins'}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{display:this.state.includeDraw?'flex':'none', backgroundColor:'rgba(146,142,142,0.3)', borderRadius:6, padding:10, marginTop:10}}>
                                        <Text style={{fontFamily:'Chakra Petch Regular', fontSize:16, color:'#928E8E'}}>Ends a draw</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{backgroundColor:'rgba(244,25,25,0.3)', borderRadius:6, padding:10, marginTop:10}}>
                                        <Text style={{fontFamily:'Chakra Petch Regular', fontSize:16, color:this.context.theme.mode==='dark'?'rgb(255,80,80)':'#F41919'}}>{this.state.name2!==''? (this.state.name2+' wins') : this.state.gametype==='PVP'?'Player2 wins':'Team2 wins'}</Text>
                                    </TouchableOpacity>
                                </View> 

                                <View style={{marginTop:15, flexDirection:'row', alignItems:'center', justifyContent:'flex-start'}}>
                                    <CheckBox
                                        value={this.state.includeDraw}
                                        onValueChange={ (e)=>{this.setState({includeDraw:e}); }}
                                    />
                                    <Text style={{marginLeft:10, color:colors[this.context.theme.mode].text1, fontSize:16, fontFamily:'Chakra Petch Regular'}}>Add a draw wager</Text>
                                </View>
                            </View>
                        </View>


                        <TouchableOpacity style={{flexDirection:'row', alignItems:'center', justifyContent:'center', backgroundColor:colors[this.context.theme.mode].btn2, width:362, height:56, borderRadius:6, marginTop:25, marginBottom:80}}onPress={()=>{!this.state.reqloading ? this.admin() : '';}}>
                            <ActivityIndicator style={{display:this.state.reqloading?'flex':'none'}} color='white'></ActivityIndicator>
                            <Text style={{display:!this.state.reqloading?'flex':'none', color:'white', fontFamily:'Chakra Petch Regular', fontSize:15}}>Proceed</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        );
    }
}

export default CreateGame;

/* 
    <Text style={{fontFamily:'Chakra Petch Regular', color:'#646060', fontSize:16}}>Input the PSN ID of a player in the game you want to create</Text>
                        <TextInput
                            placeholder={'PSN ID'}
                            value={this.state.psnid}
                            onChangeText={(e)=>{this.setState({psnid: e});}}
                            style={{marginTop:85, width:362, borderRadius:8, height:56, borderWidth:1, borderLeftColor:'#928E8E', fontSize:30, fontFamily:'Chakra Petch SemiBold', paddingLeft:15, paddingRight:15}}
                        />
*/

/*
<View style={{ width: Dimensions.get('window').width, alignItems:'center'}}>
                        <View style={{flexDirection:'row', justifyContent:'flex-start', alignItems:'center', width:382}}>
                            <Text style={{fontFamily:'Chakra Petch SemiBold', fontSize:18}}>Game Code: 12ec4gh73m</Text>
                            <Image style={{marginLeft:10, width:20, height:20}} source={require('./../assets/copy.png')}/>
                        </View>
                        <View style={{marginTop:9, width:382, height:198}}>
                            <Image source={require('./../assets/gamebg.png')}/>
                            <View style={{position:'absolute', width:382, height:198, flexDirection:'column', alignItems:'center', justifyContent:'flex-start'}}>
                                <Text style={{marginTop:28, color:'white', fontSize:16, fontFamily:'Chakra Petch Regular'}}>Game Details</Text>
                                <View style={{marginTop:36, flexDirection:'row', alignItems:'center', justifyContent:'space-around', width:342, height:80}}>
                                    <View style={{flexDirection:'column', alignItems:'center', justifyContent:'space-between', height:80}}>
                                        <Text style={{color:'white', fontFamily:'Chakra Petch SemiBold', fontSize:18}}>Player1</Text>
                                        <Image source={require('./../assets/player1.png')}/>
                                    </View>
                                    <Text style={{color:'white', fontFamily:'Chakra Petch SemiBold', fontSize:24}}>VS</Text>
                                    <View style={{flexDirection:'column', alignItems:'center', justifyContent:'space-between', height:80}}>
                                        <Text style={{color:'white', fontFamily:'Chakra Petch SemiBold', fontSize:18}}>Player2</Text>
                                        <Image source={require('./../assets/player2.png')}/>
                                    </View>
                                </View>  
                            </View>
                        </View>
                        <View style={{width:382, marginTop:30, flexDirection:'row', alignItems:'center', justifyContent:'space-around'}}>
                            <TouchableOpacity style={{backgroundColor:'rgba(15,25,166,0.3)', padding:10, borderRadius:5 }}>
                                <Text style={{fontFamily:'Chakra Petch Regular', fontSize:14, color:'#0F19A6'}}>Player1 wins</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{backgroundColor:'rgba(146,142,142,0.3)', padding:10, borderRadius:5 }}>
                                <Text style={{fontFamily:'Chakra Petch Regular', fontSize:14, color:'#928E8E'}}>Ends as draw</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{backgroundColor:'rgba(244,25,25,0.3)', padding:10, borderRadius:5 }}>
                                <Text style={{fontFamily:'Chakra Petch Regular', fontSize:14, color:'#F41919'}}>Player2 wins</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{marginTop:31, flexDirection:'column', justifyContent:'flex-start', alignItems:'flex-start'}}>
                            <Text style={{fontFamily:'Chakra Petch Regular', fontSize:18, color:'#646060'}}>Stake</Text>
                            <View style={{flexDirection:'row', alignItems:'center', justifyContent:'flex-start', width:382, height:56, borderWidth:1, borderLeftColor:'black', borderRadius:8, paddingLeft:15, paddingRight:15}}>
                                <Image style={{width:24, height:24}} source={'./../assets/naira.png'} />
                                <TextInput
                                    onChangeText={(e)=>{this.setState({stake: e});}}
                                    value={this.state.stake}
                                    keyboardType='numeric'
                                    style={{marginLeft:10, height:56, width:358, outlineStyle:'none', fontSize:30, fontFamily:'Chakra Petch SemiBold'}}
                                />
                            </View>
                        </View>
                        <TouchableOpacity style={{flexDirection:'row', alignItems:'center', justifyContent:'center', backgroundColor:'black', width:362, height:56, borderRadius:6, marginTop:35}}>
                            <Text style={{color:'white', fontFamily:'Chakra Petch Regular', fontSize:15}}>Confirm</Text>
                        </TouchableOpacity>
                    </View>
*/


//Wager Style
/*
    <View style={{width:372, flexDirection:'row', alignItems:'center', justifyContent:'space-between', paddingTop:20, paddingBottom:20, marginTop:20, borderWidth:1, borderBottomColor:'#C8D1DB', borderTopColor:'#C8D1DB', borderRightColor:'rgba(0,0,0,0)', borderLeftColor:'rgba(0,0,0,0)'}}>
                            <Text style={{fontFamily:'Chakra Petch Regular', fontSize:20, marginLeft:10, color:colors[this.context.theme.mode].text1}}>Wager Style</Text>
                            <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between', }}>
                                <Text style={{fontSize:16, fontFamily:'Chakra Petch Regular', color:this.state.wagerstructure==='default'? colors[this.context.theme.mode].text3 : '#C8D1DB', marginRight:12}}>Default</Text>
                                <Switch
                                    value={this.state.wagerstructure==='default'?false:true}
                                    onValueChange={(e)=>{ e ? this.setState({wagerstructure:'custom'}) : this.setState({wagerstructure:'default'}); }}
                                    inActiveText=''
                                    activeText=''
                                    backgroundActive={colors[this.context.theme.mode].text3}
                                    backgroundInactive={colors[this.context.theme.mode].text3}
                                    circleActiveColor={this.state.screenmode==='dark'?'#343434':'#928E8E'}
                                    circleInActiveColor={this.state.screenmode==='dark'?'#343434':'#928E8E'}
                                    circleBorderActiveColor={colors[this.context.theme.mode].text3}
                                    circleBorderInactiveColor={colors[this.context.theme.mode].text3}
                                    circleBorderWidth={4}
                                />
                                <Text style={{fontSize:16, fontFamily:'Chakra Petch Regular',  color:this.state.wagerstructure==='custom'? colors[this.context.theme.mode].text3 : '#C8D1DB', marginLeft:12}}>Custom</Text>
                            </View>
                        </View>

*/