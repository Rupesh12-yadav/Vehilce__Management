import React from 'react';

const Card = ({ children, className = '', hover = false }) => {
  const hoverClass = hover ? 'hover:shadow-lg transition-shadow' : '';
  
  return (
    <div className={`bg-white rounded-xl shadow-sm overflow-hidden ${hoverClass} ${className}`}>
      {children}
    </div>
  );
};

export default Card;


