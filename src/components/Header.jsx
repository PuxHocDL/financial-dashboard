import React from 'react';

const Header = () => {
  return (
    <div className="relative p-8 text-center bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl shadow-2xl overflow-hidden">
      {/* Background overlay for depth */}
      <div className="absolute inset-0 bg-black opacity-10"></div>
      
      {/* Content */}
      <div className="relative z-10">
        <h1 className="text-5xl font-extrabold text-white mb-3 transition-transform duration-500 ease-out transform hover:scale-105 animate-slideIn">
          Business Analytics
        </h1>
        <p className="text-cyan-100 text-xl font-medium tracking-wide">
          Nền tảng phân tích tài chính toàn diện
        </p>
      </div>
      
      {/* Decorative bottom border */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-300 to-blue-400"></div>
    </div>
  );
};

export default Header;