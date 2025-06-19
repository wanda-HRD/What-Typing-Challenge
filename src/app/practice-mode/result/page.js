// ✅ 파일 위치: src/app/practice-mode/result/page.js
"use client";

import { useEffect, useState } from "react";
import { db } from "@/firebase";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import Image from "next/image";
import "@/app/globals.css";

export default function PracticeResultPage() {
  const [rankings, setRankings] = useState([]);

  useEffect(() => {
    const fetchRankings = async () => {
      const q = query(collection(db, "records"), orderBy("time", "asc"));
      const snapshot = await getDocs(q);
      const result = [];

      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.hidden) return;
        if (data.promptLabel) return; // 순차모드만
        if (data.isPractice) return;  // 연습모드는 제외

        result.push({ name: data.name, time: data.time });
      });

      setRankings(result.slice(0, 20));
    };

    fetchRankings();
  }, []);

  const fullRankings = [
    ...rankings,
    ...Array(20 - rankings.length).fill({ name: "", time: null })
  ];

  return (
    <div className="results-wrapper">
      <div className="results-layout">
  <button
          onClick={() => (window.location.href = "/practice-mode")}
          className="retry-button"
        />
        {/* ✅ 내 기록 대신 홍보 이미지 */}
       
          <Image
            src="/practice-promo.png" // ⬅️ "7F에서 도전해보세요" 이미지
            alt="도전 안내"
            width={600}
            height={200}
            
            style={{ objectFit: "cover", marginTop: "30px" }}
          />
      
        {/* ✅ 실제 순차모드 랭킹 출력 */}
        <div className="top20-container">
          {fullRankings.map((record, index) => (
            <div
              key={index}
              className={`rank-row ${index < 4 ? "top4-highlight" : ""}`}
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

        <button
          onClick={() => (window.location.href = "/practice-mode")}
          className="retry-button"
        />
      </div>
    </div>
  );
}
