import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Header from './components/Header';
import { getCurrentUser } from './utils/storage';
import './index.css';

function App() {
  useEffect(() => {
    // Include required fonts
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  const AuthRoute = ({ children }: { children: JSX.Element }) => {
    const currentUser = getCurrentUser();
    
    if (!currentUser) {
      return <Navigate to="/login" replace />;
    }
    
    return children;
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col" style={{ fontFamily: "'Inter', sans-serif" }}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/" element={
            <AuthRoute>
              <>
                <Header />
                <Dashboard />
              </>
            </AuthRoute>
          } />
          
          <Route path="/dashboard" element={
            <AuthRoute>
              <>
                <Header />
                <Dashboard />
              </>
            </AuthRoute>
          } />
          
          <Route path="/profile" element={
            <AuthRoute>
              <>
                <Header />
                <Profile />
              </>
            </AuthRoute>
          } />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
