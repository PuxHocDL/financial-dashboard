import { useState, useEffect } from 'react';
import supabase from '../services/supabase';

const useFinancialData = () => {
  const [data, setData] = useState({
    balanceSheet: [],
    incomeStatement: [],
    cashFlow: [],
    depreciation: [],
    loans: [],
    wacc: [],
    storeCount: [],
    chartData: [],
  });
  const [inputs, setInputs] = useState({
    ts_vohinh: 1000,
    codonggopvon: 500,
    vongopcsh: 1000,
    khoanvayphaitra: 250,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [
        { data: candoi, error: candoiError },
        { data: kqhdkd, error: kqhdkdError },
        { data: luuchuyen, error: luuchuyenError },
        { data: khauhao, error: khauhaoError },
        { data: vay, error: vayError },
        { data: wacc, error: waccError },
        { data: socuahang, error: socuahangError },
      ] = await Promise.all([
        supabase.from('bangcandoiketoan').select('*').order('nam', { ascending: true }),
        supabase.from('baocaokqhdkd').select('*').order('nam', { ascending: true }),
        supabase.from('baocaoluuchuyentiente').select('*').order('nam', { ascending: true }),
        supabase.from('bangkhauhao').select('*').order('id', { ascending: true }),
        supabase.from('bangvay').select('*').order('nam', { ascending: true }),
        supabase.from('wacc').select('*').order('nam', { ascending: true }),
        supabase.from('socuahang').select('*').order('nam', { ascending: true }),
      ]);

      if (candoiError || kqhdkdError || luuchuyenError || khauhaoError || vayError || waccError || socuahangError) {
        throw new Error('Error fetching data: ' + JSON.stringify({
          candoiError, kqhdkdError, luuchuyenError, khauhaoError, vayError, waccError, socuahangError
        }));
      }

      const chartData = kqhdkd.map((item, index) => ({
        nam: item.nam,
        doanhthu: item.doanhthu || 0,
        loinhuansauthue: item.loinhuansauthue || 0,
        fcf: luuchuyen[index]?.fcf || 0,
        wacc_value: wacc[index]?.wacc_value || 0,
        tongtaisan: candoi[index + 1]?.tongtaisan || 0,
      }));

      setData({
        balanceSheet: candoi,
        incomeStatement: kqhdkd,
        cashFlow: luuchuyen,
        depreciation: khauhao,
        loans: vay,
        wacc,
        storeCount: socuahang,
        chartData,
      });

      const yearZero = candoi.find(row => row.nam === 0);
      if (yearZero) {
        setInputs({
          ts_vohinh: yearZero.ts_vohinh || 1000,
          codonggopvon: yearZero.codonggopvon || 500,
          vongopcsh: yearZero.vongopcsh || 1000,
          khoanvayphaitra: yearZero.khoanvayphaitra || 250,
        });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('bangcandoiketoan')
        .update({
          ts_vohinh: parseFloat(inputs.ts_vohinh),
          codonggopvon: parseFloat(inputs.codonggopvon),
          vongopcsh: parseFloat(inputs.vongopcsh),
          khoanvayphaitra: parseFloat(inputs.khoanvayphaitra),
        })
        .eq('nam', 0);
      if (error) throw error;
      await fetchData();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateBalanceSheetAnalysis = () => {
    const baseYear = data.balanceSheet.find(row => row.nam === 1) || {}; // Sử dụng năm 1 làm năm gốc
    const vertical = data.balanceSheet.map(row => ({
      nam: row.nam,
      ts_nganhan: row.tongtaisan ? row.ts_nganhan / row.tongtaisan : 0,
      tienmat: row.tongtaisan ? row.tienmat / row.tongtaisan : 0,
      hangtonkho: row.tongtaisan ? row.hangtonkho / row.tongtaisan : 0,
      khoanphaithu_cdkt: row.tongtaisan ? row.khoanphaithu_cdkt / row.tongtaisan : 0,
      ts_daihan: row.tongtaisan ? row.ts_daihan / row.tongtaisan : 0,
      ts_vohinh: row.tongtaisan ? row.ts_vohinh / row.tongtaisan : 0,
      ts_huuhinh_giatriconlai: row.tongtaisan ? row.ts_huuhinh_giatriconlai / row.tongtaisan : 0,
      voncsh: row.tongnguonvon ? row.voncsh / row.tongnguonvon : 0,
      codonggopvon: row.tongnguonvon ? row.codonggopvon / row.tongnguonvon : 0,
      vongopcsh: row.tongnguonvon ? row.vongopcsh / row.tongnguonvon : 0,
      loinhuansauthue_cdkt: row.tongnguonvon ? row.loinhuansauthue_cdkt / row.tongnguonvon : 0,
      nophaitra: row.tongnguonvon ? row.nophaitra / row.tongnguonvon : 0,
      khoanvayphaitra: row.tongnguonvon ? row.khoanvayphaitra / row.tongnguonvon : 0,
      khoanvaymuanvl: row.tongnguonvon ? row.khoanvaymuanvl / row.tongnguonvon : 0,
      khoanphaitra_cdkt_final: row.tongnguonvon ? row.khoanphaitra_cdkt_final / row.tongnguonvon : 0,
      
    }));

    const horizontal = data.balanceSheet.map(row => ({
      nam: row.nam,
      ts_nganhan: baseYear.ts_nganhan ? (row.ts_nganhan / baseYear.ts_nganhan) : 0,
      tienmat: baseYear.tienmat || row.tienmat === 0 ? (row.tienmat / baseYear.tienmat) : 0,
      hangtonkho: baseYear.hangtonkho ? (row.hangtonkho / baseYear.hangtonkho) : 0,
      khoanphaithu_cdkt: baseYear.khoanphaithu_cdkt ? (row.khoanphaithu_cdkt / baseYear.khoanphaithu_cdkt) : 0,
      ts_daihan: baseYear.ts_daihan ? (row.ts_daihan / baseYear.ts_daihan) : 0,
      ts_vohinh: baseYear.ts_vohinh ? (row.ts_vohinh / baseYear.ts_vohinh) : 0,
      ts_huuhinh_giatriconlai: baseYear.ts_huuhinh_giatriconlai ? (row.ts_huuhinh_giatriconlai / baseYear.ts_huuhinh_giatriconlai) : 0,
      nguyengia_tshh: baseYear.nguyengia_tshh ? (row.nguyengia_tshh / baseYear.nguyengia_tshh) : 0,
      khauhaoluyke_tshh: baseYear.khauhaoluyke_tshh ? (row.khauhaoluyke_tshh / baseYear.khauhaoluyke_tshh) : 0,
      tongtaisan: baseYear.tongtaisan ? (row.tongtaisan / baseYear.tongtaisan) : 0,
      voncsh: baseYear.voncsh ? (row.voncsh / baseYear.voncsh) : 0,
      codonggopvon: baseYear.codonggopvon ? (row.codonggopvon / baseYear.codonggopvon) : 0,
      vongopcsh: baseYear.vongopcsh ? (row.vongopcsh / baseYear.vongopcsh) : 0,
      loinhuansauthue_cdkt: baseYear.loinhuansauthue_cdkt ? (-row.loinhuansauthue_cdkt / baseYear.loinhuansauthue_cdkt) : 0,
      nophaitra: baseYear.nophaitra ? (row.nophaitra / baseYear.nophaitra) : 0,
      khoanvayphaitra: baseYear.khoanvayphaitra ? (row.khoanvayphaitra / baseYear.khoanvayphaitra) : 0,
      khoanvaymuanvl: baseYear.khoanvaymuanvl ? (row.khoanvaymuanvl / baseYear.khoanvaymuanvl) : 0,
      khoanphaitra_cdkt_final: baseYear.khoanphaitra_cdkt_final ? (row.khoanphaitra_cdkt_final / baseYear.khoanphaitra_cdkt_final) : 0,
      tongnguonvon: baseYear.tongnguonvon ? (row.tongnguonvon / baseYear.tongnguonvon) : 0,
    }));

    return { vertical, horizontal };
  };

  const calculateFinancialRatios = () => {
    return data.incomeStatement.map((row, index) => {
      const bs = data.balanceSheet.find(bs => bs.nam === row.nam);
      const prevBs = data.balanceSheet.find(bs => bs.nam === row.nam - 1);
      const avgAssets = prevBs ? (bs.tongtaisan + prevBs.tongtaisan) / 2 : bs.tongtaisan;
      const avgEquity = prevBs ? (bs.voncsh + prevBs.voncsh) / 2 : bs.voncsh;
      return {
        nam: row.nam,
        ros: row.doanhthu ? row.loinhuansauthue / row.doanhthu : 0,
        roa: avgAssets ? row.loinhuansauthue / avgAssets : 0,
        roe: avgEquity ? row.loinhuansauthue / avgEquity : 0,
        roi: row.loinhuansauthue / (bs.codonggopvon + bs.vongopcsh) || 0,
        grossMargin: row.doanhthu ? row.loinhuangop_ebit / row.doanhthu : 0,
      };
    });
  };
  const calculateIncomeStatementHorizontalAnalysis = () => {
    const baseYear = data.incomeStatement.find(row => row.nam === 1) || {};
    return data.incomeStatement.map(row => ({
      nam: row.nam,
      doanhthu: baseYear.doanhthu ? (row.doanhthu / baseYear.doanhthu) : 100,
      nvl: baseYear.nvl ? (row.nvl / baseYear.nvl) : 100,
      chiphikhauhao: baseYear.chiphikhauhao ? (row.chiphikhauhao / baseYear.chiphikhauhao) : 100,
      chiphiluong: baseYear.chiphiluong ? (row.chiphiluong / baseYear.chiphiluong) : 100,
      tongchiphi_giavon: baseYear.tongchiphi_giavon ? (row.tongchiphi_giavon / baseYear.tongchiphi_giavon) : 100,
      loinhuangop_ebit: baseYear.loinhuangop_ebit || row.loinhuangop_ebit === 0 ? (row.loinhuangop_ebit / baseYear.loinhuangop_ebit) || 0 : 100,
      chiphilaivay: baseYear.chiphilaivay ? (row.chiphilaivay / baseYear.chiphilaivay) : 100,
      loinhuantruocthue_ebt: baseYear.loinhuantruocthue_ebt || row.loinhuantruocthue_ebt === 0 ? (-row.loinhuantruocthue_ebt / baseYear.loinhuantruocthue_ebt) || 0 : 100,
      thuetndn: baseYear.thuetndn || row.thuetndn === 0 ? (-row.thuetndn / baseYear.thuetndn) || 0 : 100,
      loinhuansauthue: baseYear.loinhuansauthue || row.loinhuansauthue === 0 ? (-row.loinhuansauthue / baseYear.loinhuansauthue) || 0 : 100,
    }));
  };

  const calculateIncomeStatementYoY = () => {
    return data.incomeStatement.map((row, index) => {
      if (index === 0) {
        return {
          nam: row.nam,
          soluong: row.soluong || 0,
          giaban: row.giaban || 0,
          doanhthu: row.doanhthu || 0,
          nvl: row.nvl || 0,
          chiphikhauhao: row.chiphikhauhao || 0,
          chiphiluong: row.chiphiluong || 0,
          tongchiphi_giavon: row.tongchiphi_giavon || 0,
          loinhuangop_ebit: row.loinhuangop_ebit || 0,
          chiphilaivay: row.chiphilaivay || 0,
          loinhuantruocthue_ebt: row.loinhuantruocthue_ebt || 0,
          thuetndn: row.thuetndn || 0,
          loinhuansauthue: row.loinhuansauthue || 0,
          yoy_soluong: 0,
          yoy_giaban: 0,
          yoy_doanhthu: 0,
          yoy_nvl: 0,
          yoy_chiphikhauhao: 0,
          yoy_chiphiluong: 0,
          yoy_tongchiphi_giavon: 0,
          yoy_loinhuangop_ebit: 0,
          yoy_chiphilaivay: 0,
          yoy_loinhuantruocthue_ebt: 0,
          yoy_thuetndn: 0,
          yoy_loinhuansauthue: 0,
        };
      }
      const prev = data.incomeStatement[index - 1];
      return {
        nam: row.nam,
        soluong: row.soluong || 0,
        giaban: row.giaban || 0,
        doanhthu: row.doanhthu || 0,
        nvl: row.nvl || 0,
        chiphikhauhao: row.chiphikhauhao || 0,
        chiphiluong: row.chiphiluong || 0,
        tongchiphi_giavon: row.tongchiphi_giavon || 0,
        loinhuangop_ebit: row.loinhuangop_ebit || 0,
        chiphilaivay: row.chiphilaivay || 0,
        loinhuantruocthue_ebt: row.loinhuantruocthue_ebt || 0,
        thuetndn: row.thuetndn || 0,
        loinhuansauthue: row.loinhuansauthue || 0,
        yoy_soluong: prev.soluong ? ((row.soluong - prev.soluong) / prev.soluong) : 0,
        yoy_giaban: prev.giaban ? ((row.giaban - prev.giaban) / prev.giaban) : 0,
        yoy_doanhthu: prev.doanhthu ? ((row.doanhthu - prev.doanhthu) / Math.abs(prev.doanhthu)) : 0,
        yoy_nvl: prev.nvl ? ((row.nvl - prev.nvl) / prev.nvl) : 0,
        yoy_chiphikhauhao: prev.chiphikhauhao ? ((row.chiphikhauhao - prev.chiphikhauhao) / prev.chiphikhauhao) : 0,
        yoy_chiphiluong: prev.chiphiluong ? ((row.chiphiluong - prev.chiphiluong) / prev.chiphiluong) : 0,
        yoy_tongchiphi_giavon: prev.tongchiphi_giavon ? ((row.tongchiphi_giavon - prev.tongchiphi_giavon) / prev.tongchiphi_giavon) : 0,
        yoy_loinhuangop_ebit: prev.loinhuangop_ebit || row.loinhuangop_ebit === 0 ? ((row.loinhuangop_ebit - prev.loinhuangop_ebit) / prev.loinhuangop_ebit) || 0 : 0,
        yoy_chiphilaivay: prev.chiphilaivay ? ((row.chiphilaivay - prev.chiphilaivay) / prev.chiphilaivay) : 0,
        yoy_loinhuantruocthue_ebt: prev.loinhuantruocthue_ebt || row.loinhuantruocthue_ebt === 0 ? ((row.loinhuantruocthue_ebt - prev.loinhuantruocthue_ebt) / prev.loinhuantruocthue_ebt) || 0 : 0,
        yoy_thuetndn: prev.thuetndn || row.thuetndn === 0 ? ((row.thuetndn - prev.thuetndn) / prev.thuetndn) || 0 : 0,
        yoy_loinhuansauthue: prev.loinhuansauthue || row.loinhuansauthue === 0 ? ((row.loinhuansauthue - prev.loinhuansauthue) / Math.abs(prev.loinhuansauthue)) || 0 : 0,
      };
    });
  };
  const calculateIncomeStatementVerticalAnalysis = () => {
  // Calculate breakeven revenue (unchanged, as it's correct)
  const breakevenRevenue = data.incomeStatement.map(row => {
    const fixedCosts = (row.chiphikhauhao || 0) + (row.chiphiluong || 0) + (row.chiphilaivay || 0); // Include interest expense
    const variableCostRatio = row.doanhthu ? (row.nvl || 0) / row.doanhthu : 0.25;
    return row.doanhthu ? fixedCosts / (1 - variableCostRatio) : 0;
  });

  // Calculate breakeven time using free cash flow or net profit
  const initialInvestment = inputs.codonggopvon + inputs.vongopcsh; // Default to 3676.67 if inputs are zero
  let cumulativeCashFlow = 0;
  let breakevenTime = 0;

  for (let i = 0; i < data.cashFlow.length; i++) {
    const cashFlowRow = data.cashFlow[i];
    const incomeRow = data.incomeStatement.find(row => row.nam === cashFlowRow.nam);
    const cashFlow = cashFlowRow?.fcf || incomeRow?.loinhuansauthue || 0; // Prefer fcf, fallback to net profit
    cumulativeCashFlow += cashFlow;

    if (cumulativeCashFlow >= initialInvestment) {
      const previousCumulative = i > 0 ? cumulativeCashFlow - cashFlow : 0;
      const remaining = initialInvestment - previousCumulative;
      breakevenTime = cashFlow ? (i + (remaining / cashFlow)) : 0;
      break;
    }
  }

  return data.incomeStatement.map((row, index) => {
    const bs = data.balanceSheet.find(bs => bs.nam === row.nam);
    const prevBs = data.balanceSheet.find(bs => bs.nam === row.nam - 1);
    const cf = data.cashFlow.find(cf => cf.nam === row.nam);
    const avgAssets = prevBs && bs ? (bs.tongtaisan + prevBs.tongtaisan) / 2 : bs?.tongtaisan || 0;
    const avgEquity = prevBs && bs ? (bs.voncsh + prevBs.voncsh) / 2 : bs?.voncsh || 0;
    const totalInvestment = (row.nvl || 0) + (row.chiphiluong || 0) + (cf?.net_cfi || 0);

    return {
      nam: row.nam,
      doanhthu: row.doanhthu ? 1 : 0,
      nvl: row.doanhthu ? (row.nvl / row.doanhthu) : 0,
      chiphikhauhao: row.doanhthu ? (row.chiphikhauhao / row.doanhthu) : 0,
      chiphiluong: row.doanhthu ? (row.chiphiluong / row.doanhthu) : 0,
      tongchiphi_giavon: row.doanhthu ? (row.tongchiphi_giavon / row.doanhthu) : 0,
      loinhuangop_ebit: row.doanhthu ? (row.loinhuangop_ebit / row.doanhthu) : 0,
      chiphilaivay: row.doanhthu ? (row.chiphilaivay / row.doanhthu) : 0,
      loinhuantruocthue_ebt: row.doanhthu ? (row.loinhuantruocthue_ebt / row.doanhthu) : 0,
      thuetndn: row.doanhthu ? (row.thuetndn / row.doanhthu) : 0,
      loinhuansauthue: row.doanhthu ? (row.loinhuansauthue / row.doanhthu) : 0,
      ros: row.doanhthu ? (row.loinhuansauthue / row.doanhthu) : 0,
      roa: avgAssets ? (row.loinhuansauthue / avgAssets) : 0,
      roe: avgEquity ? (row.loinhuansauthue / avgEquity) : 0,
      roi: totalInvestment ? (row.loinhuansauthue / totalInvestment) : 0,
      grossMargin: row.doanhthu ? (row.loinhuangop_ebit / row.doanhthu) : 0,
      breakevenRevenue: breakevenRevenue[index] || 0,
      breakevenTime: breakevenTime || 0, // Single breakeven time value
    };
  });
};
  const calculateDCFAnalysis = () => {
    return data.cashFlow.map((row, index) => {
      const bs = data.balanceSheet.find(bs => bs.nam === row.nam);
      const prevBs = data.balanceSheet.find(bs => bs.nam === row.nam - 1);
      const wacc = data.wacc.find(w => w.nam === row.nam);
      const avgAssets = prevBs && bs ? (bs.tongtaisan + prevBs.tongtaisan) / 2 : bs?.tongtaisan || 0;
      const avgEquity = prevBs && bs ? (bs.voncsh + prevBs.voncsh) / 2 : bs?.voncsh || 0;
      const fcf = row.fcf || 0;
      const r = wacc?.wacc_value || 0.11; // Giá trị mặc định nếu wacc_value không có
      const n = row.nam; // Số năm kể từ năm 1
      const dcf = fcf / Math.pow(1 + r, n);
      const previousNPV = index === 0 ? 0 : data.cashFlow.slice(0, index).reduce((sum, prevRow) => {
        const prevWacc = data.wacc.find(w => w.nam === prevRow.nam);
        const prevR = prevWacc?.wacc_value || 0.11;
        return sum + (prevRow.fcf || 0) / Math.pow(1 + prevR, prevRow.nam);
      }, 0);
      const npv = previousNPV + dcf;


      return {
        nam: row.nam,
        roa: avgAssets ? (fcf / avgAssets) : 0,
        roe: avgEquity ? (fcf / avgEquity) : 0,
        dcf,
        npv,
      };
    });
  };

  return {
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
    calculateIncomeStatementYoY,
  };
};

export default useFinancialData;