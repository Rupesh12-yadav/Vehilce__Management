import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-10 mt-12">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-3 gap-8">
        <div>
          <h2 className="text-xl font-bold text-white mb-4">🚗 RentEase</h2>
          <p className="text-gray-400">Your trusted partner for hassle-free vehicle rentals. Reliable, affordable, and easy to book!</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li><Link to="/" className="hover:text-white">Home</Link></li>
            <li><Link to="/vehicles" className="hover:text-white">Vehicles</Link></li>
            <li><Link to="/about" className="hover:text-white">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Contact</h3>
          <p>Email: support@rentease.com</p>
          <p>Phone: +91 9876543210</p>
          <p>Location: Bhopal, MP</p>
        </div>
      </div>
      <div className="text-center text-gray-500 mt-8 border-t border-gray-700 pt-6">
        © {new Date().getFullYear()} RentEase. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
