import { View, Text, TouchableOpacity, Alert } from 'react-native'
import React from 'react'
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
        <TouchableOpacity className='flex-row py-3 px-4 justify-items-center bg-white mb-1'  onPress={logOutGroup}>
            <FontAw5 name='log-out' size={25} color={'#888'} />
            <Text className='text-gray-700 ml-2 text-lg'>Rời nhóm</Text>
        </TouchableOpacity>
    </View>
  )
}

export default OptionsGroup