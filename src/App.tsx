// import React from 'react';
import { Routes, Route } from "react-router-dom";
import './App.less';

// CustomComponent
import Layout from "@/Components/Layout/Layout";
import ClockPage from "@/Pages/ClockPage/Clock";
import AuthPage from "@/Pages/AuthPage/AuthPage";
import ProfilePage from "@/Pages/ProfilePage/Profile";
import HistoryPage from "@/Pages/HistoryPage/HistoryPage";
import TaskPage from "@/Pages/TasksPage/TaskPage";
import NotFoundPage from "@/Pages/NotFoundPage/NotFoundPage";

function App() {


  return (
    <Routes>
      {/* Rotas protegidas */}
      <Route path="/" element={<Layout />}>
        <Route path="profile" element={<ProfilePage />} />
        <Route path="history" element={<HistoryPage />} />
        {/* TODO - create page for history & reports*/}
        {/* TODO - create page for tasks & subtasks*/}
        <Route path="task" element={<TaskPage />} />
        <Route index element={<ClockPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
      <Route path="/login" element={<AuthPage />} />
    </Routes>
  );
}

export default App;
