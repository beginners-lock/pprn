import React, { Component } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Image, Dimensions, TouchableOpacity, ActivityIndicator} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
//import GoogleLoginButton from '../../components/googleLoginBtn.js';
//import { router } from 'expo-router';


class Onboarding extends Component{
    constructor(props){
        super(props);
        this.scrollViewRef = React.createRef();
    }

    state = {
        page: 0,
        user: null,
        loading:false,
        screenmode:''
    }

    async componentDidMount(){
        let screenmode = await AsyncStorage.getItem('screenmode');
        this.setState({screenmode: screenmode});
        this.timer = setInterval(()=>{
            let page = this.state.page<=1 ? this.state.page+1 : 0; 
            this.scrollViewRef.current?.scrollTo({ x: Dimensions.get('window').width * page, animated: true});
            this.setState({page: page});
        }, 5000);
    }

    navigate = async (response) => {
        if(response.data){
            this.setState({loading:true});
            await AsyncStorage.setItem('userdata', JSON.stringify(response.data));
            this.setState({loading:false});
            console.log('hiii');
            this.props.navigation.navigate('home')
        }
    }

    componentWillUnmount(){
        clearInterval(this.timer);
    }

    render(){
        return(
            <SafeAreaView style={{width: Dimensions.get('window').width, height:Dimensions.get('window').height, backgroundColor:this.state.screenmode==='dark'?'#181818':'white'}}>
                <ActivityIndicator style={{margin:'auto', display:this.state.loading?'flex':'none'}}></ActivityIndicator>
                <ScrollView ref={this.scrollViewRef} style={{ display:!this.state.loading?'flex':'none', overflowX: 'none', maxHeight:550}} 
                    showsHorizontalScrollIndicator={false} horizontal decelerationRate={0} snapToInterval={Dimensions.get('window').width} snapToAlignment={"center"} scrollEnabled={false}>
                    <View style={styles.gallDiv1}>
                        <View style={styles.textCont1}>
                            <Text style={{fontFamily:'Chakra Petch SemiBold', fontSize: 30, color:this.state.screenmode==='dark'?'white':'black'}}>Your Friends are Here!</Text>
                            <Text style={{fontFamily:'Chakra Petch Regular', fontSize: 14, color:this.state.screenmode==='dark'?'#949494':'black'}}>PacPlay, where friends stake together and win together.</Text>
                        </View>
                        <Image style={styles.img1} source={require('./../assets/mbappeleft.png')}></Image>
                    </View>
                    <View style={styles.gallDiv2}>
                        <Image style={styles.img2} source={require('./../assets/mbapperight.png')}></Image>
                        <View style={styles.textCont2}>
                            <Text style={{fontFamily:'Chakra Petch SemiBold', fontSize: 30, textAlign: 'right', color:this.state.screenmode==='dark'?'white':'black'}}>"Bet, stake and celebrate with friends!"</Text>
                            <Text style={{fontFamily:'Chakra Petch Regular', fontSize: 14, textAlign: 'right', color:this.state.screenmode==='dark'?'#949494':'black'}}>Join the ultimate betting experience. Invite friends, stake bets and let the winnings flow!</Text>
                        </View>
                    </View>
                    <View style={styles.gallDiv3}>
                        <View style={{flex:1, flexDirection: 'row', justifyContent: 'space-between', alingItems: 'center', width: Dimensions.get('window').width, marginTop: 50}}>
                            <Image style={{width:180, height:180 }} source={require('./../assets/handcash.png')}></Image>
                            <Image style={{width:180, height:180 }} source={require('./../assets/coinbag.png')}></Image>
                        </View>
                        <View style={styles.textCont3}>
                            <Text style={{fontFamily:'Chakra Petch SemiBold', fontSize: 30, textAlign: 'center', color:this.state.screenmode==='dark'?'white':'black'}}>"Double the fun, double the stakes!</Text>
                            <Text style={{fontFamily:'Chakra Petch Regular', fontSize: 14, textAlign: 'center', color:this.state.screenmode==='dark'?'#949494':'black'}}>"Turn bets into shared victories! Invite friends to join your betting circle and enjoy winning together"</Text>
                        </View>
                    </View>
                </ScrollView>
                <View style={{width: Dimensions.get('window').width, flexDirection:'column', alignItems:'center', marginTop: 20}}>
                    <TouchableOpacity style={{flexDirection:'row', alignItems: 'center', justifyContent: 'center', marginTop:20}} onPress={()=>{this.props.navigation.navigate('createacc');}}>
                        <Image style={{width:240, height:41}} source={this.state.screenmode==='dark'?require('./../assets/blackrect-dark.png'):require('./../assets/blackrect.png')}/>
                        <Text style={{ position:'absolute', fontFamily:'Chakra Petch Regular', color:'white'}}>
                            Create an account
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{flexDirection:'row', alignItems: 'center', justifyContent: 'center', marginTop:15}} onPress={()=>{this.props.navigation.navigate('loginacc');}} >
                        <Image style={{width:240, height:41}} source={this.state.screenmode==='dark'?require('./../assets/whiterect-dark.png'):require('./../assets/whiterect.png')}/>
                        <Text style={{ position:'absolute', fontFamily:'Chakra Petch Regular', color:this.state.screenmode==='dark'?'white':'black'}}>Login to account</Text>
                    </TouchableOpacity>
                    
                </View>
            </SafeAreaView>
        )
    }
} 

/*
    <GoogleLoginButton
                        navigate={this.navigate}
                    />
 */

const styles = StyleSheet.create({
    gallDiv1: {
        flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', width: Dimensions.get('window').width, height:500, marginTop:50
    },

    gallDiv2: {
        flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', width: Dimensions.get('window').width, height:500, marginTop:50
    },

    gallDiv3: {
        flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', width: Dimensions.get('window').width, height:500, marginTop:50
    },

    textCont1: {
        width:180, /*borderWidth: 2, borderLeftColor: 'blue',*/ position: 'absolute', left: 10
    },

    textCont2: {
        width:220, /*borderWidth: 2, borderLeftColor: 'blue',*/ position: 'absolute', right:10
    },

    textCont3: {
        width:280, /*borderWidth: 2, borderLeftColor: 'blue',*/ position: 'absolute', bottom:90
    },

    img1: { width:260, height:500, marginLeft:0, marginRight:0},
    img2: { width:225, height:500, marginLeft:0, marginRight:0},
});


export default Onboarding;