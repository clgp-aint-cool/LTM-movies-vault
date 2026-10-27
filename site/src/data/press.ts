// "Báo chí nói gì" — bài báo / phỏng vấn thật về Lâm Thanh Mỹ.
// Thêm bài mới: copy một mục, điền đúng tên báo, tiêu đề, link và ngày đăng.
// `quote` (tùy chọn): chỉ trích nguyên văn câu nói NGẮN có trong bài (dưới ~15 chữ).
export type PressItem = {
  outlet: string;
  title: string;
  url: string;
  date: string; // YYYY-MM-DD
  quote?: string;
  movie?: string; // slug phim liên quan, nếu có
};

export const press: PressItem[] = [
  {
    outlet: "VOV",
    title: "Lâm Thanh Mỹ: \"Tôi chưa sẵn sàng cho vai diễn phụ nữ trưởng thành\"",
    url: "https://vov.vn/giai-tri/nghe-si/lam-thanh-my-toi-chua-san-sang-cho-vai-dien-phu-nu-truong-thanh-post1231481.vov",
    date: "2025-09-22",
    quote: "Tôi chưa sẵn sàng cho vai diễn phụ nữ trưởng thành",
    movie: "khe-uoc-ban-dau",
  },
  {
    outlet: "VnExpress",
    title: "Lâm Thanh Mỹ đóng người vợ thời phong kiến",
    url: "https://vnexpress.net/lam-thanh-my-dong-nguoi-vo-thoi-phong-kien-4930811.html",
    date: "2025-08-24",
    movie: "khe-uoc-ban-dau",
  },
  {
    outlet: "Thanh Niên",
    title: "'Sao nhí' Lâm Thanh Mỹ áp lực khi lần đầu đóng cảnh tình cảm",
    url: "https://thanhnien.vn/sao-nhi-lam-thanh-my-ap-luc-khi-lan-dau-dong-canh-tinh-cam-185250824163155461.htm",
    date: "2025-08-24",
    movie: "khe-uoc-ban-dau",
  },
  {
    outlet: "VTV",
    title: "Lâm Thanh Mỹ: Phim kinh dị không là lựa chọn duy nhất",
    url: "https://vtv.vn/lam-thanh-my-phim-kinh-di-khong-la-lua-chon-duy-nhat-100250722014112499.htm",
    date: "2025-07-22",
  },
  {
    outlet: "Kenh14",
    title: "Nàng thơ phim kinh dị Việt: Với vai Cám, tôi không muốn bị gọi là diễn viên nhí",
    url: "https://kenh14.vn/nang-tho-phim-kinh-di-viet-voi-vai-cam-toi-khong-muon-bi-goi-la-dien-vien-nhi-215240925072054915.chn",
    date: "2024-09-25",
    quote: "Với vai Cám, tôi không muốn bị gọi là diễn viên nhí",
    movie: "cam",
  },
  {
    outlet: "Dân Trí",
    title: "\"Ma nhí\" Lâm Thanh Mỹ: \"Gia đình sẽ bàn bạc nếu tôi phải đóng cảnh nóng\"",
    url: "https://dantri.com.vn/giai-tri/ma-nhi-lam-thanh-my-gia-dinh-se-ban-bac-neu-toi-phai-dong-canh-nong-20240920175052000.htm",
    date: "2024-09-20",
    movie: "cam",
  },
  {
    outlet: "VnExpress",
    title: "Dàn diễn viên đóng phim kinh dị đầu tiên về Tấm Cám",
    url: "https://vnexpress.net/dan-dien-vien-dong-phim-kinh-di-dau-tien-ve-tam-cam-4771522.html",
    date: "2024-07-30",
    movie: "cam",
  },
  {
    outlet: "Dân Trí",
    title: "Lâm Thanh Mỹ: \"Ma nhí\" của màn ảnh Việt và cuộc sống tuổi 18 gây bất ngờ",
    url: "https://dantri.com.vn/giai-tri/lam-thanh-my-ma-nhi-cua-man-anh-viet-va-cuoc-song-tuoi-18-gay-bat-ngo-20231107111255455.htm",
    date: "2023-11-07",
  },
];

export function getPressForMovie(slug: string): PressItem[] {
  return press.filter((p) => p.movie === slug);
}
