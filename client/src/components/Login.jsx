import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = ({ setUser }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://muwci-roomscout.onrender.com/auth/login', { username, password });
  
      const user = res.data.user;
      console.log('User Data on Login:', user);  // Add this to check the user data
  
      setUser(user);  // Ensure the user data is being stored correctly
      alert('User logged in');
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      alert('Incorrect Username or Password');
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-black to-gray-900 overflow-hidden">
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-white">Login</h1>
        <form onSubmit={handleLogin} className="flex flex-col gap-2 mt-6">
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
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Login
          </button>
        </form>
        {message && <p className="mt-4 text-white">{message}</p>}
      </div>
    </div>
    </div>
  );
};

export default Login;
