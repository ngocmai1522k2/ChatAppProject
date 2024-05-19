import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import IonIcon from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useSelector} from 'react-redux';
import moment from 'moment-timezone';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import DateTimePicker from '@react-native-community/datetimepicker';
import {useDispatch} from 'react-redux';
import {setCurrentUser, setUserAvatar} from '../features/user/userSlice';
import {putApiNoneToken} from '../api/CallApi';
import {uploadFile} from '../api/CallApi';
import ImagePicker from 'react-native-image-crop-picker';
import { useNavigation } from '@react-navigation/native';
const FormData = require('form-data');

export default function Settings() {
  const currentUser = useSelector(state => state.user.currentUser);
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [originalImageSource, setOriginalImageSource] = useState(
    currentUser.avatar
      ? {uri: currentUser.avatar}
      : require('../assets/img/codon.jpg'),
  );
  const [imageSource, setImageSource] = useState(null); // Image source chọn từ thư viện hoặc chụp từ camera
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(currentUser.name);
  const [gender, setGender] = useState(currentUser.gender);
  const [dob, setDob] = useState(new Date(currentUser.dateOfBirth));
  const [formattedDob, setFormattedDob] = useState(
    moment(currentUser.dateOfBirth).tz('UTC').format('DD/MM/YYYY'),
  );
  const [email, setEmail] = useState(currentUser.username);
  const [phone, setPhone] = useState(currentUser.phone);
  const [avatar, setAvatar] = useState(currentUser.avatar);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const nameRegex = /^[a-zA-Z\s_-]+$/;
  const phoneRegex = /^[0-9]{10}$/;
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isEditing) {
      setName(currentUser.name);
      setGender(currentUser.gender);
      setDob(new Date(currentUser.dateOfBirth));
      setFormattedDob(
        moment(currentUser.dateOfBirth).tz('UTC').format('DD/MM/YYYY'),
      );
      setEmail(currentUser.username);
      setPhone(currentUser.phone);
      setAvatar(currentUser.avatar);
      console.log('avatar current: ', avatar);
      setIsEditing(false);

    }
  }, [isEditing, currentUser]);

  const saveChanges = async () => {
    if (name === '' || formattedDob === '' || email === '' || phone === '') {
      Alert.alert('Thông báo', 'Vui lòng nhập đầy đủ thông tin');
      return;
    } else if (!nameRegex.test(name)) {
      Alert.alert('Thông báo', 'Họ và tên không hợp lệ');
      return;
    } else if (!emailRegex.test(email)) {
      Alert.alert('Thông báo', 'Email không hợp lệ');
      return;
    } else if (!phoneRegex.test(phone)) {
      Alert.alert('Thông báo', 'Số điện thoại không hợp lệ');
      return;
    }

    // Upload avatar
    await uploadImage();

    console.log('avatar mới: ', avatar )

    // Update user info
    const respone = await putApiNoneToken(`/updateUser/${currentUser._id}`, {
      name: name,
      username: email,
      phone: phone,
      gender: gender,
      dateOfBirth: dob,
      avatar: avatar,
    });

    if (respone.message === 'User must be at least 18 years old') {
      Alert.alert('Thông báo', 'Người dùng phải đủ 18 tuổi');
      return;
    }
    if (respone.message === 'Phone is already exists') {
      Alert.alert('Thông báo', 'Số điện thoại đã tồn tại');
      return;
    }
    if (respone.data) {
      dispatch(setCurrentUser(respone.data.data));
      console.log('user update thành công : ', respone.data);
      Alert.alert('Thông báo', 'Cập nhật thông tin thành công');
    }
    setIsEditing(true);
    setEditModalVisible(false);
    
    // Call API to save changes
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || dob;
    setShowDatePicker(false);
    setDob(currentDate);
    setFormattedDob(moment(currentDate).tz('UTC').format('DD/MM/YYYY'));
  };

  const supportedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];

  const selectPhotos = () => {
    ImagePicker.openPicker({
      width: 200,
      height: 300,
      cropping: true,
      includeBase64: true,
      cropperCircleOverlay: true,
      avoidEmptySpaceAroundImage: true,
    })
      .then(image => {
        if (!supportedMimeTypes.includes(image.mime)) {
          Alert.alert(
            'Invalid File',
            'Please select a valid image file (jpg, png, gif).',
          );
          return;
        }
        console.log(image);
        setImageSource({
          // Set the image object directly
          path: image.path,
          mime: image.mime,
          data: image.data, // Base64 data
        });
        setOriginalImageSource({uri: image.path});
        console.log('image source: ', image);
      })
      .catch(error => {
        if (error.message === 'User cancelled image selection') {
          console.log('Người dùng đã hủy việc chọn hình ảnh.');
        } else {
          console.error('Lỗi khi chọn hình ảnh:', error);
        }
      });
  };

  const uploadImage = async () => {
    if (imageSource) {
      const formData = new FormData();
      formData.append('file', {
        uri: imageSource.path,
        type: imageSource.mime,
        name: `${currentUser._id}.${imageSource.mime.split('/')[1]}`,
      });
  
      try {
        const response = await uploadFile('/uploadAvatar', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        if (response.status === 200 && response.data.data) {
          // Alert.alert('Thành công', 'Tải ảnh đại diện thành công');
          console.log('image uploaded: ', response.data.data.url);
          setAvatar(response.data.data.url);
          setImageSource(null);
        } else {
          Alert.alert('Thất bại', 'Tải ảnh đại diện thất bại');
        }
      } catch (error) {
        console.error('Lỗi khi tải lên ảnh dại diện:', error);
        Alert.alert('Lỗi', 'Lỗi trong quá trình tải ảnh đại diện');
      }
    }
  };
  const takePhotos = () => {
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
    }).then(image => {
      console.log(image);
      setImageSource({
        // Set the image object directly
        path: image.path,
        mime: image.mime,
        data: image.data, // Base64 data
      });
      setOriginalImageSource({uri: image.path});
      console.log('image source: ', image);
    });
  };

  const closeModal = () => {
    setEditModalVisible(false);
    // Nếu không có sự thay đổi trong image source, giữ nguyên image source ban đầu
    if (imageSource) {
      setImageSource(null);
      setOriginalImageSource(
        currentUser.avatar
          ? {uri: currentUser.avatar}
          : require('../assets/img/codon.jpg'),
      );
    }
  };

  return (
    <ScrollView
      keyboardShouldPersistTaps="always"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{paddingBottom: 40}}>
      <View>
        <View className="bg-inherit flex-row h-9 p-5">
          <View className="flex-1 h-24 items-start">
            <TouchableOpacity
              className="h-15 w-15 my-1 mx-1"
              onPress={() => setEditModalVisible(true)}>
              <FontAwesome5 name="user-edit" size={40} color={'#2196F3'} />
            </TouchableOpacity>
          </View>
          <View className="flex-1 items-end h-24">
            <TouchableOpacity className="h-15 w-15 my-1 mx-1"  onPress={()=>navigation.navigate("Welcome")}>
              <IonIcon name="log-out-outline" size={40} color={'#2196F3'} />
            </TouchableOpacity>
          </View>
        </View>
        <View className="flex-col items-center h-40 mt-2">
          <Image
            className="h-40 w-40 rounded-full bg-black"
            source={originalImageSource}
          />
          <Text className="text-2xl font-bold text-gray-800 mt-2">
            {currentUser.name}
          </Text>
        </View>

        {/* User Info Section */}
        <View className="mt-20 px-10">
          <View className="flex-row items-center mb-3 border-cyan-600 border-2 p-3 rounded-lg">
            <IonIcon name="person" size={24} color={'#2196F3'} />
            <Text className="ml-3 text-lg text-gray-500">{name}</Text>
          </View>
          <View className="flex-row items-center mb-3 border-cyan-600 border-2 p-3 rounded-lg">
            <IonIcon name="male-female" size={24} color={'#2196F3'} />
            <Text className="ml-3 text-lg text-gray-500">
              {gender ? 'Nam' : 'Nữ'}
            </Text>
          </View>
          <View className="flex-row items-center mb-3 border-cyan-600 border-2 p-3 rounded-lg">
            <MaterialIcons name="calendar-today" size={24} color={'#2196F3'} />
            <Text className="ml-3 text-lg text-gray-500">{formattedDob}</Text>
          </View>
          <View className="flex-row items-center mb-3 border-cyan-600 border-2 p-3 rounded-lg">
            <IonIcon name="mail" size={24} color={'#2196F3'} />
            <Text className="ml-3 text-lg text-gray-500">{email}</Text>
          </View>
          <View className="flex-row items-center mb-3 border-cyan-600 border-2 p-3 rounded-lg">
            <IonIcon name="call" size={24} color={'#2196F3'} />
            <Text className="ml-3 text-lg text-gray-800">{phone}</Text>
          </View>
        </View>
      </View>

      {/* Modal edit profile*/}
      <Modal
        animationType="slide"
        transparent={true}
        visible={editModalVisible}
        onRequestClose={() => setEditModalVisible(false)}>
        <KeyboardAwareScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              backgroundColor: '#fff',
              padding: 20,
              borderRadius: 10,
              width: '90%',
              height: '85%',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              style={{position: 'absolute', top: 10, right: 10}}
              onPress={closeModal}>
              <IonIcon name="close" size={30} color={'#000'} />
            </TouchableOpacity>
            <Text style={{fontSize: 24, fontWeight: 'bold', marginBottom: 20}}>
              Thông tin
            </Text>
            {/* View Avatar */}
            <View style={{alignItems: 'center', marginBottom: 20}}>
              <TouchableOpacity onPress={selectPhotos}>
                <Image
                  style={{width: 100, height: 100, borderRadius: 50}}
                  source={originalImageSource} // Sử dụng state originalImageSource để hiển thị ảnh được chọn hoặc mặc định
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={{position: 'absolute', top: 70, left: 70}}
                onPress={takePhotos}>
                <FontAwesome5 name="camera" size={30} color={'#C5CDE0'} />
              </TouchableOpacity>
            </View>

            <View style={{width: '100%'}}>
              <Text style={{marginBottom: 5}}>Họ và tên</Text>
              <TextInput
                style={styles.textInputStyle}
                placeholder="Họ và tên"
                value={name}
                onChangeText={setName}
              />
              <Text style={{marginBottom: 5}}>Giới tính</Text>
              <View style={styles.radioContainer}>
                <TouchableOpacity
                  style={[
                    styles.radioOption,
                    gender === true && styles.selectedOption,
                  ]}
                  onPress={() => setGender(true)}>
                  <Text style={styles.optionText}>Nam</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.radioOption,
                    gender === false && styles.selectedOption,
                  ]}
                  onPress={() => setGender(false)}>
                  <Text style={styles.optionText}>Nữ</Text>
                </TouchableOpacity>
              </View>

              <Text style={{marginBottom: 5}}>Ngày sinh</Text>
              <View style={styles.radioContainer}>
                <TextInput
                  style={styles.textInputStyle}
                  placeholder="Ngày sinh"
                  value={formattedDob}
                  onChangeText={setFormattedDob}
                />
                <TouchableOpacity
                  onPress={() => setShowDatePicker(true)}
                  style={styles.datePickerButton}>
                  <Text style={{color: '#fff', padding: 15}}>
                    Chọn ngày sinh
                  </Text>
                </TouchableOpacity>
                {showDatePicker && (
                  <DateTimePicker
                    testID="dateTimePicker"
                    value={dob}
                    mode="date"
                    is24Hour={true}
                    display="default"
                    onChange={onChange}
                  />
                )}
              </View>
              <Text style={{marginBottom: 5}}>Email</Text>
              <TextInput
                style={styles.textInputStyle}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
              />
              <Text style={{marginBottom: 5}}>Số điện thoại</Text>
              <TextInput
                style={styles.textInputStyle}
                placeholder="Số điện thoại"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />

              <TouchableOpacity
                onPress={saveChanges}
                style={{alignItems: 'center'}}>
                <View
                  style={{
                    backgroundColor: '#2196F3',
                    borderRadius: 10,
                    width: '50%',
                    height: 50,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: 5,
                  }}>
                  <Text style={{color: '#fff'}}>Lưu thay đổi</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </Modal>
    </ScrollView>
  );
}

const styles = {
  textInputStyle: {
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 7,
  },
  radioContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  radioOption: {
    borderWidth: 1,
    borderColor: 'gray',
    width: '30%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 7,
    marginHorizontal: 5,
  },
  selectedOption: {
    backgroundColor: '#2196F3',
  },
  optionText: {
    color: 'black',
  },
  datePickerButton: {
    backgroundColor: '#2196F3',
    height: 50,
    borderRadius: 7,
    marginLeft: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
};
