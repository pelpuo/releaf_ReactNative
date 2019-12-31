import MyCampaigns from "./MyCampaigns";
import Home from "./Home";
import Joined from "./Joined";
import React from 'react';
import { createAppContainer } from "react-navigation";
import { createBottomTabNavigator } from 'react-navigation-tabs';
import Icon from 'react-native-vector-icons/Ionicons'

const Tabs = createBottomTabNavigator({
 
    Joined: {screen: Joined, navigationOptions:{
      tabBarLabel:'Joined',
      tabBarIcon:({tintColor})=>(
        <Icon name="ios-people" size={24} color={tintColor} />
      )
    }},

    Home: {screen: Home, navigationOptions:{
      tabBarLabel:'Home',
      tabBarIcon:({tintColor})=>(
        <Icon name="ios-home" size={24} color={tintColor} />
      )
    }},

    MyCampaigns: {screen: MyCampaigns, navigationOptions:{
      tabBarLabel:'My Campaigns',
      tabBarIcon:({tintColor})=>(
        <Icon name="ios-person" size={24} color={tintColor} />
      )
    }}

  }, {
    initialRouteName: "Home",
    navigationOptions:{
      tabBarVisible:true
    },
    tabBarOptions:{
      activeTintColor: "#90A955",
      inactiveTintColor:"#1F2F16"
    }
  },

  );

export default createAppContainer(Tabs);