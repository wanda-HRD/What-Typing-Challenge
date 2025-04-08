"use client";

import { useState, useEffect, Suspense } from "react";
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

  // ✅ 페이지 진입 시 challenge-page 클래스 추가
  useEffect(() => {
    document.body.classList.add("challenge-page");
    return () => {
      document.body.classList.remove("challenge-page");
    };
  }, []);

  const textToType =
    "안녕하세요 지금부터 WHAT 타이핑 챌린지를 시작하겠습니다.";

  const [userInput, setUserInput] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [completionTime, setCompletionTime] = useState(null);
  const [isFinished, setIsFinished] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  const handleInputChange = async (e) => {
    const value = e.target.value;

    // ✅ 복붙 방지
    if (e.nativeEvent.inputType === "insertFromPaste") {
      setShowWarning(true);
      setUserInput("");
      return;
    }

    if (!startTime) {
      setStartTime(Date.now());
    }

    // ✅ 매크로 입력 방지
    if (value.length > 20 && Date.now() - startTime < 500) {
      setShowWarning(true);
      setUserInput("");
      return;
    }

    setUserInput(value);

    if (value === textToType) {
      const timeTaken = ((Date.now() - startTime) / 1000).toFixed(2);
      setCompletionTime(timeTaken);
      setIsFinished(true);

      await addDoc(collection(db, "records"), {
        name,
        time: parseFloat(timeTaken),
        timestamp: new Date(),
      });
    }
  };

  return (
    <div className="challenge-wrapper">
      {/* ✅ 제목+안내 이미지 */}
      <Image
        src="/challenge-header.png"
        alt="챌린지 제목"
        width={600}
        height={250}
        className="challenge-header"
      />

      {/* ✅ 제시문 컨테이너 */}
      <div className="prompt-container">
        <div className="prompt-label"></div>
        <div className="prompt-typing" style={{ userSelect: "none" }}>
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
        </div>
      </div>

      {/* ✅ 타이핑 입력창 */}
      <textarea
        value={userInput}
        onChange={handleInputChange}
        placeholder="여기에 타이핑하세요..."
        className="typing-area"
      />

      {/* ✅ 결과 버튼 */}
      {isFinished && (
        <button
          className="result-button"
          onClick={() =>
            router.push(`/results?name=${name}&time=${completionTime}`)
          }
        ></button>
      )}

      {/* ✅ 조작 방지 경고 */}
      {showWarning && (
        <div className="warning-popup">
          🤖 복사/붙여넣기 또는 비정상 입력은 금지입니다! 진짜 실력으로 승부해 주세요!
        </div>
      )}
    </div>
  );
}
