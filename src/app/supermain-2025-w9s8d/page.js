"use client";
import "@/app/globals.css";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [name, setName] = useState("");
  const router = useRouter();

  const handleStart = (mode) => {
    if (name.trim() === "") {
      alert("이름을 입력하세요!");
      return;
    }
    const encodedName = encodeURIComponent(name);
    if (mode === "sequence") {
      router.push(`/megachallenge-72z9?name=${encodedName}`);
    } else if (mode === "random") {
      router.push(`/randplay-r8g7k?name=${encodedName}`);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleStart("sequence");
    }
  };

  return (
    <div className="main-wrapper">
      <div className="container">
        <div className="input-container">
          <input
            type="text"
            placeholder="홍길동 또는 홍길동B 형태로 입력하세요"
            className="input-box"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        {/* ✅ 모드 선택 버튼 두 개 */}
        <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
  <button onClick={() => handleStart("sequence")} className="button">
    <img src="/sequence-button.png" alt="순차 모드" width={300} height={100} />
  </button>
  <button onClick={() => handleStart("random")} className="button">
    <img src="/random-button.png" alt="랜덤 모드" width={300} height={100} />
  </button>
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

