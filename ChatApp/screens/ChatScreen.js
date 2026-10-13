import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import io from 'socket.io-client';

// Android Emulator mặc định dùng 10.0.2.2 để truy cập máy đang chạy server.
// Nếu server chạy trong một máy ảo khác, thay giá trị này bằng IP của máy ảo đó.
const SOCKET_URL = 'http://10.0.2.2:3000';

export default function ChatScreen({ route }) {
  // Lấy tên người dùng từ Screen 1 truyền sang
  const { userName } = route.params;
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // 1. Tạo kết nối real-time giữa client (React Native app) và server
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    newSocket.on('connect_error', (error) => {
      console.error('Không thể kết nối Chat Server:', error.message);
      Alert.alert('Lỗi kết nối', `Không thể kết nối tới ${SOCKET_URL}`);
    });

    // Lắng nghe tin nhắn và thông báo hệ thống trước khi tham gia nhóm.
    newSocket.on('receive_message', (newMessage) => {
      setChatMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    // Chỉ tham gia sau khi socket đã kết nối.
    newSocket.on('connect', () => {
      newSocket.emit('join_group', userName);
    });

    // Ngắt kết nối khi rời khỏi màn hình
    return () => {
      newSocket.disconnect();
    };
  }, [userName]);

  const sendMessage = () => {
    if (message.trim() === '') return;
    if (!socket?.connected) {
      Alert.alert('Chưa kết nối', 'Chat Server chưa sẵn sàng. Hãy kiểm tra IP và port 3000.');
      return;
    }

    const messageData = {
      id: Math.random().toString(), 
      text: message,
      sender: userName,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    // 1. Gửi tin nhắn đến server qua socket event
    socket.emit('send_message', messageData);
    setMessage(''); 
  };

  // Hàm render hiển thị từng tin nhắn trong FlatList
  const renderItem = ({ item }) => {
    if (item.type === 'system') {
      return (
        <View style={styles.systemMessageContainer}>
          <View style={styles.systemMessageBubble}>
            <Text style={styles.systemMessageText}>{item.text}</Text>
          </View>
          <Text style={styles.timeText}>{item.time}</Text>
        </View>
      );
    }

    const isMyMessage = item.sender === userName;

    return (
      <View style={[styles.messageContainer, isMyMessage ? styles.myMessage : styles.otherMessage]}>
        {!isMyMessage && <Text style={styles.senderName}>{item.sender}</Text>}
        <View style={[styles.messageBubble, isMyMessage ? styles.myBubble : styles.otherBubble]}>
          <Text style={[styles.messageText, isMyMessage ? styles.myMessageText : {}]}>{item.text}</Text>
        </View>
        <Text style={styles.timeText}>{item.time}</Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={90}
    >
      {/* Component FlatList hiển thị danh sách tin nhắn */}
      <FlatList
        data={chatMessages}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.messageList}
      />
      
      <View style={styles.inputContainer}>
        {/* Component TextInput để nhập tin nhắn */}
        <TextInput
          style={styles.input}
          placeholder="Nhập tin nhắn..."
          value={message}
          onChangeText={setMessage}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  messageContainer: { marginBottom: 15, maxWidth: '80%' },
  messageList: { padding: 15 },
  systemMessageContainer: { alignItems: 'center', marginBottom: 15 },
  systemMessageBubble: { backgroundColor: '#e8f3f2', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 8 },
  systemMessageText: { color: '#777', fontStyle: 'italic' },
  myMessage: { alignSelf: 'flex-end' },
  otherMessage: { alignSelf: 'flex-start' },
  senderName: { fontSize: 12, fontWeight: 'bold', marginBottom: 5, color: '#333' },
  messageBubble: { padding: 12, borderRadius: 15 },
  myBubble: { backgroundColor: '#2b847c', borderBottomRightRadius: 0 },
  otherBubble: { backgroundColor: '#f0f0f0', borderBottomLeftRadius: 0 },
  messageText: { fontSize: 16, color: '#333' },
  myMessageText: { color: '#fff' },
  timeText: { fontSize: 10, color: '#aaa', marginTop: 5, alignSelf: 'flex-end' },
  inputContainer: { flexDirection: 'row', padding: 10, borderTopWidth: 1, borderColor: '#eee', backgroundColor: '#fff' },
  input: { flex: 1, backgroundColor: '#f0f0f0', borderRadius: 20, paddingHorizontal: 15, fontSize: 16, marginRight: 10 },
  sendButton: { backgroundColor: '#2b847c', borderRadius: 20, justifyContent: 'center', paddingHorizontal: 20 },
  sendButtonText: { color: '#fff', fontWeight: 'bold' },
});