# Bài viết (/bai-viet)

Mỗi file `.md` trong thư mục này là **một bài viết**. Tên file chính là đường dẫn:
`phim-moi-cua-lam-thanh-my.md` → `https://lamthanhmy.com/bai-viet/phim-moi-cua-lam-thanh-my`

## Viết bài mới (ngay trên GitHub, không cần cài gì)

1. Mở repo trên GitHub → vào `site/content/posts` → **Add file → Create new file**.
2. Đặt tên file không dấu, nối bằng gạch ngang, đuôi `.md`, chứa từ khóa chính.
   Ví dụ: `lam-thanh-my-dong-vai-gi-trong-bong-de.md`
3. Dán mẫu bên dưới, sửa nội dung → **Commit changes** vào nhánh `main`.
4. Khoảng 1–2 phút sau Vercel tự deploy, bài xuất hiện trên web, trong sitemap,
   trang chủ, và trong mục "Bài viết về phim …" của các phim được gắn.

Sửa bài: mở file → bấm biểu tượng ✏️ → sửa → Commit. Xóa bài: mở file → ⋯ → Delete file.

## Mẫu bài viết

```markdown
---
title: "Tiêu đề chứa từ khóa chính – khoảng 50–65 ký tự"
description: "Mô tả hiện trên Google, 120–160 ký tự, có từ khóa."
date: 2026-11-01            # ngày đăng, dạng YYYY-MM-DD
updated: 2026-11-15         # (tuỳ chọn) ngày sửa gần nhất
cover: /poster/cam.jpg      # (tuỳ chọn) ảnh nhỏ ở danh sách bài
movies: [cam, bong-de]      # (tuỳ chọn) slug phim liên quan, lấy trong src/data/movies.ts
keywords: [từ khóa 1, từ khóa 2]
draft: false                # true = bản nháp, KHÔNG hiện trên web thật
---

Đoạn mở đầu trả lời ngay câu hỏi người đọc tìm kiếm.

## Tiêu đề mục (H2)

Nội dung… Link nội bộ: [phim Cám](/movies/cam), [tiểu sử](/about).
```

## Cú pháp Markdown hay dùng

| Viết | Kết quả |
| --- | --- |
| `## Tiêu đề` | Tiêu đề mục |
| `**đậm**`, `*nghiêng*` | **đậm**, *nghiêng* |
| `[chữ](/movies/cam)` | Liên kết |
| `- mục` | Danh sách |
| `![mô tả ảnh](/poster/cam.jpg)` | Chèn ảnh (ảnh để trong `site/public`) |
| `> trích dẫn` | Trích dẫn |

## Mẹo SEO

- Mỗi bài nhắm **một** câu hỏi người ta hay gõ ("Lâm Thanh Mỹ đóng vai gì trong Cám").
- Trả lời ngay ở đoạn đầu, sau đó mới mở rộng.
- Luôn gắn `movies:` và chèn link tới trang phim / bài viết khác.
- Viết cảm nhận riêng — nội dung độc nhất được Google ưu tiên hơn chép từ Wikipedia.
- Chỉ đăng thông tin đã kiểm chứng; không đăng thông tin riêng tư (trường học, địa chỉ…).

## Xem trước bản nháp trên máy

```bash
cd site && npm run dev
```

Mở http://localhost:3000/bai-viet — bản nháp hiện kèm nhãn [NHÁP] (chỉ khi chạy dev).
