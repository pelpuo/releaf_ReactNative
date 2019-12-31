import React from 'react';
import {ScrollView, StyleSheet, Text, View, Button,Image, TextInput,Alert, AsyncStorage, } from 'react-native';
import Constants from 'expo-constants';
import t from 'tcomb-form-native';
import RNPickerSelect from 'react-native-picker-select';
const Form = t.form.Form;
import DatePicker from 'react-native-datepicker';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import * as firebase from 'firebase';


export default class StartCampaign extends React.Component{
    constructor(props){
        super(props);
        this.state={
          userID:"",
          name:"",
          location:"",
          organizer:"",
          sDate : "2019-01-01",
          sTime : "00:00",
          eDate : "2019-01-01",
          eTime : "00:00",
          Desc:"",
          category:"",
          bgurl:"",
          image: null,
        }
    }
    componentDidMount() {
      this._retrieveData()
    .then((user)=>{
      if (user !== null) {
        this.setState({
          userID:user.uid
        })
      }
    })
      this.getPermissionAsync();
      if(this.props.navigation.state.params){
        this.setState({
        title:"Edit Campaign",
        uid:this.props.navigation.state.params.uid,
        name:this.props.navigation.state.params.name,
        sDate:this.props.navigation.state.params.sDate,
        location:this.props.navigation.state.params.location,
        category:this.props.navigation.state.params.category,
        bgurl:this.props.navigation.state.params.bg,
        id:this.props.navigation.state.params.id,
        sTime:this.props.navigation.state.params.sTime,
        eDate:this.props.navigation.state.params.eDate,
        eTime:this.props.navigation.state.params.eTime,
        Desc:this.props.navigation.state.params.Desc,
        organizer:this.props.navigation.state.params.organizer
      });
      }
    }

    _retrieveData = async () => {
      try {
        const user = await AsyncStorage.getItem('myUser');
        return JSON.parse(user);
      }catch (error) {
        //console.log('HomeJS: '+error)
      }
    };

    getPermissionAsync = async () => {
      if (Constants.platform.ios) {
        const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        if (status !== 'granted') {
          Alert.alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    }
  
    _pickImage = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
      });

      //console.log(result);

