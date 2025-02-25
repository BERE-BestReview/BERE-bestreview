import React from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import titlelogo from "../mainreview.png";
import "./Css/Header.css";

export const Header = () => {
  return (
    <>
      <Navbar id="Nav_header">
        <Container id="container_header">
          <Navbar.Brand href="/">
            <img src={titlelogo} alt="mainlogo" id="titlelogo" />
          </Navbar.Brand>
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto" id="text">
              <Nav.Link href="/ReviewCheck">리뷰조회</Nav.Link>
              <Nav.Link href="/Record">기록조회</Nav.Link>
              <Nav.Link href="/Statics">통계정보</Nav.Link>
              <Nav.Link href="/Login ">로그인</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <hr />
    </>
  );
};
