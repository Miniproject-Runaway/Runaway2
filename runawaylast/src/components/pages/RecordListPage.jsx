import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import './list.css';

function RecordListPage({ user }) {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    if (user) {
      fetchRecords(user.googleId);  // 로그인된 사용자의 googleId로 기록을 필터링
    }
  }, [user]);

  const fetchRecords = async (googleId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/records?googleId=${googleId}`);
      const data = await response.json();
      setRecords(data);
    } catch (error) {
      console.error("기록을 불러오는 중 오류가 발생했습니다:", error);
    }
  };

  if (records.length === 0) {
    return (
      <div>
        <p>기록이 없습니다.</p>
        {/* 메인 페이지로 이동하는 버튼 추가 */}
        <Link to="/">
          <button>메인 페이지로 이동</button>
        </Link>
      </div>
    );
  }

  return (
    <div className="record-list-container">
      <h2>기록 목록</h2>
      <ul className="record-list">
        {records.map((record) => (
          <li key={record.id} className="record-item">
            <Link to={`/record/${record.id}`}>
              {record.runningDate} - {record.spot}
            </Link>
          </li>
        ))}
      </ul>
      <Link to="/" className="main-button">메인 페이지로 이동</Link>
    </div>
  );
}

export default RecordListPage;