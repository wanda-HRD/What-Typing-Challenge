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
      router.push(`/challenge?name=${encodedName}`);
    } else if (mode === "random") {
      router.push(`/random-challenge?name=${encodedName}`);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleStart("sequence");
    }
  };

  return (
    <div className="main-wrapper">
      <Image
        src="/logo3.png"
        alt="로고"
        width={600}
        height={240}
        className="logo"
      />

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
        <div style={{ display: "flex", gap: "20px", justifyContent: "center" }}>
  <button
    className="button"
    onClick={() => handleStart("sequence")}
    style={{
      backgroundImage: 'url("/sequence-button.png")',
      width: "150px",
      height: "60px",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundColor: "transparent",
      border: "none",
      cursor: "pointer",
    }}
  />
  <button
    className="button"
    onClick={() => handleStart("random")}
    style={{
      backgroundImage: 'url("/random-button.png")',
      width: "150px",
      height: "60px",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundColor: "transparent",
      border: "none",
      cursor: "pointer",
    }}
  />
</div>
</div>
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

