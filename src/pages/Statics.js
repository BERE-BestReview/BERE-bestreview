import React from "react";
import { Footer } from "../component/Footer";
import { Header } from "../component/Header";
import { Progress, Card } from "antd";
import "../component/Css/Statics.css";

export const Statics = () => {
  const tasks = [
    { name: "쿠팡", value: 80 },
    { name: "11번가", value: 60 },
    { name: "알리익스프레스", value: 50 },
    { name: "G마켓", value: 90 },
    { name: "e마트", value: 90 },
  ];

  return (
    <div>
      <Header />
        <div className="statics-container">
          <div className="title3">통계 정보</div>
          <div className="statics-description">
          사용자들이 조회한 데이터를 기반으로 통계 정보를 제공합니다. <br />
          최신 결과를 반영하여 자동으로 업데이트되므로, 실시간 변화를 확인할 수 있습니다.
          </div>
          <div className="staticmain">
            <div className="progress-container">
              {tasks.map((task, index) => (
                <div className="static_card" key={index}>
                  <Card className="static_card" title={task.name} bordered={false}>
                    <Progress percent={task.value} showInfo={true} />
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      <Footer />
    </div>
  );
};
