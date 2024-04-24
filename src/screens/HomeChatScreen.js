import React, { useState } from 'react';
import { View, TextInput, Text, Alert, TouchableOpacity, Image, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import { getApiNoneToken } from '../api/CallApi';

export default function HomeChatScreen() {
  const [searchText, setSearchText] = useState('');
  const [avt, setAvt] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [searched, setSearched] = useState(false); // Biến để kiểm tra xem đã tìm kiếm hay chưa
  const [addFriendText,setAddFriendText] = useState("Kết bạn")
  const handleSearch = async (text) => {
    try {
      const response = await getApiNoneToken("/getDetailsByPhone/" + text);
      const data = response.data.data;
      if (data) {
        setName(data.name);
        setPhone(data.phone);
        setAvt(data.avatar);
        setSearched(true); // Đặt searched thành true để hiển thị kết quả tìm kiếm
      } else {
        setSearched(false); // Đặt searched thành false nếu không tìm thấy dữ liệu
      }
      setAddFriendText("Kết bạn")
    } catch (error) {
      console.error("Error for search", error);
      // Alert.alert("Error", "There was an error while searching.");
    }
  };
  // xử lý kết bạn
  const addFriend=async()=>{
    setAddFriendText("Đã gửi lời mời")
    

  }

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#f0f0f0', padding: 8, borderRadius: 10 }}>
        <TextInput
          style={{ flex: 1, padding: 8, backgroundColor: 'white', borderRadius: 10 }}
          placeholder="Tìm kiếm..."
          value={searchText}
          onChangeText={(text) => {
            setSearchText(text);
            if (text.trim() !== '') { // Chỉ gọi API khi văn bản trong ô tìm kiếm khác rỗng
              handleSearch(text);
            }
          }}
          
        />
        
        <Icon  name="search1" size={24} color="#888" />
        
      </View>

      {searched && (
        <View style={{ marginTop: 10, alignItems: 'center', flexDirection: "row",
         paddingHorizontal: 10 ,borderWidth:2,borderColor:"#FF00FF",width:"98%",left:5,
         padding:10,
         borderRadius:15
         }}>
      <Image
      source={avt ? { uri: avt } : require('../assets/img/codon.jpg')}
      style={{ width: 50, height: 50, borderRadius: 25, marginRight: 10 }}
    />
    <View>
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{name}</Text>
      <Text style={{ fontSize: 16 }}>{phone}</Text>
    </View>
    {/* // xử lý kết bạn ở đây */}
    <TouchableOpacity  onPress={addFriend} style={styles.addButton}>
            <Text style={styles.addButtonText}>{addFriendText}</Text>
          </TouchableOpacity>

  </View>
      )}

    </View>
  );
};

const styles = StyleSheet.create({
  addButton: {
    left:50,
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
});