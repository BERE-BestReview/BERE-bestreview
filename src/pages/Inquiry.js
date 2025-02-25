import React, { useState, useEffect } from "react";
import { Footer } from "../component/Footer";
import { Header } from "../component/Header";
import { Pagination } from "antd";
import "../component/Css/Inquiry.css";  // 새로운 스타일 파일 임포트

export const Inquiry = () => {
  const [data, setData] = useState([]);  // 전체 데이터 상태 관리
  const [currentPage, setCurrentPage] = useState(1);  // 현재 페이지 상태 관리
  const [pageSize] = useState(5);  // 한 페이지에 보여줄 데이터 수
  const [totalRecords, setTotalRecords] = useState(0);  // 전체 레코드 수 상태 관리

  // 더미 데이터 생성 (필요시 실제 데이터로 교체)
  useEffect(() => {
    const fetchData = () => {
      const dummyData = Array.from({ length: 2 }).map((_, index) => ({ //데이터량 설정
        id: index + 1,
        inquiry: `문의 내용 ${index + 1}`,
        writer: `사용자 ${index + 1}`,
        date: `2025/02/${(index % 30) + 1}`,
      }));
      setData(dummyData);
      setTotalRecords(dummyData.length);  // 전체 레코드 수 설정
    };
    fetchData();
  }, []);

  // 페이지네이션 변경 시 호출되는 함수
  const onPageChange = (page) => {
    setCurrentPage(page);  // 페이지 변경
  };

  // 페이지에 맞는 데이터 필터링
  const currentData = data.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // 데이터가 5개 미만일 경우 빈 데이터를 추가하여 5개 행을 만들기
  const rows = currentData.length < 5 ? [...currentData, ...Array(5 - currentData.length).fill({})] : currentData;

  return (
    <div>
      <Header />
      <div className="record-container2">
        <div className="title2">문의함</div>
        <button className="write-button">문의 작성</button>
        <div className="iqtable-container">
          <table className="iqtable">
            <thead>
              <tr>
                <th className="iq-th">번호</th>
                <th className="iq-th">제목</th>
                <th className="iq-th">글쓴이</th>
                <th className="iq-th">등록일</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan="4" className="no-records-message">
                    조회된 기록이 없습니다.
                  </td>
                </tr>
              ) : (
                rows.map((item, index) => (
                  <tr key={index} className="iq-tr">
                    <td className="iq-td">{item.id || ""}</td>
                    <td className="iq-td">{item.inquiry || ""}</td>
                    <td className="iq-td">{item.writer || ""}</td>
                    <td className="iq-td">{item.date || ""}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* 페이지네이션 추가 */}
          <div className="table-pagination-wrapper2">
            <Pagination
              current={currentPage}
              onChange={onPageChange}
              total={totalRecords}  // 전체 레코드 수
              pageSize={pageSize}  // 한 페이지에 보여줄 항목 수
              showSizeChanger={false}  // 페이지 크기 변경 숨김김
            />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};
