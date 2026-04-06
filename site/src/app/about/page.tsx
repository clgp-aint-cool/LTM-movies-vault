import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Giới thiệu Lâm Thanh Mỹ | Tiểu sử diễn viên",
  description:
    "Tìm hiểu tiểu sử diễn viên Lâm Thanh Mỹ — sinh năm 2005, 'em bé ma' của màn ảnh Việt. Phim kinh dị: Đoạt hồn, Bóng đè, Cám. Phim khác: Tôi thấy hoa vàng trên cỏ xanh, Khe ước bán dâu.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "Giới thiệu Lâm Thanh Mỹ",
    description:
      "Tiểu sử diễn viên Lâm Thanh Mỹ — 'em bé ma' của màn ảnh Việt, nổi tiếng với các phim kinh dị Đoạt hồn, Bóng đè, Cám.",
  },
};

export default function AboutPage() {
  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: "url('/about.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/60"></div>

      <div className="relative z-10 p-6 sm:p-8 max-w-3xl mx-auto">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl">
          <h1 className="text-3xl font-bold mb-2 text-white">Giới thiệu</h1>
          <p className="text-white/60 text-sm mb-8 italic">Fan archive — không chính thức</p>

          <div className="space-y-6 text-white/90 text-base leading-relaxed">

            <section>
              <h2 className="text-xl font-semibold text-white mb-2">
                Lâm Thanh Mỹ — &quot;Em bé ma&quot; của màn ảnh Việt
              </h2>
              <p>
                <strong>Lâm Thanh Mỹ</strong> sinh năm <strong>2005</strong>, là một trong những
                diễn viên trẻ triển vọng nhất của điện ảnh Việt Nam. Dù không qua trường lớp
                diễn xuất chính quy, cô bé được đánh giá cao bởi lối diễn chân thật, tự nhiên —
                phẩm chất hiếm có ở một diễn viên tuổi teen.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-white/80 mb-2">
                Sự nghiệp điện ảnh
              </h3>
              <p>
                Lâm Thanh Mỹ bén duyên với nghệ thuật từ năm 3 tuổi và nhanh chóng ghi dấu
                trong lòng khán giả qua nhiều thể loại phim — từ <em>kinh dị</em>,{" "}
                <em>cổ trang</em> đến <em>tâm lý xã hội</em>. Cô từng gây ấn tượng trong các
                phim <strong>Tôi thấy hoa vàng trên cỏ xanh</strong> (2015),{" "}
                <strong>Siêu trộm</strong>, <strong>Nghề siêu dễ</strong> (2022), và đặc biệt
                là loạt phim kinh dị đình đám.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-white/80 mb-2">
                Phim kinh dị — Thế mạnh đặc trưng
              </h3>
              <p>
                Nhắc đến Lâm Thanh Mỹ, khán giả không thể không nhớ đến loạt phim kinh dị đã
                tạo nên tên tuổi cô: <strong>Đoạt hồn</strong> (2014),{" "}
                <strong>Bóng đè</strong> (2022), và gần đây nhất là <strong>Cám</strong> (2024)
                — bộ phim kinh dị cổ trang dựa trên truyện cổ tích Tấm Cám. Chính vì thế, cô
                được khán giả gọi bằng các danh xưng <strong>&quot;em bé ma của màn ảnh Việt&quot;</strong>{" "}
                và <strong>&quot;ma nhí đáng sợ nhất màn ảnh&quot;</strong>.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-white/80 mb-2">Phim nổi bật</h3>
              <ul className="list-disc list-inside space-y-1 text-white/80">
                <li><strong>Cám</strong> (2024) — Kinh dị cổ trang, đạo diễn Trần Hữu Tấn</li>
                <li><strong>Khe ước bán dâu</strong> (2025) — Kinh dị cổ trang, đạo diễn Lê Văn Kiệt</li>
                <li>
                  <strong>Tôi thấy hoa vàng trên cỏ xanh</strong> (2015) — Đạo diễn Victor Vũ
                </li>
                <li><strong>Bóng đè</strong> (2022) — Hài hành động, đạo diễn Võ Thanh Hòa</li>
                <li><strong>Đoạt hồn</strong> (2014) — Kinh dị, đạo diễn Trần Hàm</li>
                <li><strong>Nghề siêu dễ</strong> (2022) — Hài hành động</li>
                <li><strong>Vợ ba</strong> (2019) — Cổ trang tâm lý</li>
                <li><strong>Thất Sơn tâm linh</strong> (2019) — Kinh dị</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-white/80 mb-2">Trang này</h3>
              <p>
                Trang web này là kho lưu trữ cá nhân dành cho người hâm mộ, tổng hợp thông
                tin và phim điện ảnh của diễn viên Lâm Thanh Mỹ. Không liên kết hoặc đại diện
                cho đội ngũ quản lý hay công ty sản xuất của nghệ sĩ.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
