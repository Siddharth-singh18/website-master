import React from "react";
import { Link } from "react-router-dom";
import "./StickyButton.css";

const StickyButton = () => {
  return (
    <Link to="/event-register" className="sticky-register-btn">
      Register for CODE++
    </Link>
  );
};

export default StickyButton;
