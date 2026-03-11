import React from "react";

const Categories = () => {
  const categories = [
    { 
      name: "Cars", 
      img: "https://static.cdn.circlesix.co/uploads/posts/2016/10/8827c152e352b55a01002f8fcf9d58f2.jpg?width=400",
      icon: "🚗",
      count: "50+ Vehicles"
    },
    { 
      name: "Bikes", 
      img: "https://images.drivespark.com/webp/fit-in/335x250/bikes-photos/models/yamahamt15v2_1722596363.jpg",
      icon: "🏍️",
      count: "30+ Models"
    },
    { 
      name: "Trucks", 
      img: "https://www.tata.co.za/sites/southafrica/files/styles/webp/public/post/%28%20South%20Africa%20%29%20Ultra%20T14%281%29-20250207.jpg.webp?itok=nH4NSSqo",
      icon: "🚚",
      count: "20+ Options"
    },
    { 
      name: "Buses", 
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWx2BFV-0wMFrIDzL5qTewjBvHVhjDSabvWM7ZhonWEss_1qaM9b5jisTkgbDr-e8bav8&usqp=CAU",
      icon: "🚌",
      count: "15+ Types"
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-6xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-600 rounded-full text-sm font-medium mb-3">
            Browse by Category
          </span>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Vehicle Categories</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Choose from our wide range of vehicles to suit your needs - from compact cars to spacious buses
          </p>
        </div>

        {/* Category Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, idx) => (
            <div 
              key={idx} 
              className="group bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-2 cursor-pointer"
            >
              {/* Image */}
              <div className="relative h-40 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10"></div>
                <img 
                  src={cat.img} 
                  alt={cat.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 z-20 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-gray-700">
                  {cat.icon}
                </div>
              </div>
              
              {/* Content */}
              <div className="p-5 text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-sm text-gray-500">{cat.count}</p>
                
                {/* Explore Button */}
                <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="inline-flex items-center gap-1 text-blue-600 font-medium text-sm">
                    Explore 
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;


