import React, { useState } from 'react';
import useFinancialData from '../hooks/useFinancialData';
import Sidebar from './Sidebar';
import Header from './Header';
import InputForm from './InputForm';
import BusinessInfo from './BusinessInfo';
import Charts from './Charts';
import Tables from './Tables';
import RandomBreakevenAnalysis from './RandomBreakevenAnalysis';
import Breakeven3DChart from './Breakeven3DChart';
import Loading from './Loading';
import Error from './Error';
import {
  FileText,
  Columns,
  Rows,
  ReceiptText,
  BarChart4,
  BarChartHorizontal,
  LineChart,
  Waves,
  Construction,
  Banknote,
  TrendingDown,
  PieChart,
  Building2,
  Menu,
} from 'lucide-react';

const App = () => {
  const {
    data,
    inputs,
    loading,
    error,
    fetchData,
    handleInputChange,
    handleUpdate,
    calculateBalanceSheetAnalysis,
    calculateIncomeStatementYoY,
    calculateFinancialRatios,
    calculateDCFAnalysis,
    calculateIncomeStatementVerticalAnalysis,
    calculateIncomeStatementHorizontalAnalysis,
  } = useFinancialData();

  const [activeTable, setActiveTable] = useState('balanceSheet');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const tables = [
    { id: 'balanceSheet', title: 'Bảng Cân Đối Kế Toán', icon: FileText },
    { id: 'balanceSheetVertical', title: 'Phân Tích Chiều Dọc', icon: Columns },
    { id: 'balanceSheetHorizontal', title: 'Phân Tích Chiều Ngang', icon: Rows },
    { id: 'incomeStatement', title: 'Bảng Báo Cáo KQHĐKD', icon: ReceiptText },
    { id: 'incomeStatementHorizontal', title: 'Phân Tích Ngang KQHĐKD', icon: BarChartHorizontal },
    { id: 'incomeStatementYoYExtended', title: 'Phân Tích YoY KQHĐKD', icon: LineChart },
    { id: 'incomeStatementVertical', title: 'Phân Tích Dọc KQHĐKD', icon: BarChart4 },
    { id: 'cashFlow', title: 'Bảng Báo Cáo Lưu Chuyển Tiền Tệ', icon: Waves },
    { id: 'depreciation', title: 'Bảng Khấu Hao', icon: Construction },
    { id: 'loans', title: 'Bảng Vay', icon: Banknote },
    { id: 'wacc', title: 'WACC', icon: TrendingDown },
    { id: 'storeCount', title: 'Số Cửa Hàng', icon: Building2 },
  ];

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-b from-cyan-50 to-cyan-100">
      <Sidebar
        tables={tables}
        activeTable={activeTable}
        setActiveTable={setActiveTable}
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />
      <div
        className="flex-1 main-content transition-all duration-500 ease-out"
        style={{ marginLeft: isSidebarOpen ? '16rem' : '4rem' }}
      >
        <button
          className="fixed top-4 left-4 z-20 bg-cyan-100 hover:bg-cyan-200 border border-cyan-300 rounded-full p-2 shadow-md transition-all duration-300 ease-out hover:scale-110 transform active:scale-95 md:hidden"
          onClick={toggleSidebar}
        >
          <Menu className="w-5 h-5 text-cyan-700" />
        </button>
        <div className="container mx-auto p-6 relative z-10">
          {loading ? (
            <Loading />
          ) : error ? (
            <Error error={error} fetchData={fetchData} />
          ) : (
            <>
              <Header />
              <InputForm inputs={inputs} handleInputChange={handleInputChange} handleUpdate={handleUpdate} />
              <BusinessInfo />
              <Charts data={data} />
              <RandomBreakevenAnalysis data={data} fetchData={fetchData} />
              <Breakeven3DChart />
              <Tables
                data={data}
                calculateBalanceSheetAnalysis={calculateBalanceSheetAnalysis}
                calculateIncomeStatementYoY={calculateIncomeStatementYoY}
                calculateFinancialRatios={calculateFinancialRatios}
                calculateDCFAnalysis={calculateDCFAnalysis}
                calculateIncomeStatementVerticalAnalysis={calculateIncomeStatementVerticalAnalysis}
                calculateIncomeStatementHorizontalAnalysis={calculateIncomeStatementHorizontalAnalysis}
                activeTable={activeTable}
              />
            </>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default App;