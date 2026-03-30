import React, { FC, FormEvent } from 'react';
import Button from '../shared/components/Button';

const ContactPage: FC = () => {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert('Form đã được gửi (tạm thời)');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Liên hệ với chúng tôi</h1>

      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <h3 className="font-semibold mb-2">Địa chỉ</h3>
            <p className="text-gray-600">123 Đường ABC, Quận XYZ, TP.HCM</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Email</h3>
            <p className="text-gray-600">support@myshop.com</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Điện thoại</h3>
            <p className="text-gray-600">(123) 456-7890</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Giờ làm việc</h3>
            <p className="text-gray-600">Thứ 2 - Thứ 6: 8:00 - 18:00</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Họ và tên</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Nội dung</label>
            <textarea
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              required
            ></textarea>
          </div>

          <Button type="submit" variant="primary">
            Gửi tin nhắn
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ContactPage;