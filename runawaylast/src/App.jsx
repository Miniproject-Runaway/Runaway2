import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { CORE_CONCEPTS } from "./data.js";
import { CoreConcept } from "./components/CoreConcept.jsx";
import { Header } from "./components/Header/Header.jsx";
import { GoogleLogin, googleLogout } from "@react-oauth/google";
import MainPage from "./components/pages/MainPage";
import RecordFormPage from "./components/pages/RecordFormPage";
import RecordListPage from "./components/pages/RecordListPage";
import RecordDetailPage from "./components/pages/RecordDetailPage";
import SearchPlace_convstore from "./components/SearchPlace_convstore"; // 편의점 검색 페이지
import SearchPlace_park from "./components/SearchPlace_Park"; // 공원 검색 페이지
import './button.css'; // 로그인 CSS 파일 추가

function App() {
  const [selectedTopic, setSelectedTopic] = useState();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || null); // 사용자 상태 관리
  const [showBagOptions, setShowBagOptions] = useState(false); // 짐 여부 버튼 표시 여부
  const [selectedConvenienceStore, setSelectedConvenienceStore] = useState(""); // 선택된 편의점 정보
  const [selectedPark, setSelectedPark] = useState(""); // 선택된 공원 이름 저장
  const [runStage, setRunStage] = useState(""); // 달리기 단계 관리 (짐 선택, 장소 선택, 기록 입력)
  const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate 훅

  function handleSelect(selectedButton) {
    setSelectedTopic(selectedButton);
  }

  // 구글 로그인 성공 시 호출되는 함수
  function handleLoginSuccess(credentialResponse) {
    console.log("Google 로그인 성공:", credentialResponse);

    try {
      // JWT 토큰에서 사용자 정보 추출
      const decodedResponse = JSON.parse(atob(credentialResponse.credential.split(".")[1]));
      const userData = {
        googleId: decodedResponse.sub,
        email: decodedResponse.email,
        name: decodedResponse.name,
      };

      setUser(userData); // 사용자 정보를 상태로 저장
      localStorage.setItem("user", JSON.stringify(userData)); // localStorage에 사용자 정보 저장
    } catch (error) {
      console.error("로그인 정보 파싱 중 오류 발생:", error);
    }
  }

  // 로그아웃 함수
  function handleLogout() {
    googleLogout(); // 구글 로그아웃 호출
    setUser(null); // 사용자 상태 초기화
    localStorage.removeItem("user"); // localStorage에서 사용자 정보 제거
    navigate("/"); // 로그아웃 후 메인 페이지로 이동
  }

  // "달리러 가기" 버튼 클릭 시 짐 여부 질문을 표시하는 함수
  function handleRunClick() {
    setShowBagOptions(true); // 짐 옵션 버튼 표시
    setRunStage("짐 선택 중"); // 상태 변경
  }

  // 짐 있음 버튼 클릭 시 편의점 추천 페이지로 이동
  function handleBagYes() {
    setRunStage("장소 선택 중"); // 상태 변경
    setShowBagOptions(false); // 짐 옵션 화면 숨김
    navigate("/convstore"); // 편의점 추천 페이지로 이동
  }

  // 짐 없음 버튼 클릭 시 공원 추천 페이지로 바로 이동
  function handleBagNo() {
    setRunStage("장소 선택 중"); // 상태 변경
    setShowBagOptions(false); // 짐 옵션 화면 숨김
    navigate("/park"); // 공원 추천 페이지로 바로 이동
  }

  // 편의점 선택 시 공원 추천 페이지로 이동
  function handleSelectConvenienceStore(store) {
    setSelectedConvenienceStore(store); // 선택된 편의점 저장
    navigate("/park"); // 공원 추천 페이지로 이동
  }

  // 공원 선택 시 기록 입력 페이지로 이동
  function handleSelectPark(parkName) {
    setSelectedPark(parkName); // 선택된 공원 이름 저장
    setRunStage("기록 입력 중"); // 상태 변경
    navigate("/record"); // 기록 입력 페이지로 이동
  }

  // 메인 화면으로 돌아가는 함수
  function goToMain() {
    setSelectedConvenienceStore(""); // 선택된 편의점 정보 초기화
    setSelectedPark(""); // 선택된 공원 정보 초기화
    setRunStage(""); // 달리기 단계 초기화
    setShowBagOptions(false); // 짐 옵션 숨김
    navigate("/"); // 메인 페이지로 이동
  }

  return (
    <div>
      <Header />
      <main>
        <section id="core-concepts">
          {!user ? (
            <>
              <h2>주요 기능</h2>
              <ul>
                {CORE_CONCEPTS.map((conceptItem) => (
                  <CoreConcept key={conceptItem.title} {...conceptItem} />
                ))}
              </ul>
            </>
          ) : (
            <div className="running-container">
              {/* 장소 선택 중일 때는 "달릴 준비 중!" 문구만 표시 */}
              {runStage === "장소 선택 중" && (
                <p>달릴 준비 중!</p>
              )}

              {/* 짐 선택 후 문구 표시 */}
              {runStage === "기록 입력 중" && selectedConvenienceStore && (
                <p>짐은 {selectedConvenienceStore.place_name}에 있어요!</p>
              )}

              {/* 메인으로 돌아가는 버튼 표시 */}
              {(runStage === "기록 입력 중" && (selectedConvenienceStore || selectedPark)) && (
                <button className="main-button" onClick={goToMain}>
                  메인 화면으로 가기
                </button>
              )}

              {/* 짐 있음/없음 선택 화면 - 짐 선택이 안된 경우에만 보임 */}
              <div className="centered-container">
                {!showBagOptions && runStage === "" ? (
                  <button className="running-button" onClick={handleRunClick}>
                    달리러 가기
                  </button>
                ) : showBagOptions && runStage !== "기록 입력 중" ? (
                  <div className="bag-options">
                    <h3>짐이 있으신가요?</h3>
                    <button className="bag-button" onClick={handleBagYes}>짐 있음</button>
                    <button className="bag-button" onClick={handleBagNo}>짐 없음</button>
                  </div>
                ) : null} {/* 선택 후 짐 옵션 버튼을 숨김 */}
              </div>
            </div>
          )}
        </section>

        <section>
          {!user ? (
            <div className="login-container">
              <GoogleLogin
                onSuccess={handleLoginSuccess}
                onError={() => {
                  console.log("Login Failed");
                }}
                useOneTap={false} // 자동 로그인 방지
                auto_select={false} // 자동 계정 선택 방지
              />
            </div>
          ) : (
            <div className="logout-container">
              <button id="logout" onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </section>

        {/* Routes 설정 */}
        <Routes>
          <Route path="/" element={<MainPage user={user} />} />
          <Route path="/record" element={<RecordFormPage user={user} selectedPark={selectedPark} selectedConvenienceStore={selectedConvenienceStore} />} />
          <Route path="/records" element={<RecordListPage user={user} />} /> {/* user 전달 */}
          <Route path="/record/:id" element={<RecordDetailPage user={user} />} />
          <Route
            path="/convstore"
            element={<SearchPlace_convstore onSelectStore={handleSelectConvenienceStore} />}
          /> {/* 편의점 검색 후 선택 시 기록 페이지로 이동 */}
          <Route
            path="/park"
            element={<SearchPlace_park onSelectPark={handleSelectPark} />}
          /> {/* 공원 검색 */}
        </Routes>
      </main>
    </div>
  );
}

export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}