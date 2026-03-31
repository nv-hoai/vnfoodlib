import React, { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetFoodRankingQuery, useGetAllFoodsQuery } from '../features/foods/api/foodApi';
import Button from '../shared/components/Button';

const HomePage: FC = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useGetFoodRankingQuery({ limit: 10, sortBy: 'combined' });
  const { data: likeRankingData, isLoading: likeLoading } = useGetFoodRankingQuery({ limit: 10, sortBy: 'likes' });
  const { data: recommendRankingData, isLoading: recommendLoading } = useGetFoodRankingQuery({ limit: 10, sortBy: 'recommendations' });
  const { data: galleryData } = useGetAllFoodsQuery({ page: 1, limit: 6 });
  const rankings = data?.data?.foods || [];
  const likeRankings = likeRankingData?.data?.foods || [];
  const recommendRankings = recommendRankingData?.data?.foods || [];
  const galleryFoods = galleryData?.data?.foods || [];

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
          <Button 
            variant="primary" 
            className="text-lg px-10 py-4 h-auto"
            onClick={() => navigate('/foods')}
          >
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

      {/* Ranking Tables Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-2xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Likes Ranking Table */}
            <div>
              <h3 className="text-2xl font-bold text-center mb-6 text-gray-800">Xếp Hạng Lượt Thích</h3>
              <div className="bg-white rounded-lg shadow">
                {likeLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <p className="text-gray-600">Đang tải xếp hạng...</p>
                  </div>
                ) : likeRankings.length > 0 ? (
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-gradient-to-r from-red-500 to-pink-500 text-white">
                        <th className="px-3 py-2 text-left font-semibold w-8">STT</th>
                        <th className="px-3 py-2 text-left font-semibold w">Tên Món</th>
                        <th className="px-3 py-2 text-center font-semibold w-12">Thích</th>
                      </tr>
                    </thead>
                    <tbody>
                      {likeRankings.map((food: any, index: number) => (
                        <tr key={food._id} className="border-b last:border-b-0 hover:bg-gray-50 transition cursor-pointer" onClick={() => navigate(`/foods/${food._id}`)}>
                          <td className="px-3 py-2">
                            <span className="inline-flex items-center justify-center w-6 h-6 bg-red-100 text-red-600 font-bold rounded-full text-xs">
                              {index + 1}
                            </span>
                          </td>
                          <td className="px-3 py-2 font-medium text-gray-800 truncate">{food.name}</td>
                          <td className="px-3 py-2 text-center">
                            <span className="inline-block bg-red-100 text-red-700 px-2 py-0.5 rounded font-semibold text-xs">
                              {food.likeCount || 0}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="flex items-center justify-center py-8">
                    <p className="text-gray-600">Chưa có dữ liệu xếp hạng</p>
                  </div>
                )}
              </div>
            </div>

            {/* Recommendations Ranking Table */}
            <div>
              <h3 className="text-2xl font-bold text-center mb-6 text-gray-800">Xếp Hạng Đề Cử</h3>
              <div className="bg-white rounded-lg shadow">
                {recommendLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <p className="text-gray-600">Đang tải xếp hạng...</p>
                  </div>
                ) : recommendRankings.length > 0 ? (
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                        <th className="px-3 py-2 text-left font-semibold w-8">STT</th>
                        <th className="px-3 py-2 text-left font-semibold">Tên Món</th>
                        <th className="px-3 py-2 text-center font-semibold w-16">Đề Cử</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recommendRankings.map((food: any, index: number) => (
                        <tr key={food._id} className="border-b last:border-b-0 hover:bg-gray-50 transition cursor-pointer" onClick={() => navigate(`/foods/${food._id}`)}>
                          <td className="px-3 py-2">
                            <span className="inline-flex items-center justify-center w-6 h-6 bg-green-100 text-green-600 font-bold rounded-full text-xs">
                              {index + 1}
                            </span>
                          </td>
                          <td className="px-3 py-2 font-medium text-gray-800 truncate">{food.name}</td>
                          <td className="px-3 py-2 text-center">
                            <span className="inline-block bg-green-100 text-green-700 px-2 py-0.5 rounded font-semibold text-xs">
                              {food.recommendationCount || 0}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="flex items-center justify-center py-8">
                    <p className="text-gray-600">Chưa có dữ liệu xếp hạng</p>
                  </div>
                )}
              </div>
            </div>
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
            {galleryFoods.map((food: any) => {
              let imageUrl = food.image;
              
              // Handle image URL
              if (!imageUrl.startsWith('http')) {
                // Add leading slash if not present
                if (!imageUrl.startsWith('/')) {
                  imageUrl = '/' + imageUrl;
                }
                imageUrl = `http://localhost:5000${imageUrl}`;
              }
              
              return (
                <div
                  key={food._id}
                  className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition transform hover:scale-105 cursor-pointer bg-gray-200"
                  onClick={() => navigate(`/foods/${food._id}`)}
                >
                  {/* Image */}
                  <img
                    src={imageUrl}
                    alt={food.name}
                    className="w-full h-64 object-cover transition"
                    onError={(e) => {
                      const img = e.target as HTMLImageElement;
                      if (!img.src.includes('placeholder')) {
                        img.src = 'https://via.placeholder.com/300x240?text=' + encodeURIComponent(food.name);
                      }
                    }}
                  />

                  {/* Overlay - chỉ hiển thị khi hover */}
                  <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-40 transition pointer-events-none flex items-end p-4">
                    <div className="text-white">
                      <h3 className="text-xl font-bold">{food.name}</h3>
                      <p className="text-sm">{food.tags?.category?.[0] || 'Món ăn'}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="text-center mt-10">
            <Button 
              variant="outline"
              onClick={() => navigate('/foods')}
            >
              Xem Thêm Ảnh
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;