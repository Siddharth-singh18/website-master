import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./StickyButton.css";

const StickyButton = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  if (currentPath === "/event-register") {
    return null;
  }

  return (
    <Link to="/event-register" className="sticky-register-btn">
      Register for CODE++
    </Link>
  );
};

export default StickyButton;
