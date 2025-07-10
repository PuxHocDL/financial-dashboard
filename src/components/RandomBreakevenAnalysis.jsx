import React, { useState } from 'react';
import supabase from '../services/supabase';

const RandomBreakevenAnalysis = ({ data, fetchData }) => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [numPoints, setNumPoints] = useState(200); // Default to 200 points
  const [inputError, setInputError] = useState(null);

  const calculateBreakevenTime = (inputs) => {
    const initialInvestment = inputs.codonggopvon + inputs.vongopcsh;
    let cumulativeCashFlow = 0;
    let breakevenTime = 0;

    if (!data || !data.cashFlow || data.cashFlow.length === 0) {
      return 8;
    }

    for (let i = 0; i < data.cashFlow.length; i++) {
      const cashFlowRow = data.cashFlow[i];
      const incomeRow = data.incomeStatement?.find((row) => row.nam === cashFlowRow.nam);
      const cashFlow = cashFlowRow?.fcf || incomeRow?.loinhuansauthue || 0;
      cumulativeCashFlow += cashFlow;

      if (cumulativeCashFlow >= initialInvestment) {
        const previousCumulative = i > 0 ? cumulativeCashFlow - cashFlow : 0;
        const remaining = initialInvestment - previousCumulative;
        breakevenTime = cashFlow ? i + remaining / cashFlow : 0;
        break;
      }
    }

    return breakevenTime || 8;
  };

  const saveToCsvFile = (dataPoints) => {
    const headers = ['Point', 'Tổng đầu tư', 'Khoản vay phải trả', 'Thời gian hoàn vốn (năm)'];
    const csvRows = dataPoints.map((point, index) => 
      `${index + 1},${(point.codonggopvon + point.vongopcsh).toFixed(2)},${point.khoanvayphaitra.toFixed(2)},${point.breakevenTime.toFixed(2)}`
    );
    const csvContent = [headers.join(','), ...csvRows].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'breakeven_data.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const generateRandomData = async () => {
    // Validate input
    const points = parseInt(numPoints, 10);
    if (isNaN(points) || points <= 0) {
      setInputError('Vui lòng nhập số điểm dữ liệu lớn hơn 0');
      return;
    }
    if (points > 1000) {
      setInputError('Số điểm dữ liệu không được vượt quá 1000');
      return;
    }

    setInputError(null);
    setLoading(true);
    setProgress(0);
    const dataPoints = [];

    for (let i = 0; i < points; i++) {
      const codonggopvon = Math.random() * (1000 - 250) + 250;
      const vongopcsh = Math.random() * (1500 - 500) + 500;
      const khoanvayphaitra = Math.random() * (1500 - 250) + 250;

      try {
        const { error } = await supabase
          .from('bangcandoiketoan')
          .update({
            codonggopvon: parseFloat(codonggopvon.toFixed(2)),
            vongopcsh: parseFloat(vongopcsh.toFixed(2)),
            khoanvayphaitra: parseFloat(khoanvayphaitra.toFixed(2)),
          })
          .eq('nam', 0);

        if (error) {
          console.error('Error updating Supabase:', error);
        }

        await fetchData();
        
        const breakevenTime = calculateBreakevenTime({
          codonggopvon,
          vongopcsh,
          khoanvayphaitra,
        });

        dataPoints.push({
          totalInvestment: codonggopvon + vongopcsh,
          khoanvayphaitra,
          breakevenTime,
          codonggopvon,
          vongopcsh,
        });

      } catch (error) {
        console.error('Error in data generation:', error);
        const breakevenTime = calculateBreakevenTime({
          codonggopvon,
          vongopcsh,
          khoanvayphaitra,
        });

        dataPoints.push({
          totalInvestment: codonggopvon + vongopcsh,
          khoanvayphaitra,
          breakevenTime,
          codonggopvon,
          vongopcsh,
        });
      }

      setProgress(((i + 1) / points) * 100);
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    setChartData(dataPoints);
    saveToCsvFile(dataPoints);
    setLoading(false);
  };

  const handleGenerate = async () => {
    if (loading) return;
    
    try {
      await generateRandomData();
    } catch (error) {
      console.error('Error generating random data:', error);
      setLoading(false);
    }
  };

  const handleNumPointsChange = (e) => {
    setNumPoints(e.target.value);
    setInputError(null); // Clear error when user types
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6 border border-cyan-200 transition-all duration-300 hover:shadow-xl animate-fadeIn">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-cyan-800">
          Tạo Dữ liệu Hoàn vốn Ngẫu nhiên
        </h2>
        <div className="text-sm text-gray-600">
          {chartData.length > 0 && `${chartData.length} điểm dữ liệu`}
        </div>
      </div>
      
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">
            Số điểm dữ liệu:
          </label>
          <input
            type="number"
            value={numPoints}
            onChange={handleNumPointsChange}
            min="1"
            max="1000"
            className="w-24 px-2 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-600"
            disabled={loading}
          />
        </div>
        <button
          onClick={handleGenerate}
          disabled={loading}
          className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 ${
            loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-cyan-600 text-white hover:bg-cyan-700 transform hover:scale-105'
          }`}
        >
          {loading ? 'Đang tạo & tính toán...' : `Tạo ${numPoints} điểm dữ liệu ngẫu nhiên`}
        </button>
        
        {loading && (
          <div className="flex items-center gap-2">
            <div className="w-32 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-cyan-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <span className="text-sm text-gray-600">{Math.round(progress)}%</span>
          </div>
        )}
      </div>

      {inputError && (
        <p className="text-sm text-red-600 mb-4">{inputError}</p>
      )}

      <div className="bg-gray-50 p-4 rounded-lg mb-4">
        <h3 className="font-semibold text-gray-700 mb-2">Thông số ngẫu nhiên:</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <strong>Cổ đông góp vốn:</strong> 250 - 1000
          </div>
          <div>
            <strong>Vốn góp CSH:</strong> 500 - 1,500
          </div>
          <div>
            <strong>Khoản vay phải trả:</strong> 250 - 1,500
          </div>
        </div>
      </div>
      
      {chartData.length > 0 && (
        <div className="mt-4 text-sm text-gray-600">
          <p><strong>Lưu ý:</strong> Dữ liệu được tạo ngẫu nhiên và lưu vào file <code>breakeven_data.csv</code>.</p>
          <p>Upload file CSV vào biểu đồ 3D để xem phân tích.</p>
        </div>
      )}
    </div>
  );
};

export default RandomBreakevenAnalysis;