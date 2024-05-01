import {View, Text, TouchableOpacity, ScrollView, Image} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/AntDesign';
import ListFriend from '../../components/ListFriend';
import OptionsGroup from '../../components/tabMenuInChat/optionsGroup';

const MenuChat = ({route, navigation}) => {
  const {infor} = route.params;
  const participants = infor.participants;
  const [showMemberList, setShowMemberList] = React.useState(false);
  console.log('participants', participants);

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

          <TouchableOpacity className="flex-col p-3 items-center">
            <Icon name="addusergroup" size={25} color={'#888'} />
            <Text className="text-gray-700  text-center">
              Thêm{'\n'} thành viên
            </Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex-col p-3 items-center ">
            <Icon name="deleteuser" size={25} color={'#888'} />
            <Text className="text-gray-700  text-center">
              Xóa{'\n'}
              thành viên
            </Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex-col p-3 items-center">
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
      <OptionsGroup infor={infor}></OptionsGroup>
    </ScrollView>
  );
};

export default MenuChat;
