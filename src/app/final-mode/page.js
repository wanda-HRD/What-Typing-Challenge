// ✅ 파일 위치: src/app/final-mode/page.js
"use client";
// ✅ 정답 예시 (useRouter까지 같이 쓰는 경우)
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "@/app/globals.css";


export default function FinalModeMain() {
  const [name, setName] = useState("");
  const router = useRouter();

  useEffect(() => {
    const access = localStorage.getItem("final-access");
    if (!access) {
      alert("결승 모드는 비밀번호를 통해 입장해야 합니다.");
      router.replace("/practice-gate");
    }
  }, []);

  const handleStart = () => {
    if (name.trim() === "") {
      alert("이름을 입력하세요!");
      return;
    }
    const encodedName = encodeURIComponent(name);
    router.push(`/final-seq1?name=${encodedName}`);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleStart();
    }
  };

  return (
  <div className="final-mode-wrapper"> {/* ✅ 전용 배경/정렬 클래스 */}
      <div className="container final-bg" style={{ marginTop: "120px", alignItems: "center" }}>
        <div className="input-container">
          <input
            type="text"
            placeholder="이름을 알파벳까지 입력하세요 (ex.홍길동B)"
            className="input-box"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={handleKeyDown}
          />

          {/* ✅ 결승 시작 버튼 이미지 */}
          <button onClick={handleStart} className="button">
            <img src="/final-start-button.png" width={300} height={100} />
          </button>

          <p style={{ marginTop: "20px", fontSize: "16px", color: "white", fontWeight: "bold" }}>
            * 지금부터 결승전! 총 4번의 타이핑을 시작합니다 🔥
          </p>
          <p>
            * MC의 진행에 따라 챌린지를 진행해주세요.
          </p>
          <p>
            * 새로고침 이용 시 해당 라운드 점수는 0점 처리 됩니다.
          </p>
          <p>
            * 타이핑을 완료하고 Enter키를 누르지 않도록 주의해주세요!
          </p>
        </div>
      </div>
      {/* ❌ 노티스 이미지 제거됨 */}
    </div>
  );
}
