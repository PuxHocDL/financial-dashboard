import React from 'react';
import { AlertTriangle } from 'lucide-react';

const Error = ({ error, fetchData }) => {
  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-b from-cyan-50 to-cyan-100">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md border border-cyan-200 transform transition-all duration-300 animate-fadeIn">
        <AlertTriangle className="w-16 h-16 text-red-600 mx-auto mb-4" />
        <p className="text-xl text-cyan-800 font-medium mb-2">Đã xảy ra lỗi!</p>
        <p className="text-cyan-600 text-sm mb-4">{error}</p>
        <button
          onClick={fetchData}
          className="bg-cyan-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-cyan-700 transform hover:scale-105 transition-all duration-300 shadow-md"
        >
          Thử lại
        </button>
      </div>
    </div>
  );
};

export default Error;