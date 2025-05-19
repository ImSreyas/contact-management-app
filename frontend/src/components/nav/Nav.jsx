import { navPaths } from "@/lib/const/navConstants";
import { cn } from "@/lib/utils";
import React from "react";
import { useLocation } from "react-router-dom";
import ProfilePopup from "./components/ProfilePopup";

export default function Nav() {
  return (
    <nav className="flex justify-between items-center gap-2 min-h-22 h-fit px-20 py-2">
      {/* Logo section */}
      <div></div>

      {/* Navigation links */}
      <div>
        <NavLinks paths={navPaths} />
      </div>

      {/* Profile section */}
      <div>
        <ProfilePopup />
      </div>
    </nav>
  );
}

function NavLinks({ paths }) {
  const location = useLocation();

  return (
    <ul className="flex gap-4">
      {paths.map(({ label, path }, index) => {
        return (
          <li
            key={index}
            className={cn(
              "px-3 py-1 text-foreground/70 border-2 font-medium",
              location.pathname === path
                ? "text-primary border-2 border-dashed"
                : "border-transparent"
            )}
          >
            <a href={path}>{label}</a>
          </li>
        );
      })}
    </ul>
  );
}
