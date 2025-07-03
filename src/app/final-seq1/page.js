// ✅ 파일 위치: src/app/final-seq1/page.js
"use client";
export const dynamic = "force-dynamic";

import "@/app/globals.css";
import { db } from "@/firebase";
import { addDoc, collection } from "firebase/firestore";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";

export default function FinalSequential1Wrapper() {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <FinalSequential1 />
    </Suspense>
  );
}

function FinalSequential1() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const name = searchParams.get("name");

  const prompts = [
    "Why를 먼저 생각합니다. #배경이해 #목표설정 #방향성 점검",
    "더 합리적 방법을 고민합니다. #다각적 고민 #관성적 업무 지양 #상황변화 인식",
    "언제나 고객의 관점에서 생각합니다. #Attitude #숨겨진 니즈 #트렌드",
    "대화를 넘어 소통합니다. #생각의 일치 #긍정적 표현 #대면 소통"
  ];
  const promptLabels = ["Why", "How", "Angle", "Talk"];

  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [times, setTimes] = useState([]);
  const [isComplete, setIsComplete] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [placeholderText, setPlaceholderText] = useState("여기에 입력하세요. 타이핑 시작과 동시에 시간이 카운팅 됩니다.");

  useEffect(() => {
    const access = localStorage.getItem("final-access");
    if (!access) {
      alert("결승 페이지 접근이 제한됩니다.");
      router.replace("/practice-gate");
    }
  }, [router]);

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
        setPlaceholderText("🎉 1차 완료! MC의 진행에 따라 이동해주세요.");
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
      label: "순차",
      promptLabel: null,     // ✅ 이 줄 추가로 랜덤모드 로직 막기
    });

    router.push(`/final-result1?name=${encodeURIComponent(name)}&time=${totalTime}`);
  };

  return (
    <div className="challenge-wrapper">
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "20px" }}>
        <Image
          src="/challenge-header.png"
          alt="결승 1차 순차모드"
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
          placeholder={placeholderText}
          className="typing-area"
          disabled={isComplete}
        />

        {times.map((t, idx) => (
          <p key={idx} className="typing-time">
            {promptLabels[idx]} ⏱ {t.toFixed(2)}초
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
