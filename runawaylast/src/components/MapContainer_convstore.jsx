import React, { useEffect, useState } from 'react';
import './MapContainer.css';

const { kakao } = window;

const MapContainer_convstore = ({ searchPlace, onSelectStore }) => {
  const [Places, setPlaces] = useState([]);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    var infowindow = new kakao.maps.InfoWindow({ zIndex: 1 });
    const container = document.getElementById('myMap');
    const options = {
      center: new kakao.maps.LatLng(33.450701, 126.570667),
      level: 3,
    };
    const map = new kakao.maps.Map(container, options);

    const ps = new kakao.maps.services.Places();
    const combinedSearchPlace = `${searchPlace} 편의점`;
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
        setPagination(pagination);
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
                          <button id="select-store" style="margin-top: 5px; background-color: #4CAF50; color: white; border: none; padding: 5px 10px; cursor: pointer;">
                            선택
                          </button>
                        </div>`;
        infowindow.setContent(content);
        infowindow.open(map, marker);

        // 마커의 정보창에서 "선택" 버튼을 클릭했을 때 편의점 정보를 선택하고 다음 화면으로 이동
        document.getElementById('select-store').onclick = () => {
          onSelectStore(place); // 편의점 정보를 선택한 값으로 처리
        };
      });
    }
  }, [searchPlace, onSelectStore]);

  const handlePagination = (page) => {
    if (pagination) {
      pagination.gotoPage(page);
    }
  };

  function displayPagination() {
    if (!pagination) return null;

    const pages = [];
    for (let i = 1; i <= pagination.last; i++) {
      pages.push(
        <button
          key={i}
          className={`page-button ${i === pagination.current ? 'on' : ''}`}
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
              onClick={() => onSelectStore(item)} // 선택된 편의점을 전달
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

export default MapContainer_convstore;