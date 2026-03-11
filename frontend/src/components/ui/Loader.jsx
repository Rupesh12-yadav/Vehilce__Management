import React from 'react';

const Loader = ({ size = 'md', text = 'Loading...', fullScreen = false, color = 'orange' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8 border-2',
    md: 'w-16 h-16 border-4',
    lg: 'w-24 h-24 border-4'
  };

  const colorClasses = {
    orange: 'border-orange-500',
    blue: 'border-blue-500',
    green: 'border-green-500',
    purple: 'border-purple-500'
  };

  const loaderClasses = `${sizeClasses[size]} ${colorClasses[color]} border-t-transparent rounded-full animate-spin`;

  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center">
          <div className={`${loaderClasses} mx-auto mb-4`}></div>
          <p className="text-gray-600 font-medium">{text}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className={`${loaderClasses} mb-3`}></div>
      <p className="text-gray-600 font-medium text-sm">{text}</p>
    </div>
  );
};

export default Loader;


