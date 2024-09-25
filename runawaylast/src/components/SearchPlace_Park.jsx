// SearchPlace_park.jsx

import React, { useState } from "react";
import MapContainer_park from "./MapContainer_park";

const SearchPlace_park = ({ onSelectPark }) => {
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
      <MapContainer_park searchPlace={place} onSelectPark={onSelectPark} /> {/* 공원 선택 시 콜백 전달 */}
    </>
  );
};

export default SearchPlace_park;