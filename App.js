import Home from './components/Home';
import Login from './components/Login';
import CampaignView from './components/CampaignView';
import StartCampaign from './components/StartCampaign';
// import Campaign from './components/Campaign';
import Register from './components/Register';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import Tabs from './components/Tabs';

import * as firebase from 'firebase'
import "firebase/auth";

import 'firebase/storage';

var firebaseConfig = {
  apiKey: "AIzaSyCG1CsGY6U1jf9m23RmSHyncZ8u1Wd47yM",
  authDomain: "releaf-ba461.firebaseapp.com",
  databaseURL: "https://releaf-ba461.firebaseio.com",
  projectId: "releaf-ba461",
  storageBucket: "releaf-ba461.appspot.com",
  messagingSenderId: "445697150152",
  appId: "1:445697150152:web:3b5be43b753230765969fd",
  measurementId: "G-K6GQW0YKSV"
};
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  // firebase.analytics();
  const storage = firebase.storage();

const App = createStackNavigator({
  // Splash: {
  //   screen:Login
  // },
  
  //Defination of Navigaton from setting screen
  Login: {screen: Login},
  Register: {screen: Register},
  Tabs: {screen: Tabs},
  Home: {screen:Home},
  //Campaign:{screen:Campaign},
  CampaignView: {screen: CampaignView},
  StartCampaign: {screen: StartCampaign}
}
,{
    headerMode:'none',
    initialRouteName: 'Login'
  }

)

  export default createAppContainer(App);