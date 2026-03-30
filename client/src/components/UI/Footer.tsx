import React, { FC } from 'react';

const Footer: FC = () => {
  return (
    <footer className='bg-gray-800 text-white mt-auto'>
      <div className='container mx-auto px-4 py-8'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          <div>
            <h3 className='text-lg font-semibold mb-4'>Về chúng tôi</h3>
            <p className='text-gray-300'>
              Thư viện món ăn Việt Nam là một dự án nhằm giới thiệu và chia sẻ những công thức nấu ăn truyền thống của Việt Nam. Chúng tôi mong muốn mang đến cho mọi người cơ hội khám phá và thưởng thức những món ăn đặc sắc của đất nước.
            </p>
          </div>
          <div>
            <h3 className='text-lg font-semibold mb-4'>Liên kết nhanh</h3>
            <ul className='space-y-2'>
              <li><a href='/' className='text-gray-300 hover:text-white'>Trang chủ</a></li>
              <li><a href='/about' className='text-gray-300 hover:text-white'>Giới thiệu</a></li>
              <li><a href='/contact' className='text-gray-300 hover:text-white'>Liên hệ</a></li>
            </ul>
          </div>
          <div>
            <h3 className='text-lg font-semibold mb-4'>Liên hệ</h3>
            <p className='text-gray-300'>Email: info@thuvienmonan.vn</p>
            <p className='text-gray-300'>Điện thoại: +84 123 456 789</p>
          </div>
        </div>
        <div className='border-t border-gray-700 mt-8 pt-4 text-center text-gray-400'>
          &copy; 2026 Thư viện món ăn Việt Nam. Bản quyền thuộc về chúng tôi.
        </div>
      </div>
    </footer>
  );
};

export default Footer;