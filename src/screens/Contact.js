import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import { getApiNoneToken, postApiNoneToken, putApiNoneToken } from '../api/CallApi';


export default function Contact() {
  const [inviteList, setInviteList] = useState([]);
  const [avt, setAvt] = useState("");
  const [currenUserId,setCurrentUserId] =useState("")
  const [currentUserName,setCurrentUserName]= useState("")
  const [currentUserPhone,setCurrentUserPhone]=useState("")

  const showListInvite = async () => {
    try {
      // sau sẽ đổi lại sdt mặc định thành currenUserPhone
     
      const response = await getApiNoneToken("/getDetailsByPhone/0345678977");
      const data = response.data.data.invite;
      setAvt(response.data.data.avatar);
      setCurrentUserId(response.data.data._id)
      setCurrentUserName(response.data.data.name)
      setCurrentUserPhone(response.data.data.phone)

      setInviteList(data);
      console.log("list", inviteList);
    } catch (error) {
      console.error("Error fetching invite list:", error);
    }
  };

  const acceptInvite = async (id,name,phone) => {
    // Xử lý đồng ý lời mời kết bạn
     // truyền vào id của người gửi kết bạn 
      // thực hiện add currentUser vào phoneBooks của người gửi
    const response1 = await putApiNoneToken("/addFriend/"+id,{
      name:currentUserName,
      phone:currentUserPhone

    })
    // thực hiện add sdt người gửi vào phonebooks currenUser
    const response2 = await putApiNoneToken("/addFriend/"+currenUserId,{
      name:name,
      phone:phone

    })
    // xóa lời mời của ngkhac gửi cho currentUser
    const response3 = await postApiNoneToken("/deleteInvite/"+currenUserId,{
      phone:phone
    })
    // xóa lời trong listADD của người gửi cho currentUser

    const response4 =await postApiNoneToken("/deleteListaddFriend/"+id,{
      phone:currentUserPhone
    })
   // Cập nhật state
   const updatedInviteList = inviteList.filter(item => item.id !== id);
    setInviteList(updatedInviteList);
    
  // Gọi hàm để tải lại danh sách mới
    showListInvite();
    Alert.alert("Thêm bạn thành công")
  };

  const rejectInvite = async (id,name,phone) => {
    // Xử lý từ chối lời mời kết bạn
        // xóa lời mời của ngkhac gửi cho currentUser
        const response3 = await postApiNoneToken("/deleteInvite/"+currenUserId,{
          phone:phone
        })
        // xóa lời trong listADD của người gửi cho currentUser
    
        const response4 =await postApiNoneToken("/deleteListaddFriend/"+id,{
          phone:currentUserPhone
        })
          // Cập nhật state
    const updatedInviteList = inviteList.filter(item => item.id !== id);
    setInviteList(updatedInviteList);

    // Gọi hàm để tải lại danh sách mới
    showListInvite();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={showListInvite} style={styles.button}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Icon name="wechat" size={24} color="#888" />
          <Text style={{ marginLeft: 10 }}>Lời mời kết bạn</Text>
        </View>
      </TouchableOpacity>
      {inviteList.length > 0 && (
        <View>
          <Text style={{ marginBottom: 10 }}>Danh sách lời mời kết bạn:</Text>
          {inviteList.map((item, id) => (
            <View key={id} style={styles.inviteContainer}>
              <Image
                source={avt ? { uri: avt } : require('../assets/img/codon.jpg')}
                style={styles.avatar}
              />
              <View style={styles.inviteDetails}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.phone}>{item.phone}</Text>
              </View>
              <View style={styles.actions}>
                <TouchableOpacity onPress={() => acceptInvite(item.id,item.name,item.phone)} style={[styles.button, styles.acceptButton]}>
                  <Text style={styles.buttonText}>Đồng ý</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => rejectInvite(item.id,item.name,item.phone)} style={[styles.button, styles.rejectButton]}>
                  <Text style={styles.buttonText}>Từ chối</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    top: 30,
    width: "90%",
    left: 10,
  },
  button: {
    backgroundColor: "lightblue",
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  inviteContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  inviteDetails: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  phone: {
    fontSize: 14,
  },
  actions: {
    flexDirection: "row",
  },
  acceptButton: {
    backgroundColor: "green",
    marginRight: 5,
  },
  rejectButton: {
    backgroundColor: "red",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});