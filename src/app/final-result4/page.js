// ✅ 파일 위치: src/app/final-result4/page.js
"use client";

import "@/app/globals.css";
import { useRouter, useSearchParams } from "next/navigation";

export default function FinalResult4() {
  const searchParams = useSearchParams();

  const name = searchParams.get("name");
  const time = parseFloat(searchParams.get("time"));
  const trimmedName = name && name.length > 6 ? name.slice(0, 6) + "…" : name;



  return (
    <div className="results-wrapper">
      <div className="results-layout">

              {/* ✅ 시간 크게 보여주기 */}
        <p style={{ fontSize: "150px", fontWeight: "bold", marginBottom: "10px", color: "#00777a" }}>
          {time ? time.toFixed(2) : "--"}<span style={{ fontSize: "50px", marginLeft: "6px" }}>초</span>
        </p>

        {/* ✅ 이름 및 설명 */}
        <p style={{ fontSize: "50px", fontWeight: "bold", marginBottom: "8px" }}>
          {trimmedName} 님의 마지막 기록입니다!
        </p>


        <div style={{ marginTop: "30px", textAlign: "center", fontSize: "18px", fontWeight: "bold" }}>
          <p>결승전 모든 라운드를 완료했습니다! 🔥</p>
           <p>고생 많으셨습니다 ❤️</p>
          <p>최종 우승 집계까지 잠시만 기다려주세요 ⏱</p>
        </div>

        {/* ✅ 선택: 홈으로 돌아가기 버튼 */}
<button
  onClick={() => (window.location.href = "/final-mode")}
  className="retry-button"
/>

      </div>
    </div>
  );
}
