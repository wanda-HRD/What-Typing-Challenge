// ✅ 파일 위치: src/app/practice-mode/page.js
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import "@/app/globals.css";

export default function PracticeMain() {
  const [name, setName] = useState("");
  const router = useRouter();

  // ✅ 연습모드 접근 체크 (localStorage로 수정)
  useEffect(() => {
    const access = localStorage.getItem("practice-access");
    if (!access) {
      alert("연습 페이지는 비밀번호를 통해 입장해야 합니다.");
      router.replace("/practice-gate");
    }
  }, []);

  const handleStart = () => {
    if (name.trim() === "") {
      alert("이름을 입력하세요!");
      return;
    }
    const encodedName = encodeURIComponent(name);
    router.push(`/practice-mode/challenge?name=${encodedName}`);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleStart();
    }
  };

  return (
    <div className="main-wrapper">
      <div className="container">
        <div className="input-container">
          <input
            type="text"
            placeholder="이름을  알파벳까지 입력하세요 (ex.홍길동B)"
            className="input-box"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={handleKeyDown}
          />

          {/* ✅ 버튼 하나만 */}
          <button onClick={handleStart} className="button">
            <img src="/start-button.png" alt="연습 시작" width={300} height={100} />
          </button>

          {/* ✅ 안내 문구 추가 */}
          <p style={{ marginTop: "2px", fontSize: "16px", color: "black", fontWeight: "bold" }}>
            * 결승전 시작 전 연습모드로 손을 풀어보세요 🔥
          </p>
        </div>
      </div>

      <Image
        src="/notice.png"
        alt="주의사항"
        width={600}
        height={600}
        className="notice-image"
        unoptimized
      />
    </div>
  );
}
