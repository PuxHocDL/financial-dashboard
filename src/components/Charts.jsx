import React from 'react';
import { ResponsiveContainer, LineChart, BarChart, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line, Bar, Area } from 'recharts';
import { formatNumber } from '../utils/formatNumber';
import { DollarSign, Banknote, TrendingDown, FileText } from 'lucide-react';

const Charts = ({ data }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <div className="bg-white rounded-lg p-6 shadow-lg border border-cyan-200 transition-all duration-300 hover:shadow-xl group animate-fadeIn">
        <h2 className="text-lg font-bold text-cyan-800 mb-4 flex items-center group-hover:text-cyan-900 transition-all duration-300">
          <div className="flex items-center justify-center w-8 h-8 bg-cyan-50 rounded-full mr-3 group-hover:bg-cyan-100 transition-all duration-300">
            <DollarSign className="w-5 h-5 text-cyan-600 group-hover:text-cyan-800 group-hover:scale-110 transition-all duration-300" />
          </div>
          Doanh thu & Lợi nhuận ròng
        </h2>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={data.chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" />
            <XAxis dataKey="nam" stroke="#4b5563" tick={{ fill: '#4b5563', fontSize: 12 }} />
            <YAxis stroke="#4b5563" tick={{ fill: '#4b5563', fontSize: 12 }} />
            <Tooltip
              formatter={(value) => formatNumber(value)}
              contentStyle={{
                background: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              }}
            />
            <Legend wrapperStyle={{ paddingTop: '10px' }} />
            <Line
              type="monotone"
              dataKey="doanhthu"
              name="Doanh thu"
              stroke="#0891b2"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="loinhuansauthue"
              name="Lợi nhuận ròng"
              stroke="#4b5563"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="bg-white rounded-lg p-6 shadow-lg border border-cyan-200 transition-all duration-300 hover:shadow-xl group animate-fadeIn">
        <h2 className="text-lg font-bold text-cyan-800 mb-4 flex items-center group-hover:text-cyan-900 transition-all duration-300">
          <div className="flex items-center justify-center w-8 h-8 bg-cyan-50 rounded-full mr-3 group-hover:bg-cyan-100 transition-all duration-300">
            <Banknote className="w-5 h-5 text-cyan-600 group-hover:text-cyan-800 group-hover:scale-110 transition-all duration-300" />
          </div>
          Dòng tiền tự do
        </h2>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data.chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" />
            <XAxis dataKey="nam" stroke="#4b5563" tick={{ fill: '#4b5563', fontSize: 12 }} />
            <YAxis stroke="#4b5563" tick={{ fill: '#4b5563', fontSize: 12 }} />
            <Tooltip
              formatter={(value) => formatNumber(value)}
              contentStyle={{
                background: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              }}
            />
            <Legend wrapperStyle={{ paddingTop: '10px' }} />
            <Bar dataKey="fcf" name="FCF" fill="#0891b2" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="bg-white rounded-lg p-6 shadow-lg border border-cyan-200 transition-all duration-300 hover:shadow-xl group animate-fadeIn">
        <h2 className="text-lg font-bold text-cyan-800 mb-4 flex items-center group-hover:text-cyan-900 transition-all duration-300">
          <div className="flex items-center justify-center w-8 h-8 bg-cyan-50 rounded-full mr-3 group-hover:bg-cyan-100 transition-all duration-300">
            <TrendingDown className="w-5 h-5 text-cyan-600 group-hover:text-cyan-800 group-hover:scale-110 transition-all duration-300" />
          </div>
          WACC
        </h2>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={data.chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" />
            <XAxis dataKey="nam" stroke="#4b5563" tick={{ fill: '#4b5563', fontSize: 12 }} />
            <YAxis tickFormatter={(value) => formatNumber(value, true)} stroke="#4b5563" tick={{ fill: '#4b5563', fontSize: 12 }} />
            <Tooltip
              formatter={(value) => formatNumber(value, true)}
              contentStyle={{
                background: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              }}
            />
            <Legend wrapperStyle={{ paddingTop: '10px' }} />
            <Line
              type="monotone"
              dataKey="wacc_value"
              name="WACC"
              stroke="#0891b2"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="bg-white rounded-lg p-6 shadow-lg border border-cyan-200 transition-all duration-300 hover:shadow-xl group animate-fadeIn">
        <h2 className="text-lg font-bold text-cyan-800 mb-4 flex items-center group-hover:text-cyan-900 transition-all duration-300">
          <div className="flex items-center justify-center w-8 h-8 bg-cyan-50 rounded-full mr-3 group-hover:bg-cyan-100 transition-all duration-300">
            <FileText className="w-5 h-5 text-cyan-600 group-hover:text-cyan-800 group-hover:scale-110 transition-all duration-300" />
          </div>
          Tổng tài sản
        </h2>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={data.chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" />
            <XAxis dataKey="nam" stroke="#4b5563" tick={{ fill: '#4b5563', fontSize: 12 }} />
            <YAxis stroke="#4b5563" tick={{ fill: '#4b5563', fontSize: 12 }} />
            <Tooltip
              formatter={(value) => formatNumber(value)}
              contentStyle={{
                background: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              }}
            />
            <Legend wrapperStyle={{ paddingTop: '10px' }} />
            <Area
              type="monotone"
              dataKey="tongtaisan"
              name="Tổng tài sản"
              fill="#0891b2"
              fillOpacity={0.3}
              stroke="#0891b2"
              strokeWidth={3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Charts;