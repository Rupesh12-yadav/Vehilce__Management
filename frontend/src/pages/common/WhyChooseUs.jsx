import React from "react";

const WhyChooseUs = () => {
  const points = [
    { 
      title: "Affordable Pricing", 
      desc: "Get the best deals without hidden charges. Transparent pricing for everyone.",
      icon: "💰",
      color: "from-green-400 to-green-600"
    },
    { 
      title: "24/7 Support", 
      desc: "Always available for your queries and assistance. We're here to help anytime.",
      icon: "🛟",
      color: "from-blue-400 to-blue-600"
    },
    { 
      title: "Wide Range", 
      desc: "Cars, bikes, trucks, and buses to choose from. Find your perfect ride.",
      icon: "🚗",
      color: "from-purple-400 to-purple-600"
    },
    { 
      title: "Easy Booking", 
      desc: "Book vehicles in just a few clicks. Fast, simple, and convenient.",
      icon: "⚡",
      color: "from-orange-400 to-orange-600"
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 via-white to-blue-50 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-blue-200/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-200/20 rounded-full blur-3xl"></div>

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 bg-indigo-100 text-indigo-600 rounded-full text-sm font-medium mb-3">
            Why Choose Us
          </span>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose RentEase</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Experience hassle-free vehicle rentals with our premium services designed for your convenience
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {points.map((point, idx) => (
            <div 
              key={idx} 
              className="group bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 hover:-translate-y-2 text-center"
            >
              {/* Icon */}
              <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${point.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <span className="text-3xl">{point.icon}</span>
              </div>
              
              {/* Content */}
              <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                {point.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {point.desc}
              </p>
              
              {/* Learn More Link */}
              <div className="mt-4 pt-4 border-t border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-indigo-600 font-medium text-sm cursor-pointer">
                  Learn more →
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-16 bg-white rounded-3xl shadow-lg shadow-gray-100/50 p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4">
              <p className="text-3xl font-bold text-indigo-600">10K+</p>
              <p className="text-gray-500 text-sm">Happy Customers</p>
            </div>
            <div className="p-4">
              <p className="text-3xl font-bold text-green-600">500+</p>
              <p className="text-gray-500 text-sm">Vehicles</p>
            </div>
            <div className="p-4">
              <p className="text-3xl font-bold text-purple-600">50+</p>
              <p className="text-gray-500 text-sm">Cities</p>
            </div>
            <div className="p-4">
              <p className="text-3xl font-bold text-orange-600">4.9★</p>
              <p className="text-gray-500 text-sm">Rating</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;


