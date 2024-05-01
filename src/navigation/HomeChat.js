import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Settings from '../screens/Settings';
import HomeChatScreen from '../screens/HomeChatScreen';
import Contact from '../screens/user/Contact';
import Icon from 'react-native-vector-icons/AntDesign';
import MessageScreen from '../screens/MessageScreen';

const Tab = createBottomTabNavigator();

export default function HomeChat() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        options={{
          headerShown: false,

          tabBarLabel: 'Trang chủ',
          tabBarIcon: ({color, size}) => (
            <Icon name="home" color={color} size={size} /> // Biểu tượng cho tab Trang chủ
          ),
        }}
        name="HomeChatScreen"
        component={HomeChatScreen}
      />

      <Tab.Screen
        options={{
          headerShown: false,

          tabBarLabel: 'Tin nhắn',
          tabBarIcon: ({color, size}) => (
            <Icon name="wechat" color={color} size={size} /> // Biểu tượng cho tab Trang chủ
          ),
        }}
        name="MessageScreen"
        component={MessageScreen}
      />

      <Tab.Screen
        options={{
          headerShown: false,
          tabBarLabel: 'Danh bạ',
          tabBarIcon: ({color, size}) => (
            <Icon name="team" color={color} size={size} /> // Biểu tượng cho tab Trang chủ
          ),
        }}
        name="Contact"
        component={Contact}
      />

      <Tab.Screen
        options={{
          headerShown: false,
          tabBarLabel: 'Profile',
          tabBarIcon: ({color, size}) => (
            <Icon name="user" color={color} size={size} /> // Biểu tượng cho tab Trang chủ
          ),
        }}
        name="Settings"
        component={Settings}
      />
    </Tab.Navigator>
  );
}
