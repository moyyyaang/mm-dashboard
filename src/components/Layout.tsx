import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import CalendarWidget from './CalendarWidget';

const Layout: React.FC = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-900">M/M 관리 대시보드</h1>
            <div className="flex items-center space-x-4">
              <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                <span>동료에게 전달하기</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Content Area */}
          <div className="flex-1 p-6 overflow-y-auto">
            <Outlet />
          </div>
          
          {/* Right Sidebar with Calendar */}
          <div className="w-80 bg-white border-l border-gray-200 p-6 overflow-y-auto">
            <CalendarWidget />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
