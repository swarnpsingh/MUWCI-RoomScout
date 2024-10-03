import React, { useState, useEffect } from 'react';

const Dashboard = ({ user }) => {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    // Determine if we're using ws:// for development or wss:// for production
    const wsProtocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const wsUrl = `${wsProtocol}://muwci-roomscout.onrender.com`;
    
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log('WebSocket connection opened');
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setRooms(prevRooms => {
        const updatedRooms = [...prevRooms];
        const roomIndex = updatedRooms.findIndex(room => room.name === data.room);

        if (roomIndex !== -1) {
          updatedRooms[roomIndex] = {
            ...updatedRooms[roomIndex],
            count: data.count,
            people: data.people,
          };
        }
        return updatedRooms;
      });
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      if (ws) ws.close();
    };
  }, []);

  const handleStudyingHere = (roomName, action) => {
    const wsProtocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const wsUrl = `${wsProtocol}://muwci-roomscout.onrender.com`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      const message = {
        room: roomName,
        action: action,
        user: user.username, // Send username with the message
      };
      ws.send(JSON.stringify(message));
    };
  };

  return (
    <div className="dashboard">
      <h2>Available Rooms</h2>
      <div className="rooms-grid">
        {rooms.map((room) => (
          <div key={room.name} className="room-card">
            <h3>{room.name}</h3>
            <p>{room.count !== undefined ? `${room.count} people studying here` : 'undefined people studying here'}</p>
            <button onClick={() => handleStudyingHere(room.name, 'join')}>
              Studying Here
            </button>
            <button onClick={() => handleStudyingHere(room.name, 'leave')}>
              Leave
            </button>
            <button onClick={() => alert(`${room.people.join(', ')}`)}>
              View People
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
