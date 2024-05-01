import {View, Text, TouchableOpacity, Image} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/AntDesign';

const ChatScreen = ({route, navigation}) => {
  const {conversation} = route.params;
  console.log('conversation', conversation);

  const handleOpenMenu = () => {
    navigation.navigate('MenuChat', {infor: conversation});
  }

  return (
    <View className="flex-1 bg-slate-300 ">
      {/* Header */}
      <View className="flex-row  p-2 bg-blue-500">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className=" h-15 w-15 ml-1 mt-1 mr-3">
          <Icon name="arrowleft" size={30} color={'#fff'} />
        </TouchableOpacity>
        <Image
          source={
            conversation.groupAvatar
              ? {uri: conversation.groupAvatar}
              : require('../../assets/img/codon.jpg')
          }
          className="w-10 h-10 rounded-full mr-2 ml-3"></Image>
        <Text className="ml-1 text-xl text-left text-white w-6/12">
          {conversation.groupName}
        </Text>
        <TouchableOpacity className='ml-0'>
          <Icon name="addusergroup" size={30} color={'#fff'} />
        </TouchableOpacity>
        <TouchableOpacity className='ml-4' onPress={()=>handleOpenMenu()}>
          <Icon name="ellipsis1" size={30} color={'#fff'} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChatScreen;
