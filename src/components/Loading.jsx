import React from 'react';
import { Loader } from 'lucide-react';

const Loading = () => {
  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-b from-cyan-50 to-cyan-100">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md border border-cyan-200 transform transition-all duration-300 animate-fadeIn">
        <Loader className="w-12 h-12 text-cyan-600 animate-spin mx-auto mb-4" />
        <p className="text-xl text-cyan-800 font-medium">Đang tải dữ liệu tài chính...</p>
        <p className="text-cyan-600 text-sm mt-2">Vui lòng chờ trong giây lát</p>
      </div>
    </div>
  );
};

export default Loading;