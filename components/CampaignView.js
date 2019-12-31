import React from 'react';
import {Alert, FlatList, StyleSheet, Text, View, Button,Image, ImageBackground,ScrollView } from 'react-native';
var react = require('react-native');
var width = react.Dimensions.get('window').width; 
import * as firebase from 'firebase'
import Constants from 'expo-constants';
import Icon from 'react-native-vector-icons/Ionicons'

export default class CampaignView extends React.Component{
    constructor(props){
        super(props);

    }

    onRegisterClick = () => {
        firebase.database().ref("registered").orderByChild("campaign").equalTo(this.props.navigation.state.params.id)
        .once("value")
        .then((snap)=>{
            var exists;
            snap.forEach((childSnap)=> {    
                if(childSnap.val().user===this.props.navigation.state.params.uid) return(exists = true)
                else return(exists=false)
                })
            return exists
        }).then((exists)=>{
            if(exists){
                return(alert("You have already registered for this campaign"))
            }else{
                const DB = firebase.database().ref("registered");
                DB.push({
                    user:this.props.navigation.state.params.uid,
                    campaign: this.props.navigation.state.params.id
                });
                Alert.alert("Registration successful");
                this.props.navigation.navigate('Tabs')
            }
        })
    }
    homeSwitch = ()=>{
        this.props.navigation.navigate('Tabs');
      }

    render(){
        return(
            <View style={styles.container}>
                <View style={{width:"100%",display:"flex",flexDirection:"row",height:45,borderRadius:1,borderColor:"#ccc"}}>
                 <View style ={{alignSelf:"flex-start"}}>
                    <Icon  name="ios-arrow-back" onPress={this.homeSwitch} size={25} style={{marginLeft:15,marginTop:8}} color="#1F2F15" />
                 </View>
                </View>
                <ScrollView>

                {/* Organizer */}
                <View style={{flexDirection:'row',paddingLeft:30, paddingTop:10,backgroundColor:"#eee",flexWrap:"wrap"}}>
                <Icon name="ios-contact" color="#90A955" size={35} style={{marginTop:-7, marginRight:5}}/>
                <Text style={{ color:"#90A955"}}>Organizer: </Text>
                <Text>{this.props.navigation.state.params.organizer}</Text>
                </View>
                
                {/* Category */}
                <View style={{flexDirection:'row', padding:5,paddingLeft:30,backgroundColor:"#90A955"}}>
                <Icon name="ios-options" color="#1F2F16" size={25} style={{marginTop:-2, marginRight:5}}/>
                <Text style={{fontSize:14, color:"#1F2F16"}}>Category: </Text>
                <Text style={{fontSize:14,color:"#fff"}}>{this.props.navigation.state.params.category}</Text>
                </View>

                {/* BgImg */}
                <ImageBackground source={{uri:this.props.navigation.state.params.bg}} style={{width: '100%', height:200, display:'flex', flexDirection:"row", justifyContent:"center",alignItems:"center"}}>
                   {/* Name */}
                    <View style={{flexDirection:'row',marginLeft:30,marginRight:30, marginBottom:10,marginTop:20}}>
                    <Text style={{fontSize:24,
                        fontWeight:"bold",
                        textAlign:"center",
                        textTransform:"uppercase",
                        color:"#efefef",
                        textShadowColor: 'rgba(0, 0, 0, 0.75)',
                        textShadowOffset: {width: 2, height: 2},
                        textShadowRadius: 10}}>{this.props.navigation.state.params.name}</Text>
                    </View>
                </ImageBackground>

                 {/* Location */}
                <View style={{flexDirection:'row',padding:5,paddingLeft:30, backgroundColor:"#90A955"}}>
                <Icon name="ios-map" color="#1F2F16" size={25} style={{marginTop:-2, marginRight:5}}/>
                <Text style={{ color:"#1F2F16"}}>Location: </Text>
                <Text style={{ color:"#fff"}}>{this.props.navigation.state.params.location}</Text>
                </View>
                
                <View style={{padding:30,backgroundColor:"#fff"}}>
                <Text style={{fontSize:16,textAlign:'justify'}}>{this.props.navigation.state.params.Desc}</Text>
                </View>

               
                {/* Time */}
                <Icon name="ios-clock" color="#90A955" size={45} style={{marginLeft:"46%"}}/>
                <Text style={{marginLeft:25,marginRight:25,paddingLeft:5,paddingTop:5,paddingBottom:5,color:"#90A955",backgroundColor:"#eee"}}>Starts: </Text>
                <View style={{flexDirection:'row',justifyContent:"space-around",paddingBottom:5,paddingLeft:5,marginLeft:25,marginRight:25, backgroundColor:"#eee"}}>
                <Text>{this.props.navigation.state.params.sDate}</Text>
                <Text>{this.props.navigation.state.params.sTime}</Text>
                </View>
                <Text style={{marginLeft:25,marginRight:25,paddingLeft:5,paddingTop:5,paddingBottom:5,color:"#90A955",backgroundColor:"#dedede"}}>Ends: </Text>
                <View  style={{flexDirection:'row',justifyContent:"space-around",paddingLeft:5,marginLeft:25,marginRight:25, paddingBottom:5, marginBottom:50, backgroundColor:"#dedede"}}>
                <Text>{this.props.navigation.state.params.eDate}</Text>
                <Text>{this.props.navigation.state.params.eTime}</Text>
                </View>
                
                <View style ={{width:100,alignSelf:"center",marginBottom:50}}>
                        <Button 
                        title="Register"
                        color="#90A955"
                        onPress = {this.onRegisterClick}
                        // styles={styles.btn}
                        />
                    </View>

                </ScrollView>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container:{
        fontSize:16,
        flex:1,
        alignContent:"center",
        backgroundColor:"#fff",
        marginTop: Constants.statusBarHeight
    },
    txt:{
        textAlign:'center',
        fontSize:32,
    },
    img:{
        width:width,
        height:200
    },
    header:{
        height:45,
        paddingLeft:10,
        paddingTop:5,
        fontSize:18,
        borderColor:"#ccc",
        borderWidth:1
      },
      btn:{
        width: 200,
        height: 44,
        padding: 10,
        borderWidth: 1,
        borderColor: 'black',
        marginBottom: 10,
        marginTop: 10
      }
})