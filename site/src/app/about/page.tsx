import type { Metadata } from "next";
import Link from "next/link";
import { languageAlternates } from "@/lib/i18n";
import { SITE_URL, absoluteUrl } from "@/lib/site";
import { movies } from "@/data/movies";

export const metadata: Metadata = {
  title: { absolute: "Lâm Thanh Mỹ là ai? Tiểu sử diễn viên 'em bé ma' màn ảnh Việt" },
  description:
    "Tiểu sử Lâm Thanh Mỹ: sinh năm 2005, đóng phim từ năm 5 tuổi, sinh viên Quan hệ công chúng ĐH Văn Lang. 'Em bé ma' của Đoạt hồn, Bóng đè, Cám, Khế ước bán dâu và Cộng Trừ Nhân Chia (2027).",
  alternates: {
    canonical: "/about",
    languages: languageAlternates("/about"),
  },
  openGraph: {
    title: "Lâm Thanh Mỹ là ai? Tiểu sử diễn viên 'em bé ma' màn ảnh Việt",
    description:
      "Tiểu sử diễn viên Lâm Thanh Mỹ — 'em bé ma' của màn ảnh Việt: tuổi, học vấn, sự nghiệp và danh sách phim.",
  },
};

// Nguồn kiểm chứng cho các thông tin trong tiểu sử
const SOURCES = [
  { outlet: "VTV", date: "22/07/2025", url: "https://vtv.vn/lam-thanh-my-phim-kinh-di-khong-la-lua-chon-duy-nhat-100250722014112499.htm" },
  { outlet: "VOV", date: "22/09/2025", url: "https://vov.vn/giai-tri/nghe-si/lam-thanh-my-toi-chua-san-sang-cho-vai-dien-phu-nu-truong-thanh-post1231481.vov" },
  { outlet: "Dân Trí", date: "07/11/2023", url: "https://dantri.com.vn/giai-tri/lam-thanh-my-ma-nhi-cua-man-anh-viet-va-cuoc-song-tuoi-18-gay-bat-ngo-20231107111255455.htm" },
  { outlet: "Bazaar Vietnam", url: "https://bazaarvietnam.vn/cong-tru-nhan-chia-moi-quan-he-bi-an-giua-co-giao-anh-thu-va-nu-sinh-lam-thanh-my/" },
];

// Vai có nguồn báo chí nhưng chưa có trong movies.ts
const ROLES: Record<string, string> = { "doat-hon": "Ái" };

const filmography = [...movies].sort((a, b) => b.year - a.year || a.title.localeCompare(b.title));

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfilePage",
      "@id": `${SITE_URL}/about#page`,
      url: absoluteUrl("/about"),
      name: "Lâm Thanh Mỹ là ai? Tiểu sử diễn viên 'em bé ma' màn ảnh Việt",
      inLanguage: "vi-VN",
      isPartOf: { "@id": `${SITE_URL}/#website` },
      mainEntity: { "@id": `${SITE_URL}/#person` },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Trang chủ", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Tiểu sử Lâm Thanh Mỹ", item: absoluteUrl("/about") },
      ],
    },
  ],
};

const h2 = "text-xl font-semibold text-white mb-2";

