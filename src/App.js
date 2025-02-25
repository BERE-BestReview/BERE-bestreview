import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {CreateAccount} from "./pages/CreateAccount";
import Home from "./pages/Home";  
import { Inquiry } from "./pages/Inquiry";
import { Login } from "./pages/Login";
import { Record } from "./pages/Record";
import {SearchResultDetails} from "./pages/SearchResultDetails";
import {SearchResult} from "./pages/SearchResult";
import { Statics } from "./pages/Statics";
import {ReviewCheck} from "./pages/ReviewCheck";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/CreateAccount" element={<CreateAccount />} />
        <Route path="/Inquiry" element={<Inquiry />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Record" element={<Record />} />
        <Route path="/SearchResultDetails" element={<SearchResultDetails />} />
        <Route path="/SearchResult" element={<SearchResult />} />
        <Route path="/Statics" element={<Statics />} />
        <Route path="/ReviewCheck" element={<ReviewCheck />} />
      </Routes>
    </Router>
  );
}

export default App;