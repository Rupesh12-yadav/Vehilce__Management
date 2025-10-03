import React from "react";

const WhyChooseUs = () => {
  const points = [
    { title: "Affordable Pricing", desc: "Get the best deals without hidden charges." },
    { title: "24/7 Support", desc: "Always available for your queries and assistance." },
    { title: "Wide Range", desc: "Cars, bikes, trucks, and buses to choose from." },
    { title: "Easy Booking", desc: "Book vehicles in just a few clicks." },
  ];

  return (
    <section className="py-20 bg-blue-50">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-12">Why Choose RentEase</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {points.map((point, idx) => (
            <div key={idx} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
              <h3 className="font-semibold text-lg mb-2">{point.title}</h3>
              <p className="text-gray-600">{point.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
