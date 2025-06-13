"use client";

import "@/app/globals.css";
import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { db } from "../../firebase";
import { collection, addDoc } from "firebase/firestore";
import Image from "next/image";

export default function Challenge() {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <ChallengeContent />
    </Suspense>
  );
}

function ChallengeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const name = searchParams.get("name");

  const prompts = [
    "Why를 먼저 생각합니다.",
    "더 합리적 방법을 고민합니다.",
    "언제나 고객의 관점에서 생각합니다.",
    "대화를 넘어 소통합니다."
  ];
  const promptLabels = ["Why", "How", "Angle", "Talk"];
  const [placeholderText, setPlaceholderText] = useState("여기에 입력하세요. 타이핑 시작과 동시에 시간이 카운팅 됩니다.");



  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [times, setTimes] = useState([]);
  const [showWarning, setShowWarning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const handleInputChange = async (e) => {
    if (isComplete) return; // ✅ 제시문 완료 시 입력 차단
    const value = e.target.value;


    // ✅ 복붙 방지
    if (e.nativeEvent.inputType === "insertFromPaste") {
      setShowWarning(true);
      setUserInput("");
      return;
    }

    // ✅ 매크로 방지
    if (!startTime) {
      setStartTime(Date.now());
    } else if (value.length > 20 && Date.now() - startTime < 500) {
      setShowWarning(true);
      setUserInput("");
      return;
    }

    setUserInput(value);

    if (value === prompts[currentPromptIndex]) {
      const timeTaken = ((Date.now() - startTime) / 1000).toFixed(2);
      const updatedTimes = [...times, parseFloat(timeTaken)];
      setTimes(updatedTimes);
      setUserInput("");
      setStartTime(null);
    
      if (currentPromptIndex === prompts.length - 1) {
        setIsComplete(true);
        setPlaceholderText("↓↓결과를 확인하세요↓↓"); // ✅ 정확히 입력한 경우에만 문구 바꾸기
      } else {
        setCurrentPromptIndex(currentPromptIndex + 1);
      }
    }
    

  };

  const handleResultSubmit = async () => {
    const totalTime = times.reduce((a, b) => a + b, 0).toFixed(2);
    await addDoc(collection(db, "records"), {
      name,
      time: parseFloat(totalTime),
      times,
      timestamp: new Date(),
    });
  
    router.push(`/results?name=${name}&time=${totalTime}`);
  };

  return (
    
    <div className="challenge-wrapper">
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px",
      }}>
      <Image
        src="/challenge-header.png"
        alt="챌린지 제목"
        width={600}
        height={250}
        className="challenge-header"
      />

      {/* ✅ 제시문 컨테이너 */}
      <div className={`prompt-container prompt-${currentPromptIndex + 1}`}>
  <div className="prompt-text">
    {prompts[currentPromptIndex].split("").map((char, index) => {
      let color = "black";
      if (index < userInput.length) {
        color = userInput[index] === char ? "green" : "red";
      }
      return (
        <span key={index} style={{ color }}>
          {char}
        </span>
      );
    })}
  </div>
</div>

      {/* ✅ 타이핑 입력창 */}
      <textarea
  value={userInput}
  onChange={handleInputChange}
  placeholder={placeholderText}
  className="typing-area"
  disabled={isComplete}
/>

      {/* ✅ 제시문 시간 표시 */}
      {times.map((t, idx) => (
  <p key={idx} className="typing-time">
    {promptLabels[idx]}  ⏱ {t.toFixed(2)}초
  </p>
))}
      {/* ✅ 결과 버튼 */}
      {isComplete && (
        <button className="result-button" onClick={handleResultSubmit} />
      )}

      {/* ✅ 경고 메시지 */}
      {showWarning && (
        <div className="warning-popup">
          🤖 복사/붙여넣기 또는 비정상 입력은 금지입니다!
        </div>
      )}
    </div>
    </div>
  );
  }
  