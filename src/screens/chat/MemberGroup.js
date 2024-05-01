import { View, Text } from 'react-native'
import React from 'react'

const MemberGroup = () => {
  return (
    <View className="flex-col flex-1 bg-gray-200">
      <View className="flex-row p-2 bg-blue-500">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className=" h-15 w-15 ml-1 mt-1 mr-3">
          <Icon name="arrowleft" size={30} color={'#fff'} />
        </TouchableOpacity>
        <Text className="ml-1 text-xl text-left text-white w-6/12">
          Tùy chọn cho trưởng nhóm
        </Text>
      </View>
      </View>
  )
}

export default MemberGroup