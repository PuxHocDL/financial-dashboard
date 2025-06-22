import React, { useState } from 'react';
import useFinancialData from '../hooks/useFinancialData';
import KeyMetrics from './KeyMetrics';
import EnhancedTable from './EnhancedTable';
import CollapsibleTable from './CollapsibleTable';
import Sidebar from './Sidebar';
import { ResponsiveContainer, LineChart, BarChart, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line, Bar, Area } from 'recharts';
import { formatNumber } from '../utils/formatNumber';
import { Menu, Loader, AlertTriangle, FileText, BarChart2, DollarSign, Banknote, Wrench, Landmark, TrendingDown, Store } from 'lucide-react';

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
  } = useFinancialData();

  const [activeTable, setActiveTable] = useState('balanceSheet');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const tables = [
    { id: 'balanceSheet', title: 'Bảng Cân Đối Kế Toán', icon: FileText },
    { id: 'balanceSheetVertical', title: 'Phân Tích Chiều Dọc', icon: BarChart2 },
    { id: 'balanceSheetHorizontal', title: 'Phân Tích Chiều Ngang', icon: BarChart2 },
    { id: 'incomeStatement', title: 'Bảng Báo Cáo KQHĐKD', icon: DollarSign },
    { id: 'cashFlow', title: 'Bảng Báo Cáo Lưu Chuyển Tiền Tệ', icon: Banknote },
    { id: 'depreciation', title: 'Bảng Khấu Hao', icon: Wrench },
    { id: 'loans', title: 'Bảng Vay', icon: Landmark },
    { id: 'wacc', title: 'WACC', icon: TrendingDown },
    { id: 'financialRatios', title: 'Chỉ Số Tài Chính', icon: BarChart2 },
    { id: 'storeCount', title: 'Số Cửa Hàng', icon: Store },
  ];

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const renderTable = () => {
    const balanceSheetAnalysis = calculateBalanceSheetAnalysis();
    const incomeStatementYoY = calculateIncomeStatementYoY();
    const financialRatios = calculateFinancialRatios();

    const tableIcons = {
      balanceSheet: FileText,
      balanceSheetVertical: BarChart2,
      balanceSheetHorizontal: BarChart2,
      incomeStatement: DollarSign,
      cashFlow: Banknote,
      depreciation: Wrench,
      loans: Landmark,
      wacc: TrendingDown,
      financialRatios: BarChart2,
      storeCount: Store,
    };

    switch (activeTable) {
      case 'balanceSheet':
        return (
          <CollapsibleTable title="Bảng Cân Đối Kế Toán" icon={tableIcons.balanceSheet}>
            <EnhancedTable
              headers={['Hạng mục', ...data.balanceSheet.map(row => `Năm ${row.nam}`)]}
              rows={[
                ['Tài Sản', ...Array(data.balanceSheet.length).fill('')],
                ['  TS Ngắn Hạn', ...data.balanceSheet.map(row => formatNumber(row.ts_nganhan))],
                ['    Tiền Mặt', ...data.balanceSheet.map(row => formatNumber(row.tienmat))],
                ['    Hàng Tồn Kho', ...data.balanceSheet.map(row => formatNumber(row.hangtonkho))],
                ['    Khoản Phải Thu', ...data.balanceSheet.map(row => formatNumber(row.khoanphaithu_cdkt))],
                ['  TS Dài Hạn', ...data.balanceSheet.map(row => formatNumber(row.ts_daihan))],
                ['    TS Vô Hình', ...data.balanceSheet.map(row => formatNumber(row.ts_vohinh))],
                ['    TS Hữu Hình (GTCL)', ...data.balanceSheet.map(row => formatNumber(row.ts_huuhinh_giatriconlai))],
                ['Tổng Tài Sản', ...data.balanceSheet.map(row => formatNumber(row.tongtaisan))],
                ['', ...Array(data.balanceSheet.length).fill('')],
                ['Nguồn Vốn', ...Array(data.balanceSheet.length).fill('')],
                ['  Vốn CSH', ...data.balanceSheet.map(row => formatNumber(row.voncsh))],
                ['    Cổ Đông Góp Vốn', ...data.balanceSheet.map(row => formatNumber(row.codonggopvon))],
                ['    Vốn Góp CSH', ...data.balanceSheet.map(row => formatNumber(row.vongopcsh))],
                ['    Lợi Nhuận ST', ...data.balanceSheet.map(row => formatNumber(row.loinhuansauthue_cdkt))],
                ['  Nợ Phải Trả', ...data.balanceSheet.map(row => formatNumber(row.nophaitra))],
                ['    Khoản Vay Phải Trả', ...data.balanceSheet.map(row => formatNumber(row.khoanvayphaitra))],
                ['Tổng Nguồn Vốn', ...data.balanceSheet.map(row => formatNumber(row.tongnguonvon))],
              ]}
            />
          </CollapsibleTable>
        );
      case 'balanceSheetVertical':
        return (
          <CollapsibleTable title="Phân Tích Theo Chiều Dọc - Bảng Cân Đối Kế Toán" icon={tableIcons.balanceSheetVertical}>
            <EnhancedTable
              headers={['Hạng mục', ...balanceSheetAnalysis.vertical.map(row => `Năm ${row.nam}`)]}
              rows={[
                ['Tài Sản', ...Array(balanceSheetAnalysis.vertical.length).fill('')],
                ['  TS Ngắn Hạn', ...balanceSheetAnalysis.vertical.map(row => formatNumber(row.ts_nganhan, true))],
                ['    Tiền Mặt', ...balanceSheetAnalysis.vertical.map(row => formatNumber(row.tienmat, true))],
                ['    Hàng Tồn Kho', ...balanceSheetAnalysis.vertical.map(row => formatNumber(row.hangtonkho, true))],
                ['    Khoản Phải Thu', ...balanceSheetAnalysis.vertical.map(row => formatNumber(row.khoanphaithu_cdkt, true))],
                ['  TS Dài Hạn', ...balanceSheetAnalysis.vertical.map(row => formatNumber(row.ts_daihan, true))],
                ['    TS Vô Hình', ...balanceSheetAnalysis.vertical.map(row => formatNumber(row.ts_vohinh, true))],
                ['    TS Hữu Hình (GTCL)', ...balanceSheetAnalysis.vertical.map(row => formatNumber(row.ts_huuhinh_giatriconlai, true))],
                ['', ...Array(balanceSheetAnalysis.vertical.length).fill('')],
                ['Nguồn Vốn', ...Array(balanceSheetAnalysis.vertical.length).fill('')],
                ['  Vốn CSH', ...balanceSheetAnalysis.vertical.map(row => formatNumber(row.voncsh, true))],
                ['    Cổ Đông Góp Vốn', ...balanceSheetAnalysis.vertical.map(row => formatNumber(row.codonggopvon, true))],
                ['    Vốn Góp CSH', ...balanceSheetAnalysis.vertical.map(row => formatNumber(row.vongopcsh, true))],
                ['    Lợi Nhuận ST', ...balanceSheetAnalysis.vertical.map(row => formatNumber(row.loinhuansauthue_cdkt, true))],
                ['  Nợ Phải Trả', ...balanceSheetAnalysis.vertical.map(row => formatNumber(row.nophaitra, true))],
                ['    Khoản Vay Phải Trả', ...balanceSheetAnalysis.vertical.map(row => formatNumber(row.khoanvayphaitra, true))],
              ]}
              isFinancial={true}
            />
          </CollapsibleTable>
        );
      case 'balanceSheetHorizontal':
        return (
          <CollapsibleTable title="Phân Tích Theo Chiều Ngang - Bảng Cân Đối Kế Toán" icon={tableIcons.balanceSheetHorizontal}>
            <EnhancedTable
              headers={['Hạng mục', ...balanceSheetAnalysis.horizontal.map(row => `Năm ${row.nam}`)]}
              rows={[
                ['Tài Sản', ...Array(balanceSheetAnalysis.horizontal.length).fill('')],
                ['  Tiền Mặt', ...balanceSheetAnalysis.horizontal.map(row => formatNumber(row.tienmat))],
                ['  TS Dài Hạn', ...balanceSheetAnalysis.horizontal.map(row => formatNumber(row.ts_daihan))],
                ['    TS Vô Hình', ...balanceSheetAnalysis.horizontal.map(row => formatNumber(row.ts_vohinh))],
                ['    TS Hữu Hình (GTCL)', ...balanceSheetAnalysis.horizontal.map(row => formatNumber(row.ts_huuhinh_giatriconlai))],
                ['Tổng Tài Sản', ...balanceSheetAnalysis.horizontal.map(row => formatNumber(row.tongtaisan))],
                ['', ...Array(balanceSheetAnalysis.horizontal.length).fill('')],
                ['Nguồn Vốn', ...Array(balanceSheetAnalysis.horizontal.length).fill('')],
                ['  Vốn CSH', ...balanceSheetAnalysis.horizontal.map(row => formatNumber(row.voncsh))],
                ['    Cổ Đông Góp Vốn', ...balanceSheetAnalysis.horizontal.map(row => formatNumber(row.codonggopvon))],
                ['    Vốn Góp CSH', ...balanceSheetAnalysis.horizontal.map(row => formatNumber(row.vongopcsh))],
                ['  Nợ Phải Trả', ...balanceSheetAnalysis.horizontal.map(row => formatNumber(row.nophaitra))],
                ['    Khoản Vay Phải Trả', ...balanceSheetAnalysis.horizontal.map(row => formatNumber(row.khoanvayphaitra))],
              ]}
              isFinancial={true}
            />
          </CollapsibleTable>
        );
      case 'incomeStatement':
        return (
          <CollapsibleTable title="Bảng Báo Cáo KQHĐKD" icon={tableIcons.incomeStatement}>
            <EnhancedTable
              headers={['Hạng mục', ...data.incomeStatement.map(row => `Năm ${row.nam}`)]}
              rows={[
                ['Số Lượng', ...incomeStatementYoY.map(row => formatNumber(row.soluong))],
                ['Giá Bán', ...incomeStatementYoY.map(row => formatNumber(row.giaban))],
                ['Doanh Thu', ...incomeStatementYoY.map(row => formatNumber(row.doanhthu))],
                ['NVL (25% DT)', ...incomeStatementYoY.map(row => formatNumber(row.nvl))],
                ['Chi Phí Khấu Hao', ...incomeStatementYoY.map(row => formatNumber(row.chiphikhauhao))],
                ['Chi Phí Lương', ...incomeStatementYoY.map(row => formatNumber(row.chiphiluong))],
                ['Tổng Chi Phí (Giá Vốn)', ...incomeStatementYoY.map(row => formatNumber(row.tongchiphi_giavon))],
                ['Lợi Nhuận Gộp (EBIT)', ...incomeStatementYoY.map(row => formatNumber(row.loinhuangop_ebit))],
                ['Chi Phí Lãi Vay', ...incomeStatementYoY.map(row => formatNumber(row.chiphilaivay))],
                ['Lợi Nhuận Trước Thuế (EBT)', ...incomeStatementYoY.map(row => formatNumber(row.loinhuantruocthue_ebt))],
                ['Thuế TNDN', ...incomeStatementYoY.map(row => formatNumber(row.thuetndn))],
                ['Lợi Nhuận Sau Thuế', ...incomeStatementYoY.map(row => formatNumber(row.loinhuansauthue))],
                ['YoY Số Lượng', ...incomeStatementYoY.map(row => formatNumber(row.yoy_soluong, true))],
                ['YoY Giá Bán', ...incomeStatementYoY.map(row => formatNumber(row.yoy_giaban, true))],
                ['YoY Doanh Thu', ...incomeStatementYoY.map(row => formatNumber(row.yoy_doanhthu, true))],
              ]}
              isFinancial={true}
            />
          </CollapsibleTable>
        );
      case 'cashFlow':
        return (
          <CollapsibleTable title="Bảng Báo Cáo Lưu Chuyển Tiền Tệ" icon={tableIcons.cashFlow}>
            <EnhancedTable
              headers={['Hạng mục', ...data.cashFlow.map(row => `Năm ${row.nam}`)]}
              rows={[
                ['Lợi Nhuận Sau Thuế', ...data.cashFlow.map(row => formatNumber(row.loinhuansauthue))],
                ['Khấu Hao', ...data.cashFlow.map(row => formatNumber(row.khauhao))],
                ['Khoản Phải Thu', ...data.cashFlow.map(row => formatNumber(row.khoanphaithu))],
                ['NVL Dự Trữ', ...data.cashFlow.map(row => formatNumber(row.nvldutru))],
                ['Khoản Phải Trả', ...data.cashFlow.map(row => formatNumber(row.khoanphaitra_lc))],
                ['Net CFO', ...data.cashFlow.map(row => formatNumber(row.net_cfo))],
                ['CFI (CAPEX)', ...data.cashFlow.map(row => formatNumber(row.cfi_capex))],
                ['Net CFI', ...data.cashFlow.map(row => formatNumber(row.net_cfi))],
                ['Vay', ...data.cashFlow.map(row => formatNumber(row.vay))],
                ['Góp Vốn', ...data.cashFlow.map(row => formatNumber(row.gopvon))],
                ['Net CFF', ...data.cashFlow.map(row => formatNumber(row.net_cff))],
                ['Tiền Mặt Thay Đổi Trong Kỳ', ...data.cashFlow.map(row => formatNumber(row.tienmatthaydoitrongky))],
                ['Tiền Mặt Đầu Kỳ', ...data.cashFlow.map(row => formatNumber(row.tienmatdauky))],
                ['Tiền Mặt Cuối Kỳ', ...data.cashFlow.map(row => formatNumber(row.tienmatcuoiky))],
                ['FCF', ...data.cashFlow.map(row => formatNumber(row.fcf))],
              ]}
              isFinancial={true}
            />
          </CollapsibleTable>
        );
      case 'depreciation':
        return (
          <CollapsibleTable title="Bảng Khấu Hao" icon={tableIcons.depreciation}>
            <EnhancedTable
              headers={['Máy', 'Nguyên Giá', 'Số Năm Sử Dụng', 'Năm Bắt Đầu']}
              rows={data.depreciation.map(row => [
                row.tenmay,
                formatNumber(row.nguyengia),
                row.sonamsudung,
                row.nambatdau,
              ])}
              isFinancial={false}
            />
          </CollapsibleTable>
        );
      case 'loans':
        return (
          <CollapsibleTable title="Bảng Vay" icon={tableIcons.loans}>
            <EnhancedTable
              headers={['Năm', 'Tiền Mặt Cuối Kỳ', 'Nhu Cầu Chi Tiêu', 'Khoản Vay', 'Lãi Suất', 'Lãi Vay', 'Dư']}
              rows={data.loans.map(row => [
                row.nam,
                formatNumber(row.tienmatcuoiky),
                formatNumber(row.nhucauchitieu),
                formatNumber(row.khoanvay),
                formatNumber(row.laisuat, true),
                formatNumber(row.laivay),
                formatNumber(row.du),
              ])}
              isFinancial={true}
            />
          </CollapsibleTable>
        );
      case 'wacc':
        return (
          <CollapsibleTable title="Chi Phí Sử Dụng Vốn Bình Quân (WACC)" icon={tableIcons.wacc}>
            <EnhancedTable
              headers={['Năm', 're', 'rd', 'Tc', 'E', 'D', 'V', 'WACC']}
              rows={data.wacc.map(row => [
                row.nam,
                formatNumber(row.re, true),
                formatNumber(row.rd, true),
                formatNumber(row.tc, true),
                formatNumber(row.e),
                formatNumber(row.d),
                formatNumber(row.v),
                formatNumber(row.wacc_value, true),
              ])}
              isFinancial={true}
            />
          </CollapsibleTable>
        );
      case 'financialRatios':
        return (
          <CollapsibleTable title="Chỉ Số Tài Chính" icon={tableIcons.financialRatios}>
            <EnhancedTable
              headers={['Chỉ Số', ...financialRatios.map(row => `Năm ${row.nam}`)]}
              rows={[
                ['ROS (LN Sau Thuế / Doanh Thu)', ...financialRatios.map(row => formatNumber(row.ros, true))],
                ['ROA (LN Sau Thuế / Tổng TS Bình Quân)', ...financialRatios.map(row => formatNumber(row.roa, true))],
                ['ROE (LN Sau Thuế / Vốn CSH Bình Quân)', ...financialRatios.map(row => formatNumber(row.roe, true))],
                ['ROI (LN Sau Thuế / Chi Phí Đầu Tư)', ...financialRatios.map(row => formatNumber(row.roi, true))],
                ['Biên Lợi Nhuận Gộp', ...financialRatios.map(row => formatNumber(row.grossMargin, true))],
              ]}
              isFinancial={true}
            />
          </CollapsibleTable>
        );
      case 'storeCount':
        return (
          <CollapsibleTable title="Số Cửa Hàng" icon={tableIcons.storeCount}>
            <EnhancedTable
              headers={['Năm', 'Số Cửa Hàng']}
              rows={data.storeCount.map(row => [
                row.nam,
                row.soluong,
              ])}
              isFinancial={false}
            />
          </CollapsibleTable>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-b from-green-50 to-green-100">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md border border-green-200 transform transition-all duration-300 animate-fadeIn">
          <Loader className="w-12 h-12 text-green-600 animate-spin mx-auto mb-4" />
          <p className="text-xl text-green-800 font-medium">Đang tải dữ liệu tài chính...</p>
          <p className="text-green-600 text-sm mt-2">Vui lòng chờ trong giây lát</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-b from-green-50 to-green-100">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md border border-green-200 transform transition-all duration-300 animate-fadeIn">
          <AlertTriangle className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <p className="text-xl text-green-800 font-medium mb-2">Đã xảy ra lỗi!</p>
          <p className="text-green-600 text-sm mb-4">{error}</p>
          <button
            onClick={fetchData}
            className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transform hover:scale-105 transition-all duration-300 shadow-md"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-b from-green-50 to-green-100">
      <Sidebar
        tables={tables}
        activeTable={activeTable}
        setActiveTable={setActiveTable}
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />
      <div className="flex-1 main-content transition-all duration-500 ease-out" style={{ marginLeft: isSidebarOpen ? '16rem' : '4rem' }}>
        <button 
          className="fixed top-4 left-4 z-20 bg-green-100 hover:bg-green-200 border border-green-300 rounded-full p-2 shadow-md transition-all duration-300 ease-out hover:scale-110 transform active:scale-95 md:hidden"
          onClick={toggleSidebar}
        >
          <Menu className="w-5 h-5 text-green-700" />
        </button>
        <div className="p-6 text-center bg-gradient-to-r from-green-100 to-green-200 rounded-b-lg shadow-lg">
          <h1 className="text-4xl font-bold text-green-800 mb-2 transition-all duration-300 animate-fadeIn">
             Business Analytics
          </h1>
          <p className="text-green-700 text-lg">
            Nền tảng phân tích tài chính toàn diện
          </p>
        </div>
        <div className="container mx-auto p-6 relative z-10">
          <KeyMetrics data={data} />
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6 border border-green-200 transition-all duration-300 hover:shadow-xl group animate-fadeIn">
            <div className="flex items-center mb-4">
              <div className="flex items-center justify-center w-8 h-8 bg-green-50 rounded-full mr-3 group-hover:bg-green-100 transition-all duration-300">
                <Wrench className="w-5 h-5 text-green-600 group-hover:text-green-800 group-hover:scale-110 transition-all duration-300" />
              </div>
              <h2 className="text-xl font-bold text-green-800 group-hover:text-green-900 transition-all duration-300">
                Cập nhật giá trị ban đầu (Năm 0)
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="block text-green-700 font-semibold">Tài sản vô hình</label>
                <input
                  type="number"
                  name="ts_vohinh"
                  value={inputs.ts_vohinh}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-green-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300 font-mono bg-green-50 hover:bg-green-100"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-green-700 font-semibold">Cổ đông góp vốn</label>
                <input
                  type="number"
                  name="codonggopvon"
                  value={inputs.codonggopvon}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-green-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300 font-mono bg-green-50 hover:bg-green-100"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-green-700 font-semibold">Vốn góp CSH</label>
                <input
                  type="number"
                  name="vongopcsh"
                  value={inputs.vongopcsh}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-green-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300 font-mono bg-green-50 hover:bg-green-100"
                />
              </div>
            </div>
            <button
              onClick={handleUpdate}
              className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transform hover:scale-105 transition-all duration-300 shadow-md hover:shadow-xl"
            >
              💾 Cập nhật giá trị
            </button>
          </div>
          <div className="bg-white rounded-lg p-6 mb-6 border border-green-200 transition-all duration-300 hover:shadow-xl group animate-fadeIn">
            <div className="flex items-center mb-3">
              <div className="flex items-center justify-center w-8 h-8 bg-green-50 rounded-full mr-3 group-hover:bg-green-100 transition-all duration-300">
                <BarChart2 className="w-5 h-5 text-green-600 group-hover:text-green-800 group-hover:scale-110 transition-all duration-300" />
              </div>
              <h3 className="text-lg font-bold text-green-800 group-hover:text-green-900 transition-all duration-300">
                Thông tin chi tiết kinh doanh
              </h3>
            </div>
            <p className="text-green-700 text-base leading-relaxed">
              Tổng tài sản tăng trưởng hơn 10 lần từ Năm 0 đến Năm 8, nhờ tích lũy tiền mặt đáng kể từ dòng tiền hoạt động, phản ánh khả năng mở rộng kinh doanh mạnh mẽ và vị thế thị trường xuất sắc.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-lg p-6 shadow-lg border border-green-200 transition-all duration-300 hover:shadow-xl group animate-fadeIn">
              <h2 className="text-lg font-bold text-green-800 mb-4 flex items-center group-hover:text-green-900 transition-all duration-300">
                <div className="flex items-center justify-center w-8 h-8 bg-green-50 rounded-full mr-3 group-hover:bg-green-100 transition-all duration-300">
                  <DollarSign className="w-5 h-5 text-green-600 group-hover:text-green-800 group-hover:scale-110 transition-all duration-300" />
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
                    stroke="#16a34a"
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
            <div className="bg-white rounded-lg p-6 shadow-lg border border-green-200 transition-all duration-300 hover:shadow-xl group animate-fadeIn">
              <h2 className="text-lg font-bold text-green-800 mb-4 flex items-center group-hover:text-green-900 transition-all duration-300">
                <div className="flex items-center justify-center w-8 h-8 bg-green-50 rounded-full mr-3 group-hover:bg-green-100 transition-all duration-300">
                  <Banknote className="w-5 h-5 text-green-600 group-hover:text-green-800 group-hover:scale-110 transition-all duration-300" />
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
                  <Bar dataKey="fcf" name="FCF" fill="#16a34a" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-lg border border-green-200 transition-all duration-300 hover:shadow-xl group animate-fadeIn">
              <h2 className="text-lg font-bold text-green-800 mb-4 flex items-center group-hover:text-green-900 transition-all duration-300">
                <div className="flex items-center justify-center w-8 h-8 bg-green-50 rounded-full mr-3 group-hover:bg-green-100 transition-all duration-300">
                  <TrendingDown className="w-5 h-5 text-green-600 group-hover:text-green-800 group-hover:scale-110 transition-all duration-300" />
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
                    stroke="#16a34a"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-lg border border-green-200 transition-all duration-300 hover:shadow-xl group animate-fadeIn">
              <h2 className="text-lg font-bold text-green-800 mb-4 flex items-center group-hover:text-green-900 transition-all duration-300">
                <div className="flex items-center justify-center w-8 h-8 bg-green-50 rounded-full mr-3 group-hover:bg-green-100 transition-all duration-300">
                  <FileText className="w-5 h-5 text-green-600 group-hover:text-green-800 group-hover:scale-110 transition-all duration-300" />
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
                    fill="#16a34a"
                    fillOpacity={0.3}
                    stroke="#16a34a"
                    strokeWidth={3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          {renderTable()}
        </div>
      </div>

      {/* Custom Styles */}
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