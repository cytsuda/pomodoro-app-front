// import React from 'react';
import { Routes, Route } from "react-router-dom";
import './App.less';

// CustomComponent
import Layout from "@/Components/Layout/Layout";
import HomePage from "@/Pages/HomePage/Home";
import ClockPage from "@/Pages/ClockPage/Clock";
import ProjectsPage from "@/Pages/ProjectsPage/Projects";
import AuthPage from "@/Pages/AuthPage/AuthPage";

function App() {
  return (
    <Routes>
      {/* Rotas protegidas */}
      <Route path="/" element={<Layout />}>
        <Route path="" element={<HomePage />} />
        <Route path="clock" element={<ClockPage />} />
        <Route path="projects" element={<ProjectsPage />} />
        {/* TODO - add project/:id page, show tasks*/}
        {/* TODO - add project/task/:id page */}
      </Route>
      <Route path="/login" element={<AuthPage />} />
    </Routes>
  );
}

export default App;
