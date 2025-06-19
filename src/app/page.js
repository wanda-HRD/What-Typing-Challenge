"use client";
import { useEffect } from "react"; // ✅ useEffect 꼭 import
import { useRouter } from "next/navigation";

export default function RootRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    alert("정상적인 경로가 아닙니다. 챌린지 게이트로 이동합니다.");
    router.replace("/practice-gate");
  }, []);

  return null;
}