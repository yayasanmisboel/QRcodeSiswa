import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ChartBar, QrCode, Scan, Users } from 'lucide-react';
import { getCurrentUser, getAttendanceRecords, getTodayAttendance, getUsersByRole } from '../utils/storage';
import { AttendanceRecord, User } from '../types';
import QRCodeGenerator from '../components/QRCodeGenerator';
import QRScanner from '../components/QRScanner';

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('summary');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [todayAttendance, setTodayAttendance] = useState<AttendanceRecord[]>([]);
  const [students, setStudents] = useState<User[]>([]);
  const [teachers, setTeachers] = useState<User[]>([]);
  const [showScanner, setShowScanner] = useState(false);
  
  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      navigate('/login');
      return;
    }
    
    setCurrentUser(user);
    setTodayAttendance(getTodayAttendance());
    setStudents(getUsersByRole('siswa'));
    setTeachers(getUsersByRole('guru'));
  }, [navigate]);
  
  const handleScanSuccess = () => {
    // Refresh attendance data after successful scan
    setTodayAttendance(getTodayAttendance());
    setShowScanner(false);
  };
  
  if (!currentUser) return null;
  
  const renderContent = () => {
    switch (activeTab) {
      case 'summary':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <Users size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Total Students</div>
                    <div className="text-xl font-semibold">{students.length}</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-3 rounded-full">
                    <UserIcon size={20} className="text-green-600" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Total Teachers</div>
                    <div className="text-xl font-semibold">{teachers.length}</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="bg-purple-100 p-3 rounded-full">
                    <ChartBar size={20} className="text-purple-600" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Today's Attendance</div>
                    <div className="text-xl font-semibold">{todayAttendance.length}</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-5 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Today's Attendance</h3>
              {todayAttendance.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {todayAttendance.map((record) => (
                        <tr key={record.id}>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">{record.userName}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm capitalize">{record.userRole}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">
                            {format(record.timestamp, 'HH:mm:ss')}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">
                            <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                              {record.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  No attendance records for today
                </div>
              )}
            </div>
          </div>
        );
        
      case 'myQRCode':
        return (
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-center">My QR Code</h3>
            <div className="flex justify-center">
              <QRCodeGenerator value={currentUser.id} />
            </div>
            <p className="text-center mt-4 text-gray-600">
              Use this QR code to mark your attendance
            </p>
          </div>
        );
        
      case 'scanQR':
        return (
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-center">Scan QR Code</h3>
            
            {!showScanner ? (
              <div className="text-center">
                <button 
                  onClick={() => setShowScanner(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                >
                  Start Scanner
                </button>
                <p className="mt-2 text-gray-600">
                  Click to start the scanner and scan a user's QR code to mark their attendance
                </p>
              </div>
            ) : (
              <QRScanner 
                onScanSuccess={(user, record) => {
                  setTodayAttendance([...todayAttendance, record]);
                }}
              />
            )}
          </div>
        );
        
      default:
        return <div>Unknown tab</div>;
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Welcome, {currentUser.name}
          </h2>
          <p className="text-gray-600 capitalize">
            {currentUser.role} Dashboard | {format(new Date(), 'EEEE, MMMM d, yyyy')}
          </p>
        </div>
        
        <div className="mb-6 flex overflow-x-auto pb-2">
          <button 
            className={`px-4 py-2 rounded-md mr-2 whitespace-nowrap ${
              activeTab === 'summary' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
            onClick={() => setActiveTab('summary')}
          >
            Summary
          </button>
          
          <button 
            className={`px-4 py-2 rounded-md mr-2 whitespace-nowrap flex items-center ${
              activeTab === 'myQRCode' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
            onClick={() => setActiveTab('myQRCode')}
          >
            <QrCode size={16} className="mr-2" />
            My QR Code
          </button>
          
          {(currentUser.role === 'admin' || currentUser.role === 'guru') && (
            <button 
              className={`px-4 py-2 rounded-md mr-2 whitespace-nowrap flex items-center ${
                activeTab === 'scanQR' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => setActiveTab('scanQR')}
            >
              <Scan size={16} className="mr-2" />
              Scan QR
            </button>
          )}
        </div>
        
        {renderContent()}
      </div>
    </div>
  );
};

export default Dashboard;
