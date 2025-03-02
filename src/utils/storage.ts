import { User, AttendanceRecord } from '../types';

// User Management
export const getUsers = (): User[] => {
  const users = localStorage.getItem('users');
  return users ? JSON.parse(users) : [];
};

export const getUserById = (id: string): User | undefined => {
  const users = getUsers();
  return users.find(user => user.id === id);
};

export const getUsersByRole = (role: string): User[] => {
  const users = getUsers();
  return users.filter(user => user.role === role);
};

export const saveUser = (user: User): void => {
  const users = getUsers();
  const existingUserIndex = users.findIndex(u => u.id === user.id);
  
  if (existingUserIndex >= 0) {
    users[existingUserIndex] = user;
  } else {
    users.push(user);
  }
  
  localStorage.setItem('users', JSON.stringify(users));
};

// Authentication
export const getCurrentUser = (): User | null => {
  const currentUser = localStorage.getItem('currentUser');
  return currentUser ? JSON.parse(currentUser) : null;
};

export const setCurrentUser = (user: User | null): void => {
  if (user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
  } else {
    localStorage.removeItem('currentUser');
  }
};

// Attendance Records
export const getAttendanceRecords = (): AttendanceRecord[] => {
  const records = localStorage.getItem('attendanceRecords');
  return records ? JSON.parse(records) : [];
};

export const getAttendanceByUserId = (userId: string): AttendanceRecord[] => {
  const records = getAttendanceRecords();
  return records.filter(record => record.userId === userId);
};

export const saveAttendanceRecord = (record: AttendanceRecord): void => {
  const records = getAttendanceRecords();
  records.push(record);
  localStorage.setItem('attendanceRecords', JSON.stringify(records));
};

export const getTodayAttendance = (): AttendanceRecord[] => {
  const records = getAttendanceRecords();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return records.filter(record => {
    const recordDate = new Date(record.timestamp);
    recordDate.setHours(0, 0, 0, 0);
    return recordDate.getTime() === today.getTime();
  });
};
