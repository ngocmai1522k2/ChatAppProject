// In App.js in a new project

import * as React from 'react';
import {View, Text} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import FriendScreen from  '../screens/FriendScreen'
import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import SignUpScreen from '../screens/auth/SignUpScreen';
import PhoneNumberScreen from '../screens/auth/PhoneNumberScreen';
import OTP from '../screens/auth/OTP';
import ForgotPassScreen from '../screens/auth/ForgotPassScreen';
import NewPasswordScreen from '../screens/auth/NewPasswordScreen';
import HomeChat from './HomeChat';
import ChatScreen from '../screens/chat/ChatScreen';
import MenuChat from '../screens/chat/MenuChat';
import SingleChatScreen from '../screens/chat/SingleChatScreen';
import FriendProfile from '../screens/FriendProfile';

const Stack = createNativeStackNavigator();

function AppNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Welcome'>
        <Stack.Screen name="Welcome" options={{headerShown: false}} component={WelcomeScreen} />
        <Stack.Screen name="Login" options={{headerShown: false}} component={LoginScreen} /> 
        <Stack.Screen name="FriendScreen" options={{headerShown: false}} component={FriendScreen} />
        <Stack.Screen name="SignUp" options={{headerShown: false}} component={SignUpScreen} />
        <Stack.Screen name="PhoneNumber" options={{headerShown: false}} component={PhoneNumberScreen} />
        <Stack.Screen name="OTP" options={{headerShown: false}} component={OTP} />
        <Stack.Screen name="ForgotPassScreen" options={{headerTitle:"",headerStyle:{backgroundColor:"#BEBDB8"}}} component={ForgotPassScreen} />
        <Stack.Screen name="NewPasswordScreen" options={{headerTitle:"",headerStyle:{backgroundColor:"#BEBDB8"}}} component={NewPasswordScreen} />
        <Stack.Screen name="HomeChat" options={{headerShown: false}} component={HomeChat} />
        <Stack.Screen name="ChatScreen" options={{headerShown: false}} component={ChatScreen} />
        <Stack.Screen name="SingleChatScreen" options={{headerShown: false}} component={SingleChatScreen} />
        <Stack.Screen name="MenuChat" options={{headerShown: false}} component={MenuChat} />
        <Stack.Screen name="FriendProfile" options={{headerShown: false}} component={FriendProfile} />
      

      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigation;
