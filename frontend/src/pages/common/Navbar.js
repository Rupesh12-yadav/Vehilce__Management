import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold text-blue-600">🚗 RentEase</Link>
          <div className="hidden md:flex space-x-6">
            <Link to="/" className="hover:text-blue-600 font-medium">Home</Link>
            <Link to="/vehicles" className="hover:text-blue-600 font-medium">Vehicles</Link>
            <Link to="/about" className="hover:text-blue-600 font-medium">About</Link>
            <Link to="/contact" className="hover:text-blue-600 font-medium">Contact</Link>
          </div>
          <div className="hidden md:flex space-x-4">
            <Link to="/login" className="px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50">Login</Link>
            <Link to="/signup" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Sign Up</Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
