"use client";
import { useState } from "react"; // ✅ useEffect 제거
import { useSearchParams, useRouter } from "next/navigation";
import { db } from "../../firebase";
import { collection, addDoc } from "firebase/firestore";

export default function Challenge() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const name = searchParams.get("name");

  const textToType = "안녕하세요 지금부터 WHAT 타이핑 챌린지를 시작하겠습니다.";
  const [userInput, setUserInput] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [completionTime, setCompletionTime] = useState(null);
  const [isFinished, setIsFinished] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  const handleInputChange = async (e) => {
    const value = e.target.value;

    if (e.nativeEvent.inputType === "insertFromPaste") {
      setShowWarning(true);
      setUserInput("");
      return;
    }

    if (!startTime) {
      setStartTime(Date.now());
    }

    if (value.length > 20 && (Date.now() - startTime) < 500) {
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
      <img src="/challenge-header.png" alt="챌린지 제목" className="challenge-header" />

      {/* ✅ 제시문 컨테이너 (컨테이너 배경만 이미지, 내부는 텍스트) */}
      <div className="prompt-container">
      <div className="prompt-label"></div>
        <div className="prompt-typing">
          {textToType.split("").map((char, index) => {
            let color = "black";
            if (index < userInput.length) {
              color = userInput[index] === textToType[index] ? "green" : "red";
            }
            return (
              <span key={index} style={{ color }}>{char}</span>
            );
          })}
        </div>
      </div>

      {/* ✅ 타이핑 영역 */}
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
          onClick={() => router.push(`/results?name=${name}&time=${completionTime}`)}
        ></button>
      )}

      {/* ✅ 조작 방지 경고 팝업 */}
      {showWarning && (
        <div className="warning-popup">
          🤖 비정상 입력은 금지입니다! 진짜 실력으로 승부해 주세요!
        </div>
      )}
    </div>
  );
}
