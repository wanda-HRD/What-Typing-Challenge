// ✅ src/app/practice-gate/page.js
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PracticeGatePage() {
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = () => {
    if (password === "practice2025") {
      localStorage.setItem("practice-access", "true");
      router.push("/practice-mode");
    } else if (password === "challenge2025") {
      localStorage.setItem("access-granted", "true");
      router.push("/supermain-2025-w9s8d");
    } else {
      alert("비밀번호가 틀렸습니다.");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f0f0f0",
        gap: "20px",
      }}
    >
      <h2>🔐 입장 비밀번호를 입력하세요</h2>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="비밀번호 입력"
        style={{ padding: "10px", fontSize: "16px", width: "250px" }}
      />
      <button
        onClick={handleSubmit}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          backgroundColor: "#1a838a",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        입장하기
      </button>
    </div>
  );
}