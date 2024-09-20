import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

function RecordDetailPage({ user }) {
  const { id } = useParams(); // URL에서 기록 ID를 가져옴
  const [record, setRecord] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRecord(); // 기록 데이터를 가져옴
  }, []);

  const fetchRecord = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/records/${id}`);
      const data = await response.json();
      setRecord(data);
    } catch (error) {
      console.error("기록을 불러오는 중 오류가 발생했습니다:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRecord({ ...record, [name]: value });
  };

  const handleSave = async () => {
    if (!user || !user.googleId) {
      alert("로그인되지 않았습니다. 로그인 후 다시 시도하세요.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/records/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...record,
          user: { googleId: user.googleId }, // 수정 시 사용자 정보 포함
        }),
      });

      if (response.ok) {
        navigate("/records"); // 수정 후 기록 목록 페이지로 이동
      } else {
        console.error("기록 수정 중 오류가 발생했습니다:", response.statusText);
      }
    } catch (error) {
      console.error("기록 수정 중 오류가 발생했습니다:", error);
    }
  };

  const handleDelete = async () => {
    if (!user || !user.googleId) {
      alert("로그인되지 않았습니다. 로그인 후 다시 시도하세요.");
      return;
    }

    const confirmDelete = window.confirm("이 기록을 삭제하시겠습니까?");
    if (!confirmDelete) return; // 사용자가 삭제를 취소한 경우

    try {
      const response = await fetch(`http://localhost:8080/api/records/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        navigate("/records"); // 삭제 후 기록 목록 페이지로 이동
      } else {
        console.error("기록 삭제 중 오류가 발생했습니다:", response.statusText);
      }
    } catch (error) {
      console.error("기록 삭제 중 오류가 발생했습니다:", error);
    }
  };

  if (!record) {
    return <p>기록을 불러오는 중입니다...</p>;
  }

  return (
    <div>
      <h2>기록 수정</h2>
      <div>
        <label>날짜: </label>
        <input
          type="date"
          name="runningDate"
          value={record.runningDate || ""}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Spot: </label>
        <input
          type="text"
          name="spot"
          value={record.spot || ""}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>내용: </label>
        <textarea
          name="content"
          value={record.content || ""}
          onChange={handleChange}
        />
      </div>
      <button onClick={handleSave}>저장</button>
      <button onClick={handleDelete} style={{ marginLeft: "10px", color: "red" }}>
        삭제
      </button>
    </div>
  );
}

export default RecordDetailPage;