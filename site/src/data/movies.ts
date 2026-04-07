export type Movie = {
  slug: string;
  title: string;
  year: number;
  description: string;
  posterUrl: string; // Can be remote or in public/
  videoUrl: string; // mp4/hls URL; can be remote for now
  durationMinutes?: number;
};

export type Actress = {
  name: string;
  bio: string;
  avatarUrl: string;
};

export const actress: Actress = {
  name: "Lâm Thanh Mỹ",
  bio: "Lâm Thanh Mỹ sinh năm 2005, bén duyên với nghệ thuật từ năm 3 tuổi \n . Dù không qua trường lớp diễn xuất, nhưng cô bé lại được đánh giá cao do sở hữu lối diễn chân thật. Lâm Thanh Mỹ từng gây ấn tượng trong các phim Tôi thấy hoa vàng trên cỏ xanh, Siêu trộm, Nghề siêu dễ...Đặc biệt, do từng tham gia nhiều phim kinh dị như Đoạt hồn, Bóng đè... nên Lâm Thanh Mỹ được khán giả gọi bằng các danh xưng 'em bé ma của màn ảnh Việt', 'ma nhí đáng sợ nhất màn ảnh'",
  avatarUrl: "/avatar.png",
};

export const movies: Movie[] = [
  {
    slug: "cam",
    title: "Cám",
    year: 2024,
    description:
      "Cám, hay còn được biết đến với tên cũ Con Cám, là một bộ phim điện ảnh Việt Nam thuộc thể loại kinh dị – cổ trang ra mắt năm 2024 do Trần Hữu Tấn làm đạo diễn kiêm biên kịch và Hoàng Quân làm nhà sản xuất, dựa trên những dị bản kinh dị của truyện cổ tích Tấm Cám.",
    posterUrl: "/poster/cam.jpg",
    videoUrl:
      "https://drive.google.com/file/d/1PUYa7fz_EDMNNgbRevTEpu7kMHPQj2zO/view?usp=sharing",
    durationMinutes: 140,
  },

  {
    slug: "toi-thay-hoa-vang-tren-co-xanh",
    title: "Tôi thấy hoa vàng trên cỏ xanh",
    year: 2015,
    description:
      "Tôi thấy hoa vàng trên cỏ xanh là phim điện ảnh được chuyển thể từ tiểu thuyết cùng tên của nhà văn Nguyễn Nhật Ánh. Bộ phim do Victor Vũ đạo diễn, được hợp tác sản xuất bởi Galaxy Media & Entertainment, Saigon Concert, PS Việt Nam, Hãng phim Phương Nam & Truyền hình K+ với sự đầu tư của Cục Điện ảnh Việt Nam.",
    posterUrl: "/poster/toi-thay-hoa-vang-tren-co-xanh.jpg",
    videoUrl:
      "https://drive.google.com/file/d/1r4UzRUCHSLvbWa1jf0g3FTVRAx_PVmVc/view?usp=sharing",
    durationMinutes: 140,
  },

  {
    slug: "khe-uoc-ban-dau",
    title: "Khe ước bán dâu",
    year: 2025,
    description:
      "Khế ước bán dâu: Lời nguyền đêm trăng hay gọi ngắn là Khế ước bán dâu là một bộ phim điện ảnh Việt Nam ra mắt năm 2025 thuộc thể loại kinh dị – cổ trang do Lê Văn Kiệt đạo diễn, đánh dấu sự trở lại của anh sau 3 năm kể từ Bóng đè và The Princess.",
    posterUrl: "/poster/khe-uoc-ban-dau.jpg",
    videoUrl:
      "https://drive.google.com/file/d/1vLd_HlZrZ06EENY_tdcgZQF6c8n8FXj0/view?usp=sharing",
    durationMinutes: 114,
  },

  {
    slug: "bong-de",
    title: "Bóng đè",
    year: 2022,
    description:
      "Bóng đè là một bộ phim điện ảnh hài hành động của Việt Nam ra mắt năm 2022 do Võ Thanh Hòa đạo diễn. Phim được CJ HK Entertainment và Thu Trang Entertainment chịu trách nhiệm sản xuất và CJ E&M giữ vai trò phân phối. Phim là phiên bản làm lại của bộ phim điện ảnh Hàn Quốc Nghề siêu khó ra mắt năm 2019",
    posterUrl: "/poster/bong-de.jpg",
    videoUrl:
      "https://drive.google.com/file/d/1tlAqBuXrwACugfIZjt8ZoBRCH3zo31TS/view?usp=sharing/videos/bong-de.mp4",
    durationMinutes: 101,
  },

  {
    slug: "cuc-vang-cua-ngoai",
    title: "Cục vàng của ngoại",
    year: 2025,
    description:
      "Lấy cảm hứng từ những ký ức tuổi thơ ngọt ngào, “Cục Vàng Của Ngoại” mang đến câu chuyện ấm áp về tình bà cháu trong một xóm nhỏ chan chứa nghĩa tình. Bà Hậu – người phụ nữ cả đời tần tảo, nay trở thành chỗ dựa duy nhất của cháu ngoại khi con gái bỏ đi. Dẫu cuộc sống còn nhiều nhọc nhằn, tình thương bà dành cho cháu vẫn luôn trọn vẹn. Với bà, cháu là “cục vàng” – niềm vui, niềm an ủi và cũng là lẽ sống của đời mình. Bộ phim nhẹ nhàng dẫn khán giả trở lại những khoảnh khắc quen thuộc nơi xóm nhỏ: nụ cười hồn nhiên của cháu, vòng tay chở che của bà và sự đùm bọc từ hàng xóm láng giềng. Tất cả cùng hòa thành một bức tranh đời thường ấm áp, gợi nhắc về tuổi thơ bình yên và tình người mộc mạc, chân thành.",
    posterUrl: "/poster/cuc-vang-cua-ngoai.jpg",
    videoUrl:
      "https://drive.google.com/file/d/1LD7cF6gIoa6fsifH7nwMhwrA7xPFecnK/view?usp=sharing",
    durationMinutes: 101,
  },

  {
    slug: "doat-hon",
    title: "Đoạt hồn",
    year: 2014,
    description:
      "Đoạt hồn là một bộ phim kinh dị Việt Nam công chiếu vào năm 2014, do Trần Hàm đạo diễn. Đây là phim thứ hai của anh thực hiện tại Việt Nam, sau phim hài Âm mưu giày gót nhọn năm 2013",
    posterUrl: "/poster/doat-hon.jpg",
    videoUrl:
      "https://drive.google.com/file/d/1Gi_wx_jsK2wtHyC4dsJ-o0PVphh08pqH/view?usp=sharing",
    durationMinutes: 99,
  },

  {
    slug: "nghe-sieu-de",
    title: "Nghề siêu dễ",
    year: 2022,
    description:
      "Nghề siêu dễ là một bộ phim điện ảnh hài hành động của Việt Nam ra mắt năm 2022 do Võ Thanh Hòa đạo diễn. Phim được CJ HK Entertainment và Thu Trang Entertainment chịu trách nhiệm sản xuất và CJ E&M giữ vai trò phân phối. Phim là phiên bản làm lại của bộ phim điện ảnh Hàn Quốc Nghề siêu khó ra mắt năm 2019",
    posterUrl: "/poster/nghe-sieu-de.jpg",
    videoUrl:
      "https://drive.google.com/file/d/18AM_7MpI7B7vK3JSPKZPoDj3z1quh9V4/view?usp=sharing",
    durationMinutes: 113,
  },
  {
    slug: "vo-ba",
    title: "Vợ ba",
    year: 2019,
    description:
      "Vợ ba hay Người vợ ba là một bộ phim cổ trang lịch sử tâm lý xã hội năm 2018 của đạo diễn Ash Mayfair và nhà sản xuất Nguyễn Thị Bích Ngọc. Bộ phim kể về hành trình của Mây – một cô gái 14 tuổi trở thành vợ ba của một gia đình địa chủ ở nông thôn miền Bắc vào khoảng thế kỉ 19.",
    posterUrl: "/poster/vo-ba.jpg",
    videoUrl: "",
    durationMinutes: 96,
  },
  {
    slug: "that-son-tam-linh",
    title: "Thất Sơn Tâm Linh",
    year: 2019,
    description:
      "Thất sơn tâm linh là một bộ phim điện ảnh kinh dị Việt Nam của đạo diễn Hàm Trần dựa trên vụ án có thật.",
    posterUrl: "/poster/that-son-tam-linh.jpg",
    videoUrl: "",
    durationMinutes: 100,
  },
  {
    slug: "tinh-dau-ngay-tho",
    title: "Tình đầu thơ ngây",
    year: 2019,
    description:
      "Vào một ngày đẹp trời, cuộc sống của bạn bỗng trở nên hỗn độn với sự xuất hiện của một cô bé lớp dưới, lẽo đẽo đi theo mình cả ngày, không những vậy còn… dọn luôn về nhà mình ở",
    posterUrl: "/poster/tinh-dau-ngay-tho.jpg",
    videoUrl: "",
    durationMinutes: 100,
  },
];

export function getMovieBySlug(slug: string): Movie | undefined {
  return movies.find((m) => m.slug === slug);
}
