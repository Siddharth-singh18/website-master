import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function EventPopup() {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Show popup on every page load
    setShow(true);
  }, []);

  const handleClose = () => setShow(false);

  const handleRegister = () => {
    handleClose();
    navigate("/register");
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      size="lg"
      centered
      className="event-popup"
    >
      <Modal.Header closeButton>
        <Modal.Title>
          <span>🚀</span> Recruitment Drive Alert! <span>🚀</span>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="event-content">
          <h3>Programming Club Presents</h3>
          <h2>Cin&gt;&gt;PC</h2>
          <p className="event-details">
            Cin&gt;&gt;PC is the official recruitment drive of the Programming
            Club, designed exclusively for 2nd-year students who are passionate
            about coding and problem-solving.
          </p>
          <ul className="event-info">
            <li>📅 Date: Sept 3, 2025 </li>
            <li>⏰ Time: 4:00 PM - 7:30 PM</li>
            <li>📍 Venue: CSIT Block</li>
          </ul>
          <p className="event-description">
            Why participate?
            <ul>
              <li>Showcase your coding and problem-solving skills</li>
              <li>
                Get an opportunity to become a member of the Programming Club
              </li>
              <li>Win exciting prizes and certificates</li>
              <li>
                Learn, grow, and connect with seniors and alumni for career
                guidance
              </li>
            </ul>
          </p>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleRegister}>
          Apply Now
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default EventPopup;
