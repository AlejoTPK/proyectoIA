import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GlobalNav } from "./components/layout/GlobalNav";
import { DashboardPage } from "./pages/DashboardPage";
import { NL2SQLPage } from "./pages/NL2SQLPage";
import { KnowledgePage } from "./pages/KnowledgePage";
import { HistoryPage } from "./pages/HistoryPage";
import "./styles/global.css";

const App: React.FC = () => (
  <BrowserRouter>
    <GlobalNav />
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/consulta" element={<NL2SQLPage />} />
      <Route path="/conocimiento" element={<KnowledgePage />} />
      <Route path="/historial" element={<HistoryPage />} />
    </Routes>
  </BrowserRouter>
);

export default App;
