import React, { useState, useEffect } from "react";
import { Footer } from "../component/Footer";
import { Header } from "../component/Header";
import { DatePicker, Button, Input, Pagination } from 'antd';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import '../component/Css/Record.css';

// dayjs 플러그인 확장
dayjs.extend(customParseFormat);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const dateFormat = 'YYYY/MM/DD'; // 날짜 포맷 설정

export const Record = () => {
  // 상태 변수들
  const [selectedButtons, setSelectedButtons] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [current, setCurrent] = useState(1);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [startDate, setStartDate] = useState(null);  // 시작 날짜
  const [endDate, setEndDate] = useState(null);  // 종료 날짜

  // 더미 데이터 (실제 데이터로 교체 가능)
  useEffect(() => {
    const fetchData = () => {
      const dummyData = Array.from({ length: 64 }).map((_, index) => ({  // 데이터량 설정
        id: index + 1,
        summary: `리뷰 내용 요약 ${index + 1}`,
        result: ['A', 'B', 'C', 'D', 'F'][index % 5],
        date: `2025/02/${(index % 30) + 1}`,
      }));
      setData(dummyData);
      setFilteredData(dummyData.slice(0, 5));  // 초기 데이터 로드시 첫 5개 데이터만 표시
      setTotalRecords(dummyData.length);  // 전체 레코드 수 설정
    };
    fetchData();
  }, []);

  // 페이지네이션 변경 시 호출되는 함수
  const onPaginationChange = (page) => {
    setCurrent(page);
    handleSearch(page);  // 페이지 변경 시 필터링된 데이터 재검색
  };

  // 검색 및 필터링 함수
  const handleSearch = (page = 1) => {
    const pageSize = 5; // 한 페이지에 표시할 데이터 개수
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    // 필터링 조건
    const filtered = data.filter(item => {
      const isInDateRange =
        (!startDate || dayjs(item.date).isSameOrAfter(startDate, 'day')) && // startDate부터 필터링
        (!endDate || dayjs(item.date).isSameOrBefore(endDate, 'day'));
    
      return (
        (selectedButtons.length === 0 || selectedButtons.includes(item.result)) &&
        item.summary.includes(keyword) &&  // 키워드를 리뷰 내용 요약에서만 체크
        isInDateRange  // 날짜 범위 필터링
      );
    });

    setFilteredData(filtered.slice(startIndex, endIndex));  // 필터링 후 현재 페이지 데이터 설정
    setTotalRecords(filtered.length);  // 필터링된 데이터의 총 개수 설정
  };

  // 데이터가 없을 때 메시지 표시
  const renderTableContent = () => {
    if (totalRecords === 0) {  // 전체 데이터가 없을 때
      return (
        <tr>
          <td colSpan="4" style={{ textAlign: "center", fontSize: "1.5vh", color: "#3A278B" }}>
            <div className="no-records-message">
              검색 기록이 존재하지 않습니다.
            </div>
          </td>
        </tr>
      );
    }

    if (filteredData.length === 0) {  // 필터링된 데이터가 없을 때
      return (
        <tr>
          <td colSpan="4" style={{ textAlign: "center", fontSize: "1.5vh", color: "#3A278B" }}>
            <div className="no-records-message">
              검색 조건에 맞는 기록이 없습니다.
            </div>
          </td>
        </tr>
      );
    }

    // 페이지 번호 계산
    const startIndex = (current - 1) * 5; // 현재 페이지에서 첫 번째 항목의 인덱스
    return filteredData.map((item, index) => (
      <tr key={item.id}>
        <td>{startIndex + index + 1}</td> {/* 번호는 startIndex + index + 1로 설정 */}
        <td>{item.summary}</td>
        <td>{item.result}</td>
        <td>{item.date}</td>
      </tr>
    ));
  };

  return (
    <div>
      <Header />
      <div className="record-container">
        <div className="title">검색 기록 조회</div>
        <div className="div1">
          <div className="filter-box">
            <div className="filter-item1">
              <label className="label">검색 날짜 </label>
              <DatePicker 
                value={startDate ? dayjs(startDate, dateFormat) : null} 
                onChange={setStartDate} 
                format={dateFormat} 
              />
              <span className="date-range-separator">~</span>
              <DatePicker 
                value={endDate ? dayjs(endDate, dateFormat) : null} 
                onChange={setEndDate} 
                format={dateFormat} 
              />
            </div>
            <div className="filter-item2">
              <label className="label">검색 키워드 </label>
              <Input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="원하는 키워드를 입력하세요"
              />
            </div>
          </div>

          {/* "판단 결과" 텍스트와 버튼들 */}
          <div className="result-section">
            <div className="result-title">판단 결과</div>
            <div className="result-button-wrapper">
              {['A', 'B', 'C', 'D', 'F'].map((result) => (
                <Button
                  key={result}
                  className={`result-button ${selectedButtons.includes(result) ? 'selected' : ''}`}
                  onClick={() => setSelectedButtons((prevState) => prevState.includes(result) ? prevState.filter(id => id !== result) : [...prevState, result])}
                >
                  {result}
                </Button>
              ))}
            </div>

            {/* 오른쪽 정렬된 초기화 및 검색 버튼 */}
            <div className="button-wrapper">
              <Button className="reset-button" onClick={() => { setSelectedButtons([]); setKeyword(''); setStartDate(null); setEndDate(null); setFilteredData(data.slice(0, 5)); setTotalRecords(data.length); setCurrent(1); }}>
                초기화
              </Button>
              <Button className="search-button" onClick={() => handleSearch(1)}>
                검색
              </Button>
            </div>
          </div>
        </div>

        <div className="div5">
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>번호</th>
                  <th>리뷰 내용 요약</th>
                  <th>판단 결과</th>
                  <th>검색 날짜</th>
                </tr>
              </thead>
              <tbody>
                {renderTableContent()}
              </tbody>
            </table>

            {/* 페이지네이션 컴포넌트 추가 */}
            <div className="table-pagination-wrapper">
              <Pagination
                current={current}
                onChange={onPaginationChange}
                total={totalRecords}  // 전체 데이터 길이를 totalRecords로 설정
                pageSize={5}  // 한 페이지에 보여줄 항목 수
                showSizeChanger={false}  // 페이지당 항목 수 변경 버튼 없애기
              />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};
