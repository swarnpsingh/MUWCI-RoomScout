import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = ({ setUser }) => {
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://muwci-roomscout.onrender.com/auth/signup', { name, username, password });
  
      const user = res.data.user;
      console.log('User Data on Signup:', user);  // Add this to check the user data
  
      setUser(user);
      alert('User Registered');
      navigate('/dashboard');
    } catch (err) {
      console.error('Signup error:', err);
    }
  };


  return (
    <div className="relative min-h-screen bg-gradient-to-b from-black to-gray-900 overflow-hidden">
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4 text-white">Signup</h1>
        <form onSubmit={handleSignup} className="flex flex-col gap-2 mt-6">
          <input
            type="text"
            placeholder="Name"
            className="border rounded px-3 py-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Username"
            className="border rounded px-3 py-2"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="border rounded px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
            Sign Up
          </button>
        </form>
        {message && <p className="mt-4 text-white">{message}</p>}
      </div>
    </div>
    </div>
  );
};

export default Signup;
