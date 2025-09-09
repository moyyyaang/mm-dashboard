import React, { useState, useEffect } from 'react';
import { DailyInput, DashboardStats, TeamStats } from '../types';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalEmployees: 0,
    totalInputs: 0,
    missingInputs: 0,
    monthlyProgress: 0,
    teamStats: []
  });

  const [recentInputs, setRecentInputs] = useState<DailyInput[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = () => {
    const inputs = JSON.parse(localStorage.getItem('dailyInputs') || '[]') as DailyInput[];
    
    // Calculate stats
    const totalInputs = inputs.length;
    const uniqueEmployees = new Set(inputs.map(input => input.employeeName)).size;
    
    // Calculate missing inputs (assuming 20 working days per month)
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const monthlyInputs = inputs.filter(input => {
      const inputDate = new Date(input.date);
      return inputDate.getMonth() === currentMonth && inputDate.getFullYear() === currentYear;
    });
    
    const expectedInputs = uniqueEmployees * 20; // 20 working days
    const missingInputs = Math.max(0, expectedInputs - monthlyInputs.length);
    const monthlyProgress = expectedInputs > 0 ? (monthlyInputs.length / expectedInputs) * 100 : 0;
    
    // Calculate team stats (simplified)
    const teamStats: TeamStats[] = [
      {
        teamName: '기획팀',
        totalMembers: 5,
        completedInputs: monthlyInputs.filter(input => input.employeeName.includes('기획')).length,
        totalInputs: 5 * 20,
        completionRate: 0
      },
      {
        teamName: '촬영팀',
        totalMembers: 8,
        completedInputs: monthlyInputs.filter(input => input.employeeName.includes('촬영')).length,
        totalInputs: 8 * 20,
        completionRate: 0
      },
      {
        teamName: '편집팀',
        totalMembers: 6,
        completedInputs: monthlyInputs.filter(input => input.employeeName.includes('편집')).length,
        totalInputs: 6 * 20,
        completionRate: 0
      }
    ];

    // Calculate completion rates
    teamStats.forEach(team => {
      team.completionRate = team.totalInputs > 0 ? (team.completedInputs / team.totalInputs) * 100 : 0;
    });

    setStats({
      totalEmployees: uniqueEmployees,
      totalInputs,
      missingInputs,
      monthlyProgress,
      teamStats
    });

    // Get recent inputs
    setRecentInputs(inputs.slice(-5).reverse());
  };

  const StatCard: React.FC<{ title: string; value: string | number; subtitle?: string; color?: string }> = ({ 
    title, 
    value, 
    subtitle, 
    color = 'blue' 
  }) => {
    const colorClasses = {
      blue: 'bg-blue-50 text-blue-600',
      green: 'bg-green-50 text-green-600',
      orange: 'bg-orange-50 text-orange-600',
      red: 'bg-red-50 text-red-600'
    };

    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
          </div>
          <div className={`w-12 h-12 rounded-lg ${colorClasses[color as keyof typeof colorClasses]} flex items-center justify-center`}>
            <span className="text-xl">📊</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">대시보드</h1>
        <button 
          onClick={loadDashboardData}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          새로고침
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="전체 직원"
          value={stats.totalEmployees}
          subtitle="등록된 직원 수"
          color="blue"
        />
        <StatCard
          title="총 입력 건수"
          value={stats.totalInputs}
          subtitle="누적 입력 건수"
          color="green"
        />
        <StatCard
          title="누락된 입력"
          value={stats.missingInputs}
          subtitle="이번 달 누락"
          color="red"
        />
        <StatCard
          title="월별 진행률"
          value={`${stats.monthlyProgress.toFixed(1)}%`}
          subtitle="이번 달 완료율"
          color="orange"
        />
      </div>

      {/* Team Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">팀별 현황</h3>
          <div className="space-y-4">
            {stats.teamStats.map((team, index) => (
              <div key={index} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{team.teamName}</p>
                  <p className="text-sm text-gray-500">{team.completedInputs}/{team.totalInputs} 완료</p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${team.completionRate}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-700 w-12">
                    {team.completionRate.toFixed(0)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Inputs */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">최근 입력</h3>
          <div className="space-y-3">
            {recentInputs.length > 0 ? (
              recentInputs.map((input) => (
                <div key={input.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{input.employeeName}</p>
                    <p className="text-sm text-gray-500">{input.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-700">
                      {input.planning + input.shooting + input.editing + input.other}시간
                    </p>
                    <p className="text-xs text-gray-500">
                      기획:{input.planning} 촬영:{input.shooting} 편집:{input.editing} 기타:{input.other}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>아직 입력된 데이터가 없습니다.</p>
                <p className="text-sm mt-1">일일 입력 페이지에서 데이터를 입력해보세요.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Monthly Progress Chart */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">월별 진행률</h3>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-32 h-32 mx-auto mb-4 relative">
              <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#e5e7eb"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#3b82f6"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${stats.monthlyProgress * 2.51} 251`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-gray-900">
                  {stats.monthlyProgress.toFixed(0)}%
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-600">이번 달 완료율</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
