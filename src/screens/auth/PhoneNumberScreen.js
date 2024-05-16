import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  TextInput,
  StatusBar,
  Alert
} from 'react-native';
import React, { useEffect, useState } from 'react';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {styled} from 'nativewind';
import {OtpInput} from 'react-native-otp-entry';
// add
import auth from "@react-native-firebase/auth"

export default function PhoneNumberScreen() {
  const navigation = useNavigation();
   // If null, no SMS has been sent
   const [confirm, setConfirm] = useState(null);
   const [code,setCode] = useState('')
   

   // verification code (OTP - One-Time-Passcode)
   const [phoneNumber,setPhoneNumber] = useState('')

    // Handle the button press
    const signInWithPhoneNumber = async()=>{
      try{
          const confirmmation = await auth().signInWithPhoneNumber("+84"+phoneNumber);
          // const confirmmation = "NVV"
          setConfirm(confirmmation);
          console.log(confirmmation)
          // navigation.navigate('OTP',{confirmCode:confirmmation})
          // navigation.navigate('OTP',{confirmCode:confirmmation})

          
      }catch(error){
          Alert.alert("invalid your phoneNumber")
          console.log("Error sending code",error)
      }
  };


  const confirmcode = async()=>{
    try{
        const userCredential = await confirm.confirm(code);
        const user = userCredential.user;
        // check if user is new or existing

        if(user!=null){
            navigation.navigate("SignUp",{sdt:phoneNumber})
            // navigation.navigate("SignUp")
        }
      
      
      
    }catch(error){
       Alert.alert("Thông Báo","Số điện thoại không hợp lệ!")
        console.log("invalid code",error)
    }
    
}
  
  

 
  return (
    <SafeAreaView className="flex-1 bg-white">
          {!confirm?(
                    <>
      <View className="flex-row justify-start">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className=" h-15 w-15  my-7 mx-7  ">
          <Icon name="arrowleft" size={30} color={'blue'} />
        </TouchableOpacity>

      </View>
      <View className="flex-row justify-center mt-0 ">
      
        <Image
          source={require('../../assets/img/phone.jpg')}
          style={{width: 200, height: 200}}
        />
      </View>
      <View className="flex-row justify-center mt-11">
        <Text className="text-2xl font-bold text-gray-800">
          Enter your phone number{' '}
        </Text>
      </View>
      <View className="flex-row justify-center mt-2">
        <Text className="text-lg font-serif text-gray-800">
          We will send you a verification code
        </Text>
      </View>

      <View className="flex-row">
        <TouchableOpacity onPress={() => {}}>
          <View className="flex-col justify-center items-center bg-slate-100 rounded-xl px-2 ml-3 mt-4">
            <MaterialIcons
              name="keyboard-arrow-down"
              size={20}
              color={'#000'}
            />
            <Image
              source={require('../../assets/img/vietnam-flag.png')}
              style={{width: 40, height: 30}}
            />
            <Text className="text-sm font-bold text-gray-800">+84</Text>
          </View>
        </TouchableOpacity>
        <View className="flex-1">
          <TextInput className="p-5 bg-gray-100 text-gray-700 rounded-2xl mx-5 mt-5" placeholder='Enter your phone number' 
          value={phoneNumber}
          onChangeText={setPhoneNumber} />
        </View>
      </View>
      <View className="flex-row justify-center mt-5">
        <TouchableOpacity
          className="bg-blue-500 py-3 px-10 my-7 mx-7 rounded-xl"
          // onPress={() => navigation.navigate('OTP')}
          onPress={signInWithPhoneNumber}
          >
          <Text className="text-white font-bold text-lg text-center ">
            Send OTP
          </Text>
        </TouchableOpacity>
      </View>
      </>

):(
  <>
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
  </>
)}
  




    
        <View className="flex-row justify-center mt-5">
            <Text className="text-gray-700 text-sm">Already have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text className="text-blue-900 text-sm font-semibold">  Login</Text>
            </TouchableOpacity>
        </View>
    </SafeAreaView>
  );


}
