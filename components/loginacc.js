import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { Component } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, Dimensions, ActivityIndicator, ScrollView } from 'react-native';
import { ThemeContext } from '../contexts/ThemeContext';
import { colors } from '../config/theme';

class LoginAcc extends Component{
    static contextType = ThemeContext;

    constructor(props){
        super(props);
        this.scrollViewRef = React.createRef();
        this.input1 = React.createRef(null);
        this.input2 = React.createRef(null);
        this.input3 = React.createRef(null);
        this.input4 = React.createRef(null);
        this.input5 = React.createRef(null);
        this.input6 = React.createRef(null);
    }

    state={
        username:'',
        usernamewarning:'',
        password:'',
        passwordwarning:'',
        pass1toggle:'Show Password',
        reqloading: false,
        processwarning: '',
        changepassvars: {},
        digit1: '',
        digit2: '',
        digit3: '',
        digit4: '',
        digit5: '',
        digit6: '',
        vcodeloading: false,
        emailloader: false,
        verificationwarning: '',
        vwcolor: '',
        fpass1: '',
        fpass2: '',
        fpass1toggle: 'Show Password',
        fpass2toggle: 'Show Password',
        reqloading2: false,
        fpass1warning:'',
        fpass2warning:'',
        fprocesswarning: ''
    }

    loginaccount = () => {
        if(!this.state.reqloading){
            this.setState({usernamewarning:'', passwordwarning:'', processwarning:''});
            if(this.state.password!=='' && this.state.username!=='' ){
                let data = {
                    username: this.state.username,
                    password: this.state.password
                }

                console.log(data);
                this.setState({reqloading: true});
                const response = fetch(
                    'https://ppbe01.onrender.com/loginaccount',//"http://localhost:3000/loginaccount",
                    {
                        method: 'POST',
                        body: JSON.stringify(data),
                        headers: { 'Content-Type': 'application/json' }
                    }  
                ).then(response=>{
                    return response.json();
                }).then(async response=>{
                    if(response.msg==='200'){
                        await AsyncStorage.setItem('userdata', JSON.stringify(response.data));
                        console.log(response.data);
                        this.props.navigation.navigate('user');
                        this.setState({reqloading: false});
                    }else{
                        this.setState({usernamewarning:response.msg, passwordwarning:response.msg, reqloading: false});
                    }
                });
            }else{
                if(this.state.username===''){ this.setState({usernamewarning:'This field cannot be empty'}); } 
                if(this.state.password===''){ this.setState({passwordwarning:'This field cannot be empty'}); }
            }
        }
    }

    forgotpassword = () => {
        if(this.state.username===''){
            this.setState({usernamewarning:'This field has to be provided for a password change', passwordwarning:''});
        }else{
            this.setState({usernamewarning:'', processwarning:'', reqloading:true});
            fetch(
                'https://ppbe01.onrender.com/passwordchangepossible',//"http://localhost:3000/passwordchangepossible",
                {
                    method: 'POST',
                    body: JSON.stringify({ username: this.state.username }),
                    headers: { 'Content-Type': 'application/json' }
                }  
            ).then(response=>{
                return response.json();
            }).then(async response=>{
                if(response.msg==='success'){
                    this.resendcode(response.data.username, response.data.email);
                    this.setState({changepassvars: response.data, reqloading:false});
                    this.scrollViewRef.current?.scrollTo({ x: Dimensions.get('window').width*1, animated: true});
                }else{
                    this.setState({processwarning: response.msg, reqloading: false})
                }
            })
        }
    }

    verifycode = () => {
        this.setState({verificationwarning:'', vwcolor:''});
        if(this.state.digit1===''&&this.state.digit2===''&&this.state.digit3===''&&this.state.digit4===''&&this.state.digit5===''&&this.state.digit6===''){
            this.setState({verificationwarning:'Field cannot be empty', vwcolor:'red'});
        
        }else{
            if(this.state.digit1===''||this.state.digit2===''||this.state.digit3===''||this.state.digit4===''||this.state.digit5===''||this.state.digit6===''){
                this.setState({verificationwarning:'6 digit code incomplete', vwcolor:'red'});
            
            }else{
                let code = this.state.digit1+this.state.digit2+this.state.digit3+this.state.digit4+this.state.digit5+this.state.digit6;
                this.setState({vcodeloading:true});
                let data = {
                    username:this.state.changepassvars.username, 
                    email:this.state.changepassvars.email, code:code};

                const response = fetch(
                    'https://ppbe01.onrender.com/passwordverifyemail',//"http://localhost:3000/passwordverifyemail",
                    {
                        method: 'POST',
                        body: JSON.stringify(data),
                        headers: { 'Content-Type': 'application/json' }
                    }  
                ).then(response=>{
                    return response.json();
                }).then(async response=>{

                    this.setState({vcodeloading:false, verificationwarning:response.msg});
                    if(response.msg==='Email verified'){  
                        this.setState({vwcolor:'green'});
                        this.scrollViewRef.current?.scrollTo({ x: Dimensions.get('window').width*2, animated: true});
                    }else{
                        this.setState({vwcolor:'red'});
                    }
                });
            }
        }
    }

