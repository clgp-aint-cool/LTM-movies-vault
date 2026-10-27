"use client";

import { useState } from "react";
import Link from "next/link";
import type { QuizQuestion } from "@/data/quiz";

const QUIZ_URL = "https://lamthanhmy.com/quiz";

function verdict(score: number, total: number) {
  const ratio = score / total;
  if (ratio === 1) return "Fan cứng chính hiệu! Bạn biết mọi thứ về Lâm Thanh Mỹ 👑";
  if (ratio >= 0.7) return "Rất giỏi! Bạn đúng là fan của “em bé ma” 🎬";
  if (ratio >= 0.4) return "Khá ổn! Xem thêm vài phim nữa là thành fan cứng 🍿";
  return "Có vẻ bạn mới biết Lâm Thanh Mỹ — bắt đầu với phim Cám nhé 👻";
}

export default function QuizClient({ questions }: { questions: QuizQuestion[] }) {
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [copied, setCopied] = useState(false);

  const q = questions[index];
  const total = questions.length;

  function choose(i: number) {
    if (picked !== null) return;
    setPicked(i);
    if (i === q.answer) setScore((s) => s + 1);
  }

  function next() {
    if (index + 1 >= total) setDone(true);
    else {
      setIndex(index + 1);
      setPicked(null);
    }
  }

  function restart() {
    setIndex(0);
    setPicked(null);
    setScore(0);
    setDone(false);
    setCopied(false);
  }

  const shareText = `Mình được ${score}/${total} điểm trong quiz “Bạn hiểu Lâm Thanh Mỹ bao nhiêu?” 🎬 Thử xem bạn được mấy điểm:`;

  async function share() {
    if (navigator.share) {
      try {
        await navigator.share({ title: "Quiz Lâm Thanh Mỹ", text: shareText, url: QUIZ_URL });
        return;
      } catch {
        // user closed the share sheet → fall through to copy
      }
    }
    await copy();
  }

  async function copy() {
    await navigator.clipboard.writeText(`${shareText} ${QUIZ_URL}`);
    setCopied(true);
  }

  if (done) {
    return (
      <div className="rounded-2xl border border-black/10 dark:border-white/15 p-6 text-center">
        <p className="text-sm uppercase tracking-wide opacity-60">Kết quả của bạn</p>
        <p className="text-6xl font-bold my-3">
          {score}<span className="text-2xl opacity-60">/{total}</span>
        </p>
        <p className="text-lg">{verdict(score, total)}</p>

        <div className="flex flex-wrap justify-center gap-2 mt-6">
          <button onClick={share} className="rounded-full bg-red-600 text-white px-5 py-2 font-medium hover:bg-red-700">
            Chia sẻ kết quả
          </button>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(QUIZ_URL)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-black/15 dark:border-white/20 px-5 py-2 font-medium hover:bg-black/5 dark:hover:bg-white/10"
          >
            Facebook
          </a>
          <button onClick={copy} className="rounded-full border border-black/15 dark:border-white/20 px-5 py-2 font-medium hover:bg-black/5 dark:hover:bg-white/10">
            {copied ? "Đã chép ✓" : "Chép link (Zalo, Messenger…)"}
          </button>
        </div>

        <div className="mt-6 flex justify-center gap-4 text-sm">
          <button onClick={restart} className="underline opacity-80 hover:opacity-100">Làm lại</button>
          <Link href="/movies" className="underline opacity-80 hover:opacity-100">Xem phim Lâm Thanh Mỹ</Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between text-sm opacity-70 mb-2">
        <span>Câu {index + 1}/{total}</span>
        <span>Điểm: {score}</span>
      </div>
      <div className="h-1.5 rounded-full bg-black/10 dark:bg-white/10 mb-6 overflow-hidden">
        <div className="h-full bg-red-500 transition-all" style={{ width: `${(index / total) * 100}%` }} />
      </div>

      <h2 className="text-xl font-semibold mb-4">{q.question}</h2>
      <ul className="grid gap-2">
        {q.options.map((opt, i) => {
          const state =
            picked === null ? "idle" : i === q.answer ? "correct" : i === picked ? "wrong" : "dim";
          return (
            <li key={opt}>
              <button
                onClick={() => choose(i)}
                disabled={picked !== null}
                className={`w-full text-left rounded-xl border px-4 py-3 transition-colors ${
                  state === "correct"
                    ? "border-green-600 bg-green-600/15"
                    : state === "wrong"
                      ? "border-red-600 bg-red-600/15"
                      : state === "dim"
                        ? "border-black/10 dark:border-white/10 opacity-50"
                        : "border-black/15 dark:border-white/20 hover:bg-black/5 dark:hover:bg-white/10"
                }`}
              >
                {opt}
              </button>
            </li>
          );
        })}
      </ul>

      {picked !== null && (
        <div className="mt-4 rounded-xl bg-black/5 dark:bg-white/5 p-4">
          <p className="font-medium">{picked === q.answer ? "✅ Chính xác!" : "❌ Chưa đúng rồi."}</p>
          <p className="text-sm opacity-80 mt-1">
            {q.explain}{" "}
            {q.link && <Link href={q.link} target="_blank" className="underline">Tìm hiểu thêm</Link>}
          </p>
          <button onClick={next} className="mt-4 rounded-full bg-red-600 text-white px-5 py-2 font-medium hover:bg-red-700">
            {index + 1 >= total ? "Xem kết quả" : "Câu tiếp theo →"}
          </button>
        </div>
      )}
    </div>
  );
}
