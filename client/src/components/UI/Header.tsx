import React, { FC, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Button from '../../shared/components/Button';
import { useLogoutMutation } from '../../features/auth/api/authApi';
import type { RootState } from '../../app/store';

const Header: FC = () => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // Get auth state
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const user = useSelector((state: RootState) => state.user);
  
  // Logout mutation
  const [logoutMutation] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logoutMutation().unwrap();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      navigate('/login');
    }
  };

  return (
    <header className='bg-white shadow-md'>
      <nav className='container mx-auto px-4 py-3 flex justify-between items-center h-16'>
        <Link to='/' className='text-xl font-bold text-blue-600 hover:text-blue-800 whitespace-nowrap'>
          Thư viện món ăn Việt Nam
        </Link>

        <ul className='flex-1 flex justify-start items-center gap-6 ml-8'>
          <li>
            <Link to='/' className='text-gray-700 hover:text-blue-600 transition'>
              Trang chủ
            </Link>
          </li>
          <li>
            <Link to='/meal-scheduling' className='text-gray-700 hover:text-blue-600 transition'>
              Lịch ăn
            </Link>
          </li>
          <li>
            <Link to='/collections' className='text-gray-700 hover:text-blue-600 transition'>
              Bộ sưu tập
            </Link>
          </li>
          <li>
            <Link to='/about' className='text-gray-700 hover:text-blue-600 transition'>
              Giới thiệu
            </Link>
          </li>
          <li>
            <Link to='/contact' className='text-gray-700 hover:text-blue-600 transition'>
              Liên hệ
            </Link>
          </li>
        </ul>

        <div className='flex justify-center items-center gap-2 ml-auto'>
          {isAuthenticated && user ? (
            // User logged in - show user menu
            <div className='relative'>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className='flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition'
              >
                <div className='w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold'>
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className='text-gray-700 font-medium'>{user.name}</span>
              </button>

              {isDropdownOpen && (
                <div className='absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50'>
                  <div className='px-4 py-3 border-b border-gray-100'>
                    <p className='text-sm font-semibold text-gray-900'>{user.name}</p>
                    <p className='text-xs text-gray-500'>{user.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      navigate('/profile');
                      setIsDropdownOpen(false);
                    }}
                    className='w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition'
                  >
                    Hồ sơ
                  </button>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsDropdownOpen(false);
                    }}
                    className='w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition border-t border-gray-100'
                  >
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            // User not logged in - show login/register buttons
            <>
              <Button 
                variant='outline' 
                className='text-sm'
                onClick={() => navigate('/login')}
              >
                Đăng nhập
              </Button>
              <Button 
                variant='primary' 
                className='text-sm'
                onClick={() => navigate('/register')}
              >
                Đăng ký
              </Button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;