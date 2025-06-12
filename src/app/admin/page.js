"use client";
import { useState, useEffect } from "react";
import { db } from "../../firebase";
import {
  collection,
  query,
  orderBy,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";

export default function AdminPage() {
  const [accessGranted, setAccessGranted] = useState(false);
  const [password, setPassword] = useState("");
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rankingList, setRankingList] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [sortOption, setSortOption] = useState("rank-asc");
  const [filterPrompt, setFilterPrompt] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 200;

  const PASSWORD = "megaport2025";

  const handlePasswordSubmit = () => {
    if (password === PASSWORD) {
      setAccessGranted(true);
    } else {
      alert("비밀번호가 틀렸습니다.");
    }
  };

  useEffect(() => {
    if (!accessGranted) return;
    const fetchData = async () => {
      const q = query(collection(db, "records"), orderBy("time", "asc"));
      const snapshot = await getDocs(q);
      const data = [];
      const rankGroups = {};

      snapshot.forEach((docSnap) => {
        const d = docSnap.data();
        const label = d.promptLabel || "순차";
        data.push({ id: docSnap.id, ...d, label });
        if (!rankGroups[label]) rankGroups[label] = [];
        rankGroups[label].push({ id: docSnap.id, ...d });
      });

      const fullRanked = [];
      for (const label in rankGroups) {
        const group = rankGroups[label].filter((d) => d.hidden !== true);
        const seenNames = new Set();
        const withRank = group.map((d, i) => {
          const isDup = seenNames.has(d.name);
          seenNames.add(d.name);
          return { 
            ...d,
            label,
            rank: i + 1,
            duplicate: isDup ? "Y" : "N",
          };
        });
        fullRanked.push(...withRank);
      }

      setRecords(data);
      setRankingList(fullRanked);
      setLoading(false);
    };
    fetchData();
  }, [accessGranted]);

  const handleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };

  const handleBulkUpdate = async (action) => {
    if (action === "hide") {
      await Promise.all(
        selectedIds.map((id) => updateDoc(doc(db, "records", id), { hidden: true }))
      );
    } else if (action === "show") {
      await Promise.all(
        selectedIds.map((id) => updateDoc(doc(db, "records", id), { hidden: false }))
      );
    } else if (action === "delete") {
      await Promise.all(
        selectedIds.map((id) => deleteDoc(doc(db, "records", id)))
      );
    }
    window.location.reload();
  };

  const getSortedData = () => {
    let dataWithRank = records.map((r) => {
      const rankInfo = rankingList.find((d) => d.id === r.id);
      return {
        ...r,
        rank: rankInfo?.rank || null,
        duplicate: rankInfo?.duplicate || "-",
        label: r.promptLabel || "순차",
      };
    });

    if (filterPrompt !== "all") {
      dataWithRank = dataWithRank.filter((r) => r.label === filterPrompt);
    }

    switch (sortOption) {
      case "rank-asc":
        return [...dataWithRank].sort((a, b) => (a.rank || Infinity) - (b.rank || Infinity));
      case "rank-desc":
        return [...dataWithRank].sort((a, b) => (b.rank || -1) - (a.rank || -1));
      case "latest":
        return [...dataWithRank].sort((a, b) => b.timestamp?.toMillis() - a.timestamp?.toMillis());
      case "oldest":
        return [...dataWithRank].sort((a, b) => a.timestamp?.toMillis() - b.timestamp?.toMillis());
      case "name":
        return [...dataWithRank].sort((a, b) => a.name.localeCompare(b.name));
      default:
        return dataWithRank;
    }
  };

  const sortedData = getSortedData();
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const currentData = sortedData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (!accessGranted) {
    return (
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        <h2>🔒 관리자 비밀번호를 입력하세요</h2>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ padding: "10px", fontSize: "16px" }}
        />
        <br />
        <button
          onClick={handlePasswordSubmit}
          style={{ marginTop: "10px", padding: "10px 20px" }}
        >
          확인
        </button>
      </div>
    );
  }

  if (loading) return <div style={{ textAlign: "center" }}>불러오는 중...</div>;

  return (
      <div style={{ padding: "30px", color: "black" }}>
      <h1>📊 관리자 페이지</h1>

      {/* 정렬 옵션 */}
      <div style={{ marginBottom: "10px" }}>
        <label>정렬: </label>
        <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
          <option value="rank-asc">랭킹 높은 순</option>
          <option value="rank-desc">랭킹 낮은 순</option>
          <option value="latest">최신순</option>
          <option value="oldest">오래된순</option>
          <option value="name">이름순</option>
        </select>

        <label style={{ marginLeft: "20px" }}>제시문 필터: </label>
        <select value={filterPrompt} onChange={(e) => setFilterPrompt(e.target.value)}>
          <option value="all">전체</option>
          <option value="순차">순차</option>
          <option value="Why">Why</option>
          <option value="How">How</option>
          <option value="Angle">Angle</option>
          <option value="Talk">Talk</option>
        </select>
      </div>

      <div style={{ marginBottom: "15px" }}>
        <button onClick={() => handleBulkUpdate("show")} style={{ padding: "8px 16px", marginRight: "10px", backgroundColor: "#d1e7dd", border: "1px solid #0f5132", borderRadius: "5px", cursor: "pointer" }}>선택 노출</button>
        <button onClick={() => handleBulkUpdate("hide")} style={{ padding: "8px 16px", marginRight: "10px", backgroundColor: "#fff3cd", border: "1px solid #664d03", borderRadius: "5px", cursor: "pointer" }}>선택 비노출</button>
        <button onClick={() => handleBulkUpdate("delete")} style={{ padding: "8px 16px", backgroundColor: "#f8d7da", border: "1px solid #842029", borderRadius: "5px", cursor: "pointer" }}>선택 삭제</button>
      </div>

      <table border="1" cellPadding="8" style={{ width: "100%", marginTop: "20px",borderCollapse: "collapse", }}>
        <thead>
           <tr>
    {["선택", "No", "이름", "챌린지 시간", "제시문", "상세 시간", "현재 랭킹", "중복", "비노출"].map((label, i) => (
      <th
        key={label}
        style={{
          borderRight: i === 8 ? "none" : "1px solid #ddd", // 마지막 열만 없음
          textAlign: "center",
        }}
      >
        {label}
      </th>
    ))}
  </tr>
        </thead>
       <tbody>
  {currentData.map((r, idx) => (
    <tr key={r.id} style={{ backgroundColor: r.hidden ? "#f2f2f2" : "white" }}>
      {[ 
        <input type="checkbox" checked={selectedIds.includes(r.id)} onChange={() => handleSelect(r.id)} />,
        (currentPage - 1) * itemsPerPage + idx + 1,
        r.name,
        r.timestamp?.toDate().toLocaleString() || "-",
        r.label,
        r.times ? r.times.map((t, i) => `문장${i + 1}: ${t.toFixed(2)}초`).join(", ") : "-",
        r.rank || "-",
        r.duplicate,
        r.hidden ? "Y" : "N"
      ].map((val, i) => (
        <td
          key={i}
          style={{
            borderRight: i === 8 ? "none" : "1px solid #ddd",
            borderBottom: "1px solid #ddd", // ✅ 이 줄이 행별 구분선!
            textAlign: "center",
            padding: "8px",
          }}
        >
          {val}
        </td>
      ))}
    </tr>
  ))}
</tbody>
      </table>

      <div style={{ marginTop: "20px", textAlign: "center" }}>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => setCurrentPage(i + 1)}
            style={{ margin: "0 5px", padding: "5px 10px", backgroundColor: currentPage === i + 1 ? "#0d6efd" : "#e2e6ea", color: currentPage === i + 1 ? "white" : "black", border: "none", borderRadius: "5px", cursor: "pointer" }}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
