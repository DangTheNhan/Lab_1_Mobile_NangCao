import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import ChatScreen from './screens/ChatScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        {/* Screen 1: Home Screen - Màn hình nhập tên */}
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ headerShown: false }} 
        />
        {/* Screen 2: Chat Screen - Giao diện Group Chat */}
        <Stack.Screen 
          name="Chat" 
          component={ChatScreen} 
          options={{ title: 'Group CSE 434' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}