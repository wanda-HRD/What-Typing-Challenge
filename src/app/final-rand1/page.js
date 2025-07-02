// ✅ 파일 위치: src/app/final-rand1/page.js
"use client";
export const dynamic = "force-dynamic";
import "@/app/globals.css";
import { db } from "@/firebase";
import { addDoc, collection } from "firebase/firestore";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

export default function FinalRand1() {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <FinalRand1Content />
    </Suspense>
  );
}

function FinalRand1Content() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const name = searchParams.get("name");

  // ✅ 고정 제시문 (Why)
  const selectedPrompt =
    "Why를 먼저 생각합니다. 일을 시작하기 전, 이 일을 왜 해야 하는지 이유와 배경을 생각합니다. 동료들과 이야기를 나누며 함께 달성할 명확한 목표를 정합니다. 올바른 방향으로 가고 있는지 정기적으로 점검합니다.";
  const selectedPromptLabel = "Why";

  // ✅ label → 숫자 매핑
  const promptIndexMap = {
    Why: 1,
    How: 2,
    Angle: 3,
    Talk: 4,
  };

  const [userInput, setUserInput] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [time, setTime] = useState(null);
  const [isComplete, setIsComplete] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [placeholderText, setPlaceholderText] = useState("여기에 입력하세요. 타이핑 시작과 동시에 시간이 카운팅 됩니다.");

  useEffect(() => {
    const access = localStorage.getItem("final-access");
    if (!access) {
      alert("결승 페이지 접근이 제한됩니다.");
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

    if (value === selectedPrompt) {
      const timeTaken = ((Date.now() - startTime) / 1000).toFixed(2);
      setTime(parseFloat(timeTaken));
      setUserInput("");
      setStartTime(null);
      setIsComplete(true);
      setPlaceholderText("🎉 입력 완료! 결과 확인으로 이동하세요");
    }
  };

  const handleResultSubmit = async () => {
    await addDoc(collection(db, "records"), {
      name,
      time,
      times: [time],
      promptLabel: selectedPromptLabel,
      timestamp: new Date(),
      label: "결승-랜덤1",
    });

    router.push(`/final-result3?name=${encodeURIComponent(name)}&time=${time}`);
  };

  return (
    <div className="challenge-wrapper">
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "20px" }}>
        <Image
          src="/challenge-header.png"
          alt="결승 랜덤1"
          width={600}
          height={250}
          className="challenge-header"
        />

        {/* ✅ prompt-1 클래스 자동 적용됨 */}
        <div className={`prompt-container prompt-${promptIndexMap[selectedPromptLabel]}`}>
          <div className="prompt-text">
            {selectedPrompt.split("").map((char, index) => {
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
          placeholder={placeholderText}
          className="typing-area"
          disabled={isComplete}
        />

        {time && (
          <p className="typing-time">{selectedPromptLabel} ⏱ {time.toFixed(2)}초</p>
        )}

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
