import React from 'react';
import {createStackNavigator} from 'react-navigation-stack';
import {Alert, SafeAreaView, FlatList, StyleSheet, Text, View, ScrollView, AsyncStorage,ActivityIndicator,TextInput } from 'react-native';
import Campaign from './Campaign';
// import Tbar from './Tbar';
import Constants from 'expo-constants';
import * as firebase from 'firebase'
import Icon from 'react-native-vector-icons/Ionicons'

export default class Home extends React.Component {
  constructor(props){
    super(props)
    this.state={
      name:"",
      email:"",
      photoURL:false,
      emailVerified:"",
      uid:"",
      isLoggedIn: false,
      campaigns:[],
      visible: 12,
      searchVal:"",

      loading: false, // user list loading
      isRefreshing: false, //for pull to refreshw
    }

    this.cvSwitch = this.cvSwitch.bind(this);
    this.scSwitch = this.scSwitch.bind(this);
    // this.changeListener = this.changeListener.bind(this);
  }

  componentDidMount(){
    this._retrieveData()
    .then((user)=>{
      if (user !== null) {
        this.setState({
          uid:user.uid,
          email:user.email,
          name:user.displayName
        })
        // console.log(this.state)
      }
    })
    this.db = firebase.database();
    this.refreshListener();
}

_retrieveData = async () => {
  try {
    const user = await AsyncStorage.getItem('myUser');

    return JSON.parse(user);
  }catch (error) {
    //console.log('HomeJS: '+error)
  }
};

// changeListener(){
//   this.db.ref('campaigns').on('child_added',snap=>{
//       let campaign = {
//           id: snap.key,
//           userID:snap.val().userID,
//           name:snap.val().name,
//           location:snap.val().location,
//           sDate:snap.val().sDate,
//           sTime:snap.val().sTime,
//           eDate:snap.val().eDate,
//           eTime:snap.val().eTime,
//           Desc:snap.val().Desc,
//           organizer:snap.val().organizer,
//           category:snap.val().category,
//           bgurl:snap.val().bgurl

//       }

//       let campaigns = this.state.campaigns;
//       campaigns.push(campaign);
//       this.setState({
//           campaigns:campaigns,
//           loading:false
//       })
//       // console.log(this.state.campaigns)
//   })
// }

refreshListener = ()=>{
  firebase.database().ref('campaigns').once('value').then((snapshot)=>{
    // console.log(snapshot.val())
    this.setState({campaigns:[]})
    let campaigns = this.state.campaigns;
    snapshot.forEach(snap=>{
      let campaign = {
        id: snap.key,
        userID:snap.val().userID,
        name:snap.val().name,
        location:snap.val().location,
        sDate:snap.val().sDate,
        sTime:snap.val().sTime,
        eDate:snap.val().eDate,
        eTime:snap.val().eTime,
        Desc:snap.val().Desc,
        organizer:snap.val().organizer,
        category:snap.val().category,
        bgurl:snap.val().bgurl

    }
    campaigns.push(campaign);
    })

    this.setState({
      campaigns:campaigns.reverse(),
      loading:false
  })

  })
}

  cvSwitch(item){
    //console.log("STATE: "+this.state.uid)
    this.props.navigation.navigate('CampaignView',{
      uid:this.state.uid,
      name:item.name,
      sDate:item.sDate,
      location:item.location,
      category:item.category,
      bg:item.bgurl,
      id:item.id,
      sTime:item.sTime,
      eDate:item.eDate,
      eTime:item.eTime,
      Desc:item.Desc,
      organizer:item.organizer
    });
  }

  scSwitch(){
    this.props.navigation.navigate('StartCampaign');
  }

  onRefresh = ()=>{
    this.setState({ loading: true }, ()=>{ this.refreshListener() });
 }


  render(){

    return(
      <View style={styles.box}>
        <View style={styles.header}>
          <Text style={styles.htext}>Home</Text>
          <Icon name="ios-search" size={25} style={{marginRight:5,marginTop:8}} color="#1F2F15" />
          <TextInput
            value={this.state.searchVal}
            onChangeText={(searchVal) => this.setState({ searchVal:searchVal })}
            placeholder={'Search for Campaigns'}
            style={styles.input}
          />
          <Icon name="ios-add" size={28} onPress={this.scSwitch} style={{marginRight:20,marginTop:5}} color="#1F2F15" />
        </View>
        <SafeAreaView style={styles.container}>

      <FlatList
        extraData={this.state}
        data={this.state.searchVal==""?this.state.campaigns:this.state.campaigns.filter((campaign)=>{
          return(
              campaign.name.includes(this.state.searchVal)||
              campaign.location.includes(this.state.searchVal)||
              campaign.category.includes(this.state.searchVal)
          );
      })}
        renderItem={({ item }) => <Campaign
        name={item.name}
        sDate={item.sDate}
        location={item.location}
        category={item.category}
        bg = {item.bgurl}
        id = {item.id}
        edit = {false}
        delete = {false}
        switch={()=>this.cvSwitch(item)}/>}
        keyExtractor={item => item.id}
        onRefresh={() => this.onRefresh()}
        refreshing={this.state.loading}
      />
        </SafeAreaView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor:"#eaf0ea",
    flex: 1,
  },
  item: {
    height:100,
    backgroundColor: '#fff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
  box:{
    flex:1,
    marginTop: Constants.statusBarHeight
  },
  header:{
    display:'flex',
    flexDirection:'row',
    height:45,
    borderColor:"#ccc",
    borderWidth:1
  },
  htext:{
    paddingLeft:10,
    paddingTop:5,
    fontSize:18,
    flex:1
  },
  input:{
    flex:3,
  },
  htext2:{
    paddingLeft:10,
    paddingTop:5,
    fontSize:24,
    flex:1
  }
});
