// ✅ 추가된 부분 주석으로 표시
"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { db } from "@/firebase";
import { collection, addDoc } from "firebase/firestore";
import Image from "next/image";
import "@/app/globals.css";

export default function PracticeChallengePage() {
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
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [times, setTimes] = useState([]);
  const [isComplete, setIsComplete] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [placeholderText, setPlaceholderText] = useState("여기에 입력하세요. 타이핑 시작과 동시에 시간이 카운팅 됩니다."); // ✅ 추가됨

  useEffect(() => {
    const access = localStorage.getItem("practice-access");
    if (!access) {
      alert("연습 페이지 접근이 제한됩니다.");
      router.replace("/practice-gate");
    }
  }, []);

  const handleInputChange = (e) => {
    if (isComplete) return;
    const value = e.target.value;

    if (e.nativeEvent.inputType === "insertFromPaste") {
      setShowWarning(true);
      setUserInput("");
      return;
    }

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
        setPlaceholderText("↓↓ 나의 연습 결과는? ↓↓"); // ✅ 추가됨
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
      isPractice: true,
      hidden: true
    });
    router.push(`/practice-mode/result?name=${encodeURIComponent(name)}`);
  };

  return (
    <div className="challenge-wrapper">
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "20px" }}>
        <Image
          src="/challenge-header.png"
          alt="챌린지 제목"
          width={600}
          height={250}
          className="challenge-header"
        />

        <div className={`prompt-container prompt-${currentPromptIndex + 1}`}>
          <div className="prompt-text">
            {prompts[currentPromptIndex].split("").map((char, index) => {
              let color = "black";
              if (index < userInput.length) {
                color = userInput[index] === char ? "green" : "red";
              }
              return (
                <span key={index} style={{ color }}>{char}</span>
              );
            })}
          </div>
        </div>

        <textarea
          value={userInput}
          onChange={handleInputChange}
          placeholder={placeholderText} // ✅ 여기에 바인딩됨
          className="typing-area"
          disabled={isComplete}
        />

        {times.map((_, idx) => (
          <p key={idx} className="typing-time">
            {promptLabels[idx]} ⏱ <b>??.??초</b>
          </p>
        ))}

        {isComplete && (
          <button className="result-button" onClick={handleResultSubmit} />
        )}

        {showWarning && (
          <div className="warning-popup">
            🤖 복사/붙여넣기 또는 비정상 입력은 금지입니다!
          </div>
        )}
      </div>
    </div>
  );
}
