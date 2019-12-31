import React from 'react';
import {StyleSheet,Text, TouchableHighlight, View, Button, ImageBackground} from 'react-native';
import { Row } from 'native-base';
var react = require('react-native');
var width = react.Dimensions.get('window').width; 
import Icon from 'react-native-vector-icons/Ionicons'

export default class Campaign extends React.Component{
    constructor(props){
        super(props);
    }


    render(){
        return(
            <TouchableHighlight onPress={this.props.switch} underlayColor="#CCC">
                <View style={styles.container}>
                    <ImageBackground style={styles.img} source={{uri:this.props.bg}}>
                    <View style ={{width:80, height:40,display:'flex',flexDirection:'row'}}>
                        {this.props.edit&&
                        <Icon name="ios-create" size={24} color="#1F2F16" onPress = {this.props.editor} 
                        style={{margin:5,backgroundColor:"#ffffff"}}/>
                        }
                        {this.props.delete&&
                        <Icon name="ios-trash" size={24} color="#000"
                         onPress = {this.props.del} id={this.props.regKey?this.props.regKey:this.props.id} 
                         style={{margin:5,padding:5,backgroundColor:"#ffffff"}}/>
                        }
                        {this.props.num>0?<Text style={{
                                            marginTop:5,
                                            marginLeft:46,
                                            borderRadius:18,
                                            paddingTop:7,
                                            paddingBottom:5,
                                            paddingLeft:12,
                                            paddingRight:12,
                                            backgroundColor:"#f5b914",
                                            color: "white",
                                            textAlign: "center",
                                            fontWeight: "500",
                                        }}>{this.props.num}</Text>:null}
                    </View>
                    </ImageBackground>
                    <View style={styles.details}>
                        <Text style={{color:'#90A955',fontSize:12,flex:1}}>{this.props.sDate}</Text>
                        <Text style={{color:'#132A13',fontSize:16,flex:2}} onPress={this.cvSwitch}>{this.props.name.length>20?this.props.name.slice(0,20)+"...":this.props.name}</Text>
                        <Text style={{fontSize:14,flex:2}}>{this.props.location}</Text>
                        <Text style={{color:'#90A955',fontSize:12,flex:1}}>{this.props.category}</Text>
                    </View>
                </View>
            </TouchableHighlight>
        )
    }

}

const styles =StyleSheet.create({
    container:{
        marginLeft:10,
        marginRight:10,
        marginTop:5,
        marginBottom:5,
        flexDirection:"row",
        height:120,
        width:width*0.95,
        backgroundColor:'#fff',
        borderWidth:1,
        borderStyle:'solid',
        borderColor:"#DDD"   
    },
    img:{
        width:150,
        height:118,
    },
    details:{
        padding:5,
        flexDirection:"column",
        width:250,
        height:100,
    }
});