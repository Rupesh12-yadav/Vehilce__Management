import React from "react";
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';
import HeroSection from '../common/HeroSection';
import Categories from '../common/Categories';
import WhyChooseUs from '../common/WhyChooseUs';
import Testimonials from '../common/Testimonials';

const Home = () => {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <Categories />
      <WhyChooseUs />
      <Testimonials />
      <Footer />
    </div>
  );
};

export default Home;


