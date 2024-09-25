import React, { useEffect, useState } from 'react';
import './MapContainer.css';

const { kakao } = window;

const MapContainer_park = ({ searchPlace, onSelectPark }) => {
  const [Places, setPlaces] = useState([]);
  const [pagination, setPagination] = useState(null); // 페이지네이션 상태 추가

  useEffect(() => {
    var infowindow = new kakao.maps.InfoWindow({ zIndex: 1 });
    const container = document.getElementById('myMap');
    const options = {
      center: new kakao.maps.LatLng(33.450701, 126.570667),
      level: 3,
    };
    const map = new kakao.maps.Map(container, options);

    const ps = new kakao.maps.services.Places();
    const combinedSearchPlace = `${searchPlace} 공원`;
    ps.keywordSearch(combinedSearchPlace, placesSearchCB);

    function placesSearchCB(data, status, pagination) {
      if (status === kakao.maps.services.Status.OK) {
        let bounds = new kakao.maps.LatLngBounds();
        data.forEach((place) => {
          displayMarker(place);
          bounds.extend(new kakao.maps.LatLng(place.y, place.x));
        });
        map.setBounds(bounds);
        setPlaces(data);
        setPagination(pagination); // 페이지네이션 상태 업데이트
      }
    }

    function displayMarker(place) {
      let marker = new kakao.maps.Marker({
        map: map,
        position: new kakao.maps.LatLng(place.y, place.x),
      });

      kakao.maps.event.addListener(marker, 'click', function () {
        const content = `<div style="padding:5px;font-size:12px; color:black; font-weight: bold;">
                          ${place.place_name}
                          <br />
                          <button id="select-park" style="margin-top: 5px; background-color: #4CAF50; color: white; border: none; padding: 5px 10px; cursor: pointer;">
                            선택
                          </button>
                        </div>`;
        infowindow.setContent(content);
        infowindow.open(map, marker);

        // 마커의 정보창에서 "선택" 버튼을 클릭했을 때 공원 정보를 선택하고 다음 화면으로 이동
        document.getElementById('select-park').onclick = () => {
          onSelectPark(place.place_name); // 공원 이름을 선택한 값으로 처리
        };
      });
    }
  }, [searchPlace, onSelectPark]);

  // 페이지네이션 처리 함수
  const handlePagination = (page) => {
    if (pagination) {
      pagination.gotoPage(page); // 페이지 이동
    }
  };

  // 페이지네이션 UI 생성 함수
  function displayPagination() {
    if (!pagination) return null; // 페이지네이션이 없을 경우 표시 안함

    const pages = [];
    for (let i = 1; i <= pagination.last; i++) {
      pages.push(
        <button
          key={i}
          className={`page-button ${i === pagination.current ? 'on' : ''}`} // 현재 페이지에 'on' 클래스 추가
          onClick={() => handlePagination(i)}
        >
          {i}
        </button>
      );
    }

    return <div className="pagination-container">{pages}</div>;
  }

  return (
    <div>
      <div
        id="myMap"
        style={{
          width: '750px',
          height: '750px',
        }}
      ></div>
      <div id="result-list">
        <div className="places-container">
          {Places.map((item, i) => (
            <div
              key={i}
              className="place-card"
              onClick={() => onSelectPark(item.place_name)} // 선택된 공원을 전달
              style={{ cursor: 'pointer' }}
            >
              <span className="place-index">{i + 1}</span>
              <div className="place-info">
                <h5 className="place-name">{item.place_name}</h5>
                {item.road_address_name ? (
                  <div>
                    <span className="place-address">{item.road_address_name}</span>
                    <span className="place-old-address">{item.address_name}</span>
                  </div>
                ) : (
                  <span className="place-address">{item.address_name}</span>
                )}
                <span className="place-phone">{item.phone}</span>
              </div>
            </div>
          ))}
        </div>
        {displayPagination()} {/* 페이지네이션 UI 표시 */}
      </div>
    </div>
  );
};

export default MapContainer_park;
