import React, { useState, useEffect } from 'react';

interface AppSettings {
  workingDaysPerMonth: number;
  defaultWorkingHours: number;
  notificationEnabled: boolean;
  autoSave: boolean;
  theme: 'light' | 'dark';
}

const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<AppSettings>({
    workingDaysPerMonth: 20,
    defaultWorkingHours: 8,
    notificationEnabled: true,
    autoSave: true,
    theme: 'light'
  });

  const [showResetModal, setShowResetModal] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = () => {
    const savedSettings = localStorage.getItem('appSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  };

  const saveSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    localStorage.setItem('appSettings', JSON.stringify(newSettings));
  };

  const handleSettingChange = (key: keyof AppSettings, value: any) => {
    const newSettings = { ...settings, [key]: value };
    saveSettings(newSettings);
  };

  const handleResetData = () => {
    if (window.confirm('정말로 모든 데이터를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      localStorage.removeItem('dailyInputs');
      localStorage.removeItem('employees');
      localStorage.removeItem('appSettings');
      setSettings({
        workingDaysPerMonth: 20,
        defaultWorkingHours: 8,
        notificationEnabled: true,
        autoSave: true,
        theme: 'light'
      });
      alert('모든 데이터가 삭제되었습니다.');
    }
  };

  const exportData = () => {
    const dailyInputs = JSON.parse(localStorage.getItem('dailyInputs') || '[]');
    const employees = JSON.parse(localStorage.getItem('employees') || '[]');
    
    const exportData = {
      dailyInputs,
      employees,
      settings,
      exportDate: new Date().toISOString()
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `mm-dashboard-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        
        if (data.dailyInputs) {
          localStorage.setItem('dailyInputs', JSON.stringify(data.dailyInputs));
        }
        if (data.employees) {
          localStorage.setItem('employees', JSON.stringify(data.employees));
        }
        if (data.settings) {
          localStorage.setItem('appSettings', JSON.stringify(data.settings));
          setSettings(data.settings);
        }
        
        alert('데이터가 성공적으로 가져와졌습니다.');
      } catch (error) {
        alert('파일 형식이 올바르지 않습니다.');
      }
    };
    reader.readAsText(file);
  };

  const SettingItem: React.FC<{ 
    title: string; 
    description: string; 
    children: React.ReactNode 
  }> = ({ title, description, children }) => (
    <div className="flex items-center justify-between py-4 border-b border-gray-200 last:border-b-0">
      <div className="flex-1">
        <h3 className="text-sm font-medium text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <div className="ml-4">
        {children}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">설정</h1>

      {/* General Settings */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">일반 설정</h2>
        
        <SettingItem
          title="월 근무일 수"
          description="한 달 기준 근무일 수를 설정합니다"
        >
          <input
            type="number"
            min="1"
            max="31"
            value={settings.workingDaysPerMonth}
            onChange={(e) => handleSettingChange('workingDaysPerMonth', parseInt(e.target.value))}
            className="w-20 px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </SettingItem>

        <SettingItem
          title="기본 근무 시간"
          description="하루 기본 근무 시간을 설정합니다"
        >
          <input
            type="number"
            min="1"
            max="24"
            step="0.5"
            value={settings.defaultWorkingHours}
            onChange={(e) => handleSettingChange('defaultWorkingHours', parseFloat(e.target.value))}
            className="w-20 px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </SettingItem>

        <SettingItem
          title="알림 활성화"
          description="입력 누락 시 알림을 받습니다"
        >
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.notificationEnabled}
              onChange={(e) => handleSettingChange('notificationEnabled', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </SettingItem>

        <SettingItem
          title="자동 저장"
          description="입력 시 자동으로 저장됩니다"
        >
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.autoSave}
              onChange={(e) => handleSettingChange('autoSave', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </SettingItem>
      </div>

      {/* Data Management */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">데이터 관리</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">데이터 내보내기</h3>
              <p className="text-sm text-gray-500">모든 데이터를 JSON 파일로 내보냅니다</p>
            </div>
            <button
              onClick={exportData}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              내보내기
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">데이터 가져오기</h3>
              <p className="text-sm text-gray-500">JSON 파일에서 데이터를 가져옵니다</p>
            </div>
            <label className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer">
              가져오기
              <input
                type="file"
                accept=".json"
                onChange={importData}
                className="hidden"
              />
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">데이터 초기화</h3>
              <p className="text-sm text-gray-500">모든 데이터를 삭제합니다 (복구 불가)</p>
            </div>
            <button
              onClick={() => setShowResetModal(true)}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              초기화
            </button>
          </div>
        </div>
      </div>

      {/* App Information */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">앱 정보</h2>
        
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex justify-between">
            <span>버전:</span>
            <span>1.0.0</span>
          </div>
          <div className="flex justify-between">
            <span>빌드 날짜:</span>
            <span>{new Date().toLocaleDateString('ko-KR')}</span>
          </div>
          <div className="flex justify-between">
            <span>개발자:</span>
            <span>M/M 관리팀</span>
          </div>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">데이터 초기화 확인</h3>
            <p className="text-sm text-gray-600 mb-6">
              정말로 모든 데이터를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={handleResetData}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-medium transition-colors"
              >
                삭제
              </button>
              <button
                onClick={() => setShowResetModal(false)}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 rounded-lg font-medium transition-colors"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
