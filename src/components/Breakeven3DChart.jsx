import React, { useState, useRef, useEffect } from 'react';
import Plotly from 'plotly.js/dist/plotly.min.js';
import Papa from 'papaparse';

const Breakeven3DChart = () => {
  const [csvData, setCsvData] = useState([]);
  const [error, setError] = useState(null);
  const chartRef = useRef(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      setError('Vui lòng upload file CSV');
      return;
    }

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        const parsedData = result.data.map(row => ({
          totalInvestment: parseFloat(row['Tổng đầu tư']) || 0,
          khoanvayphaitra: parseFloat(row['Khoản vay phải trả']) || 0,
          breakevenTime: parseFloat(row['Thời gian hoàn vốn (năm)']) || 0,
        }));
        setCsvData(parsedData);
        setError(null);
      },
      error: (err) => {
        setError('Lỗi khi đọc file CSV: ' + err.message);
      },
    });
  };

  const renderChart = (dataPoints) => {
    if (!chartRef.current || dataPoints.length === 0) return;

    const plotData = [
      {
        type: 'scatter3d',
        mode: 'markers',
        x: dataPoints.map((d) => d.totalInvestment),
        y: dataPoints.map((d) => d.khoanvayphaitra),
        z: dataPoints.map((d) => d.breakevenTime),
        marker: {
          size: 4,
          color: dataPoints.map((d) => d.breakevenTime),
          colorscale: 'Viridis',
          showscale: true,
          colorbar: { 
            title: 'Thời gian hoàn vốn (Năm)',
            titleside: 'right',
            titlefont: { size: 16 },
            tickfont: { size: 12 },
          },
        },
        text: dataPoints.map((d) => 
          `Tổng đầu tư: ${d.totalInvestment.toFixed(0)}<br>` +
          `Khoản vay: ${d.khoanvayphaitra.toFixed(0)}<br>` +
          `Thời gian hoàn vốn: ${d.breakevenTime.toFixed(2)} năm`
        ),
        hovertemplate: '%{text}<extra></extra>',
      },
    ];

    const layout = {
      title: {
        text: 'Phân tích 3D Thời gian Hoàn vốn',
        font: { size: 20, color: '#0891b2' },
      },
      scene: {
        xaxis: { 
          title: {
            text: 'Tổng Đầu tư (Cổ đông + CSH)',
            font: { size: 16, color: '#0891b2' },
          },
          tickfont: { size: 12 },
          automargin: true, // Ensure title fits without clipping
        },
        yaxis: { 
          title: {
            text: 'Khoản Vay Phải Trả',
            font: { size: 16, color: '#0891b2' },
          },
          tickfont: { size: 12 },
          automargin: true,
        },
        zaxis: { 
          title: {
            text: 'Thời gian Hoàn vốn (Năm)',
            font: { size: 16, color: '#0891b2' },
          },
          tickfont: { size: 12 },
          automargin: true,
        },
        camera: {
          eye: { x: 1.8, y: 1.8, z: 1.8 },
        },
      },
      margin: { l: 20, r: 20, b: 20, t: 80 },
      paper_bgcolor: 'rgba(0,0,0,0)',
      plot_bgcolor: 'rgba(0,0,0,0)',
      autosize: true,
    };

    const config = {
      displayModeBar: true,
      responsive: true,
      displaylogo: false,
      modeBarButtonsToRemove: ['pan2d', 'lasso2d', 'select2d'],
    };

    Plotly.newPlot(chartRef.current, plotData, layout, config);
  };

  useEffect(() => {
    if (csvData.length > 0) {
      renderChart(csvData);
    }
  }, [csvData]);

  useEffect(() => {
    return () => {
      if (chartRef.current) {
        Plotly.purge(chartRef.current);
      }
    };
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6 border border-cyan-200 transition-all duration-300 hover:shadow-xl animate-fadeIn">
      <h2 className="text-2xl font-bold text-cyan-800 mb-4">
        Biểu đồ 3D Thời gian Hoàn vốn
      </h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Upload file CSV (breakeven_data.csv):
        </label>
        <input
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-cyan-600 file:text-white hover:file:bg-cyan-700"
        />
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>

      <div 
        ref={chartRef}
        className="w-full border border-gray-200 rounded-lg"
        style={{ minHeight: '600px', height: '80vh', maxHeight: '800px' }}
      />
      
      {csvData.length > 0 && (
        <div className="mt-4 text-sm text-gray-600">
          <p><strong>Ghi chú:</strong> Biểu đồ thể hiện mối quan hệ giữa tổng đầu tư, khoản vay và thời gian hoàn vốn.</p>
          <p>Màu sắc thể hiện thời gian hoàn vốn: màu tối = thời gian ngắn, màu sáng = thời gian dài.</p>
        </div>
      )}
    </div>
  );
};

export default Breakeven3DChart;