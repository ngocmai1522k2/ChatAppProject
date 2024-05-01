import {View, Text, TouchableOpacity, Image} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';

const ListConversation = ({conversations}) => {
  const navigation = useNavigation();

  const handleChat = item => {
    navigation.navigate('ChatScreen', {conversation: item});
  };

  return (
    <View className="">
      {conversations.map((item, id) => (
        <TouchableOpacity
          key={id}
          onPress={() => handleChat(item)}
          className="flex-row py-2 bg-white mb-1">
          <View className="flex-row w-11/12">
            <Image
              source={
                item.groupAvatar
                  ? {uri: item.groupAvatar}
                  : require('../assets/img/codon.jpg')
              }
              className="w-10 h-10 rounded-full mr-4"
            />
            <View className="ml-3 flex-1">
              <Text className="text-lg text-ellipsis">{item.groupName}</Text>
              <Text className="text-md text-ellipsis">...</Text>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default ListConversation;
