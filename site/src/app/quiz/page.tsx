import type { Metadata } from "next";
import QuizClient from "./QuizClient";
import { quiz } from "@/data/quiz";

export const metadata: Metadata = {
  title: { absolute: "Quiz: Bạn hiểu Lâm Thanh Mỹ bao nhiêu?" },
  description:
    "10 câu hỏi vui về diễn viên Lâm Thanh Mỹ: vai diễn, đạo diễn, biệt danh “em bé ma”… Làm quiz và chia sẻ điểm số với bạn bè!",
  alternates: { canonical: "/quiz" },
  openGraph: {
    title: "Bạn hiểu Lâm Thanh Mỹ bao nhiêu? Làm quiz 10 câu",
    description: "Thử xem bạn có phải fan cứng của “em bé ma màn ảnh Việt” không!",
    url: "/quiz",
  },
};

export default function QuizPage() {
  return (
    <div className="p-6 sm:p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-semibold">Bạn hiểu Lâm Thanh Mỹ bao nhiêu?</h1>
      <p className="opacity-80 mt-2 mb-6">{quiz.length} câu hỏi về phim và vai diễn. Chọn đáp án để xem ngay đúng hay sai.</p>
      <QuizClient questions={quiz} />
    </div>
  );
}
