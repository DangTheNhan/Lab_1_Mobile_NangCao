const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// Khởi tạo Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*", // Cho phép mọi client kết nối
  },
});

// Lắng nghe các kết nối từ Client
io.on('connection', (socket) => {
  console.log('Một người dùng đã kết nối, ID:', socket.id);
  let userName = null;

  // Nhận sự kiện có người mới tham gia và thông báo cho toàn bộ phòng chat.
  socket.on('join_group', (name) => {
    if (typeof name !== 'string' || name.trim() === '') {
      return;
    }

    userName = name.trim();
    console.log(`${userName} đã tham gia nhóm chat.`);
    io.emit('receive_message', {
      id: `system-join-${socket.id}-${Date.now()}`,
      type: 'system',
      text: `${userName} đã tham gia nhóm chat`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });
  });

  // 2. Nhận tin nhắn từ 1 client và broadcast cho TẤT CẢ client (Từ Screen 2)
  socket.on('send_message', (messageData) => {
    console.log('Nhận tin nhắn:', messageData);
    // Phát tin nhắn đến toàn bộ người dùng trong mạng
    io.emit('receive_message', messageData); 
  });

  // Thông báo khi người dùng đã tham gia rời khỏi nhóm.
  socket.on('disconnect', () => {
    console.log('Một người dùng đã ngắt kết nối:', socket.id);
    if (userName) {
      socket.broadcast.emit('receive_message', {
        id: `system-leave-${socket.id}-${Date.now()}`,
        type: 'system',
        text: `${userName} đã rời khỏi nhóm chat`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
    }
  });

  socket.on('error', (error) => {
    console.error('Lỗi socket:', error);
  });
});

const PORT = Number(process.env.PORT) || 3000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server đang chạy tại http://0.0.0.0:${PORT}`);
});

server.on('error', (error) => {
  console.error('Không thể khởi động Chat Server:', error.message);
});