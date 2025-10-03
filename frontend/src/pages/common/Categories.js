import React from "react";

const Categories = () => {
  const categories = [
    { name: "Cars", img: "https://static.cdn.circlesix.co/uploads/posts/2016/10/8827c152e352b55a01002f8fcf9d58f2.jpg?width=400" },
    { name: "Bikes", img: "https://images.drivespark.com/webp/fit-in/335x250/bikes-photos/models/yamahamt15v2_1722596363.jpg" },
    { name: "Trucks", img: "https://www.tata.co.za/sites/southafrica/files/styles/webp/public/post/%28%20South%20Africa%20%29%20Ultra%20T14%281%29-20250207.jpg.webp?itok=nH4NSSqo" },
    { name: "Buses", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWx2BFV-0wMFrIDzL5qTewjBvHVhjDSabvWM7ZhonWEss_1qaM9b5jisTkgbDr-e8bav8&usqp=CAU" },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Vehicle Categories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {categories.map((cat, idx) => (
            <div key={idx} className="bg-gray-50 rounded-lg shadow hover:shadow-lg transition p-4 text-center">
              <img src={cat.img} alt={cat.name} className="h-32 w-full object-cover rounded mb-4" />
              <h3 className="font-semibold text-lg">{cat.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
