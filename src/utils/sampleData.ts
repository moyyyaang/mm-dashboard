import { Employee } from '../types';

export const createSampleEmployees = (): Employee[] => {
  return [
    { id: '1', name: '김철수', team: '기획팀', position: '팀장' },
    { id: '2', name: '이영희', team: '기획팀', position: '대리' },
    { id: '3', name: '박민수', team: '기획팀', position: '사원' },
    { id: '4', name: '정수진', team: '촬영팀', position: '팀장' },
    { id: '5', name: '최동현', team: '촬영팀', position: '대리' },
    { id: '6', name: '한지영', team: '촬영팀', position: '사원' },
    { id: '7', name: '윤태호', team: '촬영팀', position: '사원' },
    { id: '8', name: '강미영', team: '편집팀', position: '팀장' },
    { id: '9', name: '서준호', team: '편집팀', position: '대리' },
    { id: '10', name: '임소영', team: '편집팀', position: '사원' },
    { id: '11', name: '조현우', team: '마케팅팀', position: '팀장' },
    { id: '12', name: '배수정', team: '마케팅팀', position: '대리' },
    { id: '13', name: '오성민', team: '경영지원팀', position: '팀장' },
    { id: '14', name: '신예린', team: '경영지원팀', position: '대리' },
  ];
};

export const initializeSampleData = () => {
  const existingEmployees = localStorage.getItem('employees');
  if (!existingEmployees || JSON.parse(existingEmployees).length === 0) {
    const sampleEmployees = createSampleEmployees();
    localStorage.setItem('employees', JSON.stringify(sampleEmployees));
    return sampleEmployees;
  }
  return JSON.parse(existingEmployees);
};
