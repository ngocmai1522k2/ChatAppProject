// In App.js in a new project

import * as React from 'react';
import {View, Text} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import PhoneNumberScreen from '../screens/PhoneNumberScreen';
import OTP from '../screens/OTP';
import ForgotPassScreen from '../screens/ForgotPassScreen';
import NewPasswordScreen from '../screens/NewPasswordScreen';
import HomeChat from './HomeChat';

const Stack = createNativeStackNavigator();

function AppNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Welcome'>
        <Stack.Screen name="Welcome" options={{headerShown: false}} component={WelcomeScreen} />
        <Stack.Screen name="Login" options={{headerShown: false}} component={LoginScreen} /> 
        <Stack.Screen name="Home" options={{headerShown: false}} component={HomeScreen} />
        <Stack.Screen name="SignUp" options={{headerShown: false}} component={SignUpScreen} />
        <Stack.Screen name="PhoneNumber" options={{headerShown: false}} component={PhoneNumberScreen} />
        <Stack.Screen name="OTP" options={{headerShown: false}} component={OTP} />
        <Stack.Screen name="ForgotPassScreen" options={{headerTitle:"",headerStyle:{backgroundColor:"#BEBDB8"}}} component={ForgotPassScreen} />
        <Stack.Screen name="NewPasswordScreen" options={{headerTitle:"",headerStyle:{backgroundColor:"#BEBDB8"}}} component={NewPasswordScreen} />
        <Stack.Screen name="HomeChat" options={{headerShown: false}} component={HomeChat} />
      
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigation;
