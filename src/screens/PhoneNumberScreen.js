import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {styled} from 'nativewind';

export default function PhoneNumberScreen() {
  const navigation = useNavigation();
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row justify-start">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className=" h-15 w-15  my-7 mx-7  ">
          <Icon name="arrowleft" size={30} color={'blue'} />
        </TouchableOpacity>
      </View>
      <View className="flex-row justify-center mt-0 ">
        <Image
          source={require('../assets/img/phone.jpg')}
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
              source={require('../assets/img/vietnam-flag.png')}
              style={{width: 40, height: 30}}
            />
            <Text className="text-sm font-bold text-gray-800">+84</Text>
          </View>
        </TouchableOpacity>
        <View className="flex-1">
          <TextInput className="p-5 bg-gray-100 text-gray-700 rounded-2xl mx-5 mt-5" placeholder='Enter your phone number' />
        </View>
      </View>
      <View className="flex-row justify-center mt-5">
        <TouchableOpacity
          className="bg-blue-500 py-3 px-10 my-7 mx-7 rounded-xl"
          onPress={() => navigation.navigate('OTP')}>
          <Text className="text-white font-bold text-lg text-center ">
            Send OTP
          </Text>
        </TouchableOpacity>
      </View>

        <View className="flex-row justify-center mt-5">
            <Text className="text-gray-700 text-sm">Already have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text className="text-blue-900 text-sm font-semibold">  Login</Text>
            </TouchableOpacity>
        </View>
    </SafeAreaView>
  );
}
