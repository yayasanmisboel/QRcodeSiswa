export type UserRole = 'admin' | 'guru' | 'siswa';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  profileImage?: string;
  qrCode: string;
  createdAt: number;
}

export interface AttendanceRecord {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  timestamp: number;
  status: 'hadir' | 'izin' | 'sakit' | 'alpha';
  scannedBy?: string;
  notes?: string;
}
