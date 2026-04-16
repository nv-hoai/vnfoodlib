import React, { FC, useState } from 'react';
import ImageUploadForm from '../components/ImageUploadForm';
import { ClassificationResults } from '../components/ClassificationResults';
import Button from '../shared/components/Button';

interface ClassificationData {
  success: boolean;
  prediction: {
    class_id: number;
    class_slug: string;
    class_name: string;
    confidence: number;
    score: number;
  };
  top_5: Array<{
    class_id: number;
    class_slug: string;
    class_name: string;
    confidence: number;
    score: number;
  }>;
}

const ImageClassifierPage: FC = () => {
  const [classificationResult, setClassificationResult] = useState<ClassificationData | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<ClassificationData[]>([]);

  const handleClassificationSuccess = (data: ClassificationData) => {
    setClassificationResult(data);
    setHistory([data, ...history.slice(0, 9)]); // Keep last 10 results
  };

  const handleClearResult = () => {
    setClassificationResult(null);
  };

  return (
    <div className="flex-1 min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4">
            Nhận Diện Món Ăn Việt Nam
          </h1>
          <p className="text-lg opacity-90">
            Tải lên ảnh và AI sẽ giúp bạn xác định tên món ăn với độ chính xác cao
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upload Form */}
          <div className="lg:col-span-1 sticky top-20 h-fit">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-800">Tải Ảnh Lên</h2>
              <ImageUploadForm onClassificationSuccess={handleClassificationSuccess} />

              {classificationResult && (
                <Button
                  variant="outline"
                  onClick={handleClearResult}
                  className="w-full mt-4"
                >
                  Phân loại ảnh khác
                </Button>
              )}

              {history.length > 0 && (
                <>
                  <button
                    onClick={() => setShowHistory(!showHistory)}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium mt-6 mb-2"
                  >
                    {showHistory ? '▼' : '▶'} Lịch sử ({history.length})
                  </button>

                  {showHistory && (
                    <div className="space-y-2 mt-3 border-t pt-3">
                      {history.map((item, idx) => (
                        <button
                          key={idx}
                          onClick={() => setClassificationResult(item)}
                          className="block w-full text-left p-2 hover:bg-gray-100 rounded text-sm truncate"
                        >
                          <span className="font-medium">{item.prediction.class_name}</span>
                          <span className="text-gray-500 ml-1">
                            ({(item.prediction.confidence * 100).toFixed(0)}%)
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-2">
            {classificationResult ? (
              <div className="bg-white rounded-lg shadow-md p-8">
                <ClassificationResults
                  topPrediction={classificationResult.prediction}
                  top5={classificationResult.top_5}
                />
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <div className="text-6xl mb-4">📸</div>
                <h3 className="text-2xl font-semibold text-gray-700 mb-2">
                  Chưa có kết quả
                </h3>
                <p className="text-gray-600 mb-4">
                  Tải lên ảnh của một món ăn Việt Nam để bắt đầu!
                </p>
                <div className="space-y-2 text-left text-gray-600 max-w-sm mx-auto">
                  <p>✅ Hỗ trợ 103+ món ăn Việt truyền thống</p>
                  <p>✅ Nhận diện nhanh và chính xác</p>
                  <p>✅ Hiển thị top 5 kết quả phù hợp nhất</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Info Section */}
      <section className="bg-gray-100 py-16 px-4 mt-12">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
            Cách Sử Dụng
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                num: '1',
                title: 'Tải Ảnh',
                desc: 'Chọn ảnh của một món ăn hoặc kéo thả vào khu vực địa chỉ',
              },
              {
                num: '2',
                title: 'Phân Loại',
                desc: 'Nhấp nút "Phân Loại Ảnh" để AI xử lý',
              },
              {
                num: '3',
                title: 'Xem Kết Quả',
                desc: 'Kiểm tra kết quả kèm độ chính xác và top 5 gợi ý',
              },
            ].map((step) => (
              <div key={step.num} className="bg-white rounded-lg p-6 shadow">
                <div className="w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-lg mb-4">
                  {step.num}
                </div>
                <h3 className="font-bold text-lg mb-2 text-gray-800">{step.title}</h3>
                <p className="text-gray-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tips Section */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-4xl mx-auto bg-blue-50 border-l-4 border-blue-500 rounded-lg p-8">
          <h3 className="text-2xl font-bold mb-4 text-gray-800">💡 Mẹo Để Có Kết Quả Tốt Nhất</h3>
          <ul className="space-y-2 text-gray-700">
            <li>✓ Sử dụng ảnh chất lượng cao, ánh sáng tốt</li>
            <li>✓ Chụp từ nhiều góc độ khác nhau và thử lại nếu cần</li>
            <li>✓ Tránh ảnh mờ, sáng chói hoặc quá tối</li>
            <li>✓ Đảm bảo thức ăn được nhìn rõ ràng trong ảnh</li>
            <li>✓ Nếu độ chính xác thấp, thử với ảnh từ góc nhìn khác</li>
          </ul>
        </div>
      </section>
    </div>
  );
};

export default ImageClassifierPage;
