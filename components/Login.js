import React from 'react';
import {Alert, StyleSheet, Text, View, Button, TextInput,Image, AsyncStorage} from 'react-native';
// import { GoogleSignin } from 'react-native-google-signin';
import Icon from 'react-native-vector-icons/Ionicons'
import * as firebase from 'firebase'
import "firebase/auth";
import * as Google from 'expo-google-app-auth';
import * as GoogleSignIn from 'expo-google-sign-in';





export default class Login extends React.Component{
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      username:'',
      signedOut:false
    };
    this.onLogin = this.onLogin.bind(this);
  }

  componentDidMount(){
      this._retrieveData()
      .then((user)=>{
        if (user !== null) {
          //console.log(user)
          this.props.navigation.navigate('Tabs')
        }else{
          this.setState({
            signedOut:true 
          })
        }
      })
  }

  _retrieveData = async () => {
    try {
      const user = await AsyncStorage.getItem('myUser');
  
      return JSON.parse(user);
    }catch (error) {
      //console.log('HomeJS: '+error)
    }
  };

  onLogin() {
    const email = this.state.email;
    const password = this.state.password;
    firebase.auth().signInWithEmailAndPassword(email, password)
    .then((user) => { 

     this.storeData(user).then((user)=>{
      this.props.navigation.navigate('Tabs')
     })
     this.setState({
       signedOut:false
     })
      return(Alert.alert('Sign in successful'))
    })
    .catch((error) => {
      const { code, message } = error;
      Alert.alert(message)
    });

  }
  onLogout=()=>{
    this.removeData().then(()=>Alert.alert("Logged Out"))
    this.setState({
      signedOut:true
    })
  }

 storeData = async (user) =>{
    try{
      // console.log(user.user)
      const details = { uid:user.user.uid, email:user.user.email, username:user.user.displayName}

      const myUser = await AsyncStorage.setItem('myUser', JSON.stringify(details));
      return myUser;
    }catch(e){
      //console.log(e)

    };
  }
  removeData = async () =>{
    try{
      const myUser = await AsyncStorage.removeItem('myUser');
      return myUser;
    }catch(e){
      //console.log(e)
    };
  }


  signInWithGoogleAsync= async ()=> {
    try {
      const result = await Google.logInAsync({
        behavior:'web',
        androidClientId: '445697150152-51i6ed5c3l597ogp1hlqm4rqt2bbdctg.apps.googleusercontent.com',
        androidStandaloneAppClientId: `445697150152-pakpd5eg22gscu19hih5h7qs8oq0p62f.apps.googleusercontent.com`,
        //iosClientId: YOUR_CLIENT_ID_HERE,
        scopes: ['profile', 'email'],
      });
  
      if (result.type === 'success') {
        const { idToken, accessToken } = result;
        const credential = firebase.auth.GoogleAuthProvider.credential(idToken, accessToken);
        firebase
          .auth()
          .signInAndRetrieveDataWithCredential(credential)
          .then(res => {
            this.storeData(res);
            this.props.navigation.navigate('Tabs')
            this.setState({
              signedOut:false
            })
            Alert.alert('Sign in successful')
          })
          .catch(error => {
            Alert.alert("Error: "+error)
          });
        return result.accessToken;
      } else {
        return { cancelled: true };
      }
    } catch (e) {
      Alert.alert("Error: "+e);
      return { error: true };
    }
  }

  // signInAsync = async () => {
  //   try {
  //     await GoogleSignIn.askForPlayServicesAsync();
  //     const { type, user } = await GoogleSignIn.signInAsync();
  //     if (type === 'success') {
  //       // ...
  //       Alert.alert('Sign in successful')
  //       this.storeData(user).then((user)=>{
  //         this.props.navigation.navigate('Tabs')
  //        })
  //        this.setState({
  //         signedOut:false
  //       })
  //     }
  //   } catch ({ message }) {
  //     alert('login: Error:' + message);
  //   }
  // };
  
  // signOutAsync = async () => {
  //   try {
  //     await GoogleSignIn.signOutAsync();
  //     this.setState({ user: null });
  //   } catch ({ message }) {
  //     alert('signOutAsync: ' + message);
  //   }
  // };


  tab=()=>{
    this.props.navigation.navigate('Tabs')
  }

  render() {
    return (
      <View style={this.state.signedOut?styles.container:styles.container2}>
        {!this.state.signedOut&&
        <View style={styles.contain}>
          <Icon name="ios-home" size={36} color="#1F2F16" onPress = {this.tab} style={{margin:5}}/>
          <Icon name="ios-log-out" size={36} color="#1F2F16" onPress = {this.onLogout} style={{margin:5}}/>
        </View>
        } 
        <Image
        source={require('./rlf.png')}
        style={{width:117,height:95,marginTop:30}}
        />
        <Text style={{fontSize:40,color:'#c0ddad',textAlign:'center'}}>Releaf</Text>
        {this.state.signedOut&&
        <View style={styles.fields}>
          <TextInput
            value={this.state.email}
            onChangeText={(email) => this.setState({ email })}
            placeholder={'Email'}
            style={styles.input}
          />
          <TextInput
            value={this.state.password}
            onChangeText={(password) => this.setState({ password })}
            placeholder={'Password'}
            secureTextEntry={true}
            style={styles.input}
          />
          <View>
          <Button
            color="#90A955"
            title={'Login'}
            style={styles.btn}
            onPress={this.onLogin.bind(this)}
          />
          </View>
          <View>
          <Button
            color="#fc2003"
            title={'Login With Google'}
            style={styles.btn}
            onPress={()=>this.signInWithGoogleAsync()}
          />
          </View>
          <View style={{display:'flex', flexDirection:'row'}}>
            <Text>Don't Have An Account?</Text>
            <Text style={{color:"blue"}}
             onPress={() => this.props.navigation.navigate('Register')}>Register Here</Text>
          </View>
        </View>}
      </View>
    );
  }
  }

  const styles = StyleSheet.create({
    container: {
      padding:30,
      flex: 1,
      alignItems:'center',
      justifyContent: 'flex-end',
      backgroundColor: '#eaf0ea',
    },
    container2: {
      padding:30,
      flex: 1,
      alignItems:'center',
      justifyContent: 'center',
      backgroundColor: '#eaf0ea',
    },
    contain: {
      padding:10,
      width:"100%",
      height:80,
      flexDirection:"row",
      alignItems:'center',
      justifyContent: 'center',
      backgroundColor: '#eaf0ea',
    },
    input: {
      width: 300,
      height: 44,
      padding: 10,
      marginBottom:5,
      borderWidth: 1,
      backgroundColor:'#fff',
      borderColor: '#ddd',
    },
    btn:{
      width:300
    },
    fields:{
      height:'60%',
      display:'flex',
      flexDirection:'column',
      justifyContent:'space-around',
      paddingBottom:80
    }
  });