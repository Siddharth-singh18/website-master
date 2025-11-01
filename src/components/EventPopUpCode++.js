import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
//import './EventPopup.css'; // <-- CSS ko import karna na bhoolein
import "./EventPopUpcode++.css";

function EventPopup() {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setShow(true);
  }, []);

  const handleClose = () => setShow(false);

  const handleRegister = () => {
    handleClose();
    navigate("/event-register");
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      size="lg"
      centered
      className="event-popup" // CSS class
    >
      <Modal.Header closeButton>
        <Modal.Title>
          <span>🚀</span> Event Alert! <span>🚀</span>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="event-content">
          <h3>Programming Club Presents</h3>

          <h2>CODE++</h2>

          <p className="event-details">
            CODE++ is the ultimate coding challenge for 2nd and 3rd-year
            students passionate about competitive programming and
            problem-solving.
          </p>
          <ul className="event-info">
            <li>📅 Date: Nov 04, 2025 </li>
            <li>⏰ Time: 4:00 PM - 7:00 PM</li>
            <li>📍 Venue: 3rd floor,CSIT BLOCK</li>
            {/* <li>🏆 Prize Pool: ₹6000 </li> */}
          </ul>
          <p className="event-description">
            Why participate?
            <ul>
              <li>Compete with the best coders in the college.</li>
              <li>Solve challenging algorithmic problems.</li>
              <li>Win exciting prizes and recognition.</li>
              <li>
                Boost your skills for technical interviews and future contests.
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
          Register Now
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default EventPopup;
