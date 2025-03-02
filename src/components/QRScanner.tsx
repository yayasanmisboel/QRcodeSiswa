import { useState } from 'react';
import { QrReader } from 'react-qr-reader';
import { User, AttendanceRecord } from '../types';
import { saveAttendanceRecord, getUserById, getCurrentUser } from '../utils/storage';

interface QRScannerProps {
  onScanSuccess?: (user: User, record: AttendanceRecord) => void;
}

const QRScanner = ({ onScanSuccess }: QRScannerProps) => {
  const [isScanning, setIsScanning] = useState(true);
  const [scanError, setScanError] = useState<string | null>(null);
  const [scanSuccess, setScanSuccess] = useState(false);
  const [scannedUser, setScannedUser] = useState<User | null>(null);
  
  const handleScan = (result: any) => {
    if (!result || !result.text) return;
    
    try {
      // Stop scanning once we get a result
      setIsScanning(false);
      
      // Parse the QR code data (should be the user ID)
      const scannedUserId = result.text;
      const user = getUserById(scannedUserId);
      
      if (!user) {
        setScanError('User not found. Invalid QR code.');
        return;
      }
      
      setScannedUser(user);
      setScanSuccess(true);
      
      // Create attendance record
      const currentUser = getCurrentUser();
      
      const attendanceRecord: AttendanceRecord = {
        id: Date.now().toString(),
        userId: user.id,
        userName: user.name,
        userRole: user.role,
        timestamp: Date.now(),
        status: 'hadir',
        scannedBy: currentUser?.id,
        notes: `Attendance marked by ${currentUser?.name || 'system'}`
      };
      
      // Save attendance record
      saveAttendanceRecord(attendanceRecord);
      
      // Notify parent component
      if (onScanSuccess) {
        onScanSuccess(user, attendanceRecord);
      }
      
    } catch (error) {
      setScanError('Error processing QR code. Please try again.');
      setIsScanning(true);
    }
  };
  
  const handleError = (error: Error) => {
    setScanError(`Camera error: ${error.message}`);
  };
  
  const resetScanner = () => {
    setScanError(null);
    setScanSuccess(false);
    setScannedUser(null);
    setIsScanning(true);
  };
  
  return (
    <div className="w-full max-w-md mx-auto">
      {scanError && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {scanError}
          <button 
            className="ml-2 text-red-600 font-medium"
            onClick={resetScanner}
          >
            Try Again
          </button>
        </div>
      )}
      
      {scanSuccess && scannedUser && (
        <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-md">
          <div className="font-medium">Attendance Recorded!</div>
          <div>Name: {scannedUser.name}</div>
          <div className="capitalize">Role: {scannedUser.role}</div>
          <div>Time: {new Date().toLocaleTimeString()}</div>
          <button 
            className="mt-2 px-3 py-1 bg-green-600 text-white rounded-md"
            onClick={resetScanner}
          >
            Scan Another
          </button>
        </div>
      )}
      
      {isScanning && (
        <div className="overflow-hidden rounded-md">
          <QrReader
            constraints={{ facingMode: 'environment' }}
            onResult={handleScan}
            onError={handleError}
            containerStyle={{ width: '100%' }}
            videoStyle={{ width: '100%' }}
          />
          <div className="text-center mt-2 text-sm text-gray-600">
            Point camera at a QR code to record attendance
          </div>
        </div>
      )}
    </div>
  );
};

export default QRScanner;
