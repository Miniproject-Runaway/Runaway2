import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./form.css";

function RecordFormPage({ user }) {
  // 로그인한 사용자 정보를 받음
  const [formData, setFormData] = useState({
    runningDate: "",
    spot: "",
    content: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // user 정보가 없으면 에러 처리
    if (!user || !user.googleId || !user.email || !user.name) {
      alert("로그인되지 않았습니다. 로그인 후 다시 시도하세요.");
      return;
    }

    // 서버로 전송할 데이터 출력
    console.log("보내는 데이터:", {
      ...formData,
      user: {
        googleId: user.googleId,
        email: user.email,
        name: user.name,
      },
    });

    try {
      const response = await fetch("http://localhost:8080/api/records", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          user: {
            googleId: user.googleId,
            email: user.email,
            name: user.name,
          },
        }),
      });

      if (response.ok) {
        navigate("/records"); // 기록 목록 페이지로 이동
      } else {
        console.error("기록 저장 중 오류 발생:", response.statusText);
      }
    } catch (error) {
      console.error("기록 저장 중 오류 발생:", error);
    }
  };

  const handleCancel = () => {
    navigate("/"); // 취소 버튼 클릭 시 메인 페이지로 이동
  };

  return (
    <div className="form-container">
      <h2>러닝 기록 입력</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>날짜: </label>
          <input
            type="date"
            name="runningDate"
            value={formData.runningDate}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Spot: </label>
          <input
            type="text"
            name="spot"
            value={formData.spot}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>상세 내용: </label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-buttons">
          <button type="submit" className="save-btn">
            저장
          </button>
          <button type="button" className="cancel-btn" onClick={handleCancel}>
            취소
          </button>
        </div>
      </form>
    </div>
  );
}

export default RecordFormPage;
