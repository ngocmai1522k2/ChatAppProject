import React from 'react';
import {View, Text, Image} from 'react-native';
import {useSelector} from 'react-redux';
import {StyleSheet} from 'react-native';
import {extractTime} from '../components/extractTime/extracTime';

const ChatItem = ({currentUserId, senderId, receiver, message}) => {
  // Xác định cách hiển thị dựa trên senderId và receiverId

  // console.log('receiver', receiver);
  const alignStyle = senderId === currentUserId ? 'flex-end' : 'flex-start';
  const imageSource = senderId === currentUserId ? null : receiver.avatar;

  const allowedVideoExtensions = ['.mp4', '.avi', '.mov', '.mkv', '.wmv'];
  const isVideoExtensionAllowed = filename => {
    const fileExtension = filename.slice(filename.lastIndexOf('.'));
    return allowedVideoExtensions.includes(fileExtension.toLowerCase());
  };

  return (
    <View style={{flex: 1, margin: 10, alignItems: alignStyle}}>
      <View style={{flexDirection: 'row'}}>
        {imageSource && (
          <Image
            source={{uri: imageSource}}
            style={{width: 50, height: 50, borderRadius: 25, marginRight: 10}}
          />
        )}

        {message.message.startsWith('https://') ? (
            <Image
              source={{uri: message.message}}
              style={{width: 200, height: 200, borderWidth:1, borderColor:"gray", borderRadius:5}}
            />
          )
         : (
          <View style={styles.textView}>
            <Text style={styles.itemText}>{message.message}</Text>
            <Text
              style={{
                fontSize: 12,
                color: 'gray',
                textAlign: 'right',
                marginEnd: 10,
              }}>
              {extractTime(message.createdAt)}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  textView: {
    maxWidth: '60%',
    width: '100%',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
  },
  itemText: {
    // maxWidth: "60%", // Đặt chiều rộng tối đa của nội dung
    // width: "max-content", // Đặt chiều rộng là tối đa của nội dung
    padding: 10,
    borderRadius: 7,
    fontSize: 20,
    marginBottom: 5,
    textAlign: 'justify',
  },
});

export default ChatItem;
