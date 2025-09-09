import React, { useState, useEffect } from 'react';
import { Employee, TeamStats } from '../types';

const TeamManagement: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [teamStats, setTeamStats] = useState<TeamStats[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEmployee, setNewEmployee] = useState<Omit<Employee, 'id'>>({
    name: '',
    team: '',
    position: ''
  });

  useEffect(() => {
    loadEmployees();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadEmployees = () => {
    const data = JSON.parse(localStorage.getItem('employees') || '[]') as Employee[];
    setEmployees(data);
    calculateTeamStats(data);
  };

  const calculateTeamStats = (employeeData: Employee[]) => {
    const teamMap = employeeData.reduce((acc, employee) => {
      if (!acc[employee.team]) {
        acc[employee.team] = [];
      }
      acc[employee.team].push(employee);
      return acc;
    }, {} as Record<string, Employee[]>);

    const stats = Object.entries(teamMap).map(([teamName, teamMembers]) => {
      const inputs = JSON.parse(localStorage.getItem('dailyInputs') || '[]');
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      
      const monthlyInputs = inputs.filter((input: any) => {
        const inputDate = new Date(input.date);
        return inputDate.getMonth() === currentMonth && 
               inputDate.getFullYear() === currentYear &&
               teamMembers.some(member => member.name === input.employeeName);
      });

      return {
        teamName,
        totalMembers: teamMembers.length,
        completedInputs: monthlyInputs.length,
        totalInputs: teamMembers.length * 20, // 20 working days
        completionRate: teamMembers.length > 0 ? (monthlyInputs.length / (teamMembers.length * 20)) * 100 : 0
      };
    });

    setTeamStats(stats);
  };

  const handleAddEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    
    const employee: Employee = {
      ...newEmployee,
      id: Date.now().toString()
    };

    const updatedEmployees = [...employees, employee];
    setEmployees(updatedEmployees);
    localStorage.setItem('employees', JSON.stringify(updatedEmployees));
    
    setNewEmployee({ name: '', team: '', position: '' });
    setShowAddForm(false);
    calculateTeamStats(updatedEmployees);
  };

  const handleDeleteEmployee = (id: string) => {
    if (window.confirm('정말로 이 직원을 삭제하시겠습니까?')) {
      const updatedEmployees = employees.filter(emp => emp.id !== id);
      setEmployees(updatedEmployees);
      localStorage.setItem('employees', JSON.stringify(updatedEmployees));
      calculateTeamStats(updatedEmployees);
    }
  };

  const teams = ['기획팀', '촬영팀', '편집팀', '마케팅팀', '경영지원팀'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">팀 관리</h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          직원 추가
        </button>
      </div>

      {/* Team Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teamStats.map((team, index) => (
          <div key={index} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{team.teamName}</h3>
              <span className="text-sm text-gray-500">{team.totalMembers}명</span>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">완료율</span>
                <span className="font-medium">{team.completionRate.toFixed(1)}%</span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${team.completionRate}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between text-xs text-gray-500">
                <span>{team.completedInputs} 완료</span>
                <span>{team.totalInputs} 예정</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Employee Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">새 직원 추가</h3>
            
            <form onSubmit={handleAddEmployee} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  직원명
                </label>
                <input
                  type="text"
                  id="name"
                  value={newEmployee.name}
                  onChange={(e) => setNewEmployee(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="team" className="block text-sm font-medium text-gray-700 mb-1">
                  팀
                </label>
                <select
                  id="team"
                  value={newEmployee.team}
                  onChange={(e) => setNewEmployee(prev => ({ ...prev, team: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">팀을 선택하세요</option>
                  {teams.map(team => (
                    <option key={team} value={team}>{team}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">
                  직책
                </label>
                <input
                  type="text"
                  id="position"
                  value={newEmployee.position}
                  onChange={(e) => setNewEmployee(prev => ({ ...prev, position: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="예: 팀장, 대리, 사원"
                  required
                />
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-medium transition-colors"
                >
                  추가
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 rounded-lg font-medium transition-colors"
                >
                  취소
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Employee List */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">직원 목록</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  직원명
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  팀
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  직책
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  등록일
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  작업
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {employees.length > 0 ? (
                employees.map((employee) => (
                  <tr key={employee.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                          <span className="text-xs text-gray-600">👤</span>
                        </div>
                        <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {employee.team}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {employee.position}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(employee.id).toLocaleDateString('ko-KR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleDeleteEmployee(employee.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        삭제
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center">
                      <span className="text-4xl mb-2">👥</span>
                      <p>등록된 직원이 없습니다.</p>
                      <p className="text-sm mt-1">직원 추가 버튼을 클릭하여 직원을 등록해보세요.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TeamManagement;
