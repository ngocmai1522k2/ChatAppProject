import {View, Text, StatusBar, Image, TouchableOpacity} from 'react-native';
import React, { useState } from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {OtpInput} from 'react-native-otp-entry';
import {useNavigation} from '@react-navigation/native';

export default function OTP({navigation,route}) {
    const {confirmCode} = route.params;
    // const navigation = useNavigation();
    const [code,setCode] = useState('')


    const confirmcode = async()=>{
      try{
          const userCredential = await confirmCode.confirm(code);
          // alert(userCredential)
          console.log(userCredential.user)

          // const user = userCredential.user;
          // check if user is new or existing
          if(userCredential.user.phoneNumber != ""){
            // chổ này bị lỏ
            alert("dang ký thanh cong")
            navigation.navigate('Login')
          }

          
      }catch(error){
          console.log("invalid code",error)
         
      }
      
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row justify-center ml-20 mt-16 bg-white">
        <StatusBar hidden />
        <Image
          source={require('../../assets/img/phone.jpg')}
          style={{width: 250, height: 250, resizeMode: 'contain'}}
        />
        <Text className="text-white font-bold text-4xl text-center">OTP</Text>
      </View>
      <View className="flex-row justify-center mt-2">
        <Text className="text-lg font-serif text-gray-800">
          Enter the OTP sent to your phone number
        </Text>
      </View>
      <View className="my-16 mx-5">
        <OtpInput
          numberOfInputs={6}
          onTextChange={text => {
            setCode(text)
            
            console.log(text);
          }}
          
          focusColor={'#000'}
          focusStickBlinkingDuration={500}
          otpStyles="text-3xl text-gray-800"
        />
      </View>
      <View className="flex-row justify-center">
        <TouchableOpacity className="flex-row items-center">
          <Text className="text-sm font-serif text-gray-800">
            Didn't receive the OTP?
          </Text>
          <TouchableOpacity >
            <Text className="text-sm font-serif text-blue-800 ml-3" >Resend OTP</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </View>

        <View className="flex-row justify-center mt-5">
            <TouchableOpacity
                className="bg-blue-500 py-3 px-10 my-7 mx-7 rounded-xl"
                // onPress={() => navigation.navigate('PhoneNumber')}
                onPress={confirmcode}>
                <Text className="text-white font-bold text-lg text-center">
                Verify
                </Text>
            </TouchableOpacity>
        </View>
    </SafeAreaView>
  );
}
