import React from 'react';
import {createStackNavigator} from 'react-navigation-stack';
import {SafeAreaView, FlatList, StyleSheet, Text, View, ScrollView, AsyncStorage, Alert } from 'react-native';
import Campaign from './Campaign';
// import Tbar from './Tbar';
import Constants from 'expo-constants';
import * as firebase from 'firebase'



export default class Joined extends React.Component {
  constructor(props){
    super(props)

    this.state={
      uid:"",
      email:"",
      name:"",
      campaigns:[]
    }
  }


  componentDidMount(){
    this.db = firebase.database();
    this._retrieveData()
    .then((user)=>{
      if (user !== null) {
        this.setState({
          uid:user.uid,
          email:user.email,
          name:user.displayName,
        })
        this.joinedCampaigns(user.uid);
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


joinedCampaigns(uid){
  this.db.ref("registered").orderByChild("user").equalTo(uid).on("child_added", (snapshot)=> {
      let key =snapshot.key;
      let campaign = snapshot.val().campaign;
      let joined = this.db.ref(`campaigns`).child(campaign)
      .once('value')
      .then((snap)=>{
          let value = {
              key: key,
              id: snap.key,
              userID:snap.val().userID,
              name:snap.val().name,
              location:snap.val().location,
              sDate:snap.val().sDate,
              sTime:snap.val().sTime,
              eDate:snap.val().eDate,
              eTime:snap.val().eTime,
              Desc:snap.val().Desc,
              category:snap.val().category,
              bgurl:snap.val().bgurl

          };
          let campaigns = this.state.campaigns;
          campaigns.push(value);

          this.setState({
              campaigns:campaigns.reverse()
          })
      });

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


delete = (e) => {
  //console.log(e)
  firebase.database().ref(`registered/${e}`).remove();
  let campaigns = this.state.campaigns;
  campaigns = campaigns.filter((campaign)=>{
      return campaign.key != e;
  })
  this.setState({
      campaigns:campaigns
  })
  return(Alert.alert("Campaign Deleted Successfully"))
}

  render(){
    if(this.state.campaigns[0] == null){
      return(
        <View style = {styles.box}>
          <Text style={styles.header}>Joined</Text>
          <Text style={{margin:20,fontSize:16,color:"#aaa",textAlign:"center"}}>You have not registered for any Campaigns</Text>
        </View>
      )
    }
    return(
      <View style={styles.box}>
        <Text style={styles.header}>Joined</Text>
        <SafeAreaView style={styles.container}>
          <FlatList
          extraData={this.state}
          data={this.state.campaigns}
          renderItem={({ item }) => 
          <Campaign
          name={item.name}
          sDate={item.sDate}
          location={item.location}
          category={item.category}
          bg = {item.bgurl}
          id = {item.id}
          regKey = {item.key}
          delete = {true}
          del = {()=>this.delete(item.key)}
          switch={()=>this.cvSwitch(item)}/>}
          keyExtractor={item => item.id}
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
    height:45,
    paddingLeft:10,
    paddingTop:5,
    fontSize:18,
    borderColor:"#ccc",
    borderWidth:1
  }
});
