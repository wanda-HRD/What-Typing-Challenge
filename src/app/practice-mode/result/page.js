"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { db } from "@/firebase";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import Image from "next/image";
import "@/app/globals.css";

export default function PracticeResultPage() {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <ClientContent />
    </Suspense>
  );
}

function ClientContent() {
  const searchParams = useSearchParams();
  const nameParam = searchParams.get("name");
  const [record, setRecord] = useState(null);

  useEffect(() => {
    if (!nameParam) return;

    const fetchData = async () => {
      const q = query(
        collection(db, "records"),
        where("name", "==", nameParam),
        where("isPractice", "==", true),
        orderBy("timestamp", "desc")
      );
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const latest = snapshot.docs[0].data();
        setRecord(latest);
      }
    };
    fetchData();
  }, [nameParam]);

  const totalTime =
    record?.times?.length > 0
      ? record.times.reduce((a, b) => a + b, 0).toFixed(2)
      : null;

  const trimmedName =
    nameParam && nameParam.length > 6 ? nameParam.slice(0, 6) + "…" : nameParam;

  return (
    <div className="results-wrapper">
       <div style={{ width: "100%", display: "flex", justifyContent: "center", marginBottom: "2px" }}>
  <Image
    src="/practice-mode-label.png"
    alt="연습결과"
    width={600}
    height={150}
    style={{ objectFit: "contain" }}
  />
</div>
     
      <div className="results-layout">
        {/* ✅ 헤더 */}
        <div className="results-header">
          <p className="result-time">{totalTime ?? "계산 중..."}</p>
        </div>

        {/* ✅ 순위 텍스트 */}
        <div className="rank-line-wrapper">
          <span className="my-rank-name">{trimmedName ?? "참가자"}</span>
          <img src="/rank-title.png" alt="님의 순위는" className="rank-title" />
          <span className="rank-number">??</span>
          <img src="/rank-unit.png" alt="위입니다" className="rank-unit" />
        </div>

        {/* ✅ 홍보 이미지 */}
        <div style={{ marginTop: "40px" }}>
          <Image
            src="/practice-promo.png"
            alt="도전 안내"
            width={600}
            height={200}
            style={{ objectFit: "cover" }}
          />
        </div>

        {/* ✅ 다시 도전 버튼 */}
        <button
          onClick={() => (window.location.href = "/practice-mode")}
          className="retry-button"
        />
      </div>
    </div>
  );
}