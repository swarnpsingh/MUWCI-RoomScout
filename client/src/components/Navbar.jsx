import React from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCodeFork } from "@fortawesome/free-solid-svg-icons"; // Import the icon

function Navbar() {
  const navigate = useNavigate(); 

  return (
    <div className="flex justify-between items-center px-4 sm:px-8 py-4 mx-auto max-w-3xl">
      <div className="text-md sm:text-2xl font-bold text-white bg-gray-600 p-2 rounded-lg">
        MUWCI RoomScout
      </div>
      <div className="flex items-center sm:gap-8 gap-4">
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => navigate("/login")}
      >
        Login
      </button>
      <FontAwesomeIcon className="sm:size-8 size-6 cursor-pointer" icon={faCodeFork} style={{ color: "#07a1e3" }} />
      </div>
    </div>
  );
}

export default Navbar;
