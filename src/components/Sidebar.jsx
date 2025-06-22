import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Sidebar = ({ tables, activeTable, setActiveTable, isSidebarOpen, toggleSidebar, onHoverChange }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    onHoverChange && onHoverChange(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    onHoverChange && onHoverChange(false);
  };

  const handleTableSelect = (tableId) => {
    setActiveTable(tableId);
    if (window.innerWidth <= 768) {
      toggleSidebar();
    }
  };

  return (
    <>
      {/* Overlay cho cả mobile và desktop khi sidebar mở hoặc hover */}
      {(isSidebarOpen || isHovered) && (
        <div
          className={`
            fixed inset-0 bg-black transition-all duration-500 ease-in-out
            ${(isSidebarOpen || isHovered) ? 'bg-opacity-30 backdrop-blur-sm' : 'bg-opacity-0 backdrop-blur-none'}
            z-20
          `}
          onClick={() => {
            if (window.innerWidth <= 768) {
              toggleSidebar();
            }
          }}
          style={{ pointerEvents: isSidebarOpen || isHovered ? 'auto' : 'none' }}
        />
      )}

      <div
        className={`
          fixed top-0 left-0 h-screen bg-gradient-to-b from-blue-50 to-blue-100 
          border-r border-blue-200 shadow-lg 
          transition-all duration-500 ease-in-out transform
          ${(isSidebarOpen || isHovered) ? 'w-96' : 'w-16'}
          z-30
        `}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Toggle Button */}
        <button
          onClick={toggleSidebar}
          className="absolute -right-3 top-6 bg-blue-100 hover:bg-blue-200 
                     border border-blue-300 rounded-full p-1.5 shadow-md 
                     transition-all duration-300 ease-in-out hover:scale-110 z-10
                     transform active:scale-95"
        >
          {(isSidebarOpen || isHovered) ? (
            <ChevronLeft className="w-4 h-4 text-blue-700" />
          ) : (
            <ChevronRight className="w-4 h-4 text-blue-700" />
          )}
        </button>

        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="p-4 flex justify-center items-center border-b border-blue-200">
            <div className={`
              bg-white rounded-xl shadow-md p-2 
              transition-all duration-500 ease-in-out transform
              ${(isSidebarOpen || isHovered) ? 'w-36 h-36 scale-100' : 'w-8 h-8 scale-90'}
            `}>
              <img
                src="/logo.png"
                alt="Logo"
                className="w-full h-full object-contain rounded-lg 
                          transition-all duration-500 ease-in-out"
                onError={(e) => { e.target.src = 'https://via.placeholder.com/150'; }}
              />
            </div>
          </div>

          {/* Brand Name - Only show when expanded */}
          <div className={`
            px-4 py-2 text-center overflow-hidden
            transition-all duration-500 ease-in-out transform
            ${(isSidebarOpen || isHovered) 
              ? 'max-h-20 opacity-100 translate-y-0' 
              : 'max-h-0 opacity-0 -translate-y-4'
            }
          `}>
            <h2 className="text-blue-800 font-bold text-lg transition-all duration-300">
              Data Dashboard
            </h2>
            <p className="text-blue-600 text-sm transition-all duration-300 delay-75">
              Table Management
            </p>
          </div>

          {/* Menu Navigation */}
          <nav className="flex-1 px-2 py-4 space-y-2 overflow-y-auto">
            {tables.map((table) => (
              <div
                key={table.id}
                onClick={() => handleTableSelect(table.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleTableSelect(table.id);
                  }
                }}
                role="button"
                tabIndex={0}
                aria-label={`Select table ${table.title}`}
                className={`
                  group relative flex items-center px-3 py-3 rounded-xl
                  transition-all duration-300 ease-in-out hover:scale-105
                  transform active:scale-95 cursor-pointer
                  ${activeTable === table.id 
                    ? 'bg-blue-200 text-blue-800 shadow-md scale-105' 
                    : 'text-blue-700 hover:bg-blue-100 hover:text-blue-800'
                  }
                `}
              >
                {/* Icon */}
                <div className={`
                  flex items-center justify-center 
                  transition-all duration-300 ease-in-out
                  ${activeTable === table.id ? 'text-blue-800' : 'text-blue-600 group-hover:text-blue-800'}
                `}>
                  <table.icon className={`
                    w-5 h-5 transition-all duration-300 ease-in-out
                    ${activeTable === table.id ? 'scale-110' : 'group-hover:scale-110'}
                  `} />
                </div>

                {/* Text Label */}
                <span className={`
                  ml-3 font-medium whitespace-nowrap overflow-hidden
                  transition-all duration-500 ease-in-out
                  ${(isSidebarOpen || isHovered) 
                    ? 'opacity-100 translate-x-0 max-w-full' 
                    : 'opacity-0 translate-x-4 max-w-0'
                  }
                `}>
                  {table.title}
                </span>

                {/* Active Indicator */}
                <div className={`
                  absolute right-2 transition-all duration-300 ease-in-out
                  ${activeTable === table.id ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}
                `}>
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
                </div>

                {/* Tooltip for collapsed state */}
                <div className={`
                  absolute left-16 px-3 py-2 bg-blue-800 text-white text-sm 
                  rounded-lg shadow-lg pointer-events-none whitespace-nowrap z-50
                  transition-all duration-300 ease-in-out transform
                  ${!(isSidebarOpen || isHovered) 
                    ? 'group-hover:opacity-100 group-hover:translate-x-0 opacity-0 translate-x-2' 
                    : 'opacity-0 pointer-events-none'
                  }
                `}>
                  {table.title}
                  <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 
                                  border-4 border-transparent border-r-blue-800" />
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/* Custom Styles */}
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          .animate-fadeIn {
            animation: fadeIn 0.3s ease-in-out;
          }

          /* Hiệu ứng blur từ từ */
          .content-blur {
            filter: blur(2px);
            transition: filter 0.5s ease-in-out;
          }

          .content-normal {
            filter: blur(0px);
            transition: filter 0.5s ease-in-out;
          }
        `}</style>
      </div>
    </>
  );
};

export default Sidebar;