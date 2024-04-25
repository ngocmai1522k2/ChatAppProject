import {View, TouchableOpacity, Text, Image, TextInput} from 'react-native';
import React, { useState } from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/AntDesign';
import {useNavigation} from '@react-navigation/native';
import { postApiNoneToken } from '../api/CallApi';
import { getApiNoneToken } from '../api/CallApi';
export default function LoginScreen() {
  const [email,setEmail] =useState("hi@gmail.com")
  const[pass,setPass] = useState("0345641602Nvv!")
  // xu ly dang nhap
  const login = async()=>{
    
    console.log("hihi")
      try {
        const respone = await postApiNoneToken("/login",{
          username:email,
          password: pass
        })
        // const respone = getApiNoneToken("/getAllUser")

        navigation.navigate("HomeChat")

        console.log(respone.data)
        
        
      } catch (error) {
        console.error("Error while login:", error);
      }
    
    
  }


  const navigation = useNavigation();
  return (
    <View className="flex-1 bg-blue-400">
      <SafeAreaView className="flex-1">
        <View className="flex-row justify-start">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className=" h-15 w-15  my-7 mx-7  ">
            <Icon name="arrowleft" size={30} color={'#fff'} />
          </TouchableOpacity>
        </View>
        <View className="flex-row justify-center mt-11">
          <Image
            source={require('../assets/img/login.png')}
            style={{width: 350, height: 350}}
          />
        </View>
      </SafeAreaView>
      <View
        className="flex-1 bg-white px-8 pt-8"
        style={{
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
        }}>
        <View className="form space-y-2">
          <Text className="text-gray-700 ml-4 text-lg">Email address: </Text>
          <TextInput className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3"  onChangeText={setEmail} value={email} />
          <Text className="text-gray-700 ml-4 text-lg">Password: </Text>
          <TextInput className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3"  secureTextEntry={true}  onChangeText={setPass} value={pass}/>
        </View>
        <TouchableOpacity className="flex items-end mb-5" onPress={()=>navigation.navigate("ForgotPassScreen")}>
          <Text className="text-gray-700">Forgot Password?</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex py-4 bg-blue-500 rounded-2xl mb-1 " onPress={login}>
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
              source={require('../assets/img/gg.png')}
              className="w-10 h-10"></Image>
          </TouchableOpacity>
          <TouchableOpacity className="p-2 bg-gray-100 rounded-2xl">
            <Image
              source={require('../assets/img/fb.png')}
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
    </View>
  );
}
