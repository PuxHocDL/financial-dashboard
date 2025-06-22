import React from 'react';
import { formatNumber } from '../utils/formatNumber';
import { DollarSign, TrendingUp, Building, Wallet } from 'lucide-react';

const KeyMetrics = ({ data }) => {
  const latestYear = data.incomeStatement[data.incomeStatement.length - 1];
  const latestBS = data.balanceSheet[data.balanceSheet.length - 1];
  const latestCF = data.cashFlow[data.cashFlow.length - 1];

  const metrics = [
    { label: 'Revenue', value: latestYear?.doanhthu || 0, icon: DollarSign, color: 'bg-gradient-to-br from-green-100 to-green-200' },
    { label: 'Net Profit/Loss', value: latestYear?.loinhuansauthue || 0, icon: TrendingUp, color: 'bg-gradient-to-br from-green-100 to-green-300' },
    { label: 'Total Assets', value: latestBS?.tongtaisan || 0, icon: Building, color: 'bg-gradient-to-br from-green-100 to-green-200' },
    { label: 'Free Cash', value: latestCF?.fcf || 0, icon: Wallet, color: 'bg-gradient-to-br from-green-100 to-green-300' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {metrics.map((metric, index) => (
        <div 
          key={index} 
          className={`relative bg-white rounded-lg p-5 shadow-lg 
            transition-all duration-300 ease-out transform 
            hover:scale-105 hover:shadow-xl group
            border border-green-200
            ${metric.color}
          `}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-700 text-sm font-medium opacity-80 transition-all duration-300 group-hover:text-green-800">
                {metric.label}
              </p>
              <p className="text-green-800 text-xl font-bold mt-1 transition-all duration-300 group-hover:scale-105">
                {formatNumber(metric.value)}
              </p>
            </div>
            <div className={`
              flex items-center justify-center w-10 h-10 bg-green-50 rounded-full
              transition-all duration-300 ease-out group-hover:bg-green-100
            `}>
              <metric.icon className="w-6 h-6 text-green-600 group-hover:text-green-800 group-hover:scale-110 transition-all duration-300" />
            </div>
          </div>

          {/* Tooltip on hover */}
          <div className={`
            absolute top-2 right-2 px-2 py-1 bg-green-800 text-white text-xs 
            rounded-md shadow-lg pointer-events-none z-50
            transition-all duration-300 ease-out transform
            group-hover:opacity-100 group-hover:translate-y-0 opacity-0 translate-y-2
          `}>
            {metric.label}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 translate-y-[-2px]
                            border-4 border-transparent border-t-green-800" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default KeyMetrics;