import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import ReCAPTCHA from "react-google-recaptcha";
import { FaCheckCircle } from "react-icons/fa";
import "./Register.css";

const RECAPTCHA_SITE_KEY = "6LcnprQrAAAAABbDh36kcDHZHlAJbdg3FrSiD_Wv";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    roll_no: "",
    email: "",
    branch_name: "",
    student_no: "",
    phone: "",
    hackerrank: "",
    gender: "",
    hosteller: "",
  });

  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formError, setFormError] = useState("");
  const [shouldRenderParticles, setShouldRenderParticles] = useState(false);

  // Branch code mapping
  const branchCodes = {
    ME: "40",
    ECE: "31",
    EE: "21",
    "CSE(Hindi)": "169",
    "CSE (Hindi)": "169",
    AIML: "164",
    "CSE(DS)": "154",
    "CSE (DS)": "154",
    "CSE(AIML)": "153",
    "CSE (AIML)": "153",
    IT: "13",
    CS: "12",
    CSIT: "11",
    "CS IT": "11",
    CSE: "10",
    CE: "0",
  };

  // Only enable particles on desktop devices and if user's device is powerful enough
  useEffect(() => {
    const isDesktop = window.innerWidth >= 992;
    const isLowEndDevice = navigator.hardwareConcurrency <= 4;
    setShouldRenderParticles(isDesktop && !isLowEndDevice);

    const handleResize = () => {
      setShouldRenderParticles(window.innerWidth >= 992 && !isLowEndDevice);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const validateForm = () => {
    // Get branch code for selected branch
    const branchCode = branchCodes[formData.branch_name];
    if (!branchCode) {
      setFormError("Please select a valid branch");
      return false;
    }

    // Required field validations first
    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.branch_name ||
      !formData.student_no.trim() ||
      !formData.phone.trim() ||
      !formData.gender ||
      !formData.hosteller ||
      !formData.roll_no.trim()
    ) {
      setFormError("All fields are required except HackerRank profile");
      return false;
    }

    // Name validation - alphabets and spaces only
    if (!/^[a-zA-Z ]+$/.test(formData.name.trim())) {
      setFormError("Name must have alphabets only.");
      return false;
    }

    // Phone validation - must start with 9, 8, 7, or 6 and be exactly 10 digits
    if (!/^[9876]\d{9}$/.test(formData.phone)) {
      setFormError("Phone number is not valid");
      return false;
    }

    // Student number validation
    const studentNo = formData.student_no.trim();

    // Length check (7-8 digits only)
    if (
      studentNo.length < 7 ||
      studentNo.length > 8 ||
      !/^\d+$/.test(studentNo)
    ) {
      setFormError("Invalid Student Number");
      return false;
    }

    // Must start with 24
    if (!studentNo.startsWith("24")) {
      setFormError("Invalid Student Number");
      return false;
    }

    // Branch code must be in positions 2-4 (0-indexed)
    const studentBranchCode = studentNo.substring(2, 5);
    if (!studentBranchCode.includes(branchCode)) {
      setFormError("Invalid Student Number");
      return false;
    }

    // Roll number validation
    const rollNo = formData.roll_no.trim();

    // Must be exactly 13 digits
    if (rollNo.length !== 13 || !/^\d{13}$/.test(rollNo)) {
      setFormError("University roll number must be of 13 digits");
      return false;
    }

    // Positions 3-5 must be "027"
    if (rollNo.substring(3, 6) !== "027") {
      setFormError("Invalid University roll number");
      return false;
    }

    // Branch code must be in positions 5-8 (0-indexed)
    const rollBranchCode = rollNo.substring(5, 9);
    if (!rollBranchCode.includes(branchCode)) {
      setFormError("Invalid University roll number");
      return false;
    }

    // Email validation
    const email = formData.email.trim().toLowerCase();

    // Must end with @akgec.ac.in
    if (!email.endsWith("@akgec.ac.in")) {
      setFormError("Invalid College Email ID");
      return false;
    }

    // Email format: [letters][student_no]@akgec.ac.in
    const emailRegex = new RegExp(`^[a-zA-Z]+${studentNo}@akgec\\.ac\\.in$`);
    if (!emailRegex.test(email)) {
      setFormError("Invalid College Email ID");
      return false;
    }

    // Branch code must be in email
    if (!email.includes(branchCode)) {
      setFormError("Invalid College Email ID");
      return false;
    }

    return true;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Clear form errors when user starts typing
    if (formError) {
      setFormError("");
    }

    // Format phone number to remove any non-digit characters and limit to 10 digits
    if (name === "phone") {
      const formattedValue = value.replace(/\D/g, "").slice(0, 10);
      setFormData((prevState) => ({
        ...prevState,
        [name]: formattedValue,
      }));
      return;
    }

    // Format student number - only digits, no -d suffix allowed based on backend validation
    if (name === "student_no") {
      const formattedValue = value.replace(/\D/g, "").slice(0, 8);
      setFormData((prevState) => ({
        ...prevState,
        [name]: formattedValue,
      }));
      return;
    }

    // Format roll number - only digits, exactly 13 digits based on backend validation
    if (name === "roll_no") {
      const formattedValue = value.replace(/\D/g, "").slice(0, 13);
      setFormData((prevState) => ({
        ...prevState,
        [name]: formattedValue,
      }));
      return;
    }

    // Format name - only alphabets and spaces
    if (name === "name") {
      const formattedValue = value.replace(/[^a-zA-Z ]/g, "");
      setFormData((prevState) => ({
        ...prevState,
        [name]: formattedValue,
      }));
      return;
    }

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleRecaptchaChange = (token) => {
    setRecaptchaToken(token);

    if (formError && formError.includes("reCAPTCHA")) {
      setFormError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!recaptchaToken) {
      setFormError("Please complete the reCAPTCHA verification");
      return;
    }

    if (!validateForm()) {
      return;
    }

    // Enhanced API data preparation with exact server format
    const apiData = {
      name: formData.name.trim(),
      roll_no: formData.roll_no.trim(),
      email: formData.email.trim().toLowerCase(),
      hackerrank: formData.hackerrank.trim() || "", // Keep as empty string for server compatibility
      student_no: formData.student_no.trim(),
      recaptcha_token: recaptchaToken,
      branch_name: formData.branch_name,
      gender:
        formData.gender.charAt(0).toUpperCase() +
        formData.gender.slice(1).toLowerCase(),
      phone: formData.phone.trim(),
      hosteller: formData.hosteller === "yes" ? "True" : "False", // Backend expects string 'True'/'False'
    };

    // Debug logging (remove in production)
    console.log("Sending data:", JSON.stringify(apiData, null, 2));

    try {
      setIsLoading(true);

      const response = await fetch(
        "https://cin-pc.onrender.com/api/register/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "User-Agent": "Mozilla/5.0 Registration Form",
          },
          body: JSON.stringify(apiData),
        }
      );

      // Handle different response statuses
      if (response.status === 201 || response.status === 200) {
        // Success handling
        const responseData = await response.json();
        console.log("Success response:", responseData);

        setShowSuccess(true);

        // Reset form data
        setFormData({
          name: "",
          roll_no: "",
          email: "",
          branch_name: "",
          student_no: "",
          phone: "",
          hackerrank: "",
          gender: "",
          hosteller: "",
        });

        // Reset reCAPTCHA
        setRecaptchaToken(null);
        window.scrollTo(0, 0);
      } else {
        // Simplified error handling since validation is now on frontend
        let errorMessage = "Registration failed. Please try again.";

        if (response.status === 400) {
          errorMessage =
            "You may already be registered. Please contact support if this is an error.";
        } else if (response.status === 500) {
          errorMessage = "Server error. Please try again later.";
        }

        setFormError(errorMessage);
      }
    } catch (error) {
      console.error("Network error:", error);

      if (error.name === "TypeError" && error.message.includes("fetch")) {
        setFormError(
          "Network error: Unable to connect to server. Please check your internet connection and try again."
        );
      } else if (error.name === "AbortError") {
        setFormError("Request timed out. Please try again.");
      } else {
        setFormError("Unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="register-section">
      <Container>
        <Row className="justify-content-center">
          <Col md={8} className="register-form-container">
            <h1 className="heading-name text-center mb-4">
              <span className="purple">CIN&gt;&gt;PC</span> REGISTRATION
            </h1>
            <p className="text-center subtitle mb-4">
              Organized by Programming Club, AKGEC
            </p>

            {showSuccess ? (
              <div className="success-message">
                <div className="success-icon">
                  <FaCheckCircle />
                </div>
                <h2>
                  Registration <span className="purple">Complete!</span>
                </h2>
                <p>
                  Thank you for registering! Please check your email for further
                  instructions and confirmation details.
                </p>
                <Button
                  variant="primary"
                  className="submit-btn"
                  onClick={() => setShowSuccess(false)}
                >
                  Register Another
                </Button>
              </div>
            ) : (
              <>
                {formError && <Alert variant="danger">{formError}</Alert>}

                <Form onSubmit={handleSubmit} className="register-form">
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>
                          Full Name <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          placeholder="Enter your full name"
                        />
                        <Form.Text className="text-muted">
                          Only alphabets and spaces allowed
                        </Form.Text>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>
                          Email Address <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          placeholder="firstname24xxxxxxx@akgec.ac.in"
                          title="Format: [letters][student_number]@akgec.ac.in"
                        />
                        <Form.Text className="text-muted">
                          Format: [your_name][student_number]@akgec.ac.in
                        </Form.Text>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>
                          Phone Number <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                          placeholder="10-digit phone number"
                          title="Must start with 9, 8, 7, or 6"
                        />
                        <Form.Text className="text-muted">
                          Must start with 9, 8, 7, or 6 and be exactly 10 digits
                        </Form.Text>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>
                          Roll Number <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="roll_no"
                          value={formData.roll_no}
                          onChange={handleChange}
                          required
                          placeholder="Enter your university roll number"
                          title="Must be exactly 13 digits with specific format"
                        />
                        <Form.Text className="text-muted">
                          Must be exactly 13 digits (format:
                          XXX027[branch_code]XXX)
                        </Form.Text>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>
                          Branch <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Select
                          name="branch_name"
                          value={formData.branch_name}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Select Branch</option>
                          <option value="CSE">CSE</option>
                          <option value="CSE (AIML)">CSE (AIML)</option>
                          <option value="CSE (Hindi)">CSE (Hindi)</option>
                          <option value="CSE (DS)">CSE (DS)</option>
                          <option value="CS">CS</option>
                          <option value="CS IT">CS IT</option>
                          <option value="AIML">AIML</option>
                          <option value="IT">IT</option>
                          <option value="ECE">ECE</option>
                          <option value="EE">EE</option>
                          <option value="ME">ME</option>
                          <option value="CE">CE</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>
                          Student Number <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="student_no"
                          value={formData.student_no}
                          onChange={handleChange}
                          required
                          placeholder="Enter your student number"
                          title="7-8 digits starting with 24"
                        />
                        <Form.Text className="text-muted">
                          7-8 digits, must start with 24 and include your branch
                          code
                        </Form.Text>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>
                          Gender <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Select
                          name="gender"
                          value={formData.gender}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Select Gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>
                          Are you a Hosteller?{" "}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Select
                          name="hosteller"
                          value={formData.hosteller}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Select Option</option>
                          <option value="yes">Yes</option>
                          <option value="no">No</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>HackerRank Profile</Form.Label>
                        <Form.Control
                          type="text"
                          name="hackerrank"
                          value={formData.hackerrank}
                          onChange={handleChange}
                          placeholder="Your HackerRank username"
                        />
                        <Form.Text className="text-muted">
                          Optional field
                        </Form.Text>
                      </Form.Group>
                    </Col>
                  </Row>

                  <div className="recaptcha-container mb-4">
                    <ReCAPTCHA
                      sitekey={RECAPTCHA_SITE_KEY}
                      onChange={handleRecaptchaChange}
                    />
                  </div>

                  <Button
                    variant="primary"
                    type="submit"
                    className="submit-btn"
                    disabled={isLoading}
                  >
                    {isLoading ? "Submitting..." : "Submit Registration"}
                  </Button>
                </Form>
              </>
            )}
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default Register;
