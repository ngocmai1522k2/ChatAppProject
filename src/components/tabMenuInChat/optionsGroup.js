import { View, Text, TouchableOpacity, Alert, Modal, FlatList, Image } from 'react-native'
import React, { useState } from 'react'
import Icon from 'react-native-vector-icons/AntDesign'
import IonIcons from 'react-native-vector-icons/Ionicons'
import FontAw5 from 'react-native-vector-icons/Feather'
import { useSelector } from 'react-redux'
import { postApiapiConversation,getApiapiConversation } from '../../api/CallApi'
import { setConversations } from '../../features/conversation/conversationSlice'
import {useDispatch} from 'react-redux';

const OptionsGroup = ({infor,navigation}) => {
  console.log("infor",infor)
  const currentUser = useSelector(state => state.user.currentUser);
  const dispatch = useDispatch();
  const [isModalVisible, setModalVisible] = useState(false);
  const isAdmin = infor.idAdmin === currentUser._id; 
  const filteredParticipants = infor.participants.filter(participant => participant._id !== currentUser._id);
  console.log("currenUser",currentUser)

    // call back 
 const updateConversations = async () => {
      try {
        const resConversations = await getApiapiConversation(
          '/' + currentUser._id,
        );
        const data = resConversations.data;
        dispatch(setConversations(data));
      } catch (error) {
        console.log('error call back', error);
      }
    }

const logOutGroup= async()=>{
  // ktra có phải nhóm trưởng không
  if(currentUser._id==infor.idAdmin){
    Alert.alert(
      "Xác nhận", "Bạn đang là trưởng nhóm, nếu rời nhóm, trưởng nhóm sẽ được chuyển cho người khác",
      [
        {
          text:"Ok",
          onPress: async()=>{
        

            const respone = await postApiapiConversation("/removeParticipant",{
              conversationId:infor._id,
              userId:currentUser._id
            })

            // Xác định người mới muốn trở thành trưởng nhóm (ví dụ, người đầu tiên trong danh sách participants)
            const newAdminId = infor.participants[0]._id;
            // Gửi yêu cầu API để cập nhật idAdmin mới
            const resUpdateAdmin = await postApiapiConversation("/updateConversation/"+infor._id, {
              idAdmin:newAdminId
            });
            // Load lại danh sách cuộc trò chuyện
            updateConversations();

            Alert.alert("Xác nhận","Bạn đã rời nhóm")
            updateConversations();
            navigation.navigate("MessageScreen");

            
          }
        },
        {text:"Cancel",style:"cancel"}
      ]
    )}
    else(
      
      Alert.alert(
      "Xác nhận","Bạn có chắc muốn rời nhóm",[
        {
        text:"Ok",
         onPress: async()=>{
          const respone = await postApiapiConversation("/removeParticipant",{
            conversationId:infor._id,
            userId:currentUser._id
          })
          Alert.alert("Xác nhận","Bạn đã rời nhóm")
          updateConversations();
          navigation.navigate("MessageScreen");

         }
        },
        {text:"Cancel",style:"cancel"}
      ], { cancelable: false } // hộp thoại sẽ khoong mất đi khi nhấn ra ngoài

    )

    )

}

const transferAdmin = async (newAdminId) => {
  try {
    await postApiapiConversation("/updateConversation/" + infor._id, {
      idAdmin: newAdminId
    });
    Alert.alert("Thành công", "Đã chuyển trưởng nhóm thành công");
    setModalVisible(false);
    updateConversations();
    // navigation.navigate("ChatScreen");
    navigation.navigate("MessageScreen");
  } catch (error) {
    console.log('error transfer admin', error);
    Alert.alert("Lỗi", "Không thể chuyển trưởng nhóm");
  }
};
const confirmTransferAdmin = (item) => {
  Alert.alert(
    "Xác nhận",
    `Bạn có chắc chắn muốn chuyển trưởng nhóm cho ${item.name}?`,
    [
      {
        text: "Hủy",
        style: "cancel"
      },
      {
        text: "Đồng ý",
        onPress: () => transferAdmin(item._id)
      }
    ],
    { cancelable: false }
  );
};

const renderParticipantItem = ({ item }) => (
  <TouchableOpacity 
   onPress={() => confirmTransferAdmin(item)}
    style={{ padding: 10, borderBottomWidth: 1, borderColor: '#ccc',flexDirection:'row' }}
  >
    <Image source={item.avatar ? {uri: item.avatar} : require('../../assets/img/codon.jpg')}
                  style={{width: 50, height: 50, borderRadius: 25, marginRight: 10}} />
    <Text style={{marginTop:10}}>{item.name}</Text>
    
  </TouchableOpacity>
);
  return (
    <View className='flex-col bg-gray-100'>
      <TouchableOpacity className='flex-row py-3 px-4 justify-items-center bg-white mb-1'>
        <IonIcons name='information-circle-outline' size={25} color={'#888'} />
        <Text className='text-gray-700 ml-2 text-lg'>Thêm mô tả nhóm</Text>
        </TouchableOpacity>
        <TouchableOpacity className='flex-row py-3 px-4 justify-items-center bg-white mb-1'>
            <IonIcons name='notifications-outline' size={25} color={'#888'} />
            <Text className='text-gray-700 ml-2 text-lg'>Thông báo</Text>
        </TouchableOpacity>
        <TouchableOpacity className='flex-row py-3 px-4 justify-items-center bg-white mb-1'>
            <FontAw5 name='users' size={25} color={'#888'} />
            <Text className='text-gray-700 ml-2 text-lg'>Quản lý thành viên</Text>
        </TouchableOpacity>
        <TouchableOpacity className='flex-row py-3 px-4 justify-items-center bg-white mb-1'  onPress={() => setModalVisible(true)}  disabled={!isAdmin}>
            <Icon name='retweet' size={25} color={'#888'} />
            <Text className='text-gray-700 ml-2 text-lg'>Chuyển trưởng nhóm</Text>
        </TouchableOpacity>
        <TouchableOpacity className='flex-row py-3 px-4 justify-items-center bg-white mb-1'  onPress={logOutGroup}>
            <FontAw5 name='log-out' size={25} color={'#888'} />
            <Text className='text-gray-700 ml-2 text-lg'>Rời nhóm</Text>
        </TouchableOpacity>

       

      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, width: '80%' }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Chọn trưởng nhóm mới</Text>
            <FlatList
              data={filteredParticipants}
              renderItem={renderParticipantItem}
              keyExtractor={(item) => item._id}
            />
            <TouchableOpacity onPress={() => setModalVisible(false)} style={{ marginTop: 20 }}>
              <Text style={{ color: 'red', textAlign: 'center' }}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  )
}

export default OptionsGroup