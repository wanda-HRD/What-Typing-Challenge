"use client";
import "@/app/globals.css"; // ✅ global 스타일 import
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [name, setName] = useState("");
  const router = useRouter();

  const handleStart = () => {
    if (name.trim() === "") {
      alert("이름을 입력하세요!");
      return;
    }
    router.push(`/challenge?name=${encodeURIComponent(name)}`);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleStart();
    }
  };

  return (
    <div className="main-wrapper"> {/* ✅ 배경 적용을 위한 클래스 추가 */}

      <Image
        src="/logo3.png"
        alt="로고"
        width={600}
        height={240}
        className="logo"
      />

      {/* ✅ 컨테이너 박스 (참여방법 + 입력/버튼) */}
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

          {/* ✅ 텍스트 없는 이미지 버튼 */}
          <button className="button" onClick={handleStart}>
            {/* 텍스트 제거 → 배경이미지로만 표시 */}
          </button>
        </div>
      </div>

      {/* ✅ 주의사항 이미지 - 가운데 정렬 + 여백 */}
      <Image
  src="/notice.png"
  alt="주의사항"
  width={600}
  height={700}
  className="notice-image"
  unoptimized
/>
    </div>
  );
}
