import {View, Text, TouchableOpacity, Image} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import { useDispatch } from 'react-redux';
import { fetchMessages } from '../features/messages/messagesSlice';

const ListConversation = ({conversations}) => {
  const navigation = useNavigation();
  const currentUser = useSelector(state => state.user.currentUser);
  const dispatch = useDispatch();

  const handleChat = item => {
    if (item.groupName === "") {
      const receiver = item.participants.find(participant => participant._id !== currentUser._id);
      dispatch(fetchMessages({ senderId: currentUser._id, receiverId: receiver._id }));
      navigation.navigate('SingleChatScreen', {conversation: item});
    } else {
      navigation.navigate('ChatScreen', {conversation: item});
    }
  };

  return (
    <View style={{flex: 1}}>
      {conversations.map((item, id) => (
        <TouchableOpacity
          key={id}
          onPress={() => handleChat(item)}
          style={{
            flexDirection: 'row',
            paddingVertical: 8,
            backgroundColor: 'white',
            marginBottom: 2,
            borderRadius: 8,
          }}
        >
          {console.log('item', item)}
          {item.groupName ? (
            // Hiển thị view của cuộc trò chuyện nhóm
            <View style={{flexDirection: 'row', width: '90%', paddingHorizontal: 2, alignItems: 'center'}}>
              <Image
                source={
                  item.groupAvatar
                    ? { uri: item.groupAvatar }
                    : require('../assets/img/codon.jpg')
                }
                style={{width: 40, height: 40, borderRadius: 20, marginRight: 4}}
              />
              <View style={{marginLeft: 1, flex: 1}}>
                <Text style={{fontSize: 18, color: 'black'}}>{item.groupName}</Text>
                <Text style={{fontSize: 14, overflow: 'hidden'}}>...</Text>
              </View>
              <View>
                <Text style={{fontSize: 12, color: 'gray'}}>12:00 am</Text>
              </View>
            </View>
          ) : (
            item.participants
              .filter(participant => participant._id !== currentUser._id)
              .map(participant => (
                <View
                  key={participant._id}
                  style={{flexDirection: 'row', width: '90%', paddingHorizontal: 2, alignItems: 'center'}}
                >
                  {console.log('key participant', participant._id)}
                  <Image
                    source={
                      participant.avatar
                        ? { uri: participant.avatar }
                        : require('../assets/img/codon.jpg')
                    }
                    style={{width: 40, height: 40, borderRadius: 20, marginRight: 4}}
                  />
                  <View style={{marginLeft: 1, flex: 1}}>
                    <Text style={{fontSize: 18, color: 'black'}}>{participant.name}</Text>
                    <Text style={{fontSize: 14, overflow: 'hidden'}}>...</Text>
                  </View>
                  <View>
                    <Text style={{fontSize: 12, color: 'gray'}}>12:00 am</Text>
                  </View>
                </View>
              ))
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default ListConversation;