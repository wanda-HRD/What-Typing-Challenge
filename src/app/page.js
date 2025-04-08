"use client";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [name, setName] = useState("");
  const router = useRouter();

  const handleStart = () => {
    if (name.trim() === "") {
      alert("이름을 입력하세요!");
      return;
    }
    router.push(`/challenge?name=${encodeURIComponent(name)}`);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleStart();
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      {/* 로고 */}
      <Image
        src="/logo3.png"
        alt="로고"
        width={300}
        height={100}
        className="mb-8"
      />

      {/* 입력창 + 버튼 */}
      <div className="w-full max-w-[600px] flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          placeholder="홍길동 또는 홍길동B 형태로 입력하세요"
          className="w-full h-14 rounded-md text-center text-lg font-semibold border border-gray-300 shadow-md"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          onClick={handleStart}
          className="w-full sm:w-40 h-14 bg-green-600 text-white font-bold rounded-md hover:bg-green-700 transition-all"
        >
          START
        </button>
      </div>
    </div>
  );
}
