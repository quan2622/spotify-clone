import { Server } from 'socket.io'
import { Message } from '../models/message.model.js'
import { LoginHistory } from '../models/History.model.js';

export const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: 'http://localhost:3000',
      credentials: true,
    }
  })
  const userSockets = new Map(); // userId: socketId;
  const userActivities = new Map(); // userId: activity

  io.on('connection', (socket) => {  //  notitify to server client can listen event incoming
    socket.on('user_connected', async (userId) => {
      userSockets.set(userId, socket.id);
      userActivities.set(userId, 'Idle');

      // Update login count in the database
      try {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalize to start of the day
        await LoginHistory.findOneAndUpdate(
          { userId, date: today },
          {
            $inc: { count: 1 },
            $setOnInsert: { userId, date: today },
          }, { upsert: true, new: true }
        )
      } catch (error) {
        console.error('Error updating login history:', error);
      }

      io.emit('user_connected', userId);
      socket.emit('user_online', Array.from(userSockets.keys()));
      io.emit('activities', Array.from(userActivities.entries()));
    });

    socket.on('update_activity', ({ userId, activity }) => {
      // console.log('activity updated: ', userId, activity);
      userActivities.set(userId, activity);
      io.emit('activity_updated', { userId, activity });
    });

    socket.on('send_message', async (data) => {
      try {
        const { senderId, receiverId, content } = data;

        const message = await Message.create({
          senderId, receiverId, content
        })

        // send to receiver in realtime, if they're online 
        const receiverSocketId = userSockets.get(receiverId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit('receive_message', message);
        }

        socket.emit('message_sent', message);
      } catch (error) {
        console.log('Message error: ', error);
        socket.emit('message_error', error.message);
      }
    });

    socket.on('disconnect', () => {
      let disconnectUserId;
      for (const [userId, socketId] of userSockets.entries()) {
        // find disconnect user
        if (socketId === socket.id) {
          disconnectUserId = userId;
          userSockets.delete(userId);
          userActivities.delete(userId);
          break;
        }
      }
      if (disconnectUserId) {
        io.emit('user_disconnected', disconnectUserId);
      }
    })
  })
}

