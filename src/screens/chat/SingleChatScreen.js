import {
  View,
  Text,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  TextInput,
} from 'react-native';
import React, {useState} from 'react';
import Icon from 'react-native-vector-icons/AntDesign';
import MaterialComIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useSelector} from 'react-redux';
import ChatItem from '../../components/ChatItem';
import {postApiMessageNoneToken} from '../../api/CallApi';
import {useDispatch} from 'react-redux';
import {addMessage} from '../../features/messages/messagesSlice';
import {useEffect} from 'react';
import {initiateSocket, socket} from '../../socket/socket';
import {useRef} from 'react';

const SingleChatScreen = ({route, navigation}) => {
  const currentUser = useSelector(state => state.user.currentUser);
  const {conversation} = route.params;
  const messages = useSelector(state => state.messages.messages);
  const [message, setMessage] = useState('');
  const [newMessage, setNewMessage] = useState(null);
  const scrollViewRef = useRef();
  const inputRef = useRef();


  const dispatch = useDispatch();
  //   console.log('messages', messages);
  const receiver = conversation.participants.find(
    participant => participant._id !== currentUser._id,
  );

  useEffect(() => {
    if (currentUser._id) {
      initiateSocket(currentUser._id);
    }
  }, [currentUser._id]);

  useEffect(() => {
    if (socket === null) return;
    socket.on('receiveMessage', newMess => {
      console.log('newMessage received', newMess);
      dispatch(addMessage(newMess));
    });
    socket.on('newMessage', newMessage => {
      dispatch(addMessage(newMessage));
    });
  
    return () => {
      socket.off('receiveMessage'); // Hủy đăng ký sự kiện khi component bị unmount
      socket.off('newMessage');
    };
  }, [socket, dispatch]);

  const sendMessage = async (receiverId, senderId) => {
    if (message.trim() !== '') {
      const receiverIds = [receiverId];
      socket.emit('sendMessage', {message, senderId, receiverIds});
      setMessage('');
      // setNewMessage(message);
      
    }
  };

  const handleOpenMenu = () => {
    navigation.navigate('MenuChat', {infor: conversation});
  };

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  // Sử dụng hook useEffect để theo dõi thay đổi của messages và cập nhật newMessage
    // useEffect(() => {
    //   if (newMessage) {
    //     socket.on('newMessage', newMessage => {
    //         dispatch(addMessage(newMessage));
    //       });
    //     // dispatch(addMessage(newMessage));
    //     // setNewMessage(null);
    //   }
    // }, [newMessage]);

  //   const sendMessage = async (receiverId, senderId) => {
  //     if (message.trim() !== '') {
  //       const responseSendMessage = postApiMessageNoneToken(
  //         '/sendMessage/' + receiverId,
  //         {message: message, userId: senderId},
  //       );
  //       console.log('responseSendMessage', responseSendMessage);
  //       const newMessage = (await responseSendMessage.then()).data;

  //       if (newMessage !== null) {
  //         console.log('newMessage', newMessage);
  //         setNewMessage(newMessage);
  //         setMessage('');
  //       }
  //     }
  //   };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'slateblue'}}>
      {/* Header */}
      <View
        style={{flexDirection: 'row', padding: 8, backgroundColor: '#1EACFF'}}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            height: 30,
            width: 30,
            marginLeft: 1,
            marginTop: 1,
            marginRight: 3,
          }}>
          <Icon name="arrowleft" size={30} color={'#fff'} />
        </TouchableOpacity>
        <Image
          source={
            receiver.avatar
              ? {uri: receiver.avatar}
              : require('../../assets/img/codon.jpg')
          }
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            marginRight: 5,
            marginLeft: 5,
          }}
        />
        <Text
          style={{marginLeft: 3, fontSize: 20, color: 'white', width: '50%'}}>
          {receiver.name}
        </Text>
        <TouchableOpacity style={{marginLeft: 20}}>
          <MaterialComIcon name="phone" size={30} color={'#fff'} />
        </TouchableOpacity>
        <TouchableOpacity
          style={{marginLeft: 10}}
          onPress={() => handleOpenMenu()}>
          <Icon name="ellipsis1" size={30} color={'#fff'} />
        </TouchableOpacity>
      </View>
      <KeyboardAvoidingView style={{flex: 1, backgroundColor: 'lightgray'}}>
        <ScrollView
        ref={scrollViewRef}
        contentOffset={{ y: 999999 }}
        automaticallyAdjustContentInsets={true}
        >
          {messages.map((message) => (
            <View key={message._id} style={{flex: 1}}>
              <ChatItem
                key={message._id} // Add a unique key prop here
                currentUserId={currentUser._id}
                senderId={message.senderId}
                receiver={receiver}
                message={message}
              />
            </View>
          ))}
        </ScrollView>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: 'white',
            padding: 2,
          }}>
          <TouchableOpacity style={{marginRight: 1}}>
            <MaterialComIcon
              name="emoticon-outline"
              size={30}
              color={'#5F6368'}
            />
          </TouchableOpacity>

          <View style={{flex: 1}}>
            <TextInput
              style={{fontSize: 20, color: 'black', textAlign: 'left'}}
              placeholder="Nhập tin nhắn"
              value={message}
              onChangeText={text => setMessage(text)}
              ref={inputRef}
            />
          </View>

          <TouchableOpacity
            onPress={() => sendMessage(receiver._id, currentUser._id)}
            style={{marginRight: 2}}>
            <MaterialComIcon name="send" size={30} color={'#2597F1'} />
          </TouchableOpacity>
          <TouchableOpacity style={{marginRight: 2}}>
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

export default SingleChatScreen;
