import React, { Component } from 'react';
import { View, Text, Image, TextInput, Dimensions, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as DocumentPicker from 'expo-document-picker';

class Profile extends Component{
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
        loading:true,
        fullname: '',
        fullnamelabel:'',
        fncolor:'',
        fullnameeditable:false,
        fullnameloader:false,
        username: '',
        usernamelabel:'',
        uncolor:'',
        usernameeditable:false,
        usernameloader:false,
        email: '',
        emaillabel:'',
        ecolor:'',
        emaileditable:false,
        emailloader:false,
        phone: '',
        phonelabel:'',
        pcolor:'',
        phoneeditable:false,
        phoneloader:false,
        userdata: {},
        digit1: '',
        digit2: '',
        digit3: '',
        digit4: '',
        digit5: '',
        digit6: '',
        vcodeloading: false,
        vcodelabel:'',
        vcodecolor:'',
        screenmode:'',
        reqloading:false,
        picchanged: false
    }

    async componentDidMount(){
        let data = await AsyncStorage.getItem('userdata');
        let screenmode = await AsyncStorage.getItem('screenmode');
        data = JSON.parse(data);
        this.setState({screenmode:screenmode});
        if(data){
            //A default call to the server to get user details, incase there are any updates
            const defrequest = fetch(
                "http://localhost:3000/getuserdatawithgames",
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

    changeEditability = (opt) => {
        if(opt==='fullname'){
            if(this.state.fullnameeditable){//Means it is on save...so save what is currenntly on the input field
                this.saveChanges('fullname');
                //this.setState({fullnameeditable: false});
            }else{
                this.setState({fullnameeditable: true});
            }
        }

        if(opt==='username'){
            if(this.state.usernameeditable){//Means it is on save...so save what is currenntly on the input field
                this.saveChanges('username');
                //this.setState({usernameeditable: false});
            }else{
                this.setState({usernameeditable: true});
            }
        }

        if(opt==='email'){
            if(this.state.emaileditable){//Means it is on save...so save what is currenntly on the input field
                this.saveChanges('email');
                //this.setState({emaileditable: false});
            }else{
                this.setState({emaileditable: true});
            }
        }

        if(opt==='phone'){
            if(this.state.phoneeditable){//Means it is on save...so save what is currenntly on the input field
                this.saveChanges('phone');
                //this.setState({phoneeditable: false});
            }else{
                this.setState({phoneeditable: true});
            }
        }
    }

    saveChanges = (opt) => {
        if(opt==='fullname'){
            if(this.state.fullname!==''){
                let data = {userid:this.state.userdata.userid, fullname:this.state.fullname};
                this.setState({fullnameloader: true, fullnamelabel:'', fncolor:''});
                const response = fetch(
                    "http://localhost:3000/editfullname",
                    {
                        method: 'POST',
                        body: JSON.stringify(data),
                        headers: { 'Content-Type': 'application/json' }
                    }  
                ).then(response=>{
                    return response.json();
                }).then(async response=>{
                    console.log(response.msg);
                    if(response.msg==='success'){  
                        this.setState({fullnamelabel:'Fullname changed', fullnameeditable: false, fullnameloader:false, fncolor:'green'});
                    }else{
                        this.setState({fullnamelabel:'An error occurred', fullnameloader:false, fncolor:'red'});
                    }
                });
            }else{  	
                this.setState({fullnamelabel: 'This field cannot be empty', fncolor:'red'});
            }
        }

        if(opt==='username'){
            if(this.state.username!==''){
                let data = {userid:this.state.userdata.userid, username:this.state.username};
                this.setState({usernameloader: true, usernamelabel:'', uncolor:''});
                const response = fetch(
                    "http://localhost:3000/editusername",
                    {
                        method: 'POST',
                        body: JSON.stringify(data),
                        headers: { 'Content-Type': 'application/json' }
                    }  
                ).then(response=>{
                    return response.json();
                }).then(async response=>{
                    console.log(response.msg);
                    if(response.msg==='success'){  
                        this.setState({usernameeditable: false, usernameloader:false, usernamelabel:'Username changed', uncolor:'green'});
                    }else{
                        this.setState({usernameloader:false, usernamelabel:response.msg, uncolor:'red'});
                    }
                });
            }else{  	
                this.setState({usernamelabel: 'This field cannot be empty', uncolor:'red'});
            }
        }

        if(opt==='email'){
            if(this.state.email!==''){
                let data = {userid:this.state.userdata.userid, email:this.state.email};
                this.setState({emailloader: true, emaillabel:'', ecolor:''});
                const response = fetch(
                    "http://localhost:3000/verifyemail",
                    {
                        method: 'POST',
                        body: JSON.stringify(data),
                        headers: { 'Content-Type': 'application/json' }
                    }  
                ).then(response=>{
                    return response.json();
                }).then(async response=>{
                    console.log(response.msg);
                    this.setState({emailloader:false, emaillabel:response.msg});
                    if(response.msg==='A code has been sent to this email'){  
                        this.setState({emaileditable: false, ecolor:'green'});
                        this.scrollViewRef.current?.scrollTo({ x: Dimensions.get('window').width+10, animated: true});
                    }else{
                        this.setState({ecolor:'red'});
                    }
                });
            }else{  	
                this.setState({emaillabel: 'This field cannot be empty', ecolor:'red'});
            }
        }

        if(opt==='phone'){
            if(this.state.phone!==''){
                this.setState({phoneeditable: false});
            }else{  	
                this.setState({phonelabel: 'This field cannot be empty', pcolor:'red'});
            }
        }
    }

    goback = () => {
        this.scrollViewRef.current?.scrollTo({ x: 0, animated: true});
        this.setState({ecolor:'', emaillabel:''});
    }

    resendcode = () => {
        if(this.state.email!==''){
            let data = {userid:this.state.userdata.userid, email:this.state.email};
            this.setState({emailloader: true, emaillabel:'', ecolor:''});
            const response = fetch(
                "http://localhost:3000/verifyemail",
                {
                    method: 'POST',
                    body: JSON.stringify(data),
                    headers: { 'Content-Type': 'application/json' }
                }  
            ).then(response=>{
                return response.json();
            }).then(async response=>{
                console.log(response.msg);
                this.setState({emailloader:false, emaillabel:response.msg});
                if(response.msg==='A code has been sent to this email'){  
                    this.setState({emaileditable: false, ecolor:'green'});
                }else{
                    this.goback
                    this.setState({ecolor:'red'});
                }
            });
        }else{  	
            this.goback();
            this.setState({emaillabel: 'This field cannot be empty', ecolor:'red'});
        }
    }

    verifycode = () => {
        this.setState({vcodelabel:'', vcodecolor:''});
        if(this.state.digit1===''&&this.state.digit2===''&&this.state.digit3===''&&this.state.digit4===''&&this.state.digit5===''&&this.state.digit6===''){
            this.setState({vcodelabel:'Field cannot be empty', vcodecolor:'red'});
        
        }else{
            if(this.state.digit1===''||this.state.digit2===''||this.state.digit3===''||this.state.digit4===''||this.state.digit5===''||this.state.digit6===''){
                this.setState({vcodelabel:'6 digit code incomplete', vcodecolor:'red'});
            
            }else{
                let code = this.state.digit1+this.state.digit2+this.state.digit3+this.state.digit4+this.state.digit5+this.state.digit6;
                code = code.toString();
                this.setState({vcodeloading:true});
                let data = {userid:this.state.userdata.userid, email:this.state.email, code:code};

                const response = fetch(
                    "http://localhost:3000/verifyemailcode",
                    {
                        method: 'POST',
                        body: JSON.stringify(data),
                        headers: { 'Content-Type': 'application/json' }
                    }  
                ).then(response=>{
                    return response.json();
                }).then(async response=>{

                    this.setState({vcodeloading:false, vcodelabel:response.msg});
                    if(response.msg==='Email verified'){  
                        this.setState({vcodecolor:'green'});
                        navigation.navigate('/user/home');
                    }else{
                        this.setState({vcodecolor:'red'});
                    }
                });
            }
        }
    }

    profPicker = async () => {
        const response = await DocumentPicker.getDocumentAsync({type: 'image/*'});
        
        let data = new FormData();
        data.append('profpic', response.output[0]);
        data.append('userid', this.state.userdata.userid);
        this.setState({reqloading: true, picchanged:false});
        
        fetch(
            "http://localhost:3000/profpicupload",
            {
                method: 'POST',
                body: data
            }  
        ).then(response=>{
            return response.json();
        }).then(async response=>{
            let userdata = this.state.userdata;
            userdata.profilepic = response.profpic;
            this.setState({userdata: userdata, reqloading:false, picchanged:true});
        });
    }


    render(){
        return(
            <View style={{backgroundColor:this.state.screenmode==='dark'?'#181818':'white', height:Dimensions.get('window').height}}>
                <View style={{display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'flex-start', marginTop:20}}>
                    <TouchableOpacity onPress={()=>{navigation.navigate('/user/home');}}>
                        <Image style={{marginLeft:10}} source={this.state.screenmode==='dark'?require('./../../../../assets/gameback-dark.png'):require('./../../../../assets/gameback.png')}></Image>
                    </TouchableOpacity>
                    <Text style={{fontFamily:'Chakra Petch SemiBold', fontSize:24, marginLeft:130, color:this.state.screenmode==='dark'?'white':'black'}}>Profile</Text>
                </View>
                <ActivityIndicator style={{display:this.state.loading?'flex':'none', marginTop:Dimensions.get('window').height*0.4}}></ActivityIndicator>
                <ScrollView ref={this.scrollViewRef} style={{ display:!this.state.loading?'flex':'none', overflowX: 'none'}} 
                    showsHorizontalScrollIndicator={false} horizontal decelerationRate={0} snapToInterval={Dimensions.get('window').width} snapToAlignment={"center"} scrollEnabled={false}>
                <View style={{width:Dimensions.get('window').width, flexDirection:'column', alignItems:'center', justifyContent:'flex-start'}}>
                    
                    <TouchableOpacity onPress={()=>{ !this.state.reqloading? this.profPicker() :'';}} style={{position:'relative', width:100, height:100, justifyContent:'center', alignItems:'center', marginTop:10, marginBottom:10}}>
                        <Image style={{width:100, height:100, borderRadius:'50%'}} source={{uri:this.state.userdata.profilepic?this.state.userdata.profilepic:'http://localhost:3000/public/defaultpic.png'}}></Image>
                        <ActivityIndicator style={{display:this.state.reqloading?'flex':'none', position:'absolute'}}></ActivityIndicator>
                    </TouchableOpacity>
                    <Text style={{display:'flex', fontFamily:'Chakra Petch Regular', color:'green', textAlign:'center', width:Dimensions.get('window').width-40, marginBottom:10}}>
                        Profile Picture changed. The change might take a few minutes to show but try going back to the home tab.
                    </Text>

                    <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-around', width:332, height:69, marginTop:10}}>
                        <View style={{flexDirection:'colum', alignItems:'center', justifyContent:'space-between', height:70}}>
                            <Text style={{fontFamily:'Chakra Petch Regular', fontSize:14, color:this.state.screenmode==='dark'?'white':'black'}}>Games Created</Text>
                            <View style={{width:80, height:40, borderRadius:4, backgroundColor:this.state.screenmode==='dark'?'white':'black', alignItems:'center', justifyContent:'center'}}>
                                <Text style={{fontFamily:'Chakra Petch Regular', fontSize:18, color:this.state.screenmode==='dark'?'black':'white', textAlign:'center', }}>{this.state.userdata.gamescreated?this.state.userdata.gamescreated.filter(x=>x.status!=='cancelled').length:'0'}</Text>
                            </View>
                        </View>

                        <View style={{flexDirection:'colum', alignItems:'center', justifyContent:'space-between', height:70}}>
                            <Text style={{fontFamily:'Chakra Petch Regular', fontSize:14, color:this.state.screenmode==='dark'?'white':'black'}}>Bets Won</Text>
                            <View style={{width:80, height:40, borderRadius:4, backgroundColor:this.state.screenmode==='dark'?'white':'black', alignItems:'center', justifyContent:'center'}}>
                                <Text style={{fontFamily:'Chakra Petch Regular', fontSize:18, color:this.state.screenmode==='dark'?'black':'white', textAlign:'center', }}>{this.state.userdata.gameswon?this.state.userdata.gameswon:'0'}</Text>
                            </View>
                        </View>

                        <View style={{flexDirection:'colum', alignItems:'center', justifyContent:'space-between', height:70}}>
                            <Text style={{fontFamily:'Chakra Petch Regular', fontSize:14, color:this.state.screenmode==='dark'?'white':'black'}}>Bets Lost</Text>
                            <View style={{width:80, height:40, borderRadius:4, backgroundColor:this.state.screenmode==='dark'?'white':'black', alignItems:'center', justifyContent:'center'}}>
                                <Text style={{fontFamily:'Chakra Petch Regular', fontSize:18, color:this.state.screenmode==='dark'?'black':'white', textAlign:'center', }}>{this.state.userdata.gameslost?this.state.userdata.gameslost:'0'}</Text>
                            </View>
                        </View>
                    </View>

                    <View>
                        <View style={{marginTop:15}}>
                            <Text style={{fontFamily:'Chakra Petch Regular', fontSize:14, color:this.state.screenmode==='dark'?'white':'black'}}>Full Name</Text>
                            <View style={{width:340, borderRadius:8, height:44, flexDirection:'row', alignItems:'center', justifyContent:'space-between', borderWidth:1, borderColor:this.state.screenmode==='dark'?'white':'#928E8E', paddingLeft:15, paddingRight:15, marginTop:5}}>
                                <TextInput
                                    editable={this.state.fullnameeditable}
                                    placeholder={this.state.userdata.fullname?this.state.userdata.fullname:'Full Name'}
                                    value={this.state.fullname}
                                    onChangeText={ (e)=>{this.setState({fullname: e});} }
                                    style={{outlineStyle:'none', width:320, borderRadius:8, height:44, fontSize:16, fontFamily:'Chakra Petch Regular', color:this.state.screenmode==='dark'?'white':'black'}}
                                />
                                <TouchableOpacity onPress={()=>{ !this.state.fullnameloader? this.changeEditability('fullname') :''; }}>
                                    <Text style={{display:!this.state.fullnameloader?'flex':'none', color:'#4285F4', fontFamily:'Chakra Petch Regular', fontSize:16}}>{this.state.fullnameeditable?'Save':'Edit'}</Text>
                                    <ActivityIndicator style={{display:this.state.fullnameloader?'flex':'none'}} color='#4285F4'/>
                                </TouchableOpacity>
                            </View>
                            <Text style={{color:this.state.fncolor, fontFamily:'Chakra Petch Regular', fontSize:14, marginTop:5}}>{this.state.fullnamelabel}</Text>
                        </View>

                        <View style={{marginTop:15}}>
                            <Text style={{fontFamily:'Chakra Petch Regular', fontSize:14, color:this.state.screenmode==='dark'?'white':'black'}}>Username</Text>
                            <View style={{width:340, borderRadius:8, height:44, flexDirection:'row', alignItems:'center', justifyContent:'space-between', borderWidth:1, borderColor:this.state.screenmode==='dark'?'white':'#928E8E', paddingLeft:15, paddingRight:15, marginTop:5}}>
                                <TextInput
                                    editable={this.state.usernameeditable}
                                    placeholder={this.state.userdata.username?this.state.userdata.username:'username'}
                                    value={this.state.username}
                                    onChangeText={ (e)=>{this.setState({username: e});} }
                                    style={{outlineStyle:'none', width:320, borderRadius:8, height:44, fontSize:16, fontFamily:'Chakra Petch Regular', color:this.state.screenmode==='dark'?'white':'black'}}
                                />
                                <TouchableOpacity onPress={()=>{ !this.state.usernameloader? this.changeEditability('username'):''; }}>
                                    <Text style={{display:!this.state.usernameloader?'flex':'none', color:'#4285F4', fontFamily:'Chakra Petch Regular', fontSize:16}}>{this.state.usernameeditable?'Save':'Edit'}</Text>
                                    <ActivityIndicator style={{display:this.state.usernameloader?'flex':'none'}} color='#4285F4'/>
                                </TouchableOpacity>
                            </View>
                            <Text style={{color:this.state.uncolor, fontFamily:'Chakra Petch Regular', fontSize:14, marginTop:5}}>{this.state.usernamelabel}</Text>
                        </View>

                        <View style={{marginTop:15}}>
                            <Text style={{fontFamily:'Chakra Petch Regular', fontSize:14, color:this.state.screenmode==='dark'?'white':'black'}}>Email</Text>
                            <View style={{width:340, borderRadius:8, height:44, flexDirection:'row', alignItems:'center', justifyContent:'space-between', borderWidth:1, borderColor:this.state.screenmode==='dark'?'white':'#928E8E', paddingLeft:15, paddingRight:15, marginTop:5}}>
                                <TextInput
                                    editable={this.state.emaileditable}
                                    placeholder={this.state.userdata.email?this.state.userdata.email:'email@gmail.com'}
                                    value={this.state.email}
                                    onChangeText={ (e)=>{this.setState({email: e});} }
                                    style={{outlineStyle:'none', width:320, borderRadius:8, height:44, fontSize:16, fontFamily:'Chakra Petch Regular', color:this.state.screenmode==='dark'?'white':'black'}}
                                />
                                <TouchableOpacity onPress={()=>{ this.changeEditability('email'); }}>
                                    <Text style={{display:!this.state.emailloader?'flex':'none', color:'#4285F4', fontFamily:'Chakra Petch Regular', fontSize:16}}>{this.state.emaileditable?'Verify':'Edit'}</Text>
                                    <ActivityIndicator style={{display:this.state.emailloader?'flex':'none'}} color='#4285F4'/>
                                </TouchableOpacity>
                            </View>
                            <Text style={{color:this.state.ecolor, fontFamily:'Chakra Petch Regular', fontSize:14, marginTop:5}}>{this.state.emaillabel}</Text>
                        </View>

                        <View style={{marginTop:15}}>
                            <Text style={{fontFamily:'Chakra Petch Regular', fontSize:14, color:this.state.screenmode==='dark'?'white':'black'}}>Phone Number</Text>
                            <View style={{width:340, borderRadius:8, height:44, flexDirection:'row', alignItems:'center', justifyContent:'space-between', borderWidth:1, borderColor:this.state.screenmode==='dark'?'white':'#928E8E', paddingLeft:15, paddingRight:15, marginTop:5}}>
                                <TextInput
                                    editable={this.state.phoneeditable}
                                    placeholder={this.state.userdata.phone?this.state.userdata.phone:'08123456789'}
                                    value={this.state.phone}
                                    onChangeText={ (e)=>{this.setState({phone: e});} }
                                    keyboardType={'numeric'}
                                    style={{outlineStyle:'none', width:320, borderRadius:8, height:44, fontSize:16, fontFamily:'Chakra Petch Regular', color:this.state.screenmode==='dark'?'white':'black'}}
                                />
                                <TouchableOpacity onPress={()=>{ this.changeEditability('phone'); }}>
                                    <Text style={{color:'#4285F4', fontFamily:'Chakra Petch Regular', fontSize:16}}>{this.state.phoneeditable?'Save':'Edit'}</Text>
                                </TouchableOpacity>
                            </View>
                            <Text style={{color:this.state.pcolor, fontFamily:'Chakra Petch Regular', fontSize:14, marginTop:5}}>{this.state.phonelabel}</Text>
                        </View>

                    </View>
                
                </View>

                <View style={{width:Dimensions.get('window').width, flexDirection:'column', alignItems:'center', justifyContent:'flex-start', marginTop:40}}>
                    <Text style={{fontFamily:'Chakra Petch SemiBold', fontSize:20, width:Dimensions.get('window').width, textAlign:'center', color:this.state.screenmode==='dark'?'white':'black'}}>Confirm Email</Text>
                    <Text style={{fontFamily:'Chakra Petch Regular', fontSize:16, width:356, textAlign:'center', color:'', marginTop:10, color:this.state.screenmode==='dark'?'white':'black'}}>{'Input the 6 digit code that was sent to '+this.state.email+'. If it is not in your inbox check your spam.'}</Text>
                    <Text style={{fontFamily:'Chakra Petch Regular', fontSize:16, width:356, textAlign:'center', color:'', color:this.state.screenmode==='dark'?'white':'black'}}>The code will be invalid in 3 mins</Text>
                    <View style={{flexDirection:'row', justifyContent:'space-around', alignItems:'center', width:382}}>
                        <TextInput
                            ref={this.input1}
                            placeholder={''}
                            value={this.state.digit1}
                            keyboardType={'numeric'}
                            onChangeText={ (e)=>{ if(e===''){ this.setState({digit1:e}); }else{ if(this.state.digit1!==''){ this.setState({digit1: e[1]}); }else{ this.setState({digit1: e[0]});  } this.input2.current.focus(); } } }
                            style={{outlineStyle:'none', width:60, height:50, fontSize:30, fontFamily:'Chakra Petch SemiBold', textAlign:'center', borderWidth:2, borderBottomColor:this.state.screenmode==='dark'?'white':'black', borderTopColor:'rgba(0,0,0,0)', borderLeftColor:'rgba(0,0,0,0)', borderRightColor:'rgba(0,0,0,0)', color:this.state.screenmode==='dark'?'white':'black'}}
                        />

                        <TextInput
                            ref={this.input2}
                            placeholder={''}
                            value={this.state.digit2}
                            keyboardType={'numeric'}
                            onChangeText={ (e)=>{ if(e===''){ this.setState({digit2:e}); }else{ if(this.state.digit2!==''){ this.setState({digit2: e[1]}); }else{ this.setState({digit2: e[0]});  } this.input3.current.focus(); } } }
                            style={{outlineStyle:'none', width:60, height:50, fontSize:30, fontFamily:'Chakra Petch SemiBold', textAlign:'center', borderWidth:2, borderBottomColor:this.state.screenmode==='dark'?'white':'black', borderTopColor:'rgba(0,0,0,0)', borderLeftColor:'rgba(0,0,0,0)', borderRightColor:'rgba(0,0,0,0)', color:this.state.screenmode==='dark'?'white':'black'}}
                        />

                        <TextInput
                            ref={this.input3}
                            placeholder={''}
                            value={this.state.digit3}
                            keyboardType={'numeric'}
                            onChangeText={ (e)=>{ if(e===''){ this.setState({digit3:e}); }else{ if(this.state.digit3!==''){ this.setState({digit3: e[1]}); }else{ this.setState({digit3: e[0]});  } this.input4.current.focus(); } } }
                            style={{outlineStyle:'none', width:60, height:50, fontSize:30, fontFamily:'Chakra Petch SemiBold', textAlign:'center', borderWidth:2, borderBottomColor:this.state.screenmode==='dark'?'white':'black', borderTopColor:'rgba(0,0,0,0)', borderLeftColor:'rgba(0,0,0,0)', borderRightColor:'rgba(0,0,0,0)', color:this.state.screenmode==='dark'?'white':'black'}}
                        />

                        <TextInput
                            ref={this.input4}
                            placeholder={''}
                            value={this.state.digit4}
                            keyboardType={'numeric'}
                            onChangeText={ (e)=>{ if(e===''){ this.setState({digit4:e}); }else{ if(this.state.digit4!==''){ this.setState({digit4: e[1]}); }else{ this.setState({digit4: e[0]});  } this.input5.current.focus(); } } }
                            style={{outlineStyle:'none', width:60, height:50, fontSize:30, fontFamily:'Chakra Petch SemiBold', textAlign:'center', borderWidth:2, borderBottomColor:this.state.screenmode==='dark'?'white':'black', borderTopColor:'rgba(0,0,0,0)', borderLeftColor:'rgba(0,0,0,0)', borderRightColor:'rgba(0,0,0,0)', color:this.state.screenmode==='dark'?'white':'black'}}
                        />

                        <TextInput
                            ref={this.input5}
                            placeholder={''}
                            value={this.state.digit5}
                            keyboardType={'numeric'}
                            onChangeText={ (e)=>{ if(e===''){ this.setState({digit5:e}); }else{ if(this.state.digit5!==''){ this.setState({digit5: e[1]}); }else{ this.setState({digit5: e[0]});  } this.input6.current.focus(); } } }
                            style={{outlineStyle:'none', width:60, height:50, fontSize:30, fontFamily:'Chakra Petch SemiBold', textAlign:'center', borderWidth:2, borderBottomColor:this.state.screenmode==='dark'?'white':'black', borderTopColor:'rgba(0,0,0,0)', borderLeftColor:'rgba(0,0,0,0)', borderRightColor:'rgba(0,0,0,0)', color:this.state.screenmode==='dark'?'white':'black'}}
                        />

                        <TextInput
                            ref={this.input6}
                            placeholder={''}
                            value={this.state.digit6}
                            keyboardType={'numeric'}
                            onChangeText={ (e)=>{ if(e===''){ this.setState({digit6:e}); }else{ if(this.state.digit6!==''){this.setState({digit6: e[1]});}else{this.setState({digit6: e[0]});} } } }
                            style={{outlineStyle:'none', width:60, height:50, fontSize:30, fontFamily:'Chakra Petch SemiBold', textAlign:'center', borderWidth:2, borderBottomColor:this.state.screenmode==='dark'?'white':'black', borderTopColor:'rgba(0,0,0,0)', borderLeftColor:'rgba(0,0,0,0)', borderRightColor:'rgba(0,0,0,0)', color:this.state.screenmode==='dark'?'white':'black'}}
                        />
                    </View>

                    <Text style={{marginTop:10, width:382, textAlign:'center', fontFamily:'Chakra Petch Regular', fontSize:16, color:this.state.vcodecolor}}>{this.state.vcodelabel}</Text>

                    <View style={{flexDirection:'column', alignItems:'center', justifyContent:'flex-start', marginTop:120}}>
                        <TouchableOpacity style={{width:Dimensions.get('window').width-36, height:56, flexDirection:'row', alignItems:'center', justifyContent:'center', borderRadius:8, marginTop:20, backgroundColor:this.state.screenmode==='dark'?'#1E9E40':'black'}} onPress={()=>{!this.state.vcodeloading?this.verifycode():'';}}>
                            <Text style={{display:!this.state.vcodeloading?'flex':'none', color:'white', fontFamily:'Chakra Petch Regular', fontSize:16}}>Verify code</Text>
                            <ActivityIndicator style={{display:this.state.vcodeloading?'flex':'none'}} color="white"></ActivityIndicator>
                        </TouchableOpacity>

                        <TouchableOpacity style={{width:Dimensions.get('window').width-36, height:56, flexDirection:'row', alignItems:'center', justifyContent:'center', borderRadius:8, marginTop:20, backgroundColor:this.state.screenmode==='dark'?'#1E9E40':'black'}} onPress={()=>{!this.state.emailloader?this.resendcode():'';}}>
                            <Text style={{display:!this.state.emailloader?'flex':'none', color:'white', fontFamily:'Chakra Petch Regular', fontSize:16}}>Resend code</Text>
                            <ActivityIndicator style={{display:this.state.emailloader?'flex':'none'}} color="white"></ActivityIndicator>
                        </TouchableOpacity>

                        <TouchableOpacity style={{width:Dimensions.get('window').width-36, height:56, flexDirection:'row', alignItems:'center', justifyContent:'center', borderRadius:8, marginTop:20, backgroundColor:this.state.screenmode==='dark'?'#1E9E40':'black'}} onPress={()=>{this.goback();}}>
                            <Text style={{color:'white', fontFamily:'Chakra Petch Regular', fontSize:16}}>Go Back</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                </ScrollView>
            </View>
        );
    }
}

export default Profile;

/*
    <View style={{marginTop:15}}>
                            <Text style={{fontFamily:'Chakra Petch Regular', fontSize:14}}>Date of Birth</Text>
                            <TextInput
                                placeholder={'31/12/1990'}
                                value={this.state.dob}
                                onChangeText={ (e)=>{this.setState({dob: e});} }
                                keyboardType={'numeric'}
                                style={{width:340, borderRadius:8, height:44, borderWidth:1, borderLeftColor:'#928E8E', borderRightColor:'#928E8E', borderTopColor:'#928E8E', borderBottomColor:'#928E8E', fontSize:16, fontFamily:'Chakra Petch Regular', paddingLeft:15, paddingRight:15, marginTop:5}}
                            />
                        </View>
*/