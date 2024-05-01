import {View, TouchableOpacity, Text, Image, TextInput} from 'react-native';
import React, { useState } from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/AntDesign';
import {useNavigation} from '@react-navigation/native';
import { getApiapiConversation, postApiNoneToken } from '../../api/CallApi';

import { useDispatch, useSelector } from 'react-redux';
import { setCurrentUser } from '../../features/user/userSlice';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';


export default function LoginScreen() {
  const [email,setEmail] =useState("hi@gmail.com")
  const[pass,setPass] = useState("0345641602Nvv!")
  const dispatch = useDispatch()
  const currentUser = useSelector((state) => state.user.currentUser);
  // xu ly dang nhap
  const login = async()=>{
    
    console.log("hihi")
      try {
        const respone = await postApiNoneToken("/login",{
          username:email,
          password: pass
        })
        const user = respone.data.userLogin;
        dispatch(setCurrentUser(user))
        console.log("user",user)
       

        navigation.navigate("HomeChat")

        console.log(respone.data)
        
        
      } catch (error) {
        console.error("Error while login:", error);
      }
    
    
  }


  const navigation = useNavigation();
  return (

    <SafeAreaView className="flex-1 bg-blue-400">
      <View className="flex-1">
        <View className="flex-row justify-start">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className=" h-15 w-15  my-5 mx-5  ">
            <Icon name="arrowleft" size={30} color={'#fff'} />
          </TouchableOpacity>
        </View>
        <View className="flex-row justify-center">
          <Image
            source={require('../../assets/img/login.png')}
            style={{width: 200, height: 230}}
          />
        </View>
      </View>
      <View
        className="flex bg-white px-5 pt-5 pb-10"
        style={{
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
        }}>
        <View className="form space-y-5">
          <Text className="text-gray-700 ml-4 text-lg mb-1">Email address: </Text>
          <TextInput className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-1"  onChangeText={setEmail} value={email} />
          <Text className="text-gray-700 ml-4 text-lg">Password: </Text>
          <TextInput className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-1"  secureTextEntry={true}  onChangeText={setPass} value={pass}/>
        </View>
        <TouchableOpacity className="flex items-end mb-5" onPress={()=>navigation.navigate("ForgotPassScreen")}>
          <Text className="text-gray-700">Forgot Password?</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex py-3 bg-blue-500 rounded-2xl mb-1 " onPress={login}>
          <Text className="text-center text-white text-lg font-semibold">
            Login
          </Text>
        </TouchableOpacity>
        <Text className="text-center text-gray-800 text-xl mt-1 font-semibold">
          Or
        </Text>
        <View className="flex-row justify-center space-x-12">
          <TouchableOpacity className="p-2 bg-gray-100 rounded-2xl">
            <Image
              source={require('../../assets/img/gg.png')}
              className="w-10 h-10"></Image>
          </TouchableOpacity>
          <TouchableOpacity className="p-2 bg-gray-100 rounded-2xl">
            <Image
              source={require('../../assets/img/fb.png')}
              className="w-10 h-10"></Image>
          </TouchableOpacity>
        </View>
        <View className="flex-row justify-center mt-3">
          <Text className="text-gray-700 text-sm">Don't have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
            <Text className="text-blue-900 text-sm font-semibold">  Sign Up</Text>
          </TouchableOpacity>
        </View>
        <View className="flex-row justify-center"></View>
      </View>
    </SafeAreaView>
  );
}
