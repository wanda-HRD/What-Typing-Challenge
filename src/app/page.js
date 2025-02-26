"use client";
import "./styles.css";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [name, setName] = useState("");
  const router = useRouter();

  // ✅ "시작하기" 버튼 클릭 또는 엔터 키 입력 시 페이지 이동
  const handleStart = () => {
    if (name.trim() === "") {
      alert("이름을 입력하세요!");
      return;
    }
    router.push(`/challenge?name=${encodeURIComponent(name)}`); // ✅ challenge 페이지로 이동
  };

  // ✅ 엔터 키 입력 시 시작하기 버튼과 동일한 동작 수행
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleStart();
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <img src="/logo3.png" alt="로고" className="logo" />

      <div className="container">
        {/* ✅ 입력창 + 버튼을 컨테이너 하단으로 이동 */}
        <div className="input-container">
          <input
            type="text"
            placeholder="홍길동 또는 홍길동B 형태로 입력하세요"
            className="input-box"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={handleKeyDown} // ✅ 엔터 키 이벤트 추가
          />
          <button className="button" onClick={handleStart}>START</button> {/* ✅ 버튼 클릭 이벤트 추가 */}
        </div>
      </div>
    </div>
  );
}
