"use client";

import "@/app/globals.css";
import { useState, useEffect, Suspense } from "react"; // ✅ useEffect 추가됨
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
    "Why를 먼저 생각합니다. 일을 시작하기 전, 이 일을 왜 해야 하는지 이유와 배경을 생각합니다. 동료들과 이야기를 나누며 함께 달성할 명확한 목표를 정합니다. 올바른 방향으로 가고 있는지 정기적으로 점검합니다.",
    "더 합리적 방법을 고민합니다. 다양한 시각에서 방법을 고민하고 동료들과 공유합니다. 지난 성공방식이 이번엔 다를 수 있음을 기억합니다. 업무 진행 중에도 더 나은 방법이 있는지 계속 탐색합니다.",
    "언제나 고객의 관점에서 생각합니다. 고객의 니즈를 내 필요처럼 느끼고 조금이라도 더 개선하려는 태도로 일합니다. 내게 필요한 서비스라는 마음으로 더 나은 서비스를 위해 적극적으로 임합니다. 표면적 현상 그 이상을 고민하고 숨겨진 니즈를 찾아 제시합니다. 트렌드에 관심을 갖고 지속적으로 변화를 시도합니다.",
    "대화를 넘어 소통합니다. 대화로 시작하여 서로의 생각이 통할 때 소통이 완성됩니다. 더 좋은 결과를 위해 긍정적이고 배려심 있는 언어로 이야기합니다. 구체적이고 명확한 소통을 위해 중요한 내용은 직접 만나서 이야기합니다."
  ];
  const promptLabels = ["Why", "How", "Angle", "Talk"];
  const [placeholderText, setPlaceholderText] = useState("여기에 입력하세요. 타이핑 시작과 동시에 시간이 카운팅 됩니다.");

  const [selectedPromptIndex, setSelectedPromptIndex] = useState(null); // ✅ 초기값 null
  const [userInput, setUserInput] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [time, setTime] = useState(null); // ✅ 랜덤 모드는 하나만 입력하니까 time 하나로
  const [showWarning, setShowWarning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * prompts.length);
    setSelectedPromptIndex(randomIndex);
  }, []);

  if (selectedPromptIndex === null) {
    return <div>제시문 불러오는 중...</div>; // ✅ hydration error 방지
  }

  const selectedPrompt = prompts[selectedPromptIndex];
  const selectedPromptLabel = promptLabels[selectedPromptIndex];

  const handleInputChange = async (e) => {
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
      setPlaceholderText("↓↓결과를 확인하세요↓↓"); // ✅ 입력 완료 후 문구 수정
    }
  };

  const handleResultSubmit = async () => {
    await addDoc(collection(db, "records"), {
      name,
      time,
      times: [time],
      promptLabel: selectedPromptLabel,
      timestamp: new Date(),
    });

    router.push(`/random-results?name=${name}&time=${time}`);
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
      <div className={`prompt-container prompt-${selectedPromptIndex + 1}`}>
        <div className="prompt-text">
          {selectedPrompt.split("").map((char, index) => {
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
      {time && (
        <p className="typing-time">{selectedPromptLabel} ⏱ {time.toFixed(2)}초</p>
      )}

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
