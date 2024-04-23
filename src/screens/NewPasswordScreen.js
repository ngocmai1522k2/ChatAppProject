import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { getApiNoneToken, putApiNoneToken } from '../api/CallApi';

const NewPasswordScreen = ({navigation,route}) => {
  const {id} = route.params
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleNewPasswordChange = (text) => {
    setNewPassword(text);
  };

  const handleConfirmPasswordChange = (text) => {
    setConfirmPassword(text);
  };

  const handleSubmit = async() => {
    // Xử lý logic khi người dùng nhấn nút hoàn tất
    if (newPassword === confirmPassword) {
      // Thực hiện thay đổi mật khẩu
      console.log(id)
      // const sdt = "0345641602"
      // const findUserByPhone = await getApiNoneToken("/getDetailsByPhone/"+sdt)
      // const findUserByPhone = await getApiNoneToken("/getDetailsByPhone/"+phone)
      // if(findUserByPhone.data.data.phone==""){
      //     alert("số điện thoại không tồn tại")
      // }
      // console.log(findUserByPhone.data.data._id)
      // const updatePass = await putApiNoneToken("/updateUser/"+findUserByPhone.data.data._id,{
        const updatePass = await putApiNoneToken("/updateUser/"+id,{
        password:newPassword
      })

      console.log(updatePass.data.data)
      alert("Đổi mật khẩu thành công")
      navigation.navigate("Login")
      
    
    } else {
      // Hiển thị thông báo lỗi nếu mật khẩu nhập lại không khớp
      console.log('Mật khẩu nhập lại không khớp');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Nhập mật khẩu mới</Text>
      <TextInput
        style={styles.input}
        placeholder="Mật khẩu mới"
        onChangeText={handleNewPasswordChange}
        secureTextEntry={true}
        value={newPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Nhập lại mật khẩu mới"
        onChangeText={handleConfirmPasswordChange}
        secureTextEntry={true}
        value={confirmPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Hoàn tất</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '80%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  button: {
    width: '80%',
    height: 50,
    backgroundColor: 'blue',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
  },
});

export default NewPasswordScreen;