    resendcode = (username, email) => {
        if(email && email!==''){
            this.setState({emailloader: true, processwarning:''});
            const response = fetch(
                'https://ppbe01.onrender.com/sendemailcode',//"http://localhost:3000/sendemailcode",
                {
                    method: 'POST',
                    body: JSON.stringify({username: username, email: email}),
                    headers: { 'Content-Type': 'application/json' }
                }  
            ).then(response=>{
                return response.json();
            }).then(async response=>{
                console.log(response.msg);
                this.setState({emailloader:false});
                if(response.msg==='A code has been sent to this email'){  
                    this.setState({verificationwarning:response.msg, vwcolor: 'green'});
                }else{
                    this.setState({verificationwarning:response.msg, vwcolor: 'red'});
                }
            });
        }else{  	
            this.goback();
        }
    }

    goback = () => {
        this.scrollViewRef.current?.scrollTo({ x: 0, animated: true});
    }

    changepassword = () => {
        this.setState({fpass1warning:'', fpass2warning:'', fprocesswarning:''});
        if(this.state.fpass1==='' || this.state.fpass2==='' || this.state.fpass1!==this.state.fpass2){
            if(this.state.fpass1===''){
                this.setState({fpass1warning: 'This field cannot be empty'});
            } 
            
            if(this.state.fpass2===''){
                this.setState({fpass2warning: 'This field cannot be empty'});
            }
    
            if(this.state.fpass1!==this.state.fpass2){
                this.setState({fpass1warning:'Passwords are not similar', fpass2warning:'Passwords are not similar'});
            }
        }else{
            this.setState({reqloading2: true});
            fetch(
                'https://ppbe01.onrender.com/forgotpassword',//"http://localhost:3000/forgotpassword",
                {
                    method: 'POST',
                    body: JSON.stringify({password: this.state.fpass1, username:this.state.changepassvars.username, email:this.state.changepassvars.email}),
                    headers: { 'Content-Type': 'application/json' }
                }  
            ).then(response=>{
                return response.json();
            }).then(async response=>{
                if(response.msg === 'success'){
                    this.goback();
                }else{
                    this.setState({fprocesswarning: response.msg});
                }

                this.setState({reqloading2: false});
            });
        }
    }

