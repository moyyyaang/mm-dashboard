import React, { useState, useEffect } from 'react';
import { DailyInput, Employee } from '../types';
import WeeklyCalendar from '../components/WeeklyCalendar';
import { initializeSampleData } from '../utils/sampleData';

const DailyInputPage: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [categoryTime, setCategoryTime] = useState<number>(0);
  const [selectedChannel, setSelectedChannel] = useState<string>('');
  const [formData, setFormData] = useState<Omit<DailyInput, 'id' | 'createdAt'>>({
    employeeName: '',
    date: new Date().toISOString().split('T')[0],
    planning: 0,
    shooting: 0,
    editing: 0,
    other: 0,
    memo: '',
  });

  const categories = [
    { id: 'planning', name: '기획', color: '#3b82f6' },
    { id: 'shooting', name: '촬영', color: '#10b981' },
    { id: 'editing', name: '편집', color: '#f59e0b' },
    { id: 'other', name: '기타', color: '#ef4444' },
  ];

  const channels = [
    { id: 'youtube', name: '유튜브' },
    { id: 'instagram', name: '인스타그램' },
    { id: 'tiktok', name: '틱톡' },
    { id: 'facebook', name: '페이스북' },
    { id: 'twitter', name: '트위터' },
    { id: 'naver', name: '네이버' },
    { id: 'kakao', name: '카카오' },
    { id: 'other', name: '기타' },
  ];

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = () => {
    const data = initializeSampleData();
    setEmployees(data);
  };

  const handleInputChange = (field: keyof typeof formData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setCategoryTime(0);
    setSelectedChannel('');
  };

  const handleTimeInput = (time: number) => {
    setCategoryTime(time);
  };

  const addCategoryTime = () => {
    if (selectedCategory && categoryTime > 0) {
      setFormData(prev => ({
        ...prev,
        [selectedCategory]: (prev[selectedCategory as keyof typeof prev] as number) + categoryTime
      }));
      setCategoryTime(0);
    }
  };

  const removeCategoryTime = (categoryId: string) => {
    setFormData(prev => ({
      ...prev,
      [categoryId]: 0
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newInput: DailyInput = {
      ...formData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };

    // Save to localStorage
    const existingData = JSON.parse(localStorage.getItem('dailyInputs') || '[]');
    existingData.push(newInput);
    localStorage.setItem('dailyInputs', JSON.stringify(existingData));

    // Reset form
    setFormData({
      employeeName: '',
      date: new Date().toISOString().split('T')[0],
      planning: 0,
      shooting: 0,
      editing: 0,
      other: 0,
      memo: '',
    });

    alert('일일 입력이 저장되었습니다!');
  };

  const totalHours = formData.planning + formData.shooting + formData.editing + formData.other;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">일일 입력</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Employee Name and Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="employeeName" className="block text-sm font-medium text-gray-700 mb-2">
                직원명
              </label>
              <select
                id="employeeName"
                value={formData.employeeName}
                onChange={(e) => handleInputChange('employeeName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">직원을 선택하세요</option>
                {employees.map((employee) => (
                  <option key={employee.id} value={employee.name}>
                    {employee.name} ({employee.team})
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                날짜 선택
              </label>
              <WeeklyCalendar 
                selectedDate={formData.date}
                onDateSelect={(date) => handleInputChange('date', date)}
              />
            </div>
          </div>

          {/* Category Selection and Time Input */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">카테고리별 시간 입력</h3>
            
            {/* Category Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">카테고리 선택</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => handleCategorySelect(category.id)}
                    className={`p-3 rounded-lg border-2 transition-colors ${
                      selectedCategory === category.id
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div 
                      className="w-4 h-4 rounded-full mx-auto mb-2"
                      style={{ backgroundColor: category.color }}
                    ></div>
                    <span className="text-sm font-medium">{category.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Time Input */}
            {selectedCategory && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-end space-x-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {categories.find(c => c.id === selectedCategory)?.name} 시간 입력
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="24"
                      step="0.5"
                      value={categoryTime}
                      onChange={(e) => handleTimeInput(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="시간을 입력하세요"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      채널 선택
                    </label>
                    <select
                      value={selectedChannel}
                      onChange={(e) => setSelectedChannel(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">채널을 선택하세요</option>
                      {channels.map((channel) => (
                        <option key={channel.id} value={channel.id}>
                          {channel.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    type="button"
                    onClick={addCategoryTime}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    추가
                  </button>
                </div>
              </div>
            )}

            {/* Current Time Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {categories.map((category) => (
                <div key={category.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: category.color }}
                      ></div>
                      <span className="text-sm font-medium text-gray-700">{category.name}</span>
                    </div>
                    {(formData[category.id as keyof typeof formData] as number) > 0 && (
                      <button
                        type="button"
                        onClick={() => removeCategoryTime(category.id)}
                        className="text-red-500 hover:text-red-700 text-xs"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                  <div className="text-lg font-bold text-gray-900">
                    {formData[category.id as keyof typeof formData] as number}시간
                  </div>
                </div>
              ))}
            </div>
            
            {/* Total Hours Display */}
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-blue-700">총 근무 시간:</span>
                <span className="text-xl font-bold text-blue-900">{totalHours}시간</span>
              </div>
            </div>
          </div>

          {/* Memo */}
          <div>
            <label htmlFor="memo" className="block text-sm font-medium text-gray-700 mb-2">
              메모
            </label>
            <textarea
              id="memo"
              rows={4}
              value={formData.memo}
              onChange={(e) => handleInputChange('memo', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="추가 메모나 특이사항을 입력하세요"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              저장하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DailyInputPage;
