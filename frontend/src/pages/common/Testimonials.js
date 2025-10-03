import React from "react";

const Testimonials = () => {
  const reviews = [
    { name: "Rahul", comment: "Best service! Easy to book and very affordable.", img: "https://randomuser.me/api/portraits/men/32.jpg" },
    { name: "Sneha", comment: "Amazing experience. Customer support is excellent.", img: "https://randomuser.me/api/portraits/women/44.jpg" },
    { name: "Amit", comment: "Wide range of vehicles and smooth process.", img: "https://randomuser.me/api/portraits/men/56.jpg" },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-12">What Our Customers Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((rev, idx) => (
            <div key={idx} className="bg-gray-50 rounded-lg shadow p-6 hover:shadow-lg transition">
              <img src={rev.img} alt={rev.name} className="h-16 w-16 rounded-full mx-auto mb-4" />
              <p className="text-gray-700 mb-2">"{rev.comment}"</p>
              <h4 className="font-semibold">{rev.name}</h4>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
