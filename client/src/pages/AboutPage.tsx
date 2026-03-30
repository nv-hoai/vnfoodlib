import React, { FC } from 'react';

const AboutPage: FC = () => {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Về chúng tôi</h1>

      <div className="space-y-6">
        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-3">Câu chuyện của chúng tôi</h2>
          <p className="text-gray-700 leading-relaxed">
            MyShop được thành lập vào năm 2024 với sứ mệnh mang đến cho khách hàng
            những sản phẩm chất lượng nhất với giá cả hợp lý. Chúng tôi tin rằng mua
            sắm trực tuyến nên là một trải nghiệm thú vị và dễ dàng.
          </p>
        </section>

        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-3">Giá trị cốt lõi</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Chất lượng sản phẩm hàng đầu</li>
            <li>Dịch vụ khách hàng xuất sắc</li>
            <li>Giao hàng nhanh chóng</li>
            <li>Đổi trả dễ dàng trong 30 ngày</li>
          </ul>
        </section>

        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-3">Đội ngũ của chúng tôi</h2>
          <p className="text-gray-700 leading-relaxed">
            Chúng tôi là một nhóm các chuyên gia trẻ, năng động và đam mê về công nghệ
            và thương mại điện tử. Với kinh nghiệm trong nhiều lĩnh vực, chúng tôi cam kết
            mang đến trải nghiệm mua sắm tốt nhất cho khách hàng.
          </p>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;