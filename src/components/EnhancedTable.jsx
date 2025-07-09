import React from 'react';

const EnhancedTable = ({ headers, rows, isFinancial = true, highlightRows = [] }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded-lg shadow-lg border border-blue-200">
        <thead>
          <tr className="bg-gradient-to-r from-blue-50 to-blue-100">
            {headers.map((header, index) => (
              <th
                key={index}
                className={`
                  px-6 py-4 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider 
                  border-b border-blue-200 transition-all duration-300 ease-out
                `}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-blue-100">
          {rows.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={`
                group transition-all duration-300 ease-out 
                hover:bg-blue-50 hover:shadow-md transform hover:scale-[1.002]
                ${highlightRows.includes(row[0]) ? 'bg-cyan-100 font-bold' : ''}
              `}
            >
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className={`
                    px-6 py-4 text-sm 
                    ${cellIndex === 0 
                      ? highlightRows.includes(row[0]) 
                        ? 'font-bold text-cyan-800' 
                        : 'font-semibold text-blue-800'
                      : 'text-blue-700 group-hover:text-blue-800'
                    } 
                    ${cellIndex > 0 && isFinancial ? 'font-mono' : ''} 
                    transition-all duration-300 ease-out
                  `}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Custom Styles */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .group {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default EnhancedTable;