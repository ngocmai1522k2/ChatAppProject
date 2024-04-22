import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'

export default function WelcomeScreen() {
    const navigation = useNavigation();
  return (
    <SafeAreaView className="flex-1 bg-blue-400">
        <View className="flex-1 flex justify-around my-4">
            <Text className="text-white font-bold text-4xl text-center">Let's Chat!</Text>
        </View>
        <View className="flex-row justify-center">
            <Image source={require('../assets/img/welcome.png')} style={{width: 350, height: 350}} />
        </View>
        <View className="space-y-5 px-6">
            <TouchableOpacity className="bg-blue-800 py-3 my-7 mx-7 rounded-xl" onPress={()=>navigation.navigate('Login')}>
                <Text className="text-white font-bold text-lg text-center ">Login</Text>
            </TouchableOpacity>
        </View>
        <View className=" flex-row justify-center mb-20">
            <Text className="text-white font-extrabold text-center text-sm">Don't have an account?</Text>
            <TouchableOpacity className="mx-2" onPress={()=>navigation.navigate('PhoneNumber')}>
            <Text className="text-blue-900 text-sm font-semibold">Sign Up</Text>
            </TouchableOpacity>
        </View>
    </SafeAreaView>
  )
}