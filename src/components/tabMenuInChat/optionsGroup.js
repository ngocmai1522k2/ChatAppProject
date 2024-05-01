import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/AntDesign'
import IonIcons from 'react-native-vector-icons/Ionicons'
import FontAw5 from 'react-native-vector-icons/Feather'

const OptionsGroup = ({infor}) => {
  return (
    <View className='flex-col bg-gray-100'>
      <TouchableOpacity className='flex-row py-3 px-4 justify-items-center bg-white mb-1'>
        <IonIcons name='information-circle-outline' size={25} color={'#888'} />
        <Text className='text-gray-700 ml-2 text-lg'>Thêm mô tả nhóm</Text>
        </TouchableOpacity>
        <TouchableOpacity className='flex-row py-3 px-4 justify-items-center bg-white mb-1'>
            <IonIcons name='notifications-outline' size={25} color={'#888'} />
            <Text className='text-gray-700 ml-2 text-lg'>Thông báo</Text>
        </TouchableOpacity>
        <TouchableOpacity className='flex-row py-3 px-4 justify-items-center bg-white mb-1'>
            <FontAw5 name='users' size={25} color={'#888'} />
            <Text className='text-gray-700 ml-2 text-lg'>Quản lý thành viên</Text>
        </TouchableOpacity>
    </View>
  )
}

export default OptionsGroup