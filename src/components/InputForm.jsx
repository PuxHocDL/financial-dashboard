import React from 'react';
import { Wrench } from 'lucide-react';

const InputForm = ({ inputs, handleInputChange, handleUpdate }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6 border border-cyan-200 transition-all duration-300 hover:shadow-xl group animate-fadeIn">
      <div className="flex items-center mb-4">
        <div className="flex items-center justify-center w-8 h-8 bg-cyan-50 rounded-full mr-3 group-hover:bg-cyan-100 transition-all duration-300">
          <Wrench className="w-5 h-5 text-cyan-600 group-hover:text-cyan-800 group-hover:scale-110 transition-all duration-300" />
        </div>
        <h2 className="text-xl font-bold text-cyan-800 group-hover:text-cyan-900 transition-all duration-300">
          Cập nhật giá trị ban đầu (Năm 0)
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="space-y-2">
          <label className="block text-cyan-700 font-semibold">Tài sản vô hình</label>
          <input
            type="number"
            name="ts_vohinh"
            value={inputs.ts_vohinh}
            onChange={handleInputChange}
            className="w-full p-3 border border-cyan-200 rounded-lg focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition-all duration-300 font-mono bg-cyan-50 hover:bg-cyan-100"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-cyan-700 font-semibold">Cổ đông góp vốn</label>
          <input
            type="number"
            name="codonggopvon"
            value={inputs.codonggopvon}
            onChange={handleInputChange}
            className="w-full p-3 border border-cyan-200 rounded-lg focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition-all duration-300 font-mono bg-cyan-50 hover:bg-cyan-100"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-cyan-700 font-semibold">Vốn góp CSH</label>
          <input
            type="number"
            name="vongopcsh"
            value={inputs.vongopcsh}
            onChange={handleInputChange}
            className="w-full p-3 border border-cyan-200 rounded-lg focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition-all duration-300 font-mono bg-cyan-50 hover:bg-cyan-100"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-cyan-700 font-semibold">Khoản vay phải trả</label>
          <input
            type="number"
            name="khoanvayphaitra"
            value={inputs.khoanvayphaitra}
            onChange={handleInputChange}
            className="w-full p-3 border border-cyan-200 rounded-lg focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition-all duration-300 font-mono bg-cyan-50 hover:bg-cyan-100"
          />
        </div>
      </div>
      <button
        onClick={handleUpdate}
        className="mt-4 bg-cyan-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-cyan-700 transform hover:scale-105 transition-all duration-300 shadow-md hover:shadow-xl"
      >
        💾 Cập nhật giá trị
      </button>
    </div>
  );
};

export default InputForm;