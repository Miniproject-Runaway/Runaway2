import React, { useEffect, useState } from 'react';
import './MapContainer.css';

const { kakao } = window;

const MapContainer_convstore = ({ searchPlace }) => {
  
  const [Places, setPlaces] = useState([]);

  useEffect(() => {
    var infowindow = new kakao.maps.InfoWindow({ zIndex: 1 });
    var markers = [];
    const container = document.getElementById('myMap');
    const options = {
      center: new kakao.maps.LatLng(33.450701, 126.570667),
      level: 3,
    };
    const map = new kakao.maps.Map(container, options);

    const ps = new kakao.maps.services.Places();

    // "편의점" 키워드 추가
    const combinedSearchPlace = `${searchPlace} 편의점`;
    ps.keywordSearch(combinedSearchPlace, placesSearchCB);

    function placesSearchCB(data, status, pagination) {
      if (status === kakao.maps.services.Status.OK) {
        let bounds = new kakao.maps.LatLngBounds();
        for (let i = 0; i < data.length; i++) {
          displayMarker(data[i]);
          bounds.extend(new kakao.maps.LatLng(data[i].y, data[i].x));
        }
        map.setBounds(bounds);
        displayPagination(pagination);
        setPlaces(data);
      }
    }

    function displayPagination(pagination) {
      var paginationEl = document.getElementById('pagination'),
        fragment = document.createDocumentFragment(),
        i;
      while (paginationEl.hasChildNodes()) {
        paginationEl.removeChild(paginationEl.lastChild);
      }
      for (i = 1; i <= pagination.last; i++) {
        var el = document.createElement('a');
        el.href = '#';
        el.innerHTML = i;

        if (i === pagination.current) {
          el.className = 'on';
        } else {
          el.onclick = (function (i) {
            return function () {
              pagination.gotoPage(i);
            };
          })(i);
        }

        fragment.appendChild(el);
      }
      paginationEl.appendChild(fragment);
    }

    function displayMarker(place) {
      let marker = new kakao.maps.Marker({
        map: map,
        position: new kakao.maps.LatLng(place.y, place.x),
      });

      kakao.maps.event.addListener(marker, 'click', function () {
        infowindow.setContent('<div style="padding:5px;font-size:12px;">' + place.place_name + '</div>');
        infowindow.open(map, marker);
      });
    }
  }, [searchPlace]);

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
            <div key={i} className="place-card">
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
        <div id="pagination"></div>
      </div>
    </div>
  );
};

export default MapContainer_convstore;