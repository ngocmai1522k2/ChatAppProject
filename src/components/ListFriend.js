import {View, Text, TouchableOpacity, Image, StyleSheet, ScrollView} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';

const ListFriend = ({friends}) => {
  const navigation = useNavigation();
  const handleChat = friend => {
    // navigation.navigate('Chat', {friend: friend});
  };
  const handleCall = friend => {
    // navigation.navigate('Call', {friend: friend});
  };
  const handleProfile = friend => {
    // navigation.navigate('Profile', {friend: friend});
  };
  const handleRemove = friend => {
    // removeFriend(friend);
  };
  return (
    
    <View className=" pl-4">
      {friends.map((item, id) => (
        <TouchableOpacity
          key={id}
          className="flex-row  py-2">
          <View className="flex-row w-11/12">
            <Image
              source={
                item.avatar
                  ? {uri: item.avatar}
                  : require('../assets/img/codon.jpg')
              }
              style={styles.avatar}
            />
            <View className="ml-3 flex-1" >
              <Text className="text-lg text-ellipsis">{item.name}</Text>
              <Text className="text-md text-ellipsis">{item.phone}</Text>
            </View>
            <View className="mt-3 flex-row ">
              <TouchableOpacity
                onPress={() => handleChat(item)}
                className="ml-3">
                <FontAwesome name="wechat" size={26} color="#888" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleCall(item)}
                className="ml-4">
                <Feather name="phone-call" size={26} color="#888" />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  
});

export default ListFriend;
