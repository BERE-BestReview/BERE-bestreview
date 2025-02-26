import React, { useState } from "react"; 
import { Footer } from "../component/Footer"; 
import { Header } from "../component/Header"; 
import { Carousel, Button, Flex, Radio } from "antd"; 
import { PlayCircleFilled } from "@ant-design/icons"; 
import { useNavigate } from "react-router-dom"; 
import "../component/Css/Home.css";
import HomeImg from "../homepage_img.jpg";
import ResultImg1 from "../result1.png";
import ResultImg2 from "../result2.png";
import ResultImg3 from "../result3.png";
import ResultImg4 from "../result4.png";
import MainlogImg from "../mainlog.png";
import IntroImg1 from "../introIcon1.png";
import IntroImg2 from "../introIcon2.png";
import IntroImg3 from "../introIcon3.png";

const Home = () => { 
  const [size, setSize] = useState("large"); 
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate("/Review_Check");
  };

  const handleLoginClick = () => {
    navigate("/Login");
  };

  return ( 
    <> 
      <Header /> 
      <article>
      <img src={HomeImg} alt="홈 배경" className="home-background"></img>
        <div className="div0">
          <div className="text-container">
            <div className="text1">BestReview</div>
            <div className="text2">가짜리뷰탐지시스템</div>
          </div>
        


          <div className="rectangle-container">
            <div className="rectangle">
              <Button 
                type="primary" 
                size={size} 
                className="login-button"
                onClick={handleLoginClick}
              >
                <img src={MainlogImg} alt="" className="login-icon" />
                로그인
              </Button>
            </div>
          </div>
        </div>


        <div className="introduceHome"> 
          <div className="parentHome"> 
            <div className="div4">
              <div className="div4-rec">
                <div className="div4-title-container">
                  <div className="div4-logo-title">BestReview</div>
                  <div className="div4-title">의 기능</div>
                </div>
                <div className="div4-subtitle">
                  판치는 가짜 리뷰! <br />
                  신뢰할 수 있는 리뷰인지 확인해 드립니다.
                </div>

                <div className="div4-box-container">
                  <div className="div4-box"><div className="box-text">#신뢰할수있는</div></div>
                  <div className="div4-box"><div className="box-text">#가짜리뷰탐지</div></div>
                </div>

                <div className="icon-container">
                  <div className="icon-group">
                    <img src={IntroImg1} alt="" className="div4-image" />
                    <div className="div4-icontext">원하는 사이트 검색</div>
                    <div className="div4-description">
                      리뷰의 신뢰도를 확인하고 싶은 사이트의 URL을 입력하여 직접 확인하세요.
                    </div>
                  </div>
                  <div className="icon-group">
                    <img src={IntroImg2} alt="" className="div4-image" />
                    <div className="div4-icontext">리뷰 요약</div>
                    <div className="div4-description">
                      방대한 리뷰를 한눈에 보기 쉽게 요약해 드립니다.
                    </div>
                  </div>
                  <div className="icon-group">
                    <img src={IntroImg3} alt="" className="div4-image" />
                    <div className="div4-icontext">A~D, F의 등급제</div>
                    <div className="div4-description">
                      리뷰의 신뢰도를 등급으로 평가하여 가짜 리뷰 여부를 쉽게 확인할 수 있습니다.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="div2"> 
              <Carousel arrows dots infinite={false}>
                <div> <img src={ResultImg1} alt="Slide 1" className="carousel-img" /> </div> 
                <div> <img src={ResultImg2} alt="Slide 2" className="carousel-img" /> </div> 
                <div> <img src={ResultImg3} alt="Slide 3" className="carousel-img" /> </div> 
                <div> <img src={ResultImg4} alt="Slide 4" className="carousel-img" /> </div> 
              </Carousel> 
            </div> 
            
            <div className="div3">
              <Radio.Group value={size} onChange={(e) => setSize(e.target.value)}>
                <Flex justify="center" align="center" className="button-container">
                  <Button type="primary" shape="round" size={size} className="review-button" onClick={handleButtonClick}>
                    리뷰 조회하러 가기
                    <span className="play-button">
                      <PlayCircleFilled className="play-icon" />
                    </span>
                  </Button>
                </Flex>
              </Radio.Group>
            </div> 
          </div> 
        </div> 
      </article> 
      <Footer /> 
    </>
  ); 
};

export default Home;
