import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

console.log("🚀 Motor IA: Iniciando aplicación React...");

const rootEl = document.getElementById("root");

if (rootEl) {
  try {
    const root = ReactDOM.createRoot(rootEl);
    root.render(<App />);
    console.log("✅ Motor IA: Renderizado inicial completado");
  } catch (err) {
    console.error("❌ Motor IA: Error durante el renderizado:", err);
  }
} else {
  console.error("❌ Motor IA: No se encontró el elemento #root");
}
