import {View, TouchableOpacity, Text, Image, Button,TextInput,StyleSheet, Alert} from 'react-native';
import React, { useState } from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/AntDesign';
import {useNavigation} from '@react-navigation/native';
import { postApiNoneToken } from '../../api/CallApi';
import DateTimePicker from '@react-native-community/datetimepicker';




export default function SignUpScreen({route}) {
  const {sdt} = route.params
  const [name, setName] = useState('');
  const [email, setEmail] = useState('@gmail.com');
  const [phone, setPhone] = useState(sdt);
  const [gender, setGender] = useState(false); // Default is male
  const [dateOfBirth, setDateOfBirth] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [password, setPassword] = useState('0345641602Nvv!');
  const [confirmPassword, setConfirmPassword] = useState('0345641602Nvv!');
  const navigation = useNavigation();

  //regex và các hằng số
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const nameRegex = /^[a-zA-Z\s_-]+$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,}$/;

  const isValidEmail = emailRegex.test(email);
  const isValidName = nameRegex.test(name);
  const isValidPassword = passwordRegex.test(password);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || dateOfBirth;
    setShowDatePicker(false);
    setDateOfBirth(currentDate);
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  const regex = () => {
    if (!isValidName) {
      Alert.alert("Thông Báo", "Họ và tên không hợp lệ");
      return;
    }
    if (!isValidEmail) {
      Alert.alert("Thông Báo", "Email không hợp lệ");
      return;
    }
    if (!isValidPassword) {
      Alert.alert("Thông Báo", "Mật khẩu phải có 10 kí tự, bao gồm số, chữ thường, chữ hoa và kí tự đặc biệt ");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Thông Báo", "Mật khẩu không trùng khớp");
      return;
    }
    SignUp();
  };

  const SignUp = async () => {
    try {
      const respone = await postApiNoneToken("/signup", {
        name: name,
        username: email,
        phone: phone,
        gender: gender,
        dateOfBirth: dateOfBirth,
        password: password,
        confirmPassword: confirmPassword
      });
      if (respone.data.message === "User must be at least 18 years old") {
        Alert.alert("Thông báo", "Người dùng phải đủ 18 tuổi");
        return;
      }
      if (respone.data.data) {
        setEmail("");
        setName("");
        setPassword("");
        setConfirmPassword("");
      }
      Alert.alert("Xác nhận", "Đăng ký thành công");
      navigation.navigate("Login");
    } catch (error) {
      console.log("lôi đăng ký", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
        {/* <TouchableOpacity onPress={navigation.navigate("Login")}>
          <Icon name="arrowleft" size={30} color="blue" />
        </TouchableOpacity> */}
      <Text style={styles.title}>Nhập Thông Tin Đăng Ký</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Họ và tên</Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập họ và tên"
          value={name}
          onChangeText={setName}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập địa chỉ email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Số điện thoại</Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập số điện thoại"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Giới tính</Text>
        <View style={styles.radioContainer}>
          <TouchableOpacity
            style={[styles.radioOption, gender === true && styles.selectedOption]}
            onPress={() => setGender(true)}
          >
            <Text style={styles.optionText}>Nam</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.radioOption, gender === false && styles.selectedOption]}
            onPress={() => setGender(false)}
          >
            <Text style={styles.optionText}>Nữ</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Ngày sinh</Text>
        <TouchableOpacity onPress={showDatepicker} style={styles.datePickerButton}>
          <Text>Chọn ngày sinh</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            testID="dateTimePicker"
            value={dateOfBirth}
            mode="date"
            is24Hour={true}
            display="default"
            onChange={onChange}
          />
        )}
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Mật khẩu</Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập mật khẩu"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Xác nhận mật khẩu</Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập lại mật khẩu"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />
      </View>
      <TouchableOpacity onPress={regex} style={styles.submitButton}>
        <Text style={styles.submitButtonText}>Đăng Ký</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 15,
  },
  label: {
    marginBottom: 5,
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  radioContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  radioOption: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginRight: 10,
  },
  selectedOption: {
    backgroundColor: '#0099FF',
  },
  optionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  datePickerButton: {
    padding: 10,
    marginBottom: 10,
    backgroundColor: 'pink',
    borderRadius: 5,
  },
  submitButton: {
    borderWidth: 1,
    borderRadius: 15,
    borderColor: 'black',
    width: 100,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'pink',
    marginTop: 10,
  },
  submitButtonText: {
    fontSize: 18,
    color: 'black',
  },
});