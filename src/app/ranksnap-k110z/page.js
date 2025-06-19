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
  const [rankings, setRankings] = useState({});
  const [userRank, setUserRank] = useState(null);
  const [userPrompt, setUserPrompt] = useState(null);

  useEffect(() => {
    const fetchRankings = async () => {
      const recordsRef = collection(db, "records");
      const q = query(recordsRef, orderBy("time", "asc"));
      const querySnapshot = await getDocs(q);

      const all = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.hidden) return;
        if (!data.promptLabel) return;
        all.push(data);
      });

      // 그룹화
      const grouped = {};
      all.forEach((d) => {
        const label = d.promptLabel;
        if (!grouped[label]) grouped[label] = [];
        grouped[label].push(d);
      });

      // 사용자 정보 기준 찾기
      const myRecord = all.find((d) => d.name === name && d.time === time);
      if (!myRecord) return;

      const myPrompt = myRecord.promptLabel;
      setUserPrompt(myPrompt);

      const myGroup = grouped[myPrompt] || [];
      const sorted = myGroup.sort((a, b) => a.time - b.time);
      const ranked = sorted.map((d, i) => ({ ...d, rank: i + 1 }));
      const myRank = ranked.find((d) => d.name === name && d.time === time)?.rank;
      setUserRank(myRank || null);

      // 전체 Top20를 유형별로 정리해서 저장
      const topGrouped = {};
      ["Why", "How", "Angle", "Talk"].forEach((label) => {
        const group = grouped[label] || [];
        topGrouped[label] = group.sort((a, b) => a.time - b.time).slice(0, 20);
      });
      setRankings(topGrouped);
    };

    fetchRankings();
  }, [time, name]);

  const labelMap = { why: "Why", how: "How", angle: "Angle", talk: "Talk" };
  const displayLabel = userPrompt ? labelMap[userPrompt.toLowerCase()] || userPrompt : "";

  return (
    <div className="results-wrapper">
      <div className="results-layout">
        <div className="results-header">
          <p className="result-time">{time}</p>
        </div>

        {userRank !== null && (
          <div className="rank-line-wrapper">
            <span className="my-rank-name">
              {userPrompt ? `(${displayLabel}) ` : ""}
              {trimmedName}
            </span>
            <img src="/rank-title.png" alt="님의 순위는" className="rank-title" />
            <span className="rank-number">{userRank}</span>
            <img src="/rank-unit.png" alt="위입니다" className="rank-unit" />
          </div>
        )}

        {userPrompt && (
          <div className="typing-time">제시문 유형: {displayLabel}</div>
        )}

        {userRank !== null && userRank <= 3 && (
          <div className="congrats-message">
            🎉 축하합니다! TOP {userRank} 안에 들었어요!
          </div>
        )}

        <div className="top20-random-container">
          <div className="rank-grid-wrapper">
            {["Why", "How", "Angle", "Talk"].map((type) => {
              const typeRanks = rankings[type] || [];
              return (
                <div key={type} className="rank-column">
                  {typeRanks.map((record, index) => (
                    <div key={`${record.name}-${index}`} className="random-rank-row">
                      <div
                        className="random-rank-image"
                        style={{
                          backgroundImage: `url(/ranks/rank-${index + 1}.png)`
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
          onClick={() => (window.location.href = "/supermain-2025-w9s8d")}
          className="retry-button"
        />
      </div>
    </div>
  );
}