// server/models/Room.js
import mongoose from 'mongoose';

const RoomSchema = new mongoose.Schema({
  name: String,
  count: { type: Number, default: 0 },
  people: { type: [String], default: [] } // Track list of people in the room
});

const Room = mongoose.model('Room', RoomSchema);

export default Room;
