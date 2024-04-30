import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';
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
    <View className="flex-col -scroll-ml-3.5 p-1 m-1">
      {friends.map((item, id) => (
        <TouchableOpacity
          key={id}
          className="flex-row items-center justify-items-center border-b-2 py-10">
          <View className="flex-row w-10/12 h-30">
            <Image
              source={
                item.avatar
                  ? {uri: item.avatar}
                  : require('../assets/img/codon.jpg')
              }
              style={styles.avatar}
            />
            <View className="ml-3 flex-2" >
              <Text className="text-lg text-ellipsis">{item.name}</Text>
              <Text className="text-lg text-ellipsis">{item.phone}</Text>
            </View>
            <View className="ml-2 flex-row">
              <TouchableOpacity
                onPress={() => handleChat(item)}
                className="ml-3">
                <FontAwesome name="wechat" size={24} color="green" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleCall(item)}
                className="ml-3">
                <Feather name="phone-call" size={24} color="#888" />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  friendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  friendDetails: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  phone: {
    fontSize: 14,
    color: '#888',
  },
  icon: {
    marginLeft: 10,
  },
});

export default ListFriend;
