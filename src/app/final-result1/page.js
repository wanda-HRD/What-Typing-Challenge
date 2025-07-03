"use client";

export const dynamic = "force-dynamic";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import "@/app/globals.css";

function FinalResult1Content() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const name = searchParams.get("name");
  const time = parseFloat(searchParams.get("time"));
  const trimmedName = name && name.length > 6 ? name.slice(0, 6) + "…" : name;

  const handleNext = () => {
    router.push(`/final-seq2?name=${encodeURIComponent(name)}`);
  };

  return (
    <div className="results-wrapper">
      <div className="results-layout" style={{ textAlign: "center" }}>
        <p style={{ fontSize: "150px", fontWeight: "bold", marginBottom: "10px", color: "#00777a" }}>
          {time ? time.toFixed(2) : "--"}<span style={{ fontSize: "50px", marginLeft: "6px" }}>초</span>
        </p>
        <p style={{ fontSize: "50px", fontWeight: "bold", marginBottom: "8px" }}>
          {trimmedName} 님의 Round 1 - 1차 기록입니다!
        </p>
        <p style={{ fontSize: "32px", color: "#444", marginBottom: "24px" }}>
          MC의 진행에 따라 이동해주세요.
        </p>
        <p style={{ fontSize: "32px", color: "#444", marginBottom: "24px" }}>
          Round1 2차 시도가 이어집니다.
        </p>
        <button onClick={handleNext} style={{
          padding: "12px 24px",
          fontSize: "18px",
          backgroundColor: "#00777a",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
        }}>2차 시도 →</button>
      </div>
    </div>
  );
}

export default function FinalResult1() {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <FinalResult1Content />
    </Suspense>
  );
}
