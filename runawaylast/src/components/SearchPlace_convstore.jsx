import React, { useState } from "react";
import MapContainer_convstore from "./MapContainer_convstore";
import { useNavigate } from "react-router-dom";

const SearchPlace_convstore = ({ onSelectStore }) => { // onSelectStore를 상위 컴포넌트로부터 받아옴
  const [inputText, setInputText] = useState("");
  const [place, setPlace] = useState("");

  const onChange = (e) => {
    setInputText(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setPlace(inputText);
    setInputText("");
  };

  return (
    <>
      <form className="inputForm" onSubmit={handleSubmit}>
        <input
          placeholder="Search Place..."
          onChange={onChange}
          value={inputText}
        />
        <button type="submit">검색</button>
      </form>
      {/* 편의점 선택 후 공원 페이지로 이동 */}
      <MapContainer_convstore searchPlace={place} onSelectStore={onSelectStore} />
    </>
  );
};

export default SearchPlace_convstore;