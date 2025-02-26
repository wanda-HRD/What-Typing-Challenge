"use client";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react"; // ✅ Suspense 추가

export default function ResultsPage() {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>  {/* ✅ Suspense로 감싸기 */}
      <ResultsContent />
    </Suspense>
  );
}


function ResultsContent() {
  const searchParams = useSearchParams();
  const name = searchParams.get("name");
  const time = parseFloat(searchParams.get("time")); // 문자열을 숫자로 변환
  const [rankings, setRankings] = useState([]);
  const [userRank, setUserRank] = useState(null);

  // ✅ Firestore에서 랭킹 데이터 가져오기
  useEffect(() => {
    const fetchRankings = async () => {
      const recordsRef = collection(db, "records");
      const q = query(recordsRef, orderBy("time", "asc")); // 시간 기준으로 정렬 (빠른 순)
      const querySnapshot = await getDocs(q);

      const records = [];
      let rank = 1;
      let userFound = false;

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        records.push({
          name: data.name,
          time: data.time,
          rank: rank,
        });

        // ✅ 사용자의 기록이 몇 위인지 찾기
        if (!userFound && data.time >= time) {
          setUserRank(rank);
          userFound = true;
        }
        rank++;
      });

      setRankings(records.slice(0, 20)); // 상위 20개만 저장
      if (!userFound) setUserRank(rank); // 사용자가 마지막 순위일 경우
    };

    fetchRankings();
  }, [time]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>🏆 결과 확인 페이지 🏆</h1>
      <p>🎉 <strong>{name}</strong> 님의 타이핑 기록:</p>
      <h2 style={{ color: "blue", fontSize: "24px" }}>{time} 초</h2>

      {userRank !== null && (
        <p className="h1">
          📢 당신의 순위: <strong>{userRank}위</strong>
        </p>
      )}

      <h2 style={{ marginTop: "30px" }}>🔥 역대 TOP 20 🔥</h2>
      <ol style={{ textAlign: "left", display: "inline-block", fontSize: "18px" }}>
        {rankings.map((record, index) => (
          <li key={index} style={{ marginBottom: "5px" }}>
            <strong>{record.rank}위</strong> - {record.name} ({record.time}초)
          </li>
        ))}
      </ol>

      <br />
      <button
        onClick={() => window.location.href = "/"}
        className="button">
      
        다시 도전하기
      </button>
    </div>
  );
}
