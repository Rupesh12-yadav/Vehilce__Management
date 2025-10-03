import React from "react";

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">About DriveWise</h1>
          <p className="text-lg max-w-2xl mx-auto">
            DriveWise is a trusted vehicle rental service providing reliable and affordable vehicles for personal and business needs. Our mission is to make mobility easy and accessible for everyone.
          </p>
        </div>
      </section>

      {/* Our Mission */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            At DriveWise, we aim to deliver seamless vehicle rental experiences, offering a wide range of vehicles to suit every journey. Customer satisfaction and vehicle safety are our top priorities.
          </p>
        </div>
      </section>

      {/* Our Values */}
      <section className="bg-gray-100 dark:bg-gray-800 py-16">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-10">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-white dark:bg-gray-700 rounded-lg shadow hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-2">Reliability</h3>
              <p>We provide dependable vehicles and services that our customers can always count on.</p>
            </div>
            <div className="p-6 bg-white dark:bg-gray-700 rounded-lg shadow hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-2">Customer Focus</h3>
              <p>Our customers’ needs are at the heart of everything we do, ensuring satisfaction every time.</p>
            </div>
            <div className="p-6 bg-white dark:bg-gray-700 rounded-lg shadow hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-2">Innovation</h3>
              <p>We embrace modern technology to provide seamless booking and vehicle management solutions.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-10">Meet Our Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div>
              <img
                src="https://via.placeholder.com/150"
                alt="CEO"
                className="mx-auto rounded-full mb-4"
              />
              <h3 className="text-xl font-semibold">Ethan Carter</h3>
              <p className="text-blue-600 font-medium">CEO</p>
            </div>
            <div>
              <img
                src="https://via.placeholder.com/150"
                alt="Head of Operations"
                className="mx-auto rounded-full mb-4"
              />
              <h3 className="text-xl font-semibold">Sophia Bennett</h3>
              <p className="text-blue-600 font-medium">Head of Operations</p>
            </div>
            <div>
              <img
                src="https://via.placeholder.com/150"
                alt="CTO"
                className="mx-auto rounded-full mb-4"
              />
              <h3 className="text-xl font-semibold">Liam Harper</h3>
              <p className="text-blue-600 font-medium">CTO</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-200 dark:bg-gray-900 py-8 mt-16 text-center">
        <p className="text-gray-700 dark:text-gray-400">
          © 2025 DriveWise. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default About;
