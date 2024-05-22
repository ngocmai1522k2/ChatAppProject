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
  import {useDispatch} from 'react-redux';
  import { useNavigation } from '@react-navigation/native';
  import { getApiNoneToken } from '../api/CallApi';
  const FormData = require('form-data');
  
  export default function FriendProfile({route}) {
    const {friend} = route.params;
    const currentUser = useSelector(state => state.user.currentUser);
    const navigation = useNavigation();
    const [getFriend, setGetFriend] = useState([]);
  
    const dispatch = useDispatch();
  
    // useEffect(() => {
    //   if (!isEditing) {
    //     setName(currentUser.name);
    //     setGender(currentUser.gender);
    //     setDob(new Date(currentUser.dateOfBirth));
    //     setFormattedDob(
    //       moment(currentUser.dateOfBirth).tz('UTC').format('DD/MM/YYYY'),
    //     );
    //     setEmail(currentUser.username);
    //     setPhone(currentUser.phone);
    //     setAvatar(currentUser.avatar);
    //     console.log('avatar current: ', avatar);
    //     setIsEditing(false);
  
    //   }
    // }, [isEditing, currentUser]);
  
   useEffect(() => {
    const getDetail = async () => {
      try {
        const response = await getApiNoneToken("/getDetailsByPhone/"+friend.phone);
        setGetFriend(response.data.data);
        console.log('response.data.data: ', response.data.data);
      } catch (error) {
        console.log('error: ', error);
      }
    }
    getDetail();
   },[])
  //  const [formattedDob, setFormattedDob] = useState(
  //   moment(getFriend.dateOfBirth).tz('UTC').format('DD/MM/YYYY'),
  // );
    const originalImageSource =
      getFriend.avatar
        ? {uri: getFriend.avatar}
        : require('../assets/img/codon.jpg')
   
  
  
   
  
  
  
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
                onPress={() => navigation.goBack()}>
                <FontAwesome5 name="arrow-left" size={40} color={'#2196F3'} />
              </TouchableOpacity>
            </View>
          </View>
          <View className="flex-col items-center h-40 mt-2">
            <Image
              className="h-40 w-40 rounded-full bg-black"
              source={originalImageSource}
            />
            <Text className="text-2xl font-bold text-gray-800 mt-2">
              {getFriend.name}
            </Text>
          </View>
  
          {/* User Info Section */}
          <View className="mt-20 px-10">
            <View className="flex-row items-center mb-3 border-cyan-600 border-2 p-3 rounded-lg">
              <IonIcon name="person" size={24} color={'#2196F3'} />
              <Text className="ml-3 text-lg text-gray-500">{getFriend.name}</Text>
            </View>
            <View className="flex-row items-center mb-3 border-cyan-600 border-2 p-3 rounded-lg">
              <IonIcon name="male-female" size={24} color={'#2196F3'} />
              <Text className="ml-3 text-lg text-gray-500">
                {getFriend.gender ? 'Nam' : 'Nữ'}
              </Text>
            </View>
            <View className="flex-row items-center mb-3 border-cyan-600 border-2 p-3 rounded-lg">
              <MaterialIcons name="calendar-today" size={24} color={'#2196F3'} />
              <Text className="ml-3 text-lg text-gray-500"> {getFriend.dateOfBirth?
              moment(getFriend.dateOfBirth).tz('UTC').format('DD/MM/YYYY')
              : "Chưa cập nhật"}
              
              </Text>
            </View>
            <View className="flex-row items-center mb-3 border-cyan-600 border-2 p-3 rounded-lg">
              <IonIcon name="call" size={24} color={'#2196F3'} />
              <Text className="ml-3 text-lg text-gray-800">{getFriend.phone}</Text>
            </View>
          </View>
        </View>
  
      </ScrollView>
    );
  }
  
  
  