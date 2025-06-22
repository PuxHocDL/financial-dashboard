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
    }));

    const baseYear = data.balanceSheet.find(row => row.nam === 0);
    const horizontal = data.balanceSheet.map(row => ({
      nam: row.nam,
      tienmat: baseYear.tienmat ? row.tienmat / baseYear.tienmat : 0,
      ts_daihan: baseYear.ts_daihan ? row.ts_daihan / baseYear.ts_daihan : 0,
      ts_vohinh: baseYear.ts_vohinh ? row.ts_vohinh / baseYear.ts_vohinh : 0,
      ts_huuhinh_giatriconlai: baseYear.ts_huuhinh_giatriconlai ? row.ts_huuhinh_giatriconlai / baseYear.ts_huuhinh_giatriconlai : 0,
      tongtaisan: baseYear.tongtaisan ? row.tongtaisan / baseYear.tongtaisan : 0,
      voncsh: baseYear.voncsh ? row.voncsh / baseYear.voncsh : 0,
      codonggopvon: baseYear.codonggopvon ? row.codonggopvon / baseYear.codonggopvon : 0,
      vongopcsh: baseYear.vongopcsh ? row.vongopcsh / baseYear.vongopcsh : 0,
      nophaitra: baseYear.nophaitra ? row.nophaitra / baseYear.nophaitra : 0,
      khoanvayphaitra: baseYear.khoanvayphaitra ? row.khoanvayphaitra / baseYear.khoanvayphaitra : 0,
    }));

    return { vertical, horizontal };
  };

  const calculateIncomeStatementYoY = () => {
    return data.incomeStatement.map((row, index) => {
      if (index === 0) return { ...row, yoy_soluong: 0, yoy_giaban: 0, yoy_doanhthu: 0 };
      const prev = data.incomeStatement[index - 1];
      return {
        ...row,
        yoy_soluong: prev.soluong ? (row.soluong - prev.soluong) / prev.soluong : 0,
        yoy_giaban: prev.giaban ? (row.giaban - prev.giaban) / prev.giaban : 0,
        yoy_doanhthu: prev.doanhthu ? (row.doanhthu - prev.doanhthu) / prev.doanhthu : 0,
      };
    });
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
  };
};

export default useFinancialData;