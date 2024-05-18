import {
  View,
  Text,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  TextInput,
  Alert,
  Modal,
  StyleSheet,
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import Icon from 'react-native-vector-icons/AntDesign';
import MaterialComIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useSelector, useDispatch} from 'react-redux';
import ChatItem from '../../components/ChatItem';
import {postApiMessageNoneToken, uploadFile} from '../../api/CallApi';
import {addMessage} from '../../features/messages/messagesSlice';
import {initiateSocket, socket} from '../../socket/socket';
import ImagePicker from 'react-native-image-crop-picker';
const FormData = require('form-data');
import DocumentPicker from 'react-native-document-picker';

const SingleChatScreen = ({route, navigation}) => {
  const currentUser = useSelector(state => state.user.currentUser);
  const {conversation} = route.params;
  const {isGroupChat} = route.params;
  const messages = useSelector(state => state.messages.messages);
  const [message, setMessage] = useState('');
  const [imageSource, setImageSource] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const scrollViewRef = useRef();
  const inputRef = useRef();
  const dispatch = useDispatch();

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

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({animated: true});
    }
  }, [messages]);

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
          contentOffset={{y: 999999}}
          automaticallyAdjustContentInsets={true}>
          {messages.map(message => (
            <View key={message._id} style={{flex: 1}}>
              <ChatItem
                key={message._id}
                currentUserId={currentUser._id}
                senderId={message.senderId}
                receiver={receiver}
                message={message}
                isGroupChat={isGroupChat}
              />
            </View>
          ))}
        </ScrollView>
        {imageSource && (
          <View style={{alignItems: 'center', marginVertical: 10}}>
            <Image
              source={{uri: imageSource.path}}
              style={{width: 100, height: 100, borderRadius: 10}}
            />
          </View>
        )}
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
          <TouchableOpacity style={{marginRight: 2}} onPress={selectDoc}>
            <MaterialComIcon name="attachment" size={30} color={'#5F6368'} />
          </TouchableOpacity>
          <TouchableOpacity>
            <MaterialComIcon name="microphone" size={30} color={'#5F6368'} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setOpenModal(true)}>
            <MaterialComIcon name="file-image" size={30} color={'#5F6368'} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
      {/* Modal for choosing between image and video */}
      <Modal
        transparent={true}
        animationType="slide"
        visible={openModal}
        onRequestClose={() => setOpenModal(false)}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Chọn tệp</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                selectFromPhotos();
                setOpenModal(false);
              }}>
              <Text style={styles.modalButtonText}>Chọn hình ảnh</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                selectVideos();
                setOpenModal(false);
              }}>
              <Text style={styles.modalButtonText}>Chọn video</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalCancelButton}
              onPress={() => setOpenModal(false)}>
              <Text style={styles.modalCancelButtonText}>Hủy</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: 300,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 20,
  },
  modalButton: {
    width: '100%',
    padding: 15,
    backgroundColor: '#2196F3',
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
  },
  modalCancelButton: {
    width: '100%',
    padding: 15,
    backgroundColor: '#f44336',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalCancelButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default SingleChatScreen;
