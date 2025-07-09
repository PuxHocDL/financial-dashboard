import React from 'react';
import { BarChart2 } from 'lucide-react';

const BusinessInfo = () => {
  return (
    <div className="bg-white rounded-lg p-6 mb-6 border border-cyan-200 transition-all duration-300 hover:shadow-xl group animate-fadeIn">
      <div className="flex items-center mb-3">
        <div className="flex items-center justify-center w-8 h-8 bg-cyan-50 rounded-full mr-3 group-hover:bg-cyan-100 transition-all duration-300">
          <BarChart2 className="w-5 h-5 text-cyan-600 group-hover:text-cyan-800 group-hover:scale-110 transition-all duration-300" />
        </div>
        <h3 className="text-lg font-bold text-cyan-800 group-hover:text-cyan-900 transition-all duration-300">
          Thông tin chi tiết kinh doanh
        </h3>
      </div>
      <p className="text-cyan-700 text-base leading-relaxed">
        Tổng tài sản tăng trưởng nhiều lần từ Năm 0 đến Năm 8, nhờ tích lũy tiền mặt đáng kể từ dòng tiền hoạt động, phản ánh khả năng mở rộng kinh doanh mạnh mẽ và vị thế thị trường xuất sắc.
      </p>
    </div>
  );
};

export default BusinessInfo;