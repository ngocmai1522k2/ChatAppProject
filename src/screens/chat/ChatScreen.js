import {
  View,
  Text,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  TextInput,
} from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import Icon from 'react-native-vector-icons/AntDesign';
import MaterialComIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {SafeAreaView} from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { initiateSocket, socket } from '../../socket/socket';
import { useDispatch } from 'react-redux';
import { addMessage } from '../../features/messages/messagesSlice';
import ImagePicker from 'react-native-image-crop-picker';
import DocumentPicker from 'react-native-document-picker';
import { uploadFile } from '../../api/CallApi';
import { Alert } from 'react-native';
import FormData from 'form-data';
import ChatItem from '../../components/ChatItem';


const ChatScreen = ({route, navigation}) => {
  const currentUser = useSelector(state => state.user.currentUser);
  const {conversation} = route.params;
  console.log('conversation', conversation);
  const messages = useSelector(state => state.messages.messages);
  const dispatch = useDispatch();
  const receivers = conversation.participants.filter(
    participant => participant._id !== currentUser._id,
  );
  const [message, setMessage] = useState('');
  const [imageSource, setImageSource] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const scrollViewRef = useRef();
  const [receiveId, setReceiveId] = useState('');


  useEffect(() => {
    initiateSocket(currentUser._id);
  }, [currentUser._id]);

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({animated: true});
    }
  }, [messages]);

  useEffect(() => {
    if(socket === null) return;
    socket.on('receiveMessage', (messageReceive) => {
      console.log('receiveMessage', messageReceive);
      dispatch(addMessage(messageReceive));
    });
    socket.on('newMessage', (newMessage) => {
      console.log('newMessage', newMessage);
      dispatch(addMessage(newMessage));
    });
    return () => {
      socket.off('receiveMessage');
      socket.off('newMessage');
    };
  }, [socket, dispatch]);

  const sendMessage = async (receiverId, senderId) => {
    if (message.trim() !== '') {
      const receiverIds = [receiverId];
      socket.emit('sendMessage', {message, senderId, receiverIds});
      setMessage('');
    }
    if (imageSource) {
      const imageUrl = await uploadfile();
      const receiverIds = [receiverId];
      socket.emit('sendMessage', {
        message: imageUrl,
        senderId,
        receiverIds,
      });
      setImageSource(null);
    }
  };

  const uploadfile = async () => {
    const formData = new FormData();
    if(imageSource.name){
      const fileNameWithExtension = imageSource.name;
      const fileName = fileNameWithExtension.split('.').slice(0, -1).join('.'); // Extract the file name without extension
      formData.append('file', {
        uri: imageSource.path,
        type: imageSource.mime,
        name: `${fileName}.${imageSource.mime.split('/')[1]}`,
      });
      console.log('uri:', imageSource.path);
      console.log('type:', imageSource.mime);
      console.log('name:', `${fileName}.${imageSource.mime.split('/')[1]}`);
    } else {
    const fileNameWithExtension = imageSource.path.split('/').pop();
    const fileName = fileNameWithExtension.split('.').slice(0, -1).join('.'); // Extract the file name without extension
    formData.append('file', {
      uri: imageSource.path,
      type: imageSource.mime,
      name: `${fileName}.${imageSource.mime.split('/')[1]}`,
    });
    console.log('uri:', imageSource.path);
    console.log('type:', imageSource.mime);
    console.log('name:', `${fileName}.${imageSource.mime.split('/')[1]}`);
    }
    try {
      const response = await uploadFile('/uploadAvatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.status === 200 && response.data.data) {
        // Alert.alert('Thành công', 'Tải ảnh đại diện thành công');
        console.log('image uploaded: ', response.data.data.url);
        return response.data.data.url;
      } else {
        Alert.alert('Thất bại', 'Tải ảnh thất bại');
      }
    } catch (error) {
      console.error('Lỗi khi tải lên ảnh dại diện:', error);
      Alert.alert('Lỗi', 'Lỗi trong quá trình tải ảnh đại diện');
    }
  };

  const supportedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];

  const selectFromPhotos = () => {
    ImagePicker.openPicker({
      width: 200,
      height: 300,
      cropping: true,
      includeBase64: true,
    })
      .then(image => {
        if (!supportedMimeTypes.includes(image.mime)) {
          Alert.alert(
            'Invalid File',
            'Sai định dạng hình ảnh (jpg, png, gif).',
          );
          return;
        }
        setImageSource({
          path: image.path,
          mime: image.mime,
          data: image.data,
        });
      })
      .catch(error => {
        if (error.message === 'User cancelled image selection') {
          console.log('Người dùng đã hủy việc chọn hình ảnh.');
        } else {
          console.error('Lỗi khi chọn hình ảnh:', error);
        }
      });
  };

  const selectVideos = () => {
    ImagePicker.openPicker({
      mediaType: 'video',
    })
      .then(video => {
        console.log('video', video);
        setImageSource({
          path: video.path,
          mime: video.mime,
          data: video.data,
        });
        console.log('video path:', video.path);
        console.log('video mime:', video.mime);
        console.log('video data:', video.data);
      })
      .catch(error => {
        if (error.message === 'User cancelled image selection') {
          console.log('Người dùng đã hủy việc chọn video.');
        } else {
          console.error('Lỗi khi chọn video:', error);
        }
      });
  };

  const selectDoc = async () => {
    try {
      const doc = await DocumentPicker.pick({
        type: [
          DocumentPicker.types.pdf,
          DocumentPicker.types.docx,
          DocumentPicker.types.doc,
          DocumentPicker.types.ppt,
          DocumentPicker.types.pptx,
          DocumentPicker.types.xls,
          DocumentPicker.types.xlsx,
        ],
        allowMultiSelection: false, // Chỉ chọn một tệp để kiểm tra kích thước
      });
  
      const selectedDoc = doc[0];
      const fileSizeInMB = selectedDoc.size / (1024 * 1024); // Chuyển đổi byte sang MB
      console.log('File size:', fileSizeInMB);
  
      if (fileSizeInMB > 1) {
        Alert.alert('Tệp quá lớn', 'Chỉ chọn các tệp nhỏ hơn 1 MB.');
        return;
      }
  
      console.log('Document :', selectedDoc);
      setImageSource({
        path: selectedDoc.uri,
        mime: selectedDoc.type,
        name: selectedDoc.name,
      });
    } catch (error) {
      if (DocumentPicker.isCancel(error)) {
        console.log('Người dùng đã hủy việc chọn tệp.', error);
      } else {
        console.error('Lỗi khi chọn tệp:', error);
      }
    }
  };


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
        <ScrollView
        ref={scrollViewRef}
        contentOffset={{y: 999999}}
        automaticallyAdjustContentInsets={true}
        >
          {
            messages.map((message) => {
              {
                if(message.senderId !== currentUser._id)
                  {
                    setReceiveId(message.senderId);
                    console.log('receiveId', receiveId);
                  }
              }
              <View key={message._id} style={{flex:1}}>
                <ChatItem
                key={message._id}
                currentUserId={currentUser._id}
                senderId={message.senderId}
                receiver={receivers.find(receiver => receiver._id === receiveId)}
                message={message}
                />
              </View>
          })}
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
