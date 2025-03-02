import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Menu } from 'lucide-react';
import { getCurrentUser, setCurrentUser } from '../utils/storage';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  
  const handleLogout = () => {
    setCurrentUser(null);
    navigate('/login');
  };
  
  const navigateTo = (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
  };
  
  if (!currentUser) return null;
  
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <h1 
            className="text-xl font-bold text-blue-600 cursor-pointer" 
            onClick={() => navigate('/')}
          >
            AbsensiQR
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <button 
              className="flex items-center gap-2 text-sm font-medium"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {currentUser.profileImage ? (
                <img 
                  src={currentUser.profileImage} 
                  alt="Profile" 
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <UserIcon size={16} className="text-blue-600" />
                </div>
              )}
              <span className="hidden md:inline">{currentUser.name}</span>
              <Menu size={16} />
            </button>
            
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                <div className="px-4 py-2 text-sm text-gray-700 border-b">
                  <div className="font-semibold">{currentUser.name}</div>
                  <div className="text-gray-400 capitalize">{currentUser.role}</div>
                </div>
                
                <button 
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                  onClick={() => navigateTo('/profile')}
                >
                  <UserIcon size={16} />
                  Profile
                </button>
                
                <button 
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center gap-2"
                  onClick={handleLogout}
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
