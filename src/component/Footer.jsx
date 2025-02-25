import React from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import footerlogo from "../footerlogo.png";
import "./Css/Footer.css";

export const Footer = () => {
  return (
    <>
      <hr />
      <Navbar id="Footer_Nav">
        <Container id="container_footer">
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto" id="text_footer">
              <Nav.Link href="/ReviewCheck">이용약관</Nav.Link>
              <img src={footerlogo} alt="footerlogo" />
              <Nav.Link href="/Inquiry">문의하기</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};
