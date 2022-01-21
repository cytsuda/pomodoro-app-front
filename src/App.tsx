// import React from 'react';
import { Routes, Route } from "react-router-dom";
import './App.less';

// CustomComponent
import Layout from "@/Components/Layout/Layout";
import ClockPage from "@/Pages/ClockPage/Clock";
import AuthPage from "@/Pages/AuthPage/AuthPage";
import NotFoundPage from "@/Pages/NotFoundPage/NotFoundPage";

function App() {
  return (
    <Routes>
      {/* Rotas protegidas */}
      <Route path="/" element={<Layout />}>
        <Route path="" element={<ClockPage />} />
        {/* TODO - add project/:id page, show tasks*/}
        {/* TODO - add project/task/:id page */}
      </Route>
      <Route path="/login" element={<AuthPage />} />
      <Route element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