      if (!result.cancelled) {
        this.setState({ image: result.uri });
        this.uploadImage(result.uri).then((blob)=>console.log(blob))
      }
    };

    uploadImage = async(uri) => {
      const response = await fetch(uri);
      const blob = await response.blob();
      var ref = firebase.storage().ref().child(`image-${this.state.name}-${this.state.location}-${this.state.organizer}`);
      ref.put(blob).then((snapshot)=>{
        return snapshot.ref.getDownloadURL()})
         .then((url)=>{
             this.setState({
                 bgurl:url
             })
             //console.log(url);
         })
  }
  


    onSubmit = () => {
      const DB = firebase.database().ref("campaigns");
      if(this.state.name!==""&&
      this.state.location!==""&&
      this.state.sDate!==""&&
      this.state.sTime!==""&&
      this.state.eDate!==""&&
      this.state.eTime!==""&&
      this.state.organizer!==""&&
      this.state.Desc!==""&&
      this.state.category!==""&&
      this.state.bgurl!==""){
      DB.push({
          userID:this.state.userID,
          name:this.state.name,
          location:this.state.location,
          sDate:this.state.sDate,
          sTime:this.state.sTime,
          eDate:this.state.eDate,
          eTime:this.state.eTime,
          organizer:this.state.organizer,
          Desc:this.state.Desc,
          category:this.state.category,
          bgurl:this.state.bgurl
     })
      Alert.alert("Campaign Created Successfully");
      this.props.navigation.navigate('Tabs');
    }else alert("Please fill out all fields")

  } 

  onEdit = () =>{
    if(this.state.name!==""&&
    this.state.location!==""&&
    this.state.sDate!==""&&
    this.state.sTime!==""&&
    this.state.eDate!==""&&
    this.state.eTime!==""&&
    this.state.organizer!==""&&
    this.state.Desc!==""&&
    this.state.category!==""&&
    this.state.bgurl!==""){
    Alert.alert("All changes have been saved");
    firebase.database().ref(`campaigns/${this.props.navigation.state.params.id}`).set({
        userID:this.state.userID,
        name:this.state.name,
        location:this.state.location,
        sDate:this.state.sDate,
        sTime:this.state.sTime,
        eDate:this.state.eDate,
        eTime:this.state.eTime,
        organizer:this.state.organizer,
        Desc:this.state.Desc,
        category:this.state.category,
        bgurl:this.state.bgurl
    })
    this.props.navigation.navigate('Tabs');
  }else alert("Please fill out all fields")
}


  render(){
    let  image  = this.state.image;
    const photo = this.state.photo;
      return(
        <View style={styles.body}>
        <View style={styles.header}>
            <Text style={styles.htext}>Start Campaign</Text>
        </View>
        <ScrollView>
                <View style={styles.container}>
                <Text>Campaign Name:</Text>
                  <TextInput
                    value={this.state.name}
                    onChangeText={(name) => this.setState({ name:name })}
                    placeholder={'Campaign name'}
                    style={styles.input}
                  />    
                  <Text>Location:</Text>
                  <TextInput
                    value={this.state.location}
                    onChangeText={(location) => this.setState({ location:location })}
                    placeholder={'Location'}
                    style={styles.input}
                  />
                  <Text>Organizer:</Text>
                  <TextInput
                      value={this.state.organizer}
                      onChangeText={(organizer) => this.setState({ organizer:organizer })}
                      placeholder={'Organizer'}
                      style={styles.input}
                    />  
                  <Text>Start Date:</Text>
                  <DatePicker style={{width: 200, borderColor:"#AAA", marginBottom:20}} date={this.state.sDate} mode="date" placeholder="select date" format="YYYY-MM-DD"
                    minDate="2016-05-01" maxDate="2100-06-01" confirmBtnText="Confirm" cancelBtnText="Cancel"
                      customStyles={{ dateIcon: { position: 'absolute', left: 0, top: 4, marginLeft: 0}, dateInput: { marginLeft: 36 }
                      }}
                      onDateChange={(date) => {this.setState({sDate: date})}}
                    />
                    <Text>Start Time:</Text>
                     <DatePicker style={{width: 200, borderColor:"#AAA", marginBottom:20}} date={this.state.sTime} mode="time" confirmBtnText="Confirm" cancelBtnText="Cancel"
                      customStyles={{ dateIcon: { position: 'absolute', left: 0, top: 4, marginLeft: 0}, dateInput: { marginLeft: 36 }
                      }}
                      onDateChange={(time) => {this.setState({sTime: time})}}
                    />
                    <Text>End Date:</Text>
                     <DatePicker style={{width: 200, borderColor:"#AAA", marginBottom:20}} date={this.state.eDate} mode="date" placeholder="select date" format="YYYY-MM-DD"
                      minDate="2016-05-01" maxDate="2100-06-01" confirmBtnText="Confirm" cancelBtnText="Cancel"
                      customStyles={{ dateIcon: { position: 'absolute', left: 0, top: 4, marginLeft: 0}, dateInput: { marginLeft: 36 }
                      }}
                      onDateChange={(date) => {this.setState({date: date})}}
                    />
                    <Text>End Time:</Text>
                     <DatePicker style={{width: 200, borderColor:"#AAA", marginBottom:20}} date={this.state.eTime} mode="time" confirmBtnText="Confirm" cancelBtnText="Cancel"
                      customStyles={{ dateIcon: { position: 'absolute', left: 0, top: 4, marginLeft: 0}, dateInput: { marginLeft: 36 }
                      }}
                      onDateChange={(time) => {this.setState({eTime: time})}}
                    />
                    <Text>Description: </Text>
                    <TextInput
                      multiline = {true}
                      // numberOfLines = {10}
                      onChangeText={(Desc) => this.setState({Desc})}
                      value={this.state.Desc}
                      editable = {true}
                      maxLength = {2000}
                      style={{padding:10, borderBottomColor: '#000000',borderBottomWidth: 1}}
                    />
                     <RNPickerSelect
                        onValueChange={(value) =>  {this.setState({category: value})}}
                        items={[
                            { label: 'Sanitation', value: 'Sanitation' },
                            { label: 'Collaboration Activity', value: 'Collaboration Activity' },
                            { label: 'Conference', value: 'Conference' },
                            { label: 'Parade', value: 'Parade' },
                            { label: 'Forestry', value: 'Forestry' }, 
                            { label: 'Wildlife', value: 'Wildlife' },
                        ]}
                    />

                    
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginTop:50 ,marginBottom:100 }}>
                      <Button
                        color="#31572C"
                        title="Select your campaign banner"
                        onPress={this._pickImage}
                      />
                      {image &&
                        <Image source={{ uri: image }} style={{ width: 320, height: 180 }} />}
                    </View>
                      
                    <Button
                    title={this.props.navigation.state.params?"Save Changes":"Create Campaign!"}
                    color="#90A955"
                    style={styles.btn}
                    onPress={this.state.title=="Edit Campaign"?this.onEdit:this.onSubmit}
                    />
                   
                </View>
                
            </ScrollView>
            </View>
        )
    }

}

const styles = StyleSheet.create({ 
  body:{
    flex:1,
  },
    container: {
        justifyContent: 'center',
        flex:1,
        padding: 20,
        backgroundColor: '#eaf0ea',
      },
    inputContainer: {
        paddingTop: 15
      },
      textInput: {
        borderColor: '#CCCCCC',
        borderTopWidth: 1,
        borderBottomWidth: 1,
        height: 50,
        fontSize: 25,
        paddingLeft: 20,
        paddingRight: 20
      },
      header:{
        display:'flex',
        marginTop: Constants.statusBarHeight,
        flexDirection:'row',
        height:45,
        borderColor:"#ccc",
        borderWidth:1
      },
      input: {
        width: 250,
        height: 44,
        padding: 10,
        // backgroundColor:'#fff',
        borderWidth: 1,
        borderColor: '#AAA',
        marginBottom: 10,
        marginTop: 10,
        marginLeft:36
      },
      htext:{
        paddingLeft:10,
        paddingTop:5,
        fontSize:18,
        flex:5
      },
      btn:{
        marginTop:100
      }
})