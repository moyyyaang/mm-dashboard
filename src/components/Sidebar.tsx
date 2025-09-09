import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface MenuItem {
  id: string;
  name: string;
  path: string;
  icon: string;
}

const menuItems: MenuItem[] = [
  { id: 'home', name: '홈', path: '/', icon: '🏠' },
  { id: 'daily-input', name: '일일 입력', path: '/daily-input', icon: '📝' },
  { id: 'statistics', name: '통계/차트', path: '/statistics', icon: '📊' },
  { id: 'team-management', name: '팀 관리', path: '/team-management', icon: '👥' },
  { id: 'settings', name: '설정', path: '/settings', icon: '⚙️' },
];

const Sidebar: React.FC = () => {
  const location = useLocation();

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col">
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">M/M</span>
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">M/M 관리</h1>
            <p className="text-xs text-gray-500">대시보드</p>
          </div>
        </div>
      </div>


      {/* Profile & Utilities */}
      <div className="p-4 border-b border-gray-200 space-y-3">
        <div className="flex items-center space-x-3 text-sm text-gray-700">
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-xs">👤</span>
          </div>
          <span>내 프로필</span>
        </div>
        
        <div className="flex items-center space-x-3 text-sm text-gray-700">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span>Q 검색</span>
          <span className="text-xs text-gray-400">Ctrl K</span>
        </div>
        
        <div className="flex items-center space-x-3 text-sm text-gray-700">
          <div className="relative">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.828 7l2.586 2.586a2 2 0 002.828 0L12.828 7H4.828z" />
            </svg>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-xs text-white">3</span>
            </div>
          </div>
          <span>알림</span>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <Link
                to={item.path}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  location.pathname === item.path
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-500'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
