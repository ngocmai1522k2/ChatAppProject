import {View, Text, TouchableOpacity, ScrollView, Image, Alert, Modal, StyleSheet} from 'react-native';
import React, { useEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/AntDesign';
import ListFriend from '../../components/ListFriend';
import OptionsGroup from '../../components/tabMenuInChat/optionsGroup';
import { postApiapiConversation,getApiapiConversation } from '../../api/CallApi';
import { useSelector } from 'react-redux';
import {useDispatch} from 'react-redux';
// import {setConversations} from '../features/conversation/conversationSlice';
import { setConversations } from '../../features/conversation/conversationSlice';


const MenuChat = ({route, navigation}) => {
  const {infor} = route.params;
  const participants = infor.participants;
  const [showMemberList, setShowMemberList] = useState(false);
  

  

  

  

  // console.log('participants', participants);
  const currentUser = useSelector(state => state.user.currentUser);
  const dispatch = useDispatch();
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [selectMembersRemove,setSelectMemberRemove]=useState([])
  const [showRemoveMemberModal,setShowRemoveMemberModal] = useState(false)
 
  const isAdmin = infor.idAdmin === currentUser._id; // Kiểm tra xem người dùng hiện tại có phải là quản trị viên không
  const filteredParticipants = participants.filter(participant => participant._id !== currentUser._id);

  
   // Lọc ra các thành viên mới từ currentUser.phoneBooks không có trong participants
   const newMembers = currentUser.phoneBooks.filter(
    phoneBook => !participants.some(participant => participant.phone === phoneBook.phone)
  );
  // Hàm để thêm thành viên mới vào danh sách đã chọn
  const addMember = (member) => {
    const isSelected = selectedMembers.includes(member);
   if(isSelected){
    setSelectedMembers(
      selectedMembers.filter(selectedMember=>selectedMember !== member)
    )
   }
   else{
    setSelectedMembers([...selectedMembers, member]);
   
  }
  };
    // Hàm để thêm thành viên mới vào danh sách đã chọn
    const removeMember = (member) => {
      const isSelected = selectMembersRemove.includes(member);
     if(isSelected){
      setSelectMemberRemove(
        selectMembersRemove.filter(selectedMember=>selectedMember !== member)
      )
     }
     else{
      setSelectMemberRemove([...selectMembersRemove, member]);
     
    }
  
    };
  
  // Giao diện của modal thêm thành viên
  const renderAddMemberModal = () => (
    <Modal visible={showAddMemberModal} 
    animationType="slide" transparent ={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <ScrollView>
            {newMembers.map(member => (
              <TouchableOpacity  key={member.phone} onPress={() => addMember(member)
              
              }
              style={
                    selectedMembers.includes(member)
                      ? styles.selectedMember
                      : styles.unselectedMember
                  }
              >
               {/* {console.log("avt",member.avatar)} */}
              <Image
                      source={
                        member.avatar ? {uri:  member.avatar} : require('../../assets/img/codon.jpg')
                      }
                      style={{
                        width: 50,
                        height: 50,
                        borderRadius: 25,
                        marginRight: 10,
                      }}
                    />
                 
                <Text style={styles.memberText}>{member.name}</Text>
              </TouchableOpacity>
            
            ))}
            {console.log("danh sach nguoi duoc chon de them",selectedMembers)}
           
            
          </ScrollView>
          
             <View style={{flexDirection:"row",justifyContent:"space-between"}}>
             <TouchableOpacity onPress={() => setShowAddMemberModal(false)}>
                <Text style={styles.closeButton}>Đóng</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={addMemberGroup} >
                <Text style={{fontSize:22,color:'black'}}>Thêm</Text>
              </TouchableOpacity>

             </View>
      
        </View>
      </View>
    </Modal>
  );
  
  // Giao diện của modal xóa thành viên
  const renderRemoveMemberModal = () => (
    <Modal visible={showRemoveMemberModal} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <ScrollView>
            {filteredParticipants.map(member => (
              <TouchableOpacity key={member.phone}  onPress={() => removeMember(member)}
                style={
                    selectMembersRemove.includes(member)
                      ? styles.selectedMember
                      : styles.unselectedMember
                  }>
                <Image source={member.avatar ? {uri: member.avatar} : require('../../assets/img/codon.jpg')}
                  style={{width: 50, height: 50, borderRadius: 25, marginRight: 10}} />
                <Text style={styles.memberText}>{member.name}</Text>
              </TouchableOpacity>
            ))}
            {console.log("danh sach nguoi duoc chon de xóa",selectMembersRemove)}
          </ScrollView>
         <View style={{flexDirection:"row",justifyContent:"space-between"}}>
         <TouchableOpacity onPress={() => setShowRemoveMemberModal(false)}>
            <Text style={styles.closeButton}>Đóng</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={removeMemberGroup} style={{justifyContent:"flex-end"}}>
                <Text style={{fontSize:22,color:'black',}}>Xóa</Text>
              </TouchableOpacity>
         </View>
        </View>
      </View>
    </Modal>
  );
   
  
  // thêm thành viên có ktra admin
  const addMemberGroup = async()=>{
   try {
    const userIds = selectedMembers.map(member => member.id);
    console.log("cai gi day",userIds)
    if (userIds.length === 0) {
      Alert.alert("Lỗi", "Vui lòng chọn ít nhất một thành viên để thêm");
      return;
    }

     // Lặp qua từng userId và gọi hàm addParticipant cho mỗi userId
     userIds.forEach(async userId => {
      try {
        const response = await postApiapiConversation("/addParticipant", {
          conversationId: infor._id,
          userId: userId
        });
        updateConversations()
        
      
      } catch (error) {
        console.error("Lỗi khi thêm thành viên:", error);
      }
    });
    Alert.alert("Xác nhân","thêm thành viên thành công")
    setSelectedMembers([])
    setShowAddMemberModal(false)
    navigation.navigate("MessageScreen");
   } catch (error) {
    console.log("lỗi thêm thành viên",error)
   }
  }
  // xóa thành viên group
    const removeMemberGroup = async()=>{
      try {
       const userIds = selectMembersRemove.map(member => member._id);
       console.log("idxoa",userIds)
        // Lặp qua từng userId và gọi hàm addParticipant cho mỗi userId
        if (userIds.length === 0) {
          Alert.alert("Lỗi", "Vui lòng chọn ít nhất một thành viên để xóa");
          return;
        }
        userIds.forEach(async userId => {
         try {
           const response = await postApiapiConversation("/removeParticipant", {
             conversationId: infor._id,
             userId: userId
           });
           updateConversations()
   
           
         
         } catch (error) {
           console.error("Lỗi khi xóa  thành viên:", error);
         }
       });
       
       Alert.alert("Xác nhân","xóa thành viên thành công")
       setSelectMemberRemove([])
       setShowRemoveMemberModal(false)
       navigation.navigate("MessageScreen");
       
      } catch (error) {
       console.log("lỗi xóa thành viên",error)
      }
     }
  
  
  const removeGroup = async () => {
    try {
      // Hiển thị hộp thoại xác nhận
      
      Alert.alert(
        'Xác nhận',
        'Bạn có chắc chắn muốn xóa nhóm?',
        [
          {
            text: 'Không',
            style: 'cancel',
          },
          {
            text: 'Có',
            onPress: async () => {
              const respone = await postApiapiConversation("/deleteConversation/" + infor._id);
              console.log(infor._id);
              // Thông báo khi xóa thành công
              Alert.alert("Thành công", "Giải tán nhóm " + infor.groupName + " thành công");
              updateConversations();
              navigation.navigate("MessageScreen");
            },
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      console.log("error for remove group", error);
    }
  }
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

  return (
    <ScrollView className="flex-col flex-1">
      <View className="flex-row p-2 bg-blue-500">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className=" h-15 w-15 ml-1 mt-1 mr-3">
          <Icon name="arrowleft" size={30} color={'#fff'} />
        </TouchableOpacity>
        <Text className="ml-1 text-xl text-left text-white w-6/12">
          Tùy chọn
        </Text>
      </View>
      <View className="flex-col items-center bg-white ">
        <View className="border-collapse bg-yellow-400 rounded-full p-16 mt-2"></View>
        <Text className="text-2xl mt-3">{infor.groupName}</Text>
        <View className="flex-row justify-items-center ">
          <TouchableOpacity className="flex-col p-3 items-center">
            <Icon name="search1" size={25} color={'#888'} />
            <Text className="text-gray-700 text-center">
              Tìm{'\n'} tin nhắn
            </Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-col p-3 items-center"   onPress={() => setShowAddMemberModal(true)} 
          disabled={!isAdmin}
          style={styles.addButton}>
            <Icon name="addusergroup" size={25} color={'#888'} />
            <Text className="text-gray-700  text-center" style={styles.addButtonText}>
              Thêm{'\n'} thành viên
            </Text>
          </TouchableOpacity>
          {renderAddMemberModal()}

          <TouchableOpacity className="flex-col p-3 items-center "   onPress={() => setShowRemoveMemberModal(true)} 
          disabled={!isAdmin} >
            <Icon name="deleteuser" size={25} color={'#888'} />
            <Text className="text-gray-700  text-center">
              Xóa{'\n'}
              thành viên
            </Text>
          </TouchableOpacity>
          {renderRemoveMemberModal()}
           {/* Hiển thị danh sách thành viên mới trong modal */}
    
      
       

           <TouchableOpacity className="flex-col p-3 items-center"  onPress={removeGroup} disabled={!isAdmin}>
            <Icon name="delete" size={25} color={'#888'} />
            <Text className="text-gray-700  text-center">Xóa{'\n'} nhóm</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        className="py-1  my-1 bg-white flex-row items-baseline "
        onPress={() => setShowMemberList(!showMemberList)}>
        <Text className="text-lg text-left text-gray-700 w-5/6 ml-3 mr-5">
          Danh sách thành viên
        </Text>
        <Icon name={showMemberList ? 'up' : 'down'} size={20} color="#888" />
      </TouchableOpacity>
      {showMemberList && (
        <ScrollView className="flex-col">
          <ListFriend friends={participants}></ListFriend>
          
        </ScrollView>
      )}
      <OptionsGroup infor={infor} navigation={navigation}></OptionsGroup>
    </ScrollView>
  );
};

export default MenuChat;
const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    
    backgroundColor: '#fff',
    width: '80%',
    maxHeight: '70%',
    borderRadius: 10,
    padding: 20,
  },
  memberText: {
    fontSize: 22,
  
    padding:10
  },
  closeButton: {
    fontSize: 20,
    color: 'blue',
    textAlign: 'center',
    // marginTop: 10,
    // borderWidth:1,
    borderColor:"green",
    width:100
  },
  addButton: {
    // backgroundColor: 'blue',
    // paddingVertical: 10,
    // paddingHorizontal: 20,
    borderRadius: 5,
    alignSelf: 'center',
    // marginTop: 20,
  },
  addButtonText: {
    // color: '#fff',
    fontSize: 16,

  },
  selectedMember: {
    flexDirection:"row",
    backgroundColor: '#4CAF50', // Màu nền khi được chọn
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#2E7D32', // Màu viền khi được chọn
  },
  unselectedMember: {
    flexDirection:"row",
    backgroundColor: '#FFFFFF', // Màu nền khi chưa được chọn
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#E0E0E0', // Màu viền khi chưa được chọn
  },
})