    render(){
        return(
            <ScrollView ref={this.scrollViewRef} style={{ display:!this.state.loading?'flex':'none', overflowX: 'none'}} 
                showsHorizontalScrollIndicator={false} horizontal decelerationRate={0} snapToInterval={Dimensions.get('window').width} snapToAlignment={"center"} scrollEnabled={false}>
                <View style={{height:Dimensions.get('window').height, backgroundColor: colors[this.context.theme.mode].background}}>
                    <View style={{display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'flex-start', marginTop:20}}>
                        <TouchableOpacity style={{marginLeft:10}} onPress={()=>{this.props.navigation.navigate('onboarding');}}>
                            <Image style={{width:24, height:24}} source={this.context.theme.mode?require('./../assets/gameback-dark.png'):require('./../assets/gameback.png')} ></Image>
                        </TouchableOpacity>
                        <Text style={{fontFamily:'Chakra Petch SemiBold', fontSize:24, marginLeft:138, color:colors[this.context.theme.mode].text1}}>Login</Text>
                    </View>
                    <View style={{width: Dimensions.get('window').width, flexDirection:'column', justifyContent:'flex-start', alignItems:'center', marginTop:40/*, borderWidth:1, borderLeftColor:'black'*/}}>
                        <Text style={{fontFamily:'Chakra Petch SemiBold', fontSize:22, textAlign:'left', width:378, color:colors[this.context.theme.mode].text1}}>Welcome Back</Text>
                        <Text style={{fontFamily:'Chakra Petch SemiBold', fontSize:22, color:colors[this.context.theme.mode].text2, textAlign:'left', width:378, marginBottom:10}}>Fill in your login details</Text>
                        <Text style={{fontFamily:'Chakra Petch Regular', width:378, fontSize:14, color:colors[this.context.theme.mode].text2, marginTop:10}}>New to Pacplay? 
                            <TouchableOpacity onPress={()=>{this.props.navigation.navigate('createacc')}}><Text style={{color:colors[this.context.theme.mode].text3, marginLeft:5}}>Create an account</Text></TouchableOpacity></Text>

                        <View style={{marginTop:20}}>
                            <Text style={{fontFamily:'Chakra Petch Regular', fontSize:16, color:colors[this.context.theme.mode].inputlabel1}}>Username</Text>
                            <View style={{marginTop:10, flexDirection:'row', alignItems:'center', justifyContent:'space-between', width:378, flexWrap:'wrap'}}>
                                <TextInput
                                    placeholder={'Username'}
                                    value={this.state.username}
                                    onChangeText={(e)=>{this.setState({username: e});}}
                                    style={{outlineStyle:'none', width:378, borderRadius:8, height:44, borderWidth:1, borderColor:colors[this.context.theme.mode].inputborder1, fontSize:18, fontFamily:'Chakra Petch Regular', paddingLeft:15, paddingRight:15, color:colors[this.context.theme.mode].text1}}
                                />
                            </View>
                            <Text style={{color:'red', fontFamily:'Chakra Petch Regular', fontSize:16, marginTop:5}}>{this.state.usernamewarning}</Text>
                        </View>

                        <View style={{marginTop:20}}>
                            <Text style={{fontFamily:'Chakra Petch Regular', fontSize:16, color:colors[this.context.theme.mode].inputlabel1}}>Password</Text>
                            <View style={{marginTop:10, flexDirection:'row', alignItems:'center', justifyContent:'space-between', width:378, flexWrap:'wrap', borderWidth:1, borderColor:colors[this.context.theme.mode].inputborder1, borderRadius:8, paddingRight:15 }}>
                                <TextInput
                                    secureTextEntry={this.state.pass1toggle==='Hide Password'?false:true}
                                    placeholder={'Password'}
                                    value={ this.state.password }
                                    onChangeText={(e)=>{this.setState({password: e});}}
                                    style={{outlineStyle:'none', width:260, height:44, borderWidth:1, borderColor:'rgba(0,0,0,0)', fontSize:18, fontFamily:'Chakra Petch Regular', paddingLeft:15, paddingRight:15, color:colors[this.context.theme.mode].text1}}
                                />
                                <TouchableOpacity  onPress={()=>{ this.setState({pass1toggle: this.state.pass1toggle==='Show Password'?'Hide Password':'Show Password'}); }}>
                                    <Text style={{fontFamily:'Chakra Petch Regular', fontSize:14, color:'#4285F4'}}>{this.state.pass1toggle}</Text>
                                </TouchableOpacity>
                            </View>
                            <Text style={{color:'red', fontFamily:'Chakra Petch Regular', fontSize:16, marginTop:5}}>{this.state.passwordwarning}</Text>
                        </View>

                        <View style={{flexDirection:'row', alignItems:'center', justifyContent:'flex-end', width:378, marginTop:20}}>
                            <TouchableOpacity onPress={()=>{this.forgotpassword();}}>
                            <Text style={{textAlign:'right', fontFamily:'Chakra Petch Regular', fontSize:14, color:colors[this.context.theme.mode].text3}}>Forgot password?</Text>
                            </TouchableOpacity>
                        </View>
                        <Text style={{color:'red', fontFamily:'Chakra Petch Regular', fontSize:16, marginTop:35}}>{this.state.processwarning}</Text>


                        <TouchableOpacity style={{width:Dimensions.get('window').width-36, height:56, flexDirection:'row', alignItems:'center', justifyContent:'center', borderRadius:8, marginTop:90, backgroundColor:colors[this.context.theme.mode].btn1}} onPress={()=>{this.loginaccount();}}>
                            <Text style={{display:!this.state.reqloading?'flex':'none', color:'white', fontFamily:'Chakra Petch Regular', fontSize:16}}>Login</Text>
                            <ActivityIndicator style={{display:this.state.reqloading?'flex':'none'}} color="white"></ActivityIndicator>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={{width:Dimensions.get('window').width, height:Dimensions.get('window').height, flexDirection:'column', alignItems:'center', justifyContent:'flex-start', paddingTop:40, backgroundColor:colors[this.context.theme.mode].background}}>
                    <Text style={{fontFamily:'Chakra Petch SemiBold', fontSize:20, width:Dimensions.get('window').width, textAlign:'center', color:colors[this.context.theme.mode].text1}}>Confirm Email</Text>
                    <Text style={{fontFamily:'Chakra Petch Regular', fontSize:16, width:356, textAlign:'center', color:'', marginTop:10, color:colors[this.context.theme.mode].text1}}>{'Input the 6 digit code that was sent to '+(this.state.changepassvars.email?this.state.changepassvars.email:'')+'. If it is not in your inbox check your spam.'}</Text>
                    <Text style={{fontFamily:'Chakra Petch Regular', fontSize:16, width:356, textAlign:'center', color:'', color:colors[this.context.theme.mode].text1}}>The code will be invalid in 3 mins</Text>
                    <View style={{flexDirection:'row', justifyContent:'space-around', alignItems:'center', width:382}}>
                        <TextInput
                            ref={this.input1}
                            placeholder={''}
                            value={this.state.digit1}
                            keyboardType={'numeric'}
                            onChangeText={ (e)=>{ if(e===''){ this.setState({digit1:e}); }else{ if(this.state.digit1!==''){ this.setState({digit1: e[1]}); }else{ this.setState({digit1: e[0]});  } this.input2.current.focus(); } } }
                            style={{outlineStyle:'none', width:60, height:50, fontSize:30, fontFamily:'Chakra Petch SemiBold', textAlign:'center', borderWidth:2, borderBottomColor:colors[this.context.theme.mode].text1, borderTopColor:'rgba(0,0,0,0)', borderLeftColor:'rgba(0,0,0,0)', borderRightColor:'rgba(0,0,0,0)', color:colors[this.context.theme.mode].text1}}
                        />

                        <TextInput
                            ref={this.input2}
                            placeholder={''}
                            value={this.state.digit2}
                            keyboardType={'numeric'}
                            onChangeText={ (e)=>{ if(e===''){ this.setState({digit2:e}); }else{ if(this.state.digit2!==''){ this.setState({digit2: e[1]}); }else{ this.setState({digit2: e[0]});  } this.input3.current.focus(); } } }
                            style={{outlineStyle:'none', width:60, height:50, fontSize:30, fontFamily:'Chakra Petch SemiBold', textAlign:'center', borderWidth:2, borderBottomColor:colors[this.context.theme.mode].text1, borderTopColor:'rgba(0,0,0,0)', borderLeftColor:'rgba(0,0,0,0)', borderRightColor:'rgba(0,0,0,0)', color:colors[this.context.theme.mode].text1}}
                        />

                        <TextInput
                            ref={this.input3}
                            placeholder={''}
                            value={this.state.digit3}
                            keyboardType={'numeric'}
                            onChangeText={ (e)=>{ if(e===''){ this.setState({digit3:e}); }else{ if(this.state.digit3!==''){ this.setState({digit3: e[1]}); }else{ this.setState({digit3: e[0]});  } this.input4.current.focus(); } } }
                            style={{outlineStyle:'none', width:60, height:50, fontSize:30, fontFamily:'Chakra Petch SemiBold', textAlign:'center', borderWidth:2, borderBottomColor:colors[this.context.theme.mode].text1, borderTopColor:'rgba(0,0,0,0)', borderLeftColor:'rgba(0,0,0,0)', borderRightColor:'rgba(0,0,0,0)', color:colors[this.context.theme.mode].text1}}
                        />

                        <TextInput
                            ref={this.input4}
                            placeholder={''}
                            value={this.state.digit4}
                            keyboardType={'numeric'}
                            onChangeText={ (e)=>{ if(e===''){ this.setState({digit4:e}); }else{ if(this.state.digit4!==''){ this.setState({digit4: e[1]}); }else{ this.setState({digit4: e[0]});  } this.input5.current.focus(); } } }
                            style={{outlineStyle:'none', width:60, height:50, fontSize:30, fontFamily:'Chakra Petch SemiBold', textAlign:'center', borderWidth:2, borderBottomColor:colors[this.context.theme.mode].text1, borderTopColor:'rgba(0,0,0,0)', borderLeftColor:'rgba(0,0,0,0)', borderRightColor:'rgba(0,0,0,0)', color:colors[this.context.theme.mode].text1}}
                        />

                        <TextInput
                            ref={this.input5}
                            placeholder={''}
                            value={this.state.digit5}
                            keyboardType={'numeric'}
                            onChangeText={ (e)=>{ if(e===''){ this.setState({digit5:e}); }else{ if(this.state.digit5!==''){ this.setState({digit5: e[1]}); }else{ this.setState({digit5: e[0]});  } this.input6.current.focus(); } } }
                            style={{outlineStyle:'none', width:60, height:50, fontSize:30, fontFamily:'Chakra Petch SemiBold', textAlign:'center', borderWidth:2, borderBottomColor:colors[this.context.theme.mode].text1, borderTopColor:'rgba(0,0,0,0)', borderLeftColor:'rgba(0,0,0,0)', borderRightColor:'rgba(0,0,0,0)', color:colors[this.context.theme.mode].text1}}
                        />

                        <TextInput
                            ref={this.input6}
                            placeholder={''}
                            value={this.state.digit6}
                            keyboardType={'numeric'}
                            onChangeText={ (e)=>{ if(e===''){ this.setState({digit6:e}); }else{ if(this.state.digit6!==''){this.setState({digit6: e[1]});}else{this.setState({digit6: e[0]});} } } }
                            style={{outlineStyle:'none', width:60, height:50, fontSize:30, fontFamily:'Chakra Petch SemiBold', textAlign:'center', borderWidth:2, borderBottomColor:colors[this.context.theme.mode].text1, borderTopColor:'rgba(0,0,0,0)', borderLeftColor:'rgba(0,0,0,0)', borderRightColor:'rgba(0,0,0,0)', color:colors[this.context.theme.mode].text1}}
                        />
                    </View>

                    <Text style={{marginTop:10, width:382, textAlign:'center', fontFamily:'Chakra Petch Regular', fontSize:16, color:this.state.vwcolor}}>{this.state.verificationwarning}</Text>

                    <View style={{flexDirection:'column', alignItems:'center', justifyContent:'flex-start', marginTop:120}}>
                        <TouchableOpacity style={{width:Dimensions.get('window').width-36, height:56, flexDirection:'row', alignItems:'center', justifyContent:'center', borderRadius:8, marginTop:20, backgroundColor:colors[this.context.theme.mode].btn1}} onPress={()=>{!this.state.vcodeloading?this.verifycode():'';}}>
                            <Text style={{display:!this.state.vcodeloading?'flex':'none', color:'white', fontFamily:'Chakra Petch Regular', fontSize:16}}>Verify code</Text>
                            <ActivityIndicator style={{display:this.state.vcodeloading?'flex':'none'}} color="white"></ActivityIndicator>
                        </TouchableOpacity>

                        <TouchableOpacity style={{width:Dimensions.get('window').width-36, height:56, flexDirection:'row', alignItems:'center', justifyContent:'center', borderRadius:8, marginTop:20, backgroundColor:colors[this.context.theme.mode].btn1}} onPress={()=>{!this.state.emailloader?this.resendcode(this.state.changepassvars.username, this.state.changepassvars.email):'';}}>
                            <Text style={{display:!this.state.emailloader?'flex':'none', color:'white', fontFamily:'Chakra Petch Regular', fontSize:16}}>Resend code</Text>
                            <ActivityIndicator style={{display:this.state.emailloader?'flex':'none'}} color="white"></ActivityIndicator>
                        </TouchableOpacity>

                        <TouchableOpacity style={{width:Dimensions.get('window').width-36, height:56, flexDirection:'row', alignItems:'center', justifyContent:'center', borderRadius:8, marginTop:20, backgroundColor:colors[this.context.theme.mode].btn1}} onPress={()=>{this.goback();}}>
                            <Text style={{color:'white', fontFamily:'Chakra Petch Regular', fontSize:16}}>Go Back</Text>
                        </TouchableOpacity>
                    </View>
                </View>


                <View style={{width:Dimensions.get('window').width, height:Dimensions.get('window').height, flexDirection:'column', alignItems:'center', justifyContent:'flex-start', paddingTop:40, backgroundColor:colors[this.context.theme.mode].background}}>
                    <Text style={{fontFamily:'Chakra Petch SemiBold', fontSize:22, textAlign:'left', width:378, color:colors[this.context.theme.mode].text1}}>Forgot Password</Text>

                    <View style={{marginTop:50}}>
                        <Text style={{fontFamily:'Chakra Petch Regular', fontSize:16, color:colors[this.context.theme.mode].inputlabel1}}>Password</Text>
                        <View style={{marginTop:10, flexDirection:'row', alignItems:'center', justifyContent:'space-between', width:378, flexWrap:'wrap', borderWidth:1, borderColor:colors[this.context.theme.mode].inputborder1, borderRadius:8, paddingRight:15, color:colors[this.context.theme.mode].text1}}>
                            <TextInput
                                secureTextEntry={this.state.fpass1toggle==='Hide Password'?false:true}
                                placeholder={'Password'}
                                value={this.state.fpass1}
                                onChangeText={(e)=>{this.setState({fpass1: e});}}
                                style={{outlineStyle: 'none', width:260, borderRadius:8, height:44, borderWidth:1, borderColor:'rgba(0,0,0,0)', color:colors[this.context.theme.mode].text1, fontSize:18, fontFamily:'Chakra Petch Regular', paddingLeft:15, paddingRight:15}}
                            />
                            <TouchableOpacity onPress={()=>{ this.setState({fpass1toggle: this.state.fpass1toggle==='Show Password'?'Hide Password':'Show Password'}); }}>
                                <Text style={{fontFamily:'Chakra Petch Regular', fontSize:14, color:'#4285F4'}}>{this.state.fpass1toggle}</Text>
                            </TouchableOpacity>
                        </View>
                        <Text style={{color:'red', fontFamily:'Chakra Petch Regular', fontSize:16, marginTop:5}}>{this.state.fpass1warning}</Text>
                    </View>

                    <View style={{marginTop:20}}>
                        <Text style={{fontFamily:'Chakra Petch Regular', fontSize:16, color:colors[this.context.theme.mode].inputlabel1}}>Confirm Password</Text>
                        <View style={{marginTop:10, flexDirection:'row', alignItems:'center', justifyContent:'space-between', width:378, flexWrap:'wrap', borderWidth:1, borderColor:colors[this.context.theme.mode].inputborder1, borderRadius:8, paddingRight:15}}>
                            <TextInput
                                secureTextEntry={this.state.fpass2toggle==='Hide Password'?false:true}
                                placeholder={'Confirm Password'}
                                value={this.state.fpass2}
                                onChangeText={(e)=>{this.setState({fpass2: e});}}
                                style={{outlineStyle:'none', width:260, borderRadius:8, height:44, borderWidth:1, borderColor:'rgba(0,0,0,0)', color:colors[this.context.theme.mode].text1, fontSize:18, fontFamily:'Chakra Petch Regular', paddingLeft:15, paddingRight:15}}
                            />
                            <TouchableOpacity onPress={()=>{ this.setState({fpass2toggle: this.state.fpass2toggle==='Show Password'?'Hide Password':'Show Password'}); }}>
                                <Text style={{fontFamily:'Chakra Petch Regular', fontSize:14, color:'#4285F4'}}>{this.state.fpass2toggle}</Text>
                            </TouchableOpacity>
                        </View>
                        <Text style={{color:'red', fontFamily:'Chakra Petch Regular', fontSize:16, marginTop:5}}>{this.state.fpass2warning}</Text>
                    </View>
                        
                    <Text style={{color:'red', fontFamily:'Chakra Petch Regular', fontSize:16, marginTop:35}}>{this.state.fprocesswarning}</Text>

                    <TouchableOpacity style={{width:Dimensions.get('window').width-36, height:56, flexDirection:'row', alignItems:'center', justifyContent:'center', borderRadius:8, marginTop:90, backgroundColor:colors[this.context.theme.mode].btn1}} onPress={()=>{!this.state.reqloading2?this.changepassword():'';}}>
                        <Text style={{display:!this.state.reqloading2?'flex':'none', color:'white', fontFamily:'Chakra Petch Regular', fontSize:16}}>Change Password</Text>
                        <ActivityIndicator style={{display:this.state.reqloading2?'flex':'none'}} color="white"></ActivityIndicator>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        );
    }
}

export default LoginAcc;