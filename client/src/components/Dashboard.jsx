import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ReconnectingWebSocket from 'reconnecting-websocket';

const Dashboard = ({ user }) => {
  const userName = user?.name || 'Anonymous';
  const rooms = ['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'A9', 'A10', 'A11', 'A12', 'A13', 'A14', 'Library', 'Conference Room'];

  const [studyingCounts, setStudyingCounts] = useState({
    'A1': 0, 'A2': 0, 'A3': 0, 'Library': 0, 'Conference Room': 0,
  });

  const [peopleInRooms, setPeopleInRooms] = useState({
    'A1': [], 'A2': [], 'A3': [], 'Library': [], 'Conference Room': [],
  });

  const [isStudyingInRoom, setIsStudyingInRoom] = useState(() => {
    const storedState = JSON.parse(localStorage.getItem('studyingRooms')) || {};
    return {
      'A1': false, 'A2': false, 'Library': false, 'Conference Room': false,
      ...storedState,
    };
  });

  const [showModal, setShowModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);

  useEffect(() => {
    const ws = new ReconnectingWebSocket('ws://muwci-roomscout.onrender.com');

    ws.onmessage = (message) => {
      const data = JSON.parse(message.data);
      const { room, count, people } = data;

      setStudyingCounts(prevCounts => ({
        ...prevCounts,
        [room]: count,
      }));

      setPeopleInRooms(prevPeople => ({
        ...prevPeople,
        [room]: people || [],
      }));
    };

    return () => {
      ws.close();
    };
  }, []);

  const handleJoinOrLeaveRoom = (room) => {
    const ws = new ReconnectingWebSocket('ws://muwci-roomscout.onrender.com');
    const isStudying = isStudyingInRoom[room];
    
    ws.onopen = () => {
      ws.send(JSON.stringify({
        room,
        action: isStudying ? 'leave' : 'join',
        user: userName
      }));
    };

    setIsStudyingInRoom(prev => {
      const newState = {
        ...prev,
        [room]: !isStudying,
      };
      localStorage.setItem('studyingRooms', JSON.stringify(newState));
      return newState;
    });
  };

  const openPeopleModal = (room) => {
    setSelectedRoom(room);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedRoom(null);
  };

  return (
    <div className="flex h-screen">
      {/* Left sidebar - Hidden on small screens */}
      <div className="hidden md:block w-1/5 bg-gradient-to-b from-black to-gray-900 mb-4 p-5 text-white h-screen">
        <h1 className="font-bold text-2xl mb-4">MUWCI RoomScout</h1>
        <ul>
          <li><Link to="/profile">Profile</Link></li>
          <li><Link to="/settings">Settings</Link></li>
        </ul>
      </div>
      
      {/* Right content area */}
      <div className="w-full md:w-4/5 p-5 h-screen overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Available Rooms</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {rooms.map(room => (
            <div key={room} className="card bg-gray-300 rounded-lg p-4 text-center">
              <h3 className="font-bold mb-2">{room}</h3>
              <p>
                {studyingCounts[room] === 1
                  ? "1 person studying here"
                  : `${studyingCounts[room]} people studying here`}
              </p>
              <div className="flex flex-col justify-between mx-4">
                <button
                  className="mt-2 text-gray-900 font-bold px-4  rounded"
                  onClick={() => openPeopleModal(room)}
                >
                  View People
                </button>
                <button
                  className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
                  onClick={() => handleJoinOrLeaveRoom(room)}
                >
                  {isStudyingInRoom[room] ? "Leave" : "Studying Here"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal to show people in the room */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-5 rounded shadow-lg">
            <h2 className="text-xl font-bold mb-4">{selectedRoom} - People</h2>
            <ul>
              {peopleInRooms[selectedRoom]?.length ? (
                peopleInRooms[selectedRoom].map((person, index) => (
                  <li key={index} className="mb-2">{person}</li>
                ))
              ) : (
                <li>No one is currently in this room.</li>
              )}
            </ul>
            <button
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
