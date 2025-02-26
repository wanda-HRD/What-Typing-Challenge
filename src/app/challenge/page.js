"use client";
import "../styles.css"; //css 파일추가
import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { db } from "../../firebase"; // Firestore 연결
import { collection, addDoc } from "firebase/firestore";

export default function Challenge() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const name = searchParams.get("name");

  // ✅ 타이핑할 문구
  const textToType = "WHAT 타이핑 챌린지를 환영합니다! 정확하게 입력해 보세요!";
  const [userInput, setUserInput] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [completionTime, setCompletionTime] = useState(null);
  const [isFinished, setIsFinished] = useState(false); // ✅ 완료 여부 상태 추가!

  // ✅ 타이핑 입력 처리
  const handleInputChange = async (e) => {
    const value = e.target.value;
    if (!startTime) {
      setStartTime(Date.now()); // 첫 입력 시 시작 시간 기록
    }
    setUserInput(value);

    if (value === textToType) {
      const timeTaken = ((Date.now() - startTime) / 1000).toFixed(2);
      setCompletionTime(timeTaken);
      setIsFinished(true); // ✅ 완료 상태를 true로 변경

      // ✅ Firestore에 데이터 저장 (자동 이동 없이 저장만 진행)
      await addDoc(collection(db, "records"), {
        name,
        time: parseFloat(timeTaken),
        timestamp: new Date(),
      });
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px", color: "white" }}>
      <h1>🚀 WHAT 타이핑 챌린지 시작! 🚀</h1>
      <p>안녕하세요, <strong>{name}</strong> 님! 아래 문장을 빠르고 정확하게 입력하세요!⌨️</p>
        <p>타이핑을 시작하면 시간이 카운팅됩니다.</p>

      {/* ✅ 타이핑할 문구 */}
      <p style={{ fontSize: "20px", fontWeight: "bold" }}>
        {textToType.split("").map((char, index) => {
          let color = "black";
          if (index < userInput.length) {
            color = userInput[index] === textToType[index] ? "green" : "red";
          }
          return (
            <span key={index} style={{ color }}>
              {char}
            </span>
          );
        })}
      </p>

      {/* ✅ 타이핑 입력창 */}
<input
  type="text"
  value={userInput}
  onChange={handleInputChange}
  placeholder="여기에 입력하세요..."
  className="challenge-input" // ✅ styles.css의 클래스 적용
/>

      {/* ✅ 걸린 시간 표시 */}
      {completionTime !== null && (
        <p style={{ fontSize: "18px", marginTop: "20px", color: "blue" }}>
          🎉 타이핑 완료! 걸린 시간: <strong>{completionTime} 초</strong>
        </p>
      )}

      {/* ✅ 결과 확인 버튼 (자동 이동 X, 사용자가 눌러야 이동!) */}
      {isFinished && (
        <button
          onClick={() => router.push(`/results?name=${name}&time=${completionTime}`)}
          style={{
            marginTop: "20px",
            padding: "10px",
            fontSize: "16px",
            backgroundColor: "green",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          결과 확인하기
        </button>
      )}
    </div>
  );
}
