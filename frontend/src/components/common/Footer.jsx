import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = {
    quickLinks: [
      { name: "Home", path: "/" },
      { name: "Vehicles", path: "/driver/search" },
      { name: "About Us", path: "/about" },
      { name: "Contact", path: "/contact" }
    ],
    services: [
      { name: "Car Rental", path: "/driver/search?type=car" },
      { name: "Bike Rental", path: "/driver/search?type=bike" },
      { name: "Truck Rental", path: "/driver/search?type=truck" },
      { name: "Bus Rental", path: "/driver/search?type=bus" }
    ],
    socialLinks: [
      { name: "Facebook", icon: "facebook", color: "hover:bg-blue-600" },
      { name: "Twitter", icon: "twitter", color: "hover:bg-sky-500" },
      { name: "Instagram", icon: "instagram", color: "hover:bg-pink-600" },
      { name: "LinkedIn", icon: "linkedin", color: "hover:bg-blue-700" }
    ]
  };

  const contactInfo = [
    { icon: "email", text: "support@rentease.com", color: "blue" },
    { icon: "phone", text: "+91 9876543210", color: "green" },
    { icon: "location", text: "Bhopal, MP, India", color: "purple" }
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-300 pt-16 pb-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div className="lg:col-span-1">
            <Link to="/" className="inline-flex items-center gap-2 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                <span className="text-white text-xl">🚗</span>
              </div>
              <span className="text-2xl font-bold text-white">RentEase</span>
            </Link>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Your trusted partner for hassle-free vehicle rentals. Reliable, affordable, and easy to book!
            </p>
            <div className="flex gap-3">
              {footerSections.socialLinks.map((social, idx) => (
                <a key={idx} href="#" className={`w-10 h-10 bg-gray-700/50 rounded-xl flex items-center justify-center text-gray-400 hover:text-white transition-all ${social.color}`}>
                  <span className="sr-only">{social.name}</span>
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-3">
              {footerSections.quickLinks.map((link, idx) => (
                <li key={idx}>
                  <Link to={link.path} className="text-gray-400 hover:text-white hover:translate-x-1 transition-all inline-flex items-center gap-2">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Services</h3>
            <ul className="space-y-3">
              {footerSections.services.map((service, idx) => (
                <li key={idx}>
                  <Link to={service.path} className="text-gray-400 hover:text-white hover:translate-x-1 transition-all inline-flex items-center gap-2">
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Contact</h3>
            <ul className="space-y-4">
              {contactInfo.map((info, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className={`w-10 h-10 bg-${info.color}-500/20 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5`}>
                    <span className="sr-only">{info.icon}</span>
                  </div>
                  <span className="text-gray-400">{info.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700/50 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">© {currentYear} RentEase. All rights reserved.</p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


