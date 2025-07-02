
export const dynamic = "force-dynamic";
"use client";


import "@/app/globals.css";
import { useRouter, useSearchParams } from "next/navigation";

export default function FinalResult1() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const name = searchParams.get("name");
  const time = parseFloat(searchParams.get("time"));
  const trimmedName = name && name.length > 6 ? name.slice(0, 6) + "…" : name;
  const handleNext = () => {
    router.push(`/final-rand1?name=${encodeURIComponent(name)}`); // ✅ 다음: 랜덤1
  };

  return (
    <div className="results-wrapper">
      <div className="results-layout">

         {/* ✅ 시간 크게 보여주기 */}
        <p style={{ fontSize: "150px", fontWeight: "bold", marginBottom: "10px", color: "#00777a" }}>
          {time ? time.toFixed(2) : "--"}<span style={{ fontSize: "50px", marginLeft: "6px" }}>초</span>
        </p>

        {/* ✅ 이름 및 설명 */}
        <p style={{ fontSize: "50px", fontWeight: "bold", marginBottom: "8px" }}>
          {trimmedName} 님의 Round 1 2차 기록입니다!
        </p>

        <p style={{ fontSize: "32px", color: "#444", marginBottom: "24px" }}>
          Round2 랜덤모드가 이어집니다.
        </p>

        {/* ✅ 버튼 */}
        <button
          onClick={handleNext}
          style={{
            padding: "12px 24px",
            fontSize: "18px",
            backgroundColor: "#00777a",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Round 2 →
        </button>
      </div>
    </div>
  );
}
