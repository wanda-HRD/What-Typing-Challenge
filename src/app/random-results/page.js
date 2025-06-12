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
  const trimmedName = name && name.length > 6 ? name.slice(0, 6) + "…" : name;
  const time = parseFloat(searchParams.get("time"));
  const [rankings, setRankings] = useState([]);
  const [userRank, setUserRank] = useState(null);
  const [userPrompt, setUserPrompt] = useState(null); // ✅ 추가

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
  
        // ✅ 랜덤 모드 전용 필터: promptLabel이 없는 건 제외
        if (!data.promptLabel) return;
  
        records.push({
          name: data.name,
          time: data.time,
          promptLabel: data.promptLabel,
          rank,
        });
  
        if (!userFound && data.time >= time && data.name === name) {
          setUserRank(rank);
          setUserPrompt(data.promptLabel);
          userFound = true;
        }
  
        rank++;
      });
  
      setRankings(records.slice(0, 20));
      if (!userFound) setUserRank(rank);
    };
  
    fetchRankings();
  }, [time, name]);

  const fullRankings = [
    ...rankings,
    ...Array(20 - rankings.length).fill({ name: "", time: null, promptLabel: "" }),
  ];

  return (
          <div className="results-wrapper">
    <div className="results-layout">
      <div className="results-header">
        <p className="result-time">{time}</p>
      </div>

      {/* ✅ 순위 텍스트 + 제시문 종류 함께 표시 */}
      {userRank !== null && (
        <div className="rank-line-wrapper">
          <span className="my-rank-name">{trimmedName}</span>
          <img src="/rank-title.png" alt="님의 순위는" className="rank-title" />
          <span className="rank-number">{userRank}</span>
          <img src="/rank-unit.png" alt="위입니다" className="rank-unit" />
        </div>
      )}

      {userPrompt && (
        <div className="typing-time">제시문 유형: {userPrompt}</div>
      )}

      {userRank !== null && userRank <= 3 && (
        <div className="congrats-message">
          🎉 축하합니다! TOP {userRank} 안에 들었어요!
        </div>
      )}

      {/* ✅ 순위 리스트에 제시문 정보도 같이 출력 */}
   <div className="top20-random-container">
<div className="rank-grid-wrapper">
  {["Why", "How", "Angle", "Talk"].map((type) => {
    const typeRanks = rankings.filter((r) => r.promptLabel === type).slice(0, 5);
    return (
      <div key={type} className="rank-column">
        {typeRanks.map((record, index) => (
          <div key={`${record.name}-${index}`} className="random-rank-row">
          <div
           className="random-rank-image"
           style={{
           backgroundImage: `url(/ranks/rank-${index + 1}.png)`,
           }}
         />
        <div className="random-rank-text">
         <span className="random-rank-name">
          {record.name} ({record.promptLabel})
         </span>
        <span className="random-rank-time">
          {record.time.toFixed(2)}초
        </span>
      </div>
      </div>
        ))}
      </div>
    );
  })}
</div>
</div>


      <button
        onClick={() => (window.location.href = "/")}
        className="retry-button"
      />
    </div>
</div>
  );
}
