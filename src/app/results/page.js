"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { db } from "../../firebase";
import { collection, query, orderBy, getDocs } from "firebase/firestore";

export default function ResultsPage() {
  const searchParams = useSearchParams();
  const name = searchParams.get("name");
  const time = parseFloat(searchParams.get("time"));
  const [rankings, setRankings] = useState([]);
  const [userRank, setUserRank] = useState(null);

  useEffect(() => {
    const fetchRankings = async () => {
      const recordsRef = collection(db, "records");
      const q = query(recordsRef, orderBy("time", "asc"));
      const querySnapshot = await getDocs(q);

      const allRecords = [];
      let seenNames = new Set();
      let rank = 1;
      let userFound = false;
      let userRankTemp = null;

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.hidden) return; // ❗ 비노출 데이터 제외
        allRecords.push({
          name: data.name,
          time: data.time,
          rank: rank,
          duplicate: seenNames.has(data.name) ? "Y" : "N"
        });

        if (!userFound && data.time >= time && !seenNames.has(data.name)) {
          userRankTemp = rank;
          userFound = true;
        }

        seenNames.add(data.name);
        rank++;
      });

      setRankings(allRecords.slice(0, 20));
      setUserRank(userRankTemp || rank);
    };

    fetchRankings();
  }, [time]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>🏆 결과 확인 페이지 🏆</h1>
      <p>🎉 <strong>{name}</strong> 님의 타이핑 기록:</p>
      <h2 style={{ color: "blue", fontSize: "24px" }}>{time} 초</h2>

      {userRank !== null && (
        <p className="h1">
          📢 당신의 순위: <strong>{userRank}위</strong>
        </p>
      )}

      <h2 style={{ marginTop: "30px" }}>🔥 역대 TOP 20 🔥</h2>
      <ol style={{ textAlign: "left", display: "inline-block", fontSize: "18px" }}>
        {rankings.map((record, index) => (
          <li key={index} style={{ marginBottom: "5px" }}>
            <strong>{record.rank}위</strong> - {record.name} ({record.time}초)
          </li>
        ))}
      </ol>

      <br />
      <button
        onClick={() => window.location.href = "/"}
        className="button"
      >
        다시 도전하기
      </button>
    </div>
  );
}
