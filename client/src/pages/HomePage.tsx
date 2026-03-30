import React, { FC } from 'react';
import Button from '../shared/components/Button';

const HomePage: FC = () => {
  // Sample ranking data
  const rankings = [
    { rank: 1, name: 'Phở Bò Hà Nội', votes: 2850, category: 'Phở' },
    { rank: 2, name: 'Bánh Mì Sài Gòn', votes: 2420, category: 'Bánh Mì' },
    { rank: 3, name: 'Cơm Tấm Tây Ninh', votes: 2150, category: 'Cơm' },
    { rank: 4, name: 'Bún Chả Hà Nội', votes: 1980, category: 'Bún' },
    { rank: 5, name: 'Nem Rán', votes: 1850, category: 'Nem' }
  ];

  // Sample gallery data
  const galleryImages = [
    { id: 1, title: 'Phở Bò', category: 'Phở' },
    { id: 2, title: 'Bánh Mì', category: 'Bánh Mì' },
    { id: 3, title: 'Cơm Tấm', category: 'Cơm' },
    { id: 4, title: 'Bún Chả', category: 'Bún' },
    { id: 5, title: 'Nem Rán', category: 'Nem' },
    { id: 6, title: 'Gỏi Cuốn', category: 'Gỏi' }
  ];

  return (
    <div className="flex-1">
      {/* Hero Section - Larger */}
      <section className="min-h-screen flex flex-col justify-center items-center text-center py-24 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="max-w-4xl px-4">
          <h1 className="text-6xl md:text-7xl font-bold text-gray-800 mb-6 leading-tight">
            Chào mừng đến với thư viện món ăn Việt Nam
          </h1>
          <p className="text-2xl md:text-3xl text-gray-600 mb-8 leading-relaxed">
            Khám phá hàng trăm món ăn đậm đà bản sắc dân tộc và giá trị ẩm thực truyền thống
          </p>
          <Button variant="primary" className="text-lg px-10 py-4 h-auto">
            Khám Phá Ngay
          </Button>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
            Về Thư Viện Món Ăn Việt Nam
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Khảo Cứu Đa Dạng</h3>
              <p className="text-gray-600">
                Tìm tòi và tìm hiểu về đa dạng các món ăn từ 63 tỉnh thành phố Việt Nam
              </p>
            </div>
            {/* Card 2 */}
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-purple-600">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Hướng Dẫn Nấu Ăn</h3>
              <p className="text-gray-600">
                Tìm các công thức, hướng dẫn chi tiết và mẹo nấu ăn từ những người chuyên gia
              </p>
            </div>
            {/* Card 3 */}
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-pink-100 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-pink-600">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Bình Chọn & Xếp Hạng</h3>
              <p className="text-gray-600">
                Bình chọn cho món ăn yêu thích và xem xếp hạng của cộng đồng ẩm thực
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Ranking Table Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
            Bảng Xếp Hạng Món Ăn
          </h2>
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                  <th className="px-6 py-4 text-left font-semibold">Xếp Hạng</th>
                  <th className="px-6 py-4 text-left font-semibold">Tên Món Ăn</th>
                  <th className="px-6 py-4 text-left font-semibold">Chuyên Mục</th>
                  <th className="px-6 py-4 text-center font-semibold">Lượt Bình Chọn</th>
                </tr>
              </thead>
              <tbody>
                {rankings.map((item) => (
                  <tr key={item.rank} className="border-b hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 font-bold rounded-full">
                        {item.rank}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-800">{item.name}</td>
                    <td className="px-6 py-4 text-gray-600">{item.category}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold">
                        {item.votes.toLocaleString()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="text-center mt-8">
            <Button variant="primary">
              Xem Tất Cả Xếp Hạng
            </Button>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
            Bộ Sưu Tập Món Ăn
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryImages.map((image) => (
              <div
                key={image.id}
                className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition transform hover:scale-105"
              >
                {/* Image Placeholder */}
                <div className="w-full h-64 bg-gradient-to-br from-orange-200 via-red-200 to-yellow-200 flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-700">{image.title}</span>
                </div>

                {/* Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition flex items-end p-4">
                  <div className="text-white opacity-0 group-hover:opacity-100 transition">
                    <h3 className="text-xl font-bold">{image.title}</h3>
                    <p className="text-sm">{image.category}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Button variant="outline">
              Xem Thêm Ảnh
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-500 to-purple-500">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Tham Gia Cộng Đồng Ẩm Thực
          </h2>
          <p className="text-lg text-blue-100 mb-8">
            Chia sẻ công thức, bình chọn món ăn yêu thích và kết nối với những người đam mê ẩm thực
          </p>
          <Button variant="outline" className="bg-white text-blue-600 hover:bg-gray-100">
            Đăng Ký Ngay
          </Button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;