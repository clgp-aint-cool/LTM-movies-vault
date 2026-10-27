"use client";

import { useState } from "react";

const SHARE_URL = "https://lamthanhmy.com/sap-ra-mat";

export default function ShareButtons({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function share() {
    if (navigator.share) {
      try {
        await navigator.share({ text, url: SHARE_URL });
        return;
      } catch {
        // share sheet closed → copy instead
      }
    }
    await navigator.clipboard.writeText(`${text} ${SHARE_URL}`);
    setCopied(true);
  }

  return (
    <button onClick={share} className="rounded-full border border-white/30 px-5 py-2 font-medium hover:bg-white/10">
      {copied ? "Đã chép link ✓" : "Chia sẻ"}
    </button>
  );
}
