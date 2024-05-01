import React from 'react';
import { View, Text } from 'react-native';
import { useSelector } from 'react-redux';
import { StyleSheet } from 'react-native';



const ChatItem = ({ currentUserId , senderId, receiverId, message }) => {

    // Xác định cách hiển thị dựa trên senderId và receiverId
    const alignStyle = senderId === currentUserId ? 'flex-end' : 'flex-start';
    const backgroundColor = senderId === currentUserId ? 'white' : 'white';
  
    return (
      <View style={{ flex: 1, margin: 10, alignItems: alignStyle }}>
            <View style={styles.textView}>
              <Text style={styles.itemText}>{message}
            </Text>
            <View style={{ flexDirection: "row" }} />
          </View>
      </View>
    );
  };

const styles = StyleSheet.create({
  textView: {
    maxWidth: "60%",  
    width: "100%",
    borderWidth:2,
    borderColor: "black",
    borderRadius: 15,
},
    itemText: { 
      // maxWidth: "60%", // Đặt chiều rộng tối đa của nội dung
      // width: "max-content", // Đặt chiều rộng là tối đa của nội dung
      padding: 10,
      borderRadius: 7,
      fontSize: 20,
      marginBottom: 5,
      textAlign: "justify",
    },
});

    export default ChatItem;