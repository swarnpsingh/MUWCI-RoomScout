import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

const Home = () => {
  const navigate = useNavigate(); 

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-black to-gray-900 overflow-x-hidden">
      <Navbar />
      <div className="flex items-center justify-center min-h-screen px-4 sm:px-0">
        <div className="text-center z-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 sm:mb-8">
            Find where your friends are studying <br />
            Fostering group studies
          </h1>
          <p className="text-gray-500 font-bold mb-4 sm:mb-8">
            Login with your MUWCI Student ID and your first name and last name's
            initial.
          </p>
          <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0 items-center justify-center">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 w-full sm:w-28 rounded"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
            <button
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 w-full sm:w-28 rounded"
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </button>
          </div>
        </div>

        {/* Ellipse at the bottom */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[150%] h-80 bg-gradient-to-b from-transparent to-blue-900 rounded-full opacity-30 blur-3xl z-0"></div>
      </div>
    </div>
  );
};

export default Home;
