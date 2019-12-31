import React from 'react';
import {createStackNavigator} from 'react-navigation-stack';
import {Alert, SafeAreaView, FlatList, StyleSheet, Text, View, AsyncStorage, ScrollView} from 'react-native';
import Campaign from './Campaign';
// import Tbar from './Tbar';
import Constants from 'expo-constants';
import * as firebase from 'firebase';


export default class MyCampaigns extends React.Component {
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
        this.myCampaigns(user.uid);
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

myCampaigns(){
  this.db.ref("campaigns").orderByChild("userID").equalTo(this.state.uid).on("child_added", (snap)=> {

      firebase.database().ref("registered").orderByChild("campaign").equalTo(snap.key)
      .once("value")
      .then((snapshot)=>{
          var a = snapshot.numChildren();
          return a;
      }).then((num)=>{
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
              bgurl:snap.val().bgurl,
              regNum: num,

          }
          let campaigns = this.state.campaigns;
          campaigns.push(campaign);
          this.setState({
              campaigns:campaigns.reverse()
          })
      })
    });
}

delete(e){
  //console.log(e.id)
  firebase.database().ref(`campaigns/${e.id}`).remove();
  let campaigns = this.state.campaigns;
  campaigns = campaigns.filter((campaign)=>{
      return campaign.id !==e.id;
  })
  this.setState({
      campaigns:campaigns
  })

  //const key;
        firebase.database().ref("registered").orderByChild("campaign").equalTo(e.id).on("child_added", (snap)=> {
           let key = snap.key;
           //console.log("Key:" +key);
           firebase.database().ref(`registered/${key}`).remove();

          })
  Alert.alert("Campaign deleted successfully");
  //firebase.database().ref("registered").orderByChild("campaign").equalTo(e.id).remove();
}

editor(item){
  this.props.navigation.navigate('StartCampaign',{
    title:"Edit Campaign",
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

cvSwitch(item){
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


  render(){
    if(this.state.campaigns[0] == null){
      return(
        <View style = {styles.box}>
          <Text style={styles.header}>My Campaigns</Text>
          <Text style={{margin:20,fontSize:16,color:"#aaa",textAlign:"center"}}>You have not created any Campaigns</Text>
        </View>
      )
    }
    return(
      <View style={styles.box}>
        <Text style={styles.header}>My Campaigns</Text>
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
            num = {item.regNum}
            edit={true}
            delete = {true}
            editor = {()=>this.editor(item)}
            del = {()=>this.delete(item)}
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
