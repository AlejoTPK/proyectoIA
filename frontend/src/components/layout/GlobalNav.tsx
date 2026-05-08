import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { cn } from "../../lib/utils";

const NAV_LINKS = [
  { to: "/", label: "Dashboard" },
  { to: "/consulta", label: "Consulta SQL" },
  { to: "/conocimiento", label: "Base de Conocimiento" },
  { to: "/historial", label: "Historial" },
];

export const GlobalNav: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full h-11 bg-black text-white flex items-center px-4 md:px-8">
      <div className="w-full max-w-[1024px] mx-auto flex items-center justify-between">
        
        {/* Logo */}
        <span className="font-display text-sm font-semibold tracking-tight text-on-dark flex-shrink-0 cursor-pointer transition-opacity hover:opacity-80">
          ✦ Motor IA
        </span>

        {/* Links (Desktop) */}
        <ul className="hidden md:flex items-center space-x-8">
          {NAV_LINKS.map(({ to, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={to === "/"}
                className={({ isActive }) =>
                  cn(
                    "font-body text-[12px] font-normal tracking-[-0.12px] transition-colors duration-200",
                    isActive ? "text-on-dark" : "text-gray-400 hover:text-white"
                  )
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Placeholder para íconos derechos (Búsqueda/Bolsa) */}
        <div className="hidden md:flex items-center space-x-6 text-gray-400">
          <button aria-label="Search" className="hover:text-white transition-colors">
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 6.5C10 8.433 8.433 10 6.5 10C4.567 10 3 8.433 3 6.5C3 4.567 4.567 3 6.5 3C8.433 3 10 4.567 10 6.5ZM9.30884 10.0159C8.53901 10.6318 7.56251 11 6.5 11C4.01472 11 2 8.98528 2 6.5C2 4.01472 4.01472 2 6.5 2C8.98528 2 11 4.01472 11 6.5C11 7.56251 10.6318 8.53901 10.0159 9.30884L12.8536 12.1464C13.0488 12.3417 13.0488 12.6583 12.8536 12.8536C12.6583 13.0488 12.3417 13.0488 12.1464 12.8536L9.30884 10.0159Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
          </button>
          <button aria-label="Menu" className="md:hidden hover:text-white transition-colors" onClick={() => setIsMenuOpen(!isMenuOpen)}>
             <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.5 3C1.22386 3 1 3.22386 1 3.5C1 3.77614 1.22386 4 1.5 4H13.5C13.7761 4 14 3.77614 14 3.5C14 3.22386 13.7761 3 13.5 3H1.5ZM1 7.5C1 7.22386 1.22386 7 1.5 7H13.5C13.7761 7 14 7.22386 14 7.5C14 7.77614 13.7761 8 13.5 8H1.5C1.22386 8 1 7.77614 1 7.5ZM1 11.5C1 11.2239 1.22386 11 1.5 11H13.5C13.7761 11 14 11.2239 14 11.5C14 11.7761 13.7761 12 13.5 12H1.5C1.22386 12 1 11.7761 1 11.5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
          </button>
        </div>
      </div>
    </nav>
  );
};