export default function AboutPage() {
  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: "url('/about.jpg')" }}
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="absolute inset-0 bg-black/60"></div>

      <div className="relative z-10 p-6 sm:p-8 max-w-3xl mx-auto">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl">
          <nav className="text-sm text-white/60 mb-4">
            <Link href="/" className="hover:underline">Trang chủ</Link> / Tiểu sử
          </nav>
          <h1 className="text-3xl font-bold mb-2 text-white">
            Lâm Thanh Mỹ là ai? Tiểu sử diễn viên &quot;em bé ma&quot; màn ảnh Việt
          </h1>
          <p className="text-white/60 text-sm mb-8 italic">Fan archive — không chính thức</p>

          <div className="space-y-8 text-white/90 text-base leading-relaxed">
            <section>
              <p>
                <strong>Lâm Thanh Mỹ</strong> (sinh năm <strong>2005</strong>) là nữ diễn viên điện ảnh
                Việt Nam, được khán giả gọi là <strong>&quot;em bé ma của màn ảnh Việt&quot;</strong> nhờ
                loạt vai trong các phim kinh dị <em>Đoạt hồn</em>, <em>Thất Sơn tâm linh</em>,{" "}
                <em>Bóng đè</em> và <em>Cám</em>. Cô cũng được nhớ đến với vai Mận trong{" "}
                <em>Tôi thấy hoa vàng trên cỏ xanh</em> (2015) và vai nàng dâu Nhài trong{" "}
                <em>Khế ước bán dâu</em> (2025).
              </p>
            </section>

            <section>
              <h2 className={h2}>Thông tin nhanh</h2>
              <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-white/85">
                <dt className="text-white/60">Họ tên</dt><dd>Lâm Thanh Mỹ</dd>
                <dt className="text-white/60">Năm sinh</dt><dd>2005</dd>
                <dt className="text-white/60">Nghề nghiệp</dt><dd>Diễn viên điện ảnh</dd>
                <dt className="text-white/60">Bắt đầu đóng phim</dt><dd>Từ năm 5 tuổi</dd>
                <dt className="text-white/60">Học vấn</dt><dd>Sinh viên ngành Quan hệ công chúng, Trường Đại học Văn Lang (TP.HCM)</dd>
                <dt className="text-white/60">Biệt danh</dt><dd>&quot;Em bé ma của màn ảnh Việt&quot;, &quot;ma nhí đáng sợ nhất màn ảnh&quot;</dd>
                <dt className="text-white/60">Phim sắp chiếu</dt>
                <dd><Link href="/sap-ra-mat" className="underline">Cộng Trừ Nhân Chia</Link> (dự kiến tháng 01/2027)</dd>
              </dl>
            </section>

            <section>
              <h2 className={h2}>Tuổi thơ và những vai diễn đầu tiên</h2>
              <p>
                Lâm Thanh Mỹ đóng phim từ năm 5 tuổi và không qua trường lớp diễn xuất chính quy,
                nhưng sớm được chú ý nhờ lối diễn tự nhiên, chân thật. Năm 2014 cô xuất hiện trong phim
                kinh dị <Link href="/movies/doat-hon" className="underline">Đoạt hồn</Link> của đạo diễn
                Hàm Trần với vai Ái. Một năm sau, vai Mận trong{" "}
                <Link href="/movies/toi-thay-hoa-vang-tren-co-xanh" className="underline">Tôi thấy hoa vàng trên cỏ xanh</Link>{" "}
                (đạo diễn Victor Vũ, chuyển thể tiểu thuyết của Nguyễn Nhật Ánh) đưa cô đến gần hơn với
                khán giả đại chúng.
              </p>
            </section>

            <section>
              <h2 className={h2}>&quot;Em bé ma&quot; của phim kinh dị Việt</h2>
              <p>
                Sau <em>Đoạt hồn</em>, Lâm Thanh Mỹ tiếp tục gắn bó với dòng phim kinh dị qua{" "}
                <Link href="/movies/that-son-tam-linh" className="underline">Thất Sơn tâm linh</Link> (2019,
                đạo diễn Hàm Trần) và <Link href="/movies/bong-de" className="underline">Bóng đè</Link> (2022,
                đạo diễn Lê Văn Kiệt). Những vai diễn này khiến khán giả gọi cô là &quot;em bé ma của màn
                ảnh Việt&quot;. Năm 2024, cô đảm nhận vai chính đầu tiên trên màn ảnh rộng — vai Cám trong{" "}
                <Link href="/movies/cam" className="underline">Cám</Link>, phim kinh dị cổ trang của đạo
                diễn Trần Hữu Tấn dựa trên những dị bản u tối của truyện cổ tích Tấm Cám.
              </p>
            </section>

            <section>
              <h2 className={h2}>Chuyển mình với những vai trưởng thành hơn</h2>
              <p>
                Năm 2025, Lâm Thanh Mỹ vào vai Nhài — một nàng dâu, người vợ và người mẹ ở làng quê Bắc Bộ
                thời phong kiến — trong <Link href="/movies/khe-uoc-ban-dau" className="underline">Khế ước bán dâu</Link>,
                lần thứ hai hợp tác với đạo diễn Lê Văn Kiệt sau <em>Bóng đè</em>. Cô chia sẻ với báo chí rằng
                phim kinh dị không phải lựa chọn duy nhất và mong được thử sức với nhiều màu sắc vai diễn
                khác nhau, dù tự nhận ngoại hình trẻ khiến mình chưa sẵn sàng cho các vai phụ nữ trưởng thành.
              </p>
              <p className="mt-3">
                Dự án tiếp theo của cô là <Link href="/movies/cong-tru-nhan-chia" className="underline">Cộng Trừ Nhân Chia</Link>,
                phim tâm lý – giật gân học đường của đạo diễn Irving Ly, nơi cô vào vai một nữ sinh bên cạnh
                Anh Thư trong vai cô giáo. Phim dự kiến khởi chiếu tháng 01/2027 —{" "}
                <Link href="/sap-ra-mat" className="underline">xem đếm ngược</Link>.
              </p>
            </section>

            <section>
              <h2 className={h2}>Học vấn và đời sống ngoài màn ảnh</h2>
              <p>
                Ngoài đóng phim, Lâm Thanh Mỹ theo học ngành Quan hệ công chúng tại Trường Đại học Văn
                Lang (TP.HCM). Theo VTV, cô có 12 năm liền là học sinh giỏi, đạt IELTS 7.0 và năm 2023 là
                đại biểu dự Đại hội đại biểu toàn quốc Hội Sinh viên Việt Nam lần thứ XI. Cô cũng cho biết
                có ý định theo học các khóa diễn xuất chuyên nghiệp trong và ngoài nước.
              </p>
            </section>

            <section>
              <h2 className={h2}>Danh sách phim của Lâm Thanh Mỹ</h2>
              <ul className="list-disc list-inside space-y-1 text-white/80">
                {filmography.map((m) => {
                  const role = m.role ?? ROLES[m.slug];
                  return (
                    <li key={m.slug}>
                      <Link href={`/movies/${m.slug}`} className="underline"><strong>{m.title}</strong></Link>{" "}
                      ({m.year}{m.releaseTentative ? ", dự kiến" : ""})
                      {role ? ` — vai ${role}` : ""}
                      {m.director ? ` · đạo diễn ${m.director}` : ""}
                    </li>
                  );
                })}
              </ul>
              <p className="mt-2 text-sm"><Link href="/movies" className="underline">Xem tất cả phim của Lâm Thanh Mỹ →</Link></p>
            </section>

            <section>
              <h2 className={h2}>Câu hỏi thường gặp về Lâm Thanh Mỹ</h2>
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-white">Lâm Thanh Mỹ sinh năm bao nhiêu?</h3>
                  <p>Lâm Thanh Mỹ sinh năm 2005.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-white">Lâm Thanh Mỹ học trường nào?</h3>
                  <p>Cô là sinh viên ngành Quan hệ công chúng, Trường Đại học Văn Lang (TP.HCM).</p>
                </div>
                <div>
                  <h3 className="font-semibold text-white">Vì sao Lâm Thanh Mỹ được gọi là &quot;em bé ma&quot;?</h3>
                  <p>Vì từ nhỏ cô đã đóng nhiều phim kinh dị như Đoạt hồn, Thất Sơn tâm linh, Bóng đè và Cám.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-white">Phim mới nhất của Lâm Thanh Mỹ là phim gì?</h3>
                  <p>
                    <Link href="/movies/cong-tru-nhan-chia" className="underline">Cộng Trừ Nhân Chia</Link>,
                    dự kiến khởi chiếu tháng 01/2027.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className={h2}>Tìm hiểu thêm</h2>
              <ul className="list-disc list-inside space-y-1 text-white/80">
                <li><Link href="/hanh-trinh" className="underline">Hành trình sự nghiệp theo từng năm</Link></li>
                <li><Link href="/bao-chi" className="underline">Báo chí nói gì về Lâm Thanh Mỹ</Link></li>
                <li><Link href="/quiz" className="underline">Quiz: Bạn hiểu Lâm Thanh Mỹ bao nhiêu?</Link></li>
              </ul>
            </section>

            <section>
              <h2 className={h2}>Nguồn tham khảo</h2>
              <ul className="list-disc list-inside space-y-1 text-white/70 text-sm">
                {SOURCES.map((s) => (
                  <li key={s.url}>
                    <a href={s.url} target="_blank" rel="noopener noreferrer" className="underline">{s.outlet}</a>
                    {s.date ? ` (${s.date})` : ""}
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className={h2}>Về trang này</h2>
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
