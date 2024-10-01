// client/components/AdminPage.jsx
import React from 'react';

const AdminPage = () => {
  // Function to reset the room counts
  const resetRoomCounts = async () => {
    try {
      const response = await fetch('https://muwci-roomscout.onrender.com/reset-counts', {
        method: 'POST',
      });
      const data = await response.json();
      alert(data.message);  // Alert success message to the admin
    } catch (error) {
      console.error('Failed to reset room counts', error);
      alert('Failed to reset room counts');
    }
  };

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-4">Admin Page</h1>
      <button
        className="bg-red-500 text-white px-4 py-2 rounded"
        onClick={resetRoomCounts}
      >
        Reset All Room Counts
      </button>
    </div>
  );
};

export default AdminPage;
