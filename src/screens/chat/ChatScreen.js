import {
  View,
  Text,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  TextInput,
} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/AntDesign';
import MaterialComIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {SafeAreaView} from 'react-native-safe-area-context';

const ChatScreen = ({route, navigation}) => {
  const {conversation} = route.params;
  console.log('conversation', conversation);

  const handleOpenMenu = () => {
    navigation.navigate('MenuChat', {infor: conversation});
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-300 ">
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
        <TouchableOpacity className="ml-0">
          <Icon name="addusergroup" size={30} color={'#fff'} />
        </TouchableOpacity>
        <TouchableOpacity className="ml-4" onPress={() => handleOpenMenu()}>
          <Icon name="ellipsis1" size={30} color={'#fff'} />
        </TouchableOpacity>
      </View>
      <KeyboardAvoidingView className="flex-1 bg-slate-100">
        <ScrollView>
          
        </ScrollView>
        <View className="flex-row items-center align-middle bg-white p-2">
          <TouchableOpacity className="mr-1">
          <MaterialComIcon name="emoticon-outline" size={30} color={'#5F6368'} />
          </TouchableOpacity>
          
          <View className="flex-1">
            <TextInput
              className="text-xl text-left text-black"
              placeholder="Nhập tin nhắn"
              value={message}
              onChangeText={(text) => {setMessage(text)}}
              
              ></TextInput>
          </View>
          
          <TouchableOpacity className="mr-2" >
            <MaterialComIcon name="send" size={30} color={'#2597F1'} />
          </TouchableOpacity>
          <TouchableOpacity className="mr-2">
            <MaterialComIcon name="attachment" size={30} color={'#5F6368'} />
          </TouchableOpacity>
          <TouchableOpacity>
            <MaterialComIcon name="microphone" size={30} color={'#5F6368'} />
          </TouchableOpacity>
          <TouchableOpacity>
            <MaterialComIcon name="file-image" size={30} color={'#5F6368'} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatScreen;
