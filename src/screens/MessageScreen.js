import React, {useEffect, useState} from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Modal,
  Alert,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import {getApiNoneToken} from '../api/CallApi';
import {putApiNoneToken} from '../api/CallApi';
import {useSelector} from 'react-redux';
import {postApiapiConversation} from '../api/CallApi';
import ListConversation from '../components/ListConversation';
import {setConversations} from '../features/conversation/conversationSlice';
import {useDispatch} from 'react-redux';
import {getApiapiConversation} from '../api/CallApi';

export default function MessageScreen() {
  const [searchText, setSearchText] = useState('');
  const [avt, setAvt] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [searched, setSearched] = useState(false);
  const [isFriend, setIsFriend] = useState(false);
  const [idFriend, setIdFriend] = useState('');
  const [addFriendText, setAddFriendText] = useState('Kết bạn');
  const [currentUserId, setCurrentUserId] = useState('');
  const [currentUserName, setCurrentUserName] = useState('');
  const [currentUserPhone, setCurrentUserPhone] = useState('');
  const currentUser = useSelector(state => state.user.currentUser);
  const [friendListVisible, setFriendListVisible] = useState(false);
  const [friendList, setFriendList] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [groupName, setGroupName] = useState('');
  const conversations = useSelector(state => state.conversation.conversations);
  const dispatch = useDispatch();

  useEffect(() => {
    async function fetchData() {
      try {
        const resConversations = await getApiapiConversation(
          '/' + currentUser._id,
        );
        const data = resConversations.data;
        console.log('conversations', data);
        dispatch(setConversations(data));
      } catch (error) {
        console.log('error fetchDataConversations', error);
      }
    }
    fetchData();
  }, []);

  const handleSearch = async text => {
    try {
      const response = await getApiNoneToken('/getDetailsByPhone/' + text);
      const data = response.data.data;

      setCurrentUserId(currentUser._id);
      setCurrentUserName(currentUser.name);
      setCurrentUserPhone(currentUser.phone);

      if (data) {
        setIdFriend(data._id);
        setName(data.name);
        setPhone(data.phone);
        setAvt(data.avatar);
        setSearched(true);

        if (currentUser.phone === data.phone) {
          setIsFriend(true);
          return;
        }

        if (currentUser.phoneBooks && currentUser.phoneBooks.length > 0) {
          const foundUser = currentUser.phoneBooks.find(
            user => user.phone === data.phone,
          );
          if (foundUser) {
            setIsFriend(true);
            return;
          }
        }

        if (currentUser.listAddFriend && currentUser.listAddFriend.length > 0) {
          const foundUserInInvite = currentUser.listAddFriend.find(
            invitation => invitation.phone === data.phone,
          );
          if (foundUserInInvite) {
            setAddFriendText('Đã gửi lời mời');
            return;
          }
        }
        setIsFriend(false);
      } else {
        setSearched(false);
      }
      setAddFriendText('Kết bạn');
    } catch (error) {
      console.error('Error for search', error);
    }
  };

  const addFriend = async () => {
    const response = await putApiNoneToken('/addListFriend/' + currentUserId, {
      id: idFriend,
      name: name,
      phone: phone,
    });

    const response2 = await putApiNoneToken('/addInvite/' + idFriend, {
      id: currentUserId,
      name: currentUserName,
      phone: currentUserPhone,
    });
    setAddFriendText('Đã gửi lời mời');
  };

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const showFriendList = () => {
    setFriendList(currentUser.phoneBooks);
    setIsModalVisible(true);
  };
  // chọn bạn để tạo nhóm
  const toggleMemberSelection = member => {
    const isSelected = selectedMembers.includes(member);

    if (isSelected) {
      setSelectedMembers(
        selectedMembers.filter(selectedMember => selectedMember !== member),
      );
    } else {
      setSelectedMembers([...selectedMembers, member]);
    }
  };
  // tạo nhóm
  const createGroup = async () => {
    try {
      const participantIds = selectedMembers.map(member => member.id); // Lấy ra mảng các id của các thành viên được chọn
      participantIds.push(currentUser._id);
      // console.log("kk",participantIds)
      if (participantIds.length < 3) {
        Alert.alert('chọn ít nhất 2 thành viên để tạo nhóm');
        return;
      }
      if (groupName == '') {
        Alert.alert('Vui lòng nhập tên nhóm để tạo');
        return;
      }
      const respone = await postApiapiConversation('/createGroup', {
        groupName: groupName,
        participants: participantIds,
        admin: currentUser._id,
      });
      console.log('data', respone.data.participants);

      Alert.alert(
        'Xác nhận',
        'Tạo nhóm thành công',
        [
          {
            text: 'Oke',
            style: 'cancel',
          },
        
        ],
        { cancelable: false }
      );
      updateConversations();
      setGroupName('');
      setSelectedMembers([]); // Reset slect sau khi tạo nhóm thành công
      toggleModal(); // Đóng modal sau khi tạo nhóm thành công
    } catch (error) {
      console.log('error for create group', error);
    }
  };

  const updateConversations = async () => {
    try {
      const resConversations = await getApiapiConversation(
        '/' + currentUser._id,
      );
      const data = resConversations.data;
      dispatch(setConversations(data));
    } catch (error) {
      console.log('error fetchDataConversations', error);
    }
  }
  

  return (
    <View style={{flex: 1}}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#f0f0f0',
          padding: 8,
          borderRadius: 10,
        }}>
        <Icon name="search1" size={24} color="#888" />
        <TextInput
          style={{
            flex: 1,
            padding: 8,
            backgroundColor: 'white',
            borderRadius: 10,
          }}
          placeholder="Tìm kiếm..."
          value={searchText}
          onChangeText={text => {
            setSearchText(text);
            if (text.trim() !== '') {
              handleSearch(text);
            }
          }}
        />

        {/* Tạo nhóm */}
        <TouchableOpacity onPress={showFriendList}>
          <Icon name="addusergroup" size={24} color="#888" />
        </TouchableOpacity>

        {/* Modal danh sách bạn bè */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={toggleModal}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <TextInput
                onChangeText={setGroupName}
                value={groupName}
                style={{borderWidth: 1, borderColor: 'green', borderRadius: 15}}
                placeholder="Nhập tên nhóm"
              />

              {friendList.map((friend, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => toggleMemberSelection(friend)}
                  style={
                    selectedMembers.includes(friend)
                      ? styles.selectedMember
                      : styles.unselectedMember
                  }>
                  <View style={{flexDirection: 'row'}}>
                    <Image
                      source={
                        avt ? {uri: avt} : require('../assets/img/codon.jpg')
                      }
                      style={{
                        width: 50,
                        height: 50,
                        borderRadius: 25,
                        marginRight: 10,
                      }}
                    />
                    <View>
                      <Text>{friend.name}</Text>
                      <Text>{friend.phone}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
              {/* // button tạo nhóm */}
              <TouchableOpacity
                onPress={createGroup}
                style={{
                  borderWidth: 1,
                  borderColor: 'blue',
                  width: '50%',
                  justifyContent: 'center',
                  alignItems: 'center',
                  top: 10,
                  left: 120,
                  borderRadius: 10,
                  height: 50,
                  backgroundColor: 'pink',
                }}>
                <Text style={{fontSize: 20}}>Tạo nhóm</Text>
              </TouchableOpacity>
              {/* {console.log(selectedMembers)} */}
            </View>
          </View>
        </Modal>
      </View>

      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ScrollView>
          <ListConversation conversations={conversations}></ListConversation>
        </ScrollView>
      </View>

      {searched && (
        <View
          style={{
            marginTop: 10,
            alignItems: 'center',
            flexDirection: 'row',
            paddingHorizontal: 10,
            borderWidth: 2,
            borderColor: '#FF00FF',
            width: '98%',
            left: 5,
            padding: 10,
            borderRadius: 15,
          }}>
          <Image
            source={avt ? {uri: avt} : require('../assets/img/codon.jpg')}
            style={{width: 50, height: 50, borderRadius: 25, marginRight: 10}}
          />
          <View>
            <Text style={{fontSize: 20, fontWeight: 'bold'}}>{name}</Text>
            <Text style={{fontSize: 16}}>{phone}</Text>
          </View>
          {/* Thay đổi hiển thị dựa trên isFriend */}
          {isFriend ? (
            <Text style={styles.friendText}>Bạn bè</Text>
          ) : (
            <TouchableOpacity onPress={addFriend} style={styles.addButton}>
              <Text style={styles.addButtonText}>{addFriendText}</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  addButton: {
    left: 40,
    backgroundColor: 'green',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  friendText: {
    left: 100,
    fontSize: 18,
    fontWeight: 'bold',
    color: 'blue',
  },
  selectedMember: {
    backgroundColor: '#4CAF50', // Màu nền khi được chọn
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#2E7D32', // Màu viền khi được chọn
  },
  unselectedMember: {
    backgroundColor: '#FFFFFF', // Màu nền khi chưa được chọn
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#E0E0E0', // Màu viền khi chưa được chọn
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Màu nền của modal
  },
  modalContent: {
    backgroundColor: '#FFFFFF', // Màu nền của nội dung modal
    padding: 20,
    borderRadius: 10,
    width: '80%', // Chiều rộng của nội dung modal
  },
});