import React, { useState } from 'react';
import { ChevronDown, BarChart2 } from 'lucide-react';

const CollapsibleTable = ({ title, children, icon = BarChart2 }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative bg-white rounded-lg shadow-lg mb-6 overflow-hidden border border-blue-200 transition-all duration-300 ease-out hover:shadow-xl group">
      <div
        className="p-5 cursor-pointer flex justify-between items-center bg-gradient-to-r from-blue-50 to-blue-100 hover:bg-blue-100 transition-all duration-300 ease-out"
        onClick={() => setIsOpen(!isOpen)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            setIsOpen(!isOpen);
          }
        }}
        aria-expanded={isOpen}
        aria-label={`Toggle ${title} table`}
      >
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-8 h-8 bg-blue-50 rounded-full transition-all duration-300 group-hover:bg-blue-100">
            <icon className="w-5 h-5 text-blue-600 group-hover:text-blue-800 group-hover:scale-110 transition-all duration-300" />
          </div>
          <h2 className="text-lg font-bold text-blue-800 group-hover:text-blue-900 transition-all duration-300">
            {title}
          </h2>
        </div>
        <div className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          <ChevronDown className="w-6 h-6 text-blue-700 group-hover:text-blue-800 transition-all duration-300" />
        </div>
      </div>
      {isOpen && (
        <div className="p-5 overflow-x-auto bg-white animate-fadeIn">
          {children}
        </div>
      )}

      {/* Tooltip on hover */}
      <div className={`
        absolute top-2 right-2 px-2 py-1 bg-blue-800 text-white text-xs 
        rounded-md shadow-lg pointer-events-none z-50
        transition-all duration-300 ease-out transform
        group-hover:opacity-100 group-hover:translate-y-0 opacity-0 translate-y-2
      `}>
        {isOpen ? 'Collapse' : 'Expand'} {title}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 translate-y-[-2px]
                        border-4 border-transparent border-t-blue-800" />
      </div>

      {/* Custom Styles */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default CollapsibleTable;