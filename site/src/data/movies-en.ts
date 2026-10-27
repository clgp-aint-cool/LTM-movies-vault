import { movies, type Movie } from "./movies";

// English copy for the /en pages. `title` = official international title (only when known).
// Add a new movie here too after adding it to movies.ts; otherwise the Vietnamese text is shown.
const EN: Record<string, { title?: string; description: string; genres?: string[] }> = {
  "cong-tru-nhan-chia": {
    description:
      "A schoolgirl transfers to a prestigious international school, where she is drawn into a series of tragic incidents and strange phenomena — and uncovers the dark secrets behind the school's glossy facade. A psychological school thriller directed by Irving Ly, starring Anh Thư, Lâm Thanh Mỹ, Phương Trà My and Minh Hưng.",
  },
  cam: {
    title: "The Sisters",
    description:
      "Cám (formerly Con Cám) is a 2024 Vietnamese period horror film written and directed by Trần Hữu Tấn and produced by Hoàng Quân, based on the dark variants of the folk tale Tấm Cám. Lâm Thanh Mỹ plays the title role of Cám, her first leading role on the big screen.",
  },
  "toi-thay-hoa-vang-tren-co-xanh": {
    title: "Yellow Flowers on the Green Grass",
    description:
      "An adaptation of Nguyễn Nhật Ánh's beloved novel, directed by Victor Vũ and co-produced by Galaxy Media & Entertainment, Saigon Concert, PS Vietnam, Phuong Nam Film and K+. Lâm Thanh Mỹ plays Mận.",
  },
  "khe-uoc-ban-dau": {
    title: "Bride of the Covenant",
    description:
      "A 2025 Vietnamese period horror film directed by Lê Văn Kiệt, his return three years after Bóng đè and The Princess. Lâm Thanh Mỹ plays Nhài, a young bride in feudal northern Vietnam.",
  },
  "dai-tiec-trang-mau-8": {
    description:
      "A comedy about an underrated director (Vân Sơn) facing the toughest project of his life: a 35-minute film shot in a single take. Chaos ensues as the cast keeps causing trouble, but finishing the film is his last chance to win back the respect of his art-loving daughter. Released in Vietnamese cinemas on 24 April 2026.",
  },
  "cuc-vang-cua-ngoai": {
    description:
      "A warm family drama about a grandmother and her grandchild in a close-knit neighbourhood. Grandma Hậu, who has worked hard all her life, becomes her grandchild's only support after her daughter leaves — to her, the child is her \"little treasure\".",
  },
  "bong-de": {
    description:
      "A 2022 Vietnamese horror film directed by Lê Văn Kiệt, built around the folk phenomenon of sleep paralysis and a family haunted night after night by an unseen force.",
  },
  "doat-hon": {
    title: "Hollow",
    description:
      "A 2014 Vietnamese horror film directed by Hàm Trần, his second film made in Vietnam after the 2013 comedy Âm mưu giày gót nhọn.",
  },
  "nghe-sieu-de": {
    description:
      "A 2022 Vietnamese action comedy directed by Võ Thanh Hòa, produced by CJ HK Entertainment and Thu Trang Entertainment — a remake of the South Korean hit Extreme Job (2019).",
  },
  "vo-ba": {
    title: "The Third Wife",
    description:
      "A period drama by director Ash Mayfair and producer Nguyễn Thị Bích Ngọc, following Mây, a 14-year-old girl who becomes the third wife of a landowner in rural northern Vietnam in the 19th century.",
  },
  "that-son-tam-linh": {
    description: "A Vietnamese horror film by director Hàm Trần, inspired by a true case.",
  },
  "tinh-dau-ngay-tho": {
    description:
      "One fine day, your life is turned upside down by a younger schoolgirl who follows you around all day long — and then even moves into your house.",
  },
  "tay-anh-giu-mot-vi-sao": {
    description:
      "Superstar Kang Jun Woo, the \"Prince of Asia\", gets stranded in Vietnam after a string of mishaps and meets Thảo, a coffee seller determined to chase her dream.",
  },
};

const GENRES_EN: Record<string, string> = {
  "Kinh dị": "Horror",
  "Cổ trang": "Period",
  "Tâm lý": "Drama",
  "Gia đình": "Family",
  "Hài": "Comedy",
  "Hành động": "Action",
  "Tình cảm": "Romance",
  "Học đường": "School",
  "Hồi hộp": "Thriller",
};

export type MovieEn = Movie & { titleEn?: string; descriptionEn: string; genresEn?: string[] };

export function toEnglish(movie: Movie): MovieEn {
  const en = EN[movie.slug];
  return {
    ...movie,
    titleEn: en?.title,
    descriptionEn: en?.description ?? movie.description,
    genresEn: movie.genres?.map((g) => GENRES_EN[g] ?? g),
  };
}

export const moviesEn: MovieEn[] = movies.map(toEnglish);

/** "Cám (The Sisters)" or just the Vietnamese title */
export function displayTitleEn(m: MovieEn) {
  return m.titleEn ? `${m.title} (${m.titleEn})` : m.title;
}
