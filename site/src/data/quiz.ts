// Câu hỏi cho /quiz. Chỉ dùng thông tin đã kiểm chứng (dữ liệu phim + báo chí trong press.ts).
// `answer` là vị trí đáp án đúng trong `options` (bắt đầu từ 0).
export type QuizQuestion = {
  question: string;
  options: string[];
  answer: number;
  explain: string;
  link?: string;
};

export const quiz: QuizQuestion[] = [
  {
    question: "Lâm Thanh Mỹ vào vai nào trong phim Cám (2024)?",
    options: ["Tấm", "Cám", "Dì ghẻ", "Bờm"],
    answer: 1,
    explain: "Cô đóng chính vai Cám — vai chính đầu tiên của cô trên màn ảnh rộng.",
    link: "/movies/cam",
  },
  {
    question: "Khán giả thường gọi Lâm Thanh Mỹ bằng biệt danh nào?",
    options: ["Em bé ma của màn ảnh Việt", "Nữ hoàng phòng vé", "Ngọc nữ màn ảnh", "Nàng thơ Cannes"],
    answer: 0,
    explain: "Nhờ loạt phim kinh dị như Đoạt hồn, Bóng đè, cô được gọi là “em bé ma của màn ảnh Việt”.",
    link: "/about",
  },
  {
    question: "Ai là đạo diễn phim Tôi thấy hoa vàng trên cỏ xanh (2015)?",
    options: ["Lê Văn Kiệt", "Hàm Trần", "Victor Vũ", "Trần Hữu Tấn"],
    answer: 2,
    explain: "Phim do Victor Vũ đạo diễn, chuyển thể từ tiểu thuyết của Nguyễn Nhật Ánh.",
    link: "/movies/toi-thay-hoa-vang-tren-co-xanh",
  },
  {
    question: "Trong Tôi thấy hoa vàng trên cỏ xanh, Lâm Thanh Mỹ đóng vai ai?",
    options: ["Trà Long", "Nhài", "Mây", "Mận"],
    answer: 3,
    explain: "Cô đóng vai Mận — vai diễn giúp cô được khán giả nhớ tới từ nhỏ.",
    link: "/movies/toi-thay-hoa-vang-tren-co-xanh",
  },
  {
    question: "Bóng đè (2022) và Khế ước bán dâu (2025) có chung đạo diễn nào?",
    options: ["Lê Văn Kiệt", "Victor Vũ", "Võ Thanh Hòa", "Ash Mayfair"],
    answer: 0,
    explain: "Cả hai phim đều do Lê Văn Kiệt đạo diễn.",
    link: "/movies/khe-uoc-ban-dau",
  },
  {
    question: "Lâm Thanh Mỹ vào vai Nhài trong phim nào?",
    options: ["Vợ ba", "Khế ước bán dâu", "Thất Sơn Tâm Linh", "Cám"],
    answer: 1,
    explain: "Nhài là người vợ trẻ thời phong kiến trong Khế ước bán dâu (2025).",
    link: "/movies/khe-uoc-ban-dau",
  },
  {
    question: "Phim nào sau đây KHÔNG phải phim kinh dị?",
    options: ["Đoạt hồn", "Bóng đè", "Nghề siêu dễ", "Thất Sơn Tâm Linh"],
    answer: 2,
    explain: "Nghề siêu dễ (2022) là phim hài hành động, làm lại từ phim Hàn Quốc Nghề siêu khó.",
    link: "/movies/nghe-sieu-de",
  },
  {
    question: "Phim Cám khởi chiếu tại Việt Nam vào ngày nào?",
    options: ["02/10/2015", "12/09/2025", "24/04/2026", "20/09/2024"],
    answer: 3,
    explain: "Cám ra rạp ngày 20/09/2024.",
    link: "/movies/cam",
  },
  {
    question: "Phim kinh dị Đoạt hồn (2014) do ai đạo diễn?",
    options: ["Hàm Trần", "Trần Hữu Tấn", "Victor Vũ", "Lê Văn Kiệt"],
    answer: 0,
    explain: "Đoạt hồn do Hàm Trần đạo diễn — ông cũng làm Thất Sơn Tâm Linh.",
    link: "/movies/doat-hon",
  },
  {
    question: "Theo VTV (2025), Lâm Thanh Mỹ theo học ngành gì tại ĐH Văn Lang?",
    options: ["Đạo diễn điện ảnh", "Quan hệ công chúng", "Ngôn ngữ Anh", "Thiết kế thời trang"],
    answer: 1,
    explain: "Cô học ngành Quan hệ công chúng để mở rộng kiến thức, song song với diễn xuất.",
    link: "/bao-chi",
  },
];
