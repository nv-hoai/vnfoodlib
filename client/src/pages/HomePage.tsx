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
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Likes Ranking Table */}
            <div className="flex flex-col">
              <h3 className="text-2xl font-bold text-center mb-6 text-gray-800">Xếp Hạng Lượt Thích</h3>
              {likeLoading ? (
                <div className="flex items-center justify-center py-8">
                  <p className="text-gray-600">Đang tải xếp hạng...</p>
                </div>
              ) : likeRankings.length > 0 ? (
                <div className="space-y-4 flex-1">
                  {/* Top 1 - Featured Card */}
                  {likeRankings[0] && (
                    <div
                      className="bg-gradient-to-r from-red-500 to-pink-500 rounded-lg shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition transform hover:scale-105"
                      onClick={() => navigate(`/foods/${likeRankings[0]._id}`)}
                    >
                      <div className="flex items-center p-4 gap-4">
                        <div className="flex-shrink-0">
                          <div className="flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-md">
                            <span className="text-3xl font-bold text-red-600">🥇</span>
                          </div>
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-bold text-white truncate">{likeRankings[0].name}</h4>
                          <p className="text-white text-sm opacity-90">{likeRankings[0].tags?.category?.[0] || 'Món ăn'}</p>
                          <p className="text-white font-bold mt-1">❤️ {likeRankings[0].likeCount || 0} lượt thích</p>
                        </div>
                        <img
                          src={(() => {
                            let url = likeRankings[0].image;
                            if (!url.startsWith('http')) {
                              if (!url.startsWith('/')) url = '/' + url;
                              url = `http://localhost:5000${url}`;
                            }
                            return url;
                          })()}
                          alt={likeRankings[0].name}
                          className="w-20 h-20 object-cover rounded shadow"
                          onError={(e) => {
                            const img = e.target as HTMLImageElement;
                            if (!img.src.includes('placeholder')) {
                              img.src = 'https://via.placeholder.com/80x80?text=Ảnh';
                            }
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Rest of Rankings */}
                  {likeRankings.length > 1 && (
                    <div className="bg-white rounded-lg shadow">
                      <table className="w-full text-sm">
                        <tbody>
                          {likeRankings.slice(1).map((food: any, index: number) => (
                            <tr
                              key={food._id}
                              className="border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition cursor-pointer"
                              onClick={() => navigate(`/foods/${food._id}`)}
                            >
                              <td className="px-4 py-3 w-10">
                                <span className="inline-flex items-center justify-center w-8 h-8 bg-red-100 text-red-600 font-bold rounded-full text-xs">
                                  {index + 2}
                                </span>
                              </td>
                              <td className="px-4 py-3 font-medium text-gray-800">{food.name}</td>
                              <td className="px-4 py-3 text-right">
                                <span className="inline-block bg-red-100 text-red-700 px-3 py-1 rounded-full font-semibold text-xs">
                                  ❤️ {food.likeCount || 0}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-center py-8">
                  <p className="text-gray-600">Chưa có dữ liệu xếp hạng</p>
                </div>
              )}
            </div>

            {/* Recommendations Ranking Table */}
            <div className="flex flex-col h-full">
              <h3 className="text-2xl font-bold text-center mb-6 text-gray-800">Xếp Hạng Đề Cử</h3>
              {recommendLoading ? (
                <div className="flex items-center justify-center py-8">
                  <p className="text-gray-600">Đang tải xếp hạng...</p>
                </div>
              ) : recommendRankings.length > 0 ? (
                <div className="space-y-4 flex-1">
                  {/* Top 1 - Featured Card */}
                  {recommendRankings[0] && (
                    <div
                      className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition transform hover:scale-105"
                      onClick={() => navigate(`/foods/${recommendRankings[0]._id}`)}
                    >
                      <div className="flex items-center p-4 gap-4">
                        <div className="flex-shrink-0">
                          <div className="flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-md">
                            <span className="text-3xl font-bold text-green-600">🥇</span>
                          </div>
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-bold text-white truncate">{recommendRankings[0].name}</h4>
                          <p className="text-white text-sm opacity-90">{recommendRankings[0].tags?.category?.[0] || 'Món ăn'}</p>
                          <p className="text-white font-bold mt-1">⭐ {recommendRankings[0].recommendationCount || 0} đề cử</p>
                        </div>
                        <img
                          src={(() => {
                            let url = recommendRankings[0].image;
                            if (!url.startsWith('http')) {
                              if (!url.startsWith('/')) url = '/' + url;
                              url = `http://localhost:5000${url}`;
                            }
                            return url;
                          })()}
                          alt={recommendRankings[0].name}
                          className="w-20 h-20 object-cover rounded shadow"
                          onError={(e) => {
                            const img = e.target as HTMLImageElement;
                            if (!img.src.includes('placeholder')) {
                              img.src = 'https://via.placeholder.com/80x80?text=Ảnh';
                            }
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Rest of Rankings */}
                  {recommendRankings.length > 1 && (
                    <div className="bg-white rounded-lg shadow">
                      <table className="w-full text-sm">
                        <tbody>
                          {recommendRankings.slice(1).map((food: any, index: number) => (
                            <tr
                              key={food._id}
                              className="border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition cursor-pointer"
                              onClick={() => navigate(`/foods/${food._id}`)}
                            >
                              <td className="px-4 py-3 w-10">
                                <span className="inline-flex items-center justify-center w-8 h-8 bg-green-100 text-green-600 font-bold rounded-full text-xs">
                                  {index + 2}
                                </span>
                              </td>
                              <td className="px-4 py-3 font-medium text-gray-800">{food.name}</td>
                              <td className="px-4 py-3 text-right">
                                <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold text-xs">
                                  ⭐ {food.recommendationCount || 0}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-center py-8">
                  <p className="text-gray-600">Chưa có dữ liệu xếp hạng</p>
                </div>
              )}
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