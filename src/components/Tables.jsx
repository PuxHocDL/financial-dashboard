import React from 'react';
import CollapsibleTable from './CollapsibleTable';
import EnhancedTable from './EnhancedTable';
import { formatNumber } from '../utils/formatNumber';
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
  Landmark,
  TrendingDown,
  PieChart,
  Building2,
} from "lucide-react";

const Tables = ({ data, calculateBalanceSheetAnalysis, calculateIncomeStatementYoY, calculateFinancialRatios, calculateDCFAnalysis, calculateIncomeStatementVerticalAnalysis, calculateIncomeStatementHorizontalAnalysis, activeTable }) => {
  const tableIcons = {
  balanceSheet: FileText,                   // Bảng cân đối kế toán
  balanceSheetVertical: Columns,            // Biểu đồ dọc
  balanceSheetHorizontal: Rows,             // Biểu đồ ngang
  incomeStatement: ReceiptText,             // Báo cáo kết quả kinh doanh
  incomeStatementVertical: BarChart4,       // Dạng dọc
  incomeStatementHorizontal: BarChartHorizontal, // Dạng ngang
  incomeStatementYoYExtended: LineChart,    // Dạng YoY mở rộng
  cashFlow: Waves,                          // Lưu chuyển tiền tệ
  depreciation: Construction,               // Khấu hao (máy móc, thiết bị)
  loans: Banknote,                          // Khoản vay
  wacc: TrendingDown,                       // Chi phí vốn (WACC)
  financialRatios: PieChart,                // Các chỉ số tài chính
  storeCount: Building2,                    // Số lượng cửa hàng
};

  const highlightRows = [
    'TS Ngắn Hạn',
    'TS Dài Hạn',
    'Nợ Phải Trả',
    'Tổng Tài Sản',
    'Tổng Nguồn Vốn',
    'Vốn CSH',
    'Doanh Thu',
    'Tổng Chi Phí (Giá Vốn)',
    'Net CFO',
    'Net CFI',
    'Net CFF',
    'FCF = CFO - Capex ( Tiền mặt khả dụng)',
    'DCF',
    'NPV',
    'ROA',
    'ROE', 
    'ROS (LN Sau Thuế / Doanh Thu)',
    'ROA (LN Sau Thuế / Tổng TS Bình Quân)',
    'ROE (LN Sau Thuế / Vốn CSH Bình Quân)',
    'ROI (LN Sau Thuế / Chi Phí Đầu Tư)',
    'Biên Lợi Nhuận Gộp',
    'Máy 1',
    'Máy 2',
    'Máy 3',
    'Máy 4',
    'Máy 5',
    'Máy 6',
    'Máy 7',
    'Lợi Nhuận Sau Thuế',
  ];

  const renderTable = () => {
    const balanceSheetAnalysis = calculateBalanceSheetAnalysis();
    const incomeStatementYoY = calculateIncomeStatementYoY();
    const financialRatios = calculateFinancialRatios();
    const dcfAnalysis = calculateDCFAnalysis();
    const incomeStatementVertical = calculateIncomeStatementVerticalAnalysis();
    const incomeStatementHorizontal = calculateIncomeStatementHorizontalAnalysis();

    // Tính toán khấu hao và giá trị còn lại cho mỗi máy
    const depreciationRows = data.depreciation.map(machine => {
      const yearlyDepreciation = machine.nguyengia / machine.sonamsudung;
      const row = [machine.tenmay, formatNumber(machine.nguyengia), machine.sonamsudung];
      const remainingRow = ['', '', 'Còn lại'];
      for (let year = 1; year <= 9; year++) {
        const yearIndex = year - machine.nambatdau;
        if (yearIndex >= 0 && yearIndex < machine.sonamsudung) {
          row.push(formatNumber(yearlyDepreciation));
          remainingRow.push(formatNumber(machine.nguyengia - (yearIndex + 1) * yearlyDepreciation));
        } else {
          row.push('');
          remainingRow.push('');
        }
      }
      return [row, remainingRow];
    }).flat();

    // Tính tổng khấu hao, nguyên giá tổng, và giá trị còn lại
    const totalDepreciation = Array(9).fill(0);
    const totalOriginalCost = Array(9).fill(0);
    const totalRemainingValue = Array(9).fill(0);

    data.depreciation.forEach(machine => {
      const yearlyDepreciation = machine.nguyengia / machine.sonamsudung;
      for (let year = 1; year <= 9; year++) {
        const yearIndex = year - machine.nambatdau;
        if (yearIndex >= 0 && yearIndex < machine.sonamsudung) {
          totalDepreciation[year - 1] += yearlyDepreciation;
          totalOriginalCost[year - 1] += machine.nguyengia;
          totalRemainingValue[year - 1] += machine.nguyengia - (yearIndex + 1) * yearlyDepreciation;
        }
      }
    });

    const totalDepreciationRow = ['Tổng Khấu Hao', '', '', ...totalDepreciation.map(val => formatNumber(val))];
    const totalOriginalCostRow = ['Nguyên Giá Tổng', '', '', ...totalOriginalCost.map(val => formatNumber(val))];
    const totalRemainingValueRow = ['Giá Trị Còn Lại', '', '', ...totalRemainingValue.map(val => formatNumber(val))];


    switch (activeTable) {
      case 'balanceSheet':
        return (
          <CollapsibleTable title="Bảng Cân Đối Kế Toán" icon={tableIcons.balanceSheet}>
            <EnhancedTable
              headers={['Hạng mục', ...data.balanceSheet.map(row => `Năm ${row.nam}`)]}
              rows={[
                ['Tài Sản', ...Array(data.balanceSheet.length).fill('')],
                ['TS Ngắn Hạn', ...data.balanceSheet.map(row => formatNumber(row.ts_nganhan))],
                ['Tiền Mặt', ...data.balanceSheet.map(row => formatNumber(row.tienmat))],
                ['Hàng Tồn Kho', ...data.balanceSheet.map(row => formatNumber(row.hangtonkho))],
                ['Khoản Phải Thu', ...data.balanceSheet.map(row => formatNumber(row.khoanphaithu_cdkt))],
                ['TS Dài Hạn', ...data.balanceSheet.map(row => formatNumber(row.ts_daihan))],
                ['TS Vô Hình', ...data.balanceSheet.map(row => formatNumber(row.ts_vohinh))],
                ['TS Hữu Hình (GTCL)', ...data.balanceSheet.map(row => formatNumber(row.ts_huuhinh_giatriconlai))],
                ['Tổng Tài Sản', ...data.balanceSheet.map(row => formatNumber(row.tongtaisan))],
                ['', ...Array(data.balanceSheet.length).fill('')],
                ['Nguồn Vốn', ...Array(data.balanceSheet.length).fill('')],
                ['Vốn CSH', ...data.balanceSheet.map(row => formatNumber(row.voncsh))],
                ['Cổ Đông Góp Vốn', ...data.balanceSheet.map(row => formatNumber(row.codonggopvon))],
                ['Vốn Góp CSH', ...data.balanceSheet.map(row => formatNumber(row.vongopcsh))],
                ['Lợi Nhuận ST', ...data.balanceSheet.map(row => formatNumber(row.loinhuansauthue_cdkt))],
                ['Nợ Phải Trả', ...data.balanceSheet.map(row => formatNumber(row.nophaitra))],
                ['Khoản Vay Phải Trả', ...data.balanceSheet.map(row => formatNumber(row.khoanvayphaitra))],
                ['Tổng Nguồn Vốn', ...data.balanceSheet.map(row => formatNumber(row.tongnguonvon))],
              ]}
              highlightRows={highlightRows}
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
                ['TS Ngắn Hạn', ...balanceSheetAnalysis.vertical.map(row => formatNumber(row.ts_nganhan, true))],
                ['Tiền Mặt', ...balanceSheetAnalysis.vertical.map(row => formatNumber(row.tienmat, true))],
                ['Hàng Tồn Kho', ...balanceSheetAnalysis.vertical.map(row => formatNumber(row.hangtonkho, true))],
                ['Khoản Phải Thu', ...balanceSheetAnalysis.vertical.map(row => formatNumber(row.khoanphaithu_cdkt, true))],
                ['TS Dài Hạn', ...balanceSheetAnalysis.vertical.map(row => formatNumber(row.ts_daihan, true))],
                ['TS Vô Hình', ...balanceSheetAnalysis.vertical.map(row => formatNumber(row.ts_vohinh, true))],
                ['TS Hữu Hình (GTCL)', ...balanceSheetAnalysis.vertical.map(row => formatNumber(row.ts_huuhinh_giatriconlai, true))],
                ['', ...Array(balanceSheetAnalysis.vertical.length).fill('')],
                ['Nguồn Vốn', ...Array(balanceSheetAnalysis.vertical.length).fill('')],
                ['Vốn CSH', ...balanceSheetAnalysis.vertical.map(row => formatNumber(row.voncsh, true))],
                ['Cổ Đông Góp Vốn', ...balanceSheetAnalysis.vertical.map(row => formatNumber(row.codonggopvon, true))],
                ['Vốn Góp CSH', ...balanceSheetAnalysis.vertical.map(row => formatNumber(row.vongopcsh, true))],
                ['Lợi Nhuận ST', ...balanceSheetAnalysis.vertical.map(row => formatNumber(row.loinhuansauthue_cdkt, true))],
                ['Nợ Phải Trả', ...balanceSheetAnalysis.vertical.map(row => formatNumber(row.nophaitra, true))],
                ['Khoản Vay Phải Trả', ...balanceSheetAnalysis.vertical.map(row => formatNumber(row.khoanvayphaitra, true))],
              ]}
              highlightRows={highlightRows}
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
                ['TS Ngắn Hạn', ...balanceSheetAnalysis.horizontal.map(row => formatNumber(row.ts_nganhan, true))],
                ['Tiền Mặt', ...balanceSheetAnalysis.horizontal.map(row => formatNumber(row.tienmat, true))],
                ['Hàng Tồn Kho', ...balanceSheetAnalysis.horizontal.map(row => formatNumber(row.hangtonkho, true))],
                ['Khoản Phải Thu', ...balanceSheetAnalysis.horizontal.map(row => formatNumber(row.khoanphaithu_cdkt, true))],
                ['TS Dài Hạn', ...balanceSheetAnalysis.horizontal.map(row => formatNumber(row.ts_daihan, true))],
                ['TS Vô Hình', ...balanceSheetAnalysis.horizontal.map(row => formatNumber(row.ts_vohinh, true))],
                ['TS Hữu Hình (GTCL)', ...balanceSheetAnalysis.horizontal.map(row => formatNumber(row.ts_huuhinh_giatriconlai, true))],
                ['Nguyên Giá', ...balanceSheetAnalysis.horizontal.map(row => formatNumber(row.nguyengia_tshh, true))],
                ['Khấu Hao Lũy Kế', ...balanceSheetAnalysis.horizontal.map(row => formatNumber(row.khauhaoluyke_tshh, true))],
                ['Tổng Tài Sản', ...balanceSheetAnalysis.horizontal.map(row => formatNumber(row.tongtaisan, true))],
                ['', ...Array(balanceSheetAnalysis.horizontal.length).fill('')],
                ['Nguồn Vốn', ...Array(balanceSheetAnalysis.horizontal.length).fill('')],
                ['Vốn CSH', ...balanceSheetAnalysis.horizontal.map(row => formatNumber(row.voncsh, true))],
                ['Cổ Đông Góp Vốn', ...balanceSheetAnalysis.horizontal.map(row => formatNumber(row.codonggopvon, true))],
                ['Vốn Góp CSH', ...balanceSheetAnalysis.horizontal.map(row => formatNumber(row.vongopcsh, true))],
                ['Lợi Nhuận ST', ...balanceSheetAnalysis.horizontal.map(row => formatNumber(row.loinhuansauthue_cdkt, true))],
                ['Nợ Phải Trả', ...balanceSheetAnalysis.horizontal.map(row => formatNumber(row.nophaitra, true))],
                ['Khoản Vay Phải Trả', ...balanceSheetAnalysis.horizontal.map(row => formatNumber(row.khoanvayphaitra, true))],
                ['Khoản Vay Trả Nhà Cung Ứng', ...balanceSheetAnalysis.horizontal.map(row => formatNumber(row.khoanvaymuanvl, true))],
                ['Tổng Nguồn Vốn', ...balanceSheetAnalysis.horizontal.map(row => formatNumber(row.tongnguonvon, true))],
              ]}
              highlightRows={highlightRows}
              isFinancial={true}
            />
          </CollapsibleTable>
        );
    case 'incomeStatementVertical':
        return (
          <CollapsibleTable title="Phân Tích So Sánh Dọc (So Với Doanh Thu)" icon={tableIcons.incomeStatementVertical}>
            <EnhancedTable
              headers={['Chỉ Số', ...incomeStatementVertical.map(row => `Năm ${row.nam}`)]}
              rows={[
                ['Doanh Thu', ...incomeStatementVertical.map(row => formatNumber(row.doanhthu, true))],
                ['NVL (25% DT)', ...incomeStatementVertical.map(row => formatNumber(row.nvl, true))],
                ['Chi Phí Khấu Hao', ...incomeStatementVertical.map(row => formatNumber(row.chiphikhauhao, true))],
                ['Chi Phí Lương', ...incomeStatementVertical.map(row => formatNumber(row.chiphiluong, true))],
                ['Tổng Chi Phí (Giá Vốn)', ...incomeStatementVertical.map(row => formatNumber(row.tongchiphi_giavon, true))],
                ['Lợi Nhuận Gộp (EBIT)', ...incomeStatementVertical.map(row => formatNumber(row.loinhuangop_ebit, true))],
                ['Chi Phí Lãi Vay', ...incomeStatementVertical.map(row => formatNumber(row.chiphilaivay, true))],
                ['Lợi Nhuận Trước Thuế (EBT)', ...incomeStatementVertical.map(row => formatNumber(row.loinhuantruocthue_ebt, true))],
                ['Thuế TNDN', ...incomeStatementVertical.map(row => formatNumber(row.thuetndn, true))],
                ['Lợi Nhuận Sau Thuế', ...incomeStatementVertical.map(row => formatNumber(row.loinhuansauthue, true))],
                ['ROS (LN Sau Thuế / Doanh Thu)', ...incomeStatementVertical.map(row => formatNumber(row.ros, true))],
                ['ROA (LN Sau Thuế / Tổng TS Bình Quân)', ...incomeStatementVertical.map(row => formatNumber(row.roa, true))],
                ['ROE (LN Sau Thuế / Vốn CSH Bình Quân)', ...incomeStatementVertical.map(row => formatNumber(row.roe, true))],
                ['ROI (LN Sau Thuế / Chi Phí Đầu Tư)', ...incomeStatementVertical.map(row => formatNumber(row.roi, true))],
                ['Biên Lợi Nhuận Gộp', ...incomeStatementVertical.map(row => formatNumber(row.grossMargin, true))],
                ['Doanh Thu Hòa Vốn', ...incomeStatementVertical.map(row => formatNumber(row.breakevenRevenue))],
                ['TG Hòa Vốn', ...incomeStatementVertical.map(row => formatNumber(row.breakevenTime))],
              ]}
              highlightRows={highlightRows}
              isFinancial={true}
            />
          </CollapsibleTable>
        );
      case 'incomeStatementHorizontal':
        return (
          <CollapsibleTable title="Phân Tích So Sánh Năm Gốc (Năm 1)" icon={tableIcons.incomeStatementHorizontal}>
            <EnhancedTable
              headers={['Chỉ Số', ...incomeStatementHorizontal.filter(row => row.nam >= 1).map(row => `Năm ${row.nam}`)]}
              rows={[
                ['Doanh Thu', ...incomeStatementHorizontal.filter(row => row.nam >= 1).map(row => formatNumber(row.doanhthu, true))],
                ['NVL (25% DT)', ...incomeStatementHorizontal.filter(row => row.nam >= 1).map(row => formatNumber(row.nvl, true))],
                ['Chi Phí Khấu Hao', ...incomeStatementHorizontal.filter(row => row.nam >= 1).map(row => formatNumber(row.chiphikhauhao, true))],
                ['Chi Phí Lương', ...incomeStatementHorizontal.filter(row => row.nam >= 1).map(row => formatNumber(row.chiphiluong, true))],
                ['Tổng Chi Phí (Giá Vốn)', ...incomeStatementHorizontal.filter(row => row.nam >= 1).map(row => formatNumber(row.tongchiphi_giavon, true))],
                ['Lợi Nhuận Gộp (EBIT)', ...incomeStatementHorizontal.filter(row => row.nam >= 1).map(row => formatNumber(row.loinhuangop_ebit, true))],
                ['Chi Phí Lãi Vay', ...incomeStatementHorizontal.filter(row => row.nam >= 1).map(row => formatNumber(row.chiphilaivay, true))],
                ['Lợi Nhuận Trước Thuế (EBT)', ...incomeStatementHorizontal.filter(row => row.nam >= 1).map(row => formatNumber(row.loinhuantruocthue_ebt, true))],
                ['Thuế TNDN', ...incomeStatementHorizontal.filter(row => row.nam >= 1).map(row => formatNumber(row.thuetndn, true))],
                ['Lợi Nhuận Sau Thuế', ...incomeStatementHorizontal.filter(row => row.nam >= 1).map(row => formatNumber(row.loinhuansauthue, true))],
              ]}
              highlightRows={highlightRows}
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
              ]}
              highlightRows={highlightRows}
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
                ['CFI', ...data.cashFlow.map(row => formatNumber(row.cfi_capex))],
                ['CAPEX', ...data.cashFlow.map(row => formatNumber(row.cfi_capex))],
                ['Net CFI', ...data.cashFlow.map(row => formatNumber(row.net_cfi))],
                ['Vay', ...data.cashFlow.map(row => formatNumber(row.vay))],
                ['Góp Vốn', ...data.cashFlow.map(row => formatNumber(row.gopvon))],
                ['Net CFF', ...data.cashFlow.map(row => formatNumber(row.net_cff))],
                ['Tiền Mặt Thay Đổi Trong Kỳ', ...data.cashFlow.map(row => formatNumber(row.tienmatthaydoitrongky))],
                ['Tiền Mặt Đầu Kỳ', ...data.cashFlow.map(row => formatNumber(row.tienmatdauky))],
                ['Tiền Mặt Cuối Kỳ', ...data.cashFlow.map(row => formatNumber(row.tienmatcuoiky))],
                ['FCF = CFO - Capex ( Tiền mặt khả dụng)', ...data.cashFlow.map(row => formatNumber(row.fcf))],
                ['ROA', ...dcfAnalysis.map(row => formatNumber(row.roa, true))],
                ['ROE', ...dcfAnalysis.map(row => formatNumber(row.roe, true))],
                ['DCF', ...dcfAnalysis.map(row => formatNumber(row.dcf))],
                ['NPV', ...dcfAnalysis.map(row => formatNumber(row.npv))],

              ]}
              highlightRows={highlightRows}
              isFinancial={true}
            />
          </CollapsibleTable>
        );
      case 'incomeStatementYoYExtended':
        return (
          <CollapsibleTable title="Phân Tích Năm Gốc với %YoY" icon={tableIcons.incomeStatementYoYExtended}>
            <EnhancedTable
              headers={[
                'Chỉ Số',
                'Năm 1', 'Năm 2', '%YoY 1→2',
                'Năm 2', 'Năm 3', '%YoY 2→3',
                'Năm 3', 'Năm 4', '%YoY 3→4',
                'Năm 4', 'Năm 5', '%YoY 4→5',
                'Năm 5', 'Năm 6', '%YoY 5→6',
                'Năm 6', 'Năm 7', '%YoY 6→7',
                'Năm 7', 'Năm 8', '%YoY 7→8',
              ]}
              rows={[
                ['Số Lượng', ...incomeStatementYoY.slice(0, 7).flatMap((row, i) => [formatNumber(row.soluong), formatNumber(incomeStatementYoY[i + 1].soluong), formatNumber(incomeStatementYoY[i + 1].yoy_soluong, true)])],
                ['Giá Bán', ...incomeStatementYoY.slice(0, 7).flatMap((row, i) => [formatNumber(row.giaban), formatNumber(incomeStatementYoY[i + 1].giaban), formatNumber(incomeStatementYoY[i + 1].yoy_giaban, true)])],
                ['Doanh Thu', ...incomeStatementYoY.slice(0, 7).flatMap((row, i) => [formatNumber(row.doanhthu), formatNumber(incomeStatementYoY[i + 1].doanhthu), formatNumber(incomeStatementYoY[i + 1].yoy_doanhthu, true)])],
                ['NVL (25% DT)', ...incomeStatementYoY.slice(0, 7).flatMap((row, i) => [formatNumber(row.nvl), formatNumber(incomeStatementYoY[i + 1].nvl), formatNumber(incomeStatementYoY[i + 1].yoy_nvl, true)])],
                ['Chi Phí Khấu Hao', ...incomeStatementYoY.slice(0, 7).flatMap((row, i) => [formatNumber(row.chiphikhauhao), formatNumber(incomeStatementYoY[i + 1].chiphikhauhao), formatNumber(incomeStatementYoY[i + 1].yoy_chiphikhauhao, true)])],
                ['Chi Phí Lương', ...incomeStatementYoY.slice(0, 7).flatMap((row, i) => [formatNumber(row.chiphiluong), formatNumber(incomeStatementYoY[i + 1].chiphiluong), formatNumber(incomeStatementYoY[i + 1].yoy_chiphiluong, true)])],
                ['Tổng Chi Phí (Giá Vốn)', ...incomeStatementYoY.slice(0, 7).flatMap((row, i) => [formatNumber(row.tongchiphi_giavon), formatNumber(incomeStatementYoY[i + 1].tongchiphi_giavon), formatNumber(incomeStatementYoY[i + 1].yoy_tongchiphi_giavon, true)])],
                ['Lợi Nhuận Gộp (EBIT)', ...incomeStatementYoY.slice(0, 7).flatMap((row, i) => [formatNumber(row.loinhuangop_ebit), formatNumber(incomeStatementYoY[i + 1].loinhuangop_ebit), formatNumber(incomeStatementYoY[i + 1].yoy_loinhuangop_ebit, true)])],
                ['Chi Phí Lãi Vay', ...incomeStatementYoY.slice(0, 7).flatMap((row, i) => [formatNumber(row.chiphilaivay), formatNumber(incomeStatementYoY[i + 1].chiphilaivay), formatNumber(incomeStatementYoY[i + 1].yoy_chiphilaivay, true)])],
                ['Lợi Nhuận Trước Thuế (EBT)', ...incomeStatementYoY.slice(0, 7).flatMap((row, i) => [formatNumber(row.loinhuantruocthue_ebt), formatNumber(incomeStatementYoY[i + 1].loinhuantruocthue_ebt), formatNumber(incomeStatementYoY[i + 1].yoy_loinhuantruocthue_ebt, true)])],
                ['Thuế TNDN', ...incomeStatementYoY.slice(0, 7).flatMap((row, i) => [formatNumber(row.thuetndn), formatNumber(incomeStatementYoY[i + 1].thuetndn), formatNumber(incomeStatementYoY[i + 1].yoy_thuetndn, true)])],
                ['Lợi Nhuận Sau Thuế', ...incomeStatementYoY.slice(0, 7).flatMap((row, i) => [formatNumber(row.loinhuansauthue), formatNumber(incomeStatementYoY[i + 1].loinhuansauthue), formatNumber(incomeStatementYoY[i + 1].yoy_loinhuansauthue, true)])],
              ]}
              highlightRows={highlightRows}
              isFinancial={true}
            />
          </CollapsibleTable>
        );
      case 'depreciation':
        return (
          <CollapsibleTable title="Bảng Khấu Hao" icon={tableIcons.depreciation}>
            <EnhancedTable
              headers={['Tên', 'Nguyên Giá', 'Số Năm Sử Dụng', 'Năm 1', 'Năm 2', 'Năm 3', 'Năm 4', 'Năm 5', 'Năm 6', 'Năm 7', 'Năm 8', 'Năm 9']}
              rows={[
                ...depreciationRows,
                totalDepreciationRow,
                totalOriginalCostRow,
                totalRemainingValueRow,
              ]}
              highlightRows={highlightRows}
              isFinancial={true}
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
              headers={['Năm', 're', 'rd', 'Tc', 'E', 'D', 'E+D', 'WACC']}
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

  return renderTable();
};

export default Tables;