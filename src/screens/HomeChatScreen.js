import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import { getApiNoneToken } from '../api/CallApi';
import { putApiNoneToken } from '../api/CallApi';

export default function HomeChatScreen() {
  const [searchText, setSearchText] = useState('');
  const [avt, setAvt] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [searched, setSearched] = useState(false);
  const [isFriend, setIsFriend] = useState(false); // Sử dụng biến này để kiểm tra xem số điện thoại có trong danh bạ không
  const [idFiend,setIdFriend] = useState("")
  const [addFriendText, setAddFriendText] = useState("Kết bạn");
  const [currentUserId,setCurrentUserId] =useState("")
  const [currentUserName,setCurrentUserName] =useState("")
  const [currentUserPhone,setCurrentUserPhone] =useState("")

  const handleSearch = async (text) => {
    try {
      const response = await getApiNoneToken("/getDetailsByPhone/" + text);
      const data = response.data.data;
      // Lấy thông tin người dùng hiện tại
      // sau có redux se thay id mặc định thành currenUserId
      // hiện tại nếu muốn text add friend thì cần thêm số điện thoại mặc định vào dưới
      const currentUserResponse = await getApiNoneToken("/getDetailsByPhone/" + 7777777777);
      const currentUserData = currentUserResponse.data.data;
      setCurrentUserId(currentUserData._id)
      setCurrentUserName(currentUserData.name)
      setCurrentUserPhone(currentUserData.phone)
      if (data) {
        setIdFriend(data._id)
        setName(data.name);
        setPhone(data.phone);
        setAvt(data.avatar);
        setSearched(true);

        if (currentUserData.phone === data.phone) {
          setIsFriend(true); 
            return;
        }

  
        // Kiểm tra xem số điện thoại có trong danh bạ không
        if (currentUserData.phoneBooks && currentUserData.phoneBooks.length > 0) {
          const foundUser = currentUserData.phoneBooks.find(user => user.phone === data.phone);
          if (foundUser) {
            setIsFriend(true); // Nếu tìm thấy số điện thoại trong danh bạ, đặt isFriend thành true
            return; // Dừng hàm và không thực hiện các bước phía dưới nữa
          }
        }
          // nếu có phone trong danh sách mời
        if (currentUserData.listAddFriend && currentUserData.listAddFriend.length > 0) {
              const foundUserInInvite = currentUserData.listAddFriend.find(invitation => invitation.phone === data.phone);
          if (foundUserInInvite) {
            setAddFriendText("Đã gửi lời mời");
            return;
          }
}
        setIsFriend(false); // Nếu không tìm thấy số điện thoại trong danh bạ, đặt isFriend thành false
      } else {
        setSearched(false);
      }
      setAddFriendText("Kết bạn");
    } catch (error) {
      console.error("Error for search", error);
      // Xử lý lỗi ở đây nếu cần
    }
  };

  const addFriend = async () => {
  
    // Gửi yêu cầu kết bạn ở đây
    const response = await putApiNoneToken("/addListFriend/"+currentUserId,{
      id:idFiend,
      name:name,
      phone:phone,
    })
    const response2 = await putApiNoneToken("/addInvite/"+idFiend,{
        id:currentUserId,
        name:currentUserName,
        phone:currentUserPhone
    })
    setAddFriendText("Đã gửi lời mời");
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#f0f0f0', padding: 8, borderRadius: 10 }}>
        <TextInput
          style={{ flex: 1, padding: 8, backgroundColor: 'white', borderRadius: 10 }}
          placeholder="Tìm kiếm..."
          value={searchText}
          onChangeText={(text) => {
            setSearchText(text);
            if (text.trim() !== '') {
              handleSearch(text);
            }
            
          }}
        />
        <Icon name="search1" size={24} color="#888" />

      </View>

      {searched && (
        <View style={{ marginTop: 10, alignItems: 'center', flexDirection: "row", paddingHorizontal: 10, borderWidth: 2, borderColor: "#FF00FF", width: "98%", left: 5, padding: 10, borderRadius: 15 }}>
          <Image
            source={avt ? { uri: avt } : require('../assets/img/codon.jpg')}
            style={{ width: 50, height: 50, borderRadius: 25, marginRight: 10 }}
          />
          <View>
            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{name}</Text>
            <Text style={{ fontSize: 16 }}>{phone}</Text>
          </View>
          {/* Thay đổi hiển thị dựa trên isFriend */}
          {isFriend ? (
            <Text  style={styles.friendText}>Bạn bè</Text>
          ) : (
            <TouchableOpacity onPress={addFriend} style={styles.addButton}>
              <Text style={styles.addButtonText}>{addFriendText}</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

    </View>
  );
};

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
    left:100,
    fontSize: 18,
    fontWeight: 'bold',
    color: 'blue',
  },
});
