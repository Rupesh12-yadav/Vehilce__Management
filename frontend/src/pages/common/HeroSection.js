import React from "react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="bg-blue-50 py-20">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Drive Your Dreams with RentEase</h1>
          <p className="text-gray-700 mb-6">
            Book cars, bikes, and more instantly. Affordable, reliable, and convenient vehicle rentals at your fingertips.
          </p>
          <div className="flex gap-4">
            <Link to="/driver/search" className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700">
              Browse Vehicles
            </Link>
            <Link to="/signup" className="px-6 py-3 border border-blue-600 text-blue-600 rounded hover:bg-blue-50">
              Get Started
            </Link>
          </div>
        </div>
        <div className="flex-1">
          <img
            src="https://www.rentrabbit.io/images/blog/blog_173737875_1651756346.jpg"
            alt="Hero Car"
            className="rounded-lg shadow-lg"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
