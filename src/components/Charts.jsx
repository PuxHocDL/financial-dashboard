import React from 'react';
import { ResponsiveContainer, LineChart, BarChart, AreaChart, PieChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line, Bar, Area, Pie, Cell, ScatterChart, Scatter, ReferenceLine } from 'recharts';
import { formatNumber } from '../utils/formatNumber';
import { DollarSign, Banknote, TrendingDown, FileText, PieChart as PieChartIcon, BarChart2 } from 'lucide-react';

const Charts = ({ data }) => {
  // Dữ liệu cho biểu đồ Pie Chart (phân bổ chi phí)
  const costDistributionData = data.chartData.length > 0 ? [
    { name: 'Nguyên vật liệu', value: data.incomeStatement[data.incomeStatement.length - 1]?.nvl || 0 },
    { name: 'Khấu hao', value: data.incomeStatement[data.incomeStatement.length - 1]?.chiphikhauhao || 0 },
    { name: 'Chi phí lương', value: data.incomeStatement[data.incomeStatement.length - 1]?.chiphiluong || 0 },
    { name: 'Lãi vay', value: data.incomeStatement[data.incomeStatement.length - 1]?.chiphilaivay || 0 },
  ].filter(item => item.value > 0) : [];

  // Dữ liệu cho biểu đồ tỷ suất lợi nhuận
  const profitabilityData = data.incomeStatement.map((row, index) => {
    const bs = data.balanceSheet.find(bs => bs.nam === row.nam);
    const prevBs = data.balanceSheet.find(bs => bs.nam === row.nam - 1);
    const avgAssets = prevBs ? (bs.tongtaisan + prevBs.tongtaisan) / 2 : bs.tongtaisan;
    const avgEquity = prevBs ? (bs.voncsh + prevBs.voncsh) / 2 : bs.voncsh;
    return {
      nam: row.nam,
      ros: row.doanhthu ? (row.loinhuansauthue / row.doanhthu) * 100 : 0,
      roa: avgAssets ? (row.loinhuansauthue / avgAssets) * 100 : 0,
      roe: avgEquity ? (row.loinhuansauthue / avgEquity) * 100 : 0,
    };
  });

  // Dữ liệu cho biểu đồ tăng trưởng YoY
  const yoyGrowthData = data.incomeStatement.map((row, index) => {
    if (index === 0) {
      return { nam: row.nam, yoy_doanhthu: 0, yoy_loinhuansauthue: 0 };
    }
    const prev = data.incomeStatement[index - 1];
    return {
      nam: row.nam,
      yoy_doanhthu: prev.doanhthu ? ((row.doanhthu - prev.doanhthu) / Math.abs(prev.doanhthu) * 100) : 0,
      yoy_loinhuansauthue: prev.loinhuansauthue ? ((row.loinhuansauthue - prev.loinhuansauthue) / Math.abs(prev.loinhuansauthue) * 100) : 0,
    };
  });

  // Dữ liệu cho biểu đồ tỷ lệ nợ
  const debtRatioData = data.balanceSheet.map(row => ({
    nam: row.nam,
    debt_to_total_capital: row.tongnguonvon ? (row.nophaitra / row.tongnguonvon) * 100 : 0,
  }));

  // Dữ liệu cho biểu đồ Scatter (FCF vs WACC)
  const fcfVsWaccData = data.chartData.map(item => ({
    nam: item.nam,
    fcf: item.fcf || 0,
    wacc: item.wacc_value * 100 || 0,
  }));

  // Dữ liệu cho biểu đồ NPV
  const npvData = data.chartData.map((item, index) => {
    const fcf = item.fcf || 0;
    const wacc = item.wacc_value || 0.11; // Giá trị mặc định nếu WACC không có
    const npv = fcf / Math.pow(1 + wacc, item.nam); // Chiết khấu FCF về giá trị hiện tại
    return {
      nam: item.nam,
      npv: npv,
      cumulative_npv: data.chartData.slice(0, index + 1).reduce((sum, curr, idx) => {
        const currFcf = curr.fcf || 0;
        const currWacc = curr.wacc_value || 0.11;
        return sum + currFcf / Math.pow(1 + currWacc, curr.nam);
      }, 0),
    };
  });

  // Dữ liệu cho phân tích độ nhạy (Sensitivity Analysis)
  const sensitivityData = data.chartData.map(item => {
    const fcf = item.fcf || 0;
    const wacc = item.wacc_value || 0.11;
    return {
      nam: item.nam,
      npv_base: fcf / Math.pow(1 + wacc, item.nam),
      npv_plus_1: fcf / Math.pow(1 + (wacc + 0.01), item.nam), // WACC + 1%
      npv_minus_1: fcf / Math.pow(1 + (wacc - 0.01), item.nam), // WACC - 1%
      npv_plus_2: fcf / Math.pow(1 + (wacc + 0.02), item.nam), // WACC + 2%
      npv_minus_2: fcf / Math.pow(1 + (wacc - 0.02), item.nam), // WACC - 2%
    };
  });

  // Ngưỡng WACC ngành (giả sử 10% là trung bình ngành, có thể thay đổi tùy theo ngành)
  const industryWacc = 10;

  // Màu sắc cho Pie Chart và các biểu đồ khác
  const COLORS = ['#0891b2', '#4b5563', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {/* Biểu đồ hiện có: Doanh thu & Lợi nhuận ròng */}
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

      {/* Biểu đồ hiện có: Dòng tiền tự do */}
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

      {/* Biểu đồ hiện có: WACC */}
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

      {/* Biểu đồ hiện có: Tổng tài sản */}
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

      {/* Biểu đồ mới: Tỷ suất lợi nhuận (ROS, ROA, ROE) */}
      <div className="bg-white rounded-lg p-6 shadow-lg border border-cyan-200 transition-all duration-300 hover:shadow-xl group animate-fadeIn">
        <h2 className="text-lg font-bold text-cyan-800 mb-4 flex items-center group-hover:text-cyan-900 transition-all duration-300">
          <div className="flex items-center justify-center w-8 h-8 bg-cyan-50 rounded-full mr-3 group-hover:bg-cyan-100 transition-all duration-300">
            <BarChart2 className="w-5 h-5 text-cyan-600 group-hover:text-cyan-800 group-hover:scale-110 transition-all duration-300" />
          </div>
          Tỷ suất lợi nhuận
        </h2>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={profitabilityData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" />
            <XAxis dataKey="nam" stroke="#4b5563" tick={{ fill: '#4b5563', fontSize: 12 }} />
            <YAxis tickFormatter={(value) => `${value}%`} stroke="#4 th5563" tick={{ fill: '#4b5563', fontSize: 12 }} />
            <Tooltip
              formatter={(value) => `${value.toFixed(2)}%`}
              contentStyle={{
                background: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              }}
            />
            <Legend wrapperStyle={{ paddingTop: '10px' }} />
            <Bar dataKey="ros" name="ROS" fill="#0891b2" radius={[4, 4, 0, 0]} />
            <Bar dataKey="roa" name="ROA" fill="#4b5563" radius={[4, 4, 0, 0]} />
            <Bar dataKey="roe" name="ROE" fill="#10b981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Biểu đồ mới: Tăng trưởng YoY Doanh thu & Lợi nhuận */}
      <div className="bg-white rounded-lg p-6 shadow-lg border border-cyan-200 transition-all duration-300 hover:shadow-xl group animate-fadeIn">
        <h2 className="text-lg font-bold text-cyan-800 mb-4 flex items-center group-hover:text-cyan-900 transition-all duration-300">
          <div className="flex items-center justify-center w-8 h-8 bg-cyan-50 rounded-full mr-3 group-hover:bg-cyan-100 transition-all duration-300">
            <LineChart className="w-5 h-5 text-cyan-600 group-hover:text-cyan-800 group-hover:scale-110 transition-all duration-300" />
          </div>
          Tăng trưởng YoY
        </h2>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={yoyGrowthData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" />
            <XAxis dataKey="nam" stroke="#4b5563" tick={{ fill: '#4b5563', fontSize: 12 }} />
            <YAxis tickFormatter={(value) => `${value}%`} stroke="#4b5563" tick={{ fill: '#4b5563', fontSize: 12 }} />
            <Tooltip
              formatter={(value) => `${value.toFixed(2)}%`}
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
              dataKey="yoy_doanhthu"
              name="Tăng trưởng Doanh thu"
              stroke="#0891b2"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="yoy_loinhuansauthue"
              name="Tăng trưởng Lợi nhuận"
              stroke="#4b5563"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Biểu đồ mới: Phân bổ chi phí (Pie Chart) */}
      <div className="bg-white rounded-lg p-6 shadow-lg border border-cyan-200 transition-all duration-300 hover:shadow-xl group animate-fadeIn">
        <h2 className="text-lg font-bold text-cyan-800 mb-4 flex items-center group-hover:text-cyan-900 transition-all duration-300">
          <div className="flex items-center justify-center w-8 h-8 bg-cyan-50 rounded-full mr-3 group-hover:bg-cyan-100 transition-all duration-300">
            <PieChartIcon className="w-5 h-5 text-cyan-600 group-hover:text-cyan-800 group-hover:scale-110 transition-all duration-300" />
          </div>
          Phân bổ chi phí
        </h2>
        <ResponsiveContainer width="100%" height={350}>
          <PieChart>
            <Pie
              data={costDistributionData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={120}
              fill="#0891b2"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
            >
              {costDistributionData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
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
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Biểu đồ mới: Tỷ lệ nợ trên tổng nguồn vốn */}
      <div className="bg-white rounded-lg p-6 shadow-lg border border-cyan-200 transition-all duration-300 hover:shadow-xl group animate-fadeIn">
        <h2 className="text-lg font-bold text-cyan-800 mb-4 flex items-center group-hover:text-cyan-900 transition-all duration-300">
          <div className="flex items-center justify-center w-8 h-8 bg-cyan-50 rounded-full mr-3 group-hover:bg-cyan-100 transition-all duration-300">
            <FileText className="w-5 h-5 text-cyan-600 group-hover:text-cyan-800 group-hover:scale-110 transition-all duration-300" />
          </div>
          Tỷ lệ nợ trên tổng nguồn vốn
        </h2>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={debtRatioData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" />
            <XAxis dataKey="nam" stroke="#4b5563" tick={{ fill: '#4b5563', fontSize: 12 }} />
            <YAxis tickFormatter={(value) => `${value}%`} stroke="#4b5563" tick={{ fill: '#4b5563', fontSize: 12 }} />
            <Tooltip
              formatter={(value) => `${value.toFixed(2)}%`}
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
              dataKey="debt_to_total_capital"
              name="Tỷ lệ nợ"
              fill="#0891b2"
              fillOpacity={0.3}
              stroke="#0891b2"
              strokeWidth={3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Biểu đồ mới: FCF vs WACC (Scatter Chart) với ngưỡng WACC ngành */}
      <div className="bg-white rounded-lg p-6 shadow-lg border border-cyan-200 transition-all duration-300 hover:shadow-xl group animate-fadeIn">
        <h2 className="text-lg font-bold text-cyan-800 mb-4 flex items-center group-hover:text-cyan-900 transition-all duration-300">
          <div className="flex items-center justify-center w-8 h-8 bg-cyan-50 rounded-full mr-3 group-hover:bg-cyan-100 transition-all duration-300">
            <TrendingDown className="w-5 h-5 text-cyan-600 group-hover:text-cyan-800 group-hover:scale-110 transition-all duration-300" />
          </div>
          FCF vs WACC
        </h2>
        <ResponsiveContainer width="100%" height={350}>
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" />
            <XAxis dataKey="wacc" name="WACC (%)" tickFormatter={(value) => `${value.toFixed(2)}%`} stroke="#4b5563" tick={{ fill: '#4b5563', fontSize: 12 }} />
            <YAxis dataKey="fcf" name="FCF" tickFormatter={(value) => formatNumber(value)} stroke="#4b5563" tick={{ fill: '#4b5563', fontSize: 12 }} />
            <Tooltip
              formatter={(value, name) => name === 'wacc' ? `${value.toFixed(2)}%` : formatNumber(value)}
              contentStyle={{
                background: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              }}
            />
            <Legend wrapperStyle={{ paddingTop: '10px' }} />
            <Scatter name="FCF vs WACC" data={fcfVsWaccData} fill="#0891b2">
              {fcfVsWaccData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Scatter>
            <ReferenceLine x={industryWacc} stroke="#ef4444" strokeDasharray="3 3" label={{ value: 'WACC Ngành', position: 'top', fill: '#ef4444', fontSize: 12 }} />
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {/* Biểu đồ mới: NPV của FCF */}
      <div className="bg-white rounded-lg p-6 shadow-lg border border-cyan-200 transition-all duration-300 hover:shadow-xl group animate-fadeIn">
        <h2 className="text-lg font-bold text-cyan-800 mb-4 flex items-center group-hover:text-cyan-900 transition-all duration-300">
          <div className="flex items-center justify-center w-8 h-8 bg-cyan-50 rounded-full mr-3 group-hover:bg-cyan-100 transition-all duration-300">
            <BarChart2 className="w-5 h-5 text-cyan-600 group-hover:text-cyan-800 group-hover:scale-110 transition-all duration-300" />
          </div>
          Giá trị hiện tại ròng (NPV) của FCF
        </h2>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={npvData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" />
            <XAxis dataKey="nam" stroke="#4b5563" tick={{ fill: '#4b5563', fontSize: 12 }} />
            <YAxis tickFormatter={(value) => formatNumber(value)} stroke="#4b5563" tick={{ fill: '#4b5563', fontSize: 12 }} />
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
            <Bar dataKey="npv" name="NPV Hàng Năm" fill="#0891b2" radius={[4, 4, 0, 0]} />
            <Bar dataKey="cumulative_npv" name="NPV Tích Lũy" fill="#4b5563" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Biểu đồ mới: Phân tích độ nhạy NPV */}
      <div className="bg-white rounded-lg p-6 shadow-lg border border-cyan-200 transition-all duration-300 hover:shadow-xl group animate-fadeIn">
        <h2 className="text-lg font-bold text-cyan-800 mb-4 flex items-center group-hover:text-cyan-900 transition-all duration-300">
          <div className="flex items-center justify-center w-8 h-8 bg-cyan-50 rounded-full mr-3 group-hover:bg-cyan-100 transition-all duration-300">
            <LineChart className="w-5 h-5 text-cyan-600 group-hover:text-cyan-800 group-hover:scale-110 transition-all duration-300" />
          </div>
          Phân tích độ nhạy NPV theo WACC
        </h2>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={sensitivityData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" />
            <XAxis dataKey="nam" stroke="#4b5563" tick={{ fill: '#4b5563', fontSize: 12 }} />
            <YAxis tickFormatter={(value) => formatNumber(value)} stroke="#4b5563" tick={{ fill: '#4b5563', fontSize: 12 }} />
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
            <Line type="monotone" dataKey="npv_base" name="NPV (WACC Cơ bản)" stroke="#0891b2" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
            <Line type="monotone" dataKey="npv_plus_1" name="NPV (WACC +1%)" stroke="#4b5563" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
            <Line type="monotone" dataKey="npv_minus_1" name="NPV (WACC -1%)" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
            <Line type="monotone" dataKey="npv_plus_2" name="NPV (WACC +2%)" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
            <Line type="monotone" dataKey="npv_minus_2" name="NPV (WACC -2%)" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Charts;