import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Alert } from 'react-native';

export default function HomeScreen({ navigation }) {
  const [name, setName] = useState('');

  const handleStartChat = () => {
    // 1. Kiểm tra người dùng đã nhập tên chưa
    if (name.trim() === '') {
      Alert.alert('Lỗi', 'Vui lòng nhập tên của bạn!');
      return;
    }
    // 2. Lưu tên người dùng và chuyển hướng sang Group Screen (Screen 2)
    navigation.navigate('Chat', { userName: name });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Your Name</Text>
        <Text style={styles.subtitle}>Please enter your name to start a new chat</Text>
        
        <Text style={styles.label}>Your name</Text>
        {/* Component TextInput để nhập tên */}
        <TextInput
          style={styles.input}
          placeholder="Ví dụ: Richard Nguyen"
          value={name}
          onChangeText={setName}
        />

        {/* Component Button (TouchableOpacity) để bắt đầu */}
        <TouchableOpacity style={styles.button} onPress={handleStartChat}>
          <Text style={styles.buttonText}>Start Chat</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
  subtitle: { fontSize: 14, color: 'gray', textAlign: 'center', marginBottom: 40 },
  label: { fontSize: 12, color: 'gray', marginBottom: 5 },
  input: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#2b847c',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});