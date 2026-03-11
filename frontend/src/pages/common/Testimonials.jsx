import React from "react";

const Testimonials = () => {
  const reviews = [
    { 
      name: "Rahul Sharma", 
      comment: "Best service! Easy to book and very affordable. The team was extremely helpful throughout my rental period.",
      img: "https://randomuser.me/api/portraits/men/32.jpg",
      role: "Software Engineer",
      rating: 5
    },
    { 
      name: "Sneha Patel", 
      comment: "Amazing experience. Customer support is excellent. They resolved my issue within minutes!",
      img: "https://randomuser.me/api/portraits/women/44.jpg",
      role: "Business Owner",
      rating: 5
    },
    { 
      name: "Amit Kumar", 
      comment: "Wide range of vehicles and smooth process. Highly recommend RentEase for all your rental needs.",
      img: "https://randomuser.me/api/portraits/men/56.jpg",
      role: "Travel Blogger",
      rating: 5
    },
  ];

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <svg 
        key={i} 
        className={`w-5 h-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`} 
        fill="currentColor" 
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 via-white to-indigo-50 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-20 -left-20 w-80 h-80 bg-blue-200/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 -right-20 w-80 h-80 bg-indigo-200/20 rounded-full blur-3xl"></div>

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 bg-green-100 text-green-600 rounded-full text-sm font-medium mb-3">
            Testimonials
          </span>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Don't just take our word for it - hear from our satisfied customers across the country
          </p>
        </div>

        {/* Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev, idx) => (
            <div 
              key={idx} 
              className="group bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-2xl hover:shadow-green-500/10 transition-all duration-300 hover:-translate-y-2"
            >
              {/* Quote Icon */}
              <div className="mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                </div>
              </div>
              
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {renderStars(rev.rating)}
              </div>
              
              {/* Comment */}
              <p className="text-gray-600 mb-6 leading-relaxed">
                "{rev.comment}"
              </p>
              
              {/* User Info */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                <img 
                  src={rev.img} 
                  alt={rev.name} 
                  className="w-12 h-12 rounded-full object-cover border-2 border-green-100"
                />
                <div>
                  <h4 className="font-bold text-gray-900">{rev.name}</h4>
                  <p className="text-sm text-gray-500">{rev.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Reviews Button */}
        <div className="text-center mt-10">
          <button className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-full shadow-lg shadow-green-500/30 hover:shadow-xl hover:scale-105 transition-all">
            View All Reviews
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;


