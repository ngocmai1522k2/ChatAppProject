import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from 'react-native';
import {extractTime} from '../components/extractTime/extracTime';
import MaterialComIcon from 'react-native-vector-icons/MaterialCommunityIcons';

const ChatItem = ({currentUserId, senderId, receiver, message}) => {
  const alignStyle = senderId === currentUserId ? 'flex-end' : 'flex-start';
  const imageSource = senderId === currentUserId ? null : receiver.avatar;

  const allowedVideoExtensions = ['.mp4', '.avi', '.mov', '.mkv', '.wmv'];
  const isVideoExtensionAllowed = filename => {
    const fileExtension = filename.slice(filename.lastIndexOf('.'));
    return allowedVideoExtensions.includes(fileExtension.toLowerCase());
  };


  const isVideoMessage =
    message.message.startsWith('https://') &&
    isVideoExtensionAllowed(message.message);
  const isImageMessage =
    message.message.startsWith('https://') && !isVideoMessage;
  const isTextMessage = !message.message.startsWith('https://');

  const getFileIcon = filename => {
    const fileExtension = filename.slice(filename.lastIndexOf('.'));
    switch (fileExtension) {
      case '.pdf':
        return 'file-pdf';
      case '.doc':
      case '.docx':
        return 'file-word';
      case '.xls':
      case '.xlsx':
        return 'file-excel';
      case '.ppt':
      case '.pptx':
        return 'file-powerpoint';
      default:
        return 'file';
    }
  };

  const openFile = async url => {
    try {
      await Linking.openURL(url);
    } catch (error) {
      console.error('Error opening file:', error);
    }
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

        {isVideoMessage ? (
          <View>
            <TouchableOpacity
              style={styles.videoContainer}
              onPress={() => openFile(message.message)}>
              <MaterialComIcon name="play-circle" size={50} color="gray" />
              <Text style={styles.fileName}>
                {message.message.split('/').pop()}
              </Text>
            </TouchableOpacity>
            <Text style={styles.timestamp}>
              {extractTime(message.createdAt)}
            </Text>
          </View>
        ) : isImageMessage ? (
          <TouchableOpacity
            style={styles.imageContainer}
            onPress={() => openFile(message.message)}>
            <Image source={{uri: message.message}} style={styles.image} />
            <Text style={styles.timestamp}>
              {extractTime(message.createdAt)}
            </Text>
          </TouchableOpacity>
        ) : isTextMessage ? (
          <View style={styles.textView}>
            <Text style={styles.itemText}>{message.message}</Text>
            <Text style={styles.timestamp}>
              {extractTime(message.createdAt)}
            </Text>
          </View>
        ) : (
          <View>
            <TouchableOpacity
              style={styles.fileContainer}
              onPress={() => openFile(message.message)}>
              <MaterialComIcon
                name={getFileIcon(message.message)}
                size={50}
                color="black"
              />
              <Text style={styles.fileName}>
                {message.message.split('/').pop()}
              </Text>
              
            </TouchableOpacity>
            <Text style={styles.timestamp}>
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
    padding: 10,
  },
  itemText: {
    fontSize: 20,
    textAlign: 'justify',
  },
  timestamp: {
    fontSize: 12,
    color: 'gray',
    textAlign: 'right',
    marginEnd: 10,
  },
  videoContainer: {
    width: 200,
    height: 200,
    borderRadius: 10,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  imageContainer: {
    width: 200,
    height: 200,
    borderRadius: 10,
    overflow: 'hidden',
  },
  image: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: 'cover',
  },
  fileContainer: {
    width: 100,
    height: 100,
    borderRadius: 10,
    backgroundColor: 'black',
    padding: 10,
  },
  fileName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
    color: 'black',
  },
});

export default ChatItem;
