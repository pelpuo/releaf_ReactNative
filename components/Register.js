import React from 'react';
import {Alert, StyleSheet, Text, View, Button, TextInput,Image} from 'react-native';
// import { GoogleSignin } from 'react-native-google-signin';

import * as firebase from 'firebase'
import "firebase/auth";






export default class Register extends React.Component{
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      confirmPassword:'',
      username:'',
    };
    this.onLogin = this.onLogin.bind(this);
  }

  onLogin() {
    // return(Alert.alert('Clicked Login Button '))
    const email = this.state.email;
    const username = this.state.username;
    if(this.state.password === this.state.confirmPassword){
      const password = this.state.password;
    firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((res) => {
      if(res.user){
        firebase.database().ref('users').push({
          user:res.user.uid,
          username:username
        })
        alert("Signup successful")
        this.setState({
          email: '',
          password: '',
          confirmPassword:'',
          username:'',
        })
        this.props.navigation.navigate('Login');
      }
    })
    .catch((error) => {
      const { code, message } = error;
      Alert.alert(message)
    });

  }else return(Alert.alert("Your passwords must be the same"))

  }


  render() {
    return (
      <View style={styles.container}>
        <Image
        source={require('./rlf.png')}
        style={{width:117,height:95,marginTop:30}}
        />
        <Text style={{fontSize:40,color:'#c0ddad',textAlign:'center'}}>Releaf</Text>
        <View style={styles.fields}>
          <TextInput
            value={this.state.email}
            onChangeText={(email) => this.setState({ email })}
            placeholder={'Email'}
            style={styles.input}
          />
         <TextInput
            value={this.state.username}
            onChangeText={(username) => this.setState({ username })}
            placeholder={'Username'}
            style={styles.input}
          />
          <TextInput
            value={this.state.password}
            onChangeText={(password) => this.setState({ password })}
            placeholder={'Password'}
            secureTextEntry={true}
            style={styles.input}
          />
            <TextInput
            value={this.state.confirmPassword}
            onChangeText={(confirmPassword) => this.setState({ confirmPassword })}
            placeholder={'Confirm Password'}
            secureTextEntry={true}
            style={styles.input}
          />
          
          <View>
          <Button
            color="#90A955"
            title={'Sign Up'}
            style={styles.btn}
            onPress={this.onLogin.bind(this)}
          />
          </View>
          </View>
          <View style={{display:'flex', flexDirection:'row'}}>
            <Text>Already Have An Account?</Text>
            <Text style={{color:"blue"}}
             onPress={() => this.props.navigation.navigate('Login')}>Sign in</Text>
          </View>
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
      height:'70%',
      display:'flex',
      flexDirection:'column',
      justifyContent:'space-around',
      paddingBottom:80
    }
  });