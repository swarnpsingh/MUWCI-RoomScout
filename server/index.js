import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import connectDB from './db/db.js';
import Room from './models/Room.js'; // Import the Room model
import { WebSocketServer } from 'ws';

const app = express();

// Middleware
app.use(cors({
  origin: 'https://roomscout.vercel.app', 
  credentials: true,
}));
app.use(express.json());

connectDB()
  .then(async () => {
    const PORT = process.env.PORT || 5000;
    const server = app.listen(PORT, () => {
      console.log(`Server is running at port: ${PORT}`);
    });

    // WebSocket server
    const wss = new WebSocketServer({ server });

    // Ensure rooms exist in the database
    const rooms = ['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'A9', 'A10', 'A11', 'A12', 'A13', 'A14', 'Library', 'Conference Room'];

    for (const room of rooms) {
      const existingRoom = await Room.findOne({ name: room });
      if (!existingRoom) {
        await Room.create({ name: room });
      }
    }

    // Reset all room counts and people to 0
    app.post('/reset-counts', async (req, res) => {
      try {
        await Room.updateMany({}, { count: 0, people: [] });  // Reset count and people array
        res.status(200).json({ message: 'Room counts and people have been reset.' });

        // Optionally, broadcast the reset counts to all connected WebSocket clients
        const updatedRooms = await Room.find();
        const resetData = updatedRooms.map(room => ({
          room: room.name,
          count: room.count,
          people: room.people,
        }));

        wss.clients.forEach(client => {
          if (client.readyState === client.OPEN) {
            resetData.forEach(data => {
              client.send(JSON.stringify(data));
            });
          }
        });
      } catch (error) {
        res.status(500).json({ message: 'Failed to reset room counts and people.' });
      }
    });

    // WebSocket logic
    wss.on('connection', (ws) => {
      console.log('New WebSocket connection');

      // Send the current counts and people to the newly connected client
      Room.find().then((roomData) => {
        roomData.forEach((room) => {
          ws.send(JSON.stringify({ room: room.name, count: room.count, people: room.people }));
        });
      });

      ws.on('message', async (message) => {
        const data = JSON.parse(message);
        const { room, action, user } = data; // Expect `user` field in the message

        // Find the room in the database
        const roomDoc = await Room.findOne({ name: room });

        // Update count and people list based on action
        if (action === 'join') {
          roomDoc.count += 1;
          if (!roomDoc.people.includes(user)) {
            roomDoc.people.push(user); // Add the user if they’re not already in the room
          }
        } else if (action === 'leave') {
          roomDoc.count = Math.max(0, roomDoc.count - 1);
          roomDoc.people = roomDoc.people.filter(person => person !== user); // Remove user from the list
        }

        // Save the updated count and people list
        await roomDoc.save();

        // Broadcast the updated data to all clients
        const updatedData = JSON.stringify({
          room: roomDoc.name,
          count: roomDoc.count,
          people: roomDoc.people,
        });

        wss.clients.forEach((client) => {
          if (client.readyState === ws.OPEN) {
            client.send(updatedData);
          }
        });
      });

      // Handle disconnection
      ws.on('close', () => {
        console.log('WebSocket connection closed');
      });
    });
  })
  .catch((err) => {
    console.log('MongoDB connection failed!', err);
  });

// Routes
app.use('/auth', authRoutes);
