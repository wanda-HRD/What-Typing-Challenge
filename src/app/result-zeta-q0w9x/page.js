"use client";
import "@/app/globals.css";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { db } from "../../firebase";
import { collection, query, orderBy, getDocs } from "firebase/firestore";

export default function ResultsPage() {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <ResultsContent />
    </Suspense>
  );
}

function ResultsContent() {
  const searchParams = useSearchParams();
  const name = searchParams.get("name");
  const trimmedName = name && name.length > 6 ? name.slice(0, 6) + "…" : name; // 이름 글자수 제한
  const time = parseFloat(searchParams.get("time"));
  const [rankings, setRankings] = useState([]);
  const [userRank, setUserRank] = useState(null);

  useEffect(() => {
    const fetchRankings = async () => {
      const recordsRef = collection(db, "records");
      const q = query(recordsRef, orderBy("time", "asc"));
      const querySnapshot = await getDocs(q);
  
      const records = [];
      let rank = 1;
      let userFound = false;
  
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.hidden) return;
  
        // ✅ 순차 모드 전용 필터: promptLabel이 있는 건 제외
        if (data.promptLabel) return;
  
        records.push({
          name: data.name,
          time: data.time,
          rank,
        });
  
        if (!userFound && data.time >= time && data.name === name) {
          setUserRank(rank);
          userFound = true;
        }
  
        rank++;
      });
  
      setRankings(records.slice(0, 20));
      if (!userFound) setUserRank(rank);
    };
  
    fetchRankings();
  }, [time, name]);
  


  // ✅ rankings가 업데이트된 후 여기서 항상 20개로 맞춰줌
  const fullRankings = [
    ...rankings,
    ...Array(20 - rankings.length).fill({ name: "", time: null }),
  ];

  return (
    <div className="results-wrapper">
    <div className="results-layout">
      {/* ✅ 헤더 - 챌린지 기록 보여줄 컨테이너 */}
      <div className="results-header">
        <p className="result-time">{time}</p> {/* 숫자만 보여짐 */}
      </div>
    

      {/* ✅ 순위 영역 */}
        {/* 이 영역에 "당신의 순위는" 이미지 표시 */}
        {userRank !== null && (
  <div className="rank-line-wrapper">
  <span className="my-rank-name">{trimmedName}</span>
  <img src="/rank-title.png" alt="님의 순위는" className="rank-title" />
  <span className="rank-number">{userRank}</span>
  <img src="/rank-unit.png" alt="위입니다" className="rank-unit" />
</div>
)}
      {/* ✅ 1~4등 축하 문구 */}
      {userRank !== null && userRank <= 4 && (
        <div className="congrats-message">
          🎉 축하합니다! TOP {userRank} 안에 들었어요!
        </div>
      )}

      {/* ✅ Top20 랭킹 (빈칸 포함 20개 고정) */}
<div className="top20-container">
  {fullRankings.map((record, index) => (
    <div
    key={index}
    className={`rank-row ${index < 4 ? "top4-highlight" : ""}`} // 👈 TOP4는 클래스 추가
  >
    <div
      className="rank-image"
      style={{ backgroundImage: `url(/ranks/rank-${index + 1}.png)` }}
    />
   <div className="top20-rank-name">{record.name || "\u00A0"}</div>
    <div className="rank-time">
      {record.time !== null ? `${record.time.toFixed(2)}초` : "\u00A0"}
    </div>
  </div>
  ))}
</div>

      {/* ✅ 다시하기 버튼 */}
      <button
        onClick={() => (window.location.href = "//supermain-2025-w9s8d")}
        className="retry-button"/>
    </div>
</div>
  );
}
