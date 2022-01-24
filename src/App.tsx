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
        <Route index element={<ClockPage />} />
        {/* TODO - add project/:id page, show tasks*/}
        {/* TODO - add project/task/:id page */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
      <Route path="/login" element={<AuthPage />} />
    </Routes>
  );
}

export default App;
