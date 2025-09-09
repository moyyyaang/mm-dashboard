import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { DailyInput, ChartData, TimeSeriesData } from '../types';

const Statistics: React.FC = () => {
  const [inputs, setInputs] = useState<DailyInput[]>([]);
  const [categoryData, setCategoryData] = useState<ChartData[]>([]);
  const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesData[]>([]);
  const [employeeData, setEmployeeData] = useState<ChartData[]>([]);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  useEffect(() => {
    loadData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadData = () => {
    const data = JSON.parse(localStorage.getItem('dailyInputs') || '[]') as DailyInput[];
    setInputs(data);
    
    // Calculate category data
    const categories = {
      planning: data.reduce((sum, input) => sum + input.planning, 0),
      shooting: data.reduce((sum, input) => sum + input.shooting, 0),
      editing: data.reduce((sum, input) => sum + input.editing, 0),
      other: data.reduce((sum, input) => sum + input.other, 0),
    };

    setCategoryData([
      { name: '기획', value: categories.planning, color: COLORS[0] },
      { name: '촬영', value: categories.shooting, color: COLORS[1] },
      { name: '편집', value: categories.editing, color: COLORS[2] },
      { name: '기타', value: categories.other, color: COLORS[3] },
    ]);

    // Calculate time series data (last 7 days)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toISOString().split('T')[0];
    });

    const timeSeries = last7Days.map(date => {
      const dayInputs = data.filter(input => input.date === date);
      const total = dayInputs.reduce((sum, input) => 
        sum + input.planning + input.shooting + input.editing + input.other, 0);
      
      return {
        date: new Date(date).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' }),
        planning: dayInputs.reduce((sum, input) => sum + input.planning, 0),
        shooting: dayInputs.reduce((sum, input) => sum + input.shooting, 0),
        editing: dayInputs.reduce((sum, input) => sum + input.editing, 0),
        other: dayInputs.reduce((sum, input) => sum + input.other, 0),
        total
      };
    });

    setTimeSeriesData(timeSeries);

    // Calculate employee data
    const employeeStats = data.reduce((acc, input) => {
      if (!acc[input.employeeName]) {
        acc[input.employeeName] = 0;
      }
      acc[input.employeeName] += input.planning + input.shooting + input.editing + input.other;
      return acc;
    }, {} as Record<string, number>);

    const employeeChartData = Object.entries(employeeStats)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);

    setEmployeeData(employeeChartData);
  };

  const StatCard: React.FC<{ title: string; value: string | number; subtitle?: string }> = ({ 
    title, 
    value, 
    subtitle 
  }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
          <span className="text-xl">📈</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">통계/차트</h1>
        <button 
          onClick={loadData}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          새로고침
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="총 근무 시간"
          value={`${inputs.reduce((sum, input) => sum + input.planning + input.shooting + input.editing + input.other, 0)}시간`}
          subtitle="전체 누적 시간"
        />
        <StatCard
          title="평균 일일 시간"
          value={`${inputs.length > 0 ? (inputs.reduce((sum, input) => sum + input.planning + input.shooting + input.editing + input.other, 0) / inputs.length).toFixed(1) : 0}시간`}
          subtitle="일일 평균"
        />
        <StatCard
          title="가장 많은 카테고리"
          value={categoryData.length > 0 ? categoryData.reduce((max, item) => item.value > max.value ? item : max).name : '-'}
          subtitle="시간 기준"
        />
        <StatCard
          title="활성 직원 수"
          value={new Set(inputs.map(input => input.employeeName)).size}
          subtitle="입력한 직원"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Distribution Pie Chart */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">카테고리별 시간 분포</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Employee Hours Bar Chart */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">직원별 총 근무 시간</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={employeeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                angle={-45}
                textAnchor="end"
                height={80}
                fontSize={12}
              />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Time Series Chart */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">최근 7일간 시간 추이</h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={timeSeriesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="planning" stroke="#3b82f6" strokeWidth={2} name="기획" />
            <Line type="monotone" dataKey="shooting" stroke="#10b981" strokeWidth={2} name="촬영" />
            <Line type="monotone" dataKey="editing" stroke="#f59e0b" strokeWidth={2} name="편집" />
            <Line type="monotone" dataKey="other" stroke="#ef4444" strokeWidth={2} name="기타" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Category Comparison */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">카테고리별 상세 비교</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {categoryData.map((category, index) => (
            <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
              <div 
                className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center text-white font-bold text-lg"
                style={{ backgroundColor: category.color }}
              >
                {category.value}
              </div>
              <h4 className="font-semibold text-gray-900">{category.name}</h4>
              <p className="text-sm text-gray-600">{category.value}시간</p>
              <p className="text-xs text-gray-500 mt-1">
                {inputs.length > 0 ? (category.value / inputs.length).toFixed(1) : 0}시간/일 평균
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">최근 입력 데이터</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  직원명
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  날짜
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  기획
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  촬영
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  편집
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  기타
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  총합
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {inputs.slice(-10).reverse().map((input) => (
                <tr key={input.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {input.employeeName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {input.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {input.planning}시간
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {input.shooting}시간
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {input.editing}시간
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {input.other}시간
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {input.planning + input.shooting + input.editing + input.other}시간
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
