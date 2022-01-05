import React from 'react';
import { Routes, Route } from "react-router-dom";
import './App.less';

// CustomComponent
import Layout from "./Components/Layout/Layout";
import HomePage from "./Pages/HomePage/Home";
import ClockPage from "./Pages/ClockPage/Clock";
import ProjectsPage from "./Pages/ProjectsPage/Projects";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="" element={<HomePage />} />
        <Route path="clock" element={<ClockPage />} />
        <Route path="projects" element={<ProjectsPage />} />
      </Route>
    </Routes>
  );
}

export default App;
