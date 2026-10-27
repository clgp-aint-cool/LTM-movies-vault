// Các mốc sự nghiệp NGOÀI phim (giải thưởng, sự kiện ra mắt, liên hoan phim…) cho trang /hanh-trinh.
// Phim trong src/data/movies.ts đã tự động có trên dòng thời gian — không cần thêm lại ở đây.
// Chỉ thêm mốc có nguồn kiểm chứng; điền `sourceUrl` để người xem tự đối chiếu.
//
// Ví dụ:
// {
//   date: "2025-10-01",               // YYYY-MM-DD, hoặc chỉ "2025"
//   kind: "award",                    // "award" | "event" | "milestone"
//   title: "Đề cử Nữ diễn viên chính xuất sắc – Giải ABC",
//   description: "Cho vai Cám trong phim Cám (2024).",
//   image: "/timeline/giai-abc.jpg",  // ảnh đặt trong public/timeline/ (tùy chọn)
//   sourceUrl: "https://...",
//   movie: "cam",                     // slug phim liên quan (tùy chọn)
// },
export type CareerEvent = {
  date: string;
  kind: "award" | "event" | "milestone";
  title: string;
  description?: string;
  image?: string;
  sourceUrl?: string;
  movie?: string;
};

export const careerEvents: CareerEvent[] = [];
