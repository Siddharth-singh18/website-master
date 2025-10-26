import React, { useState, useRef } from "react";
import axios from "axios";
import styles from "./RegisterationForm.module.css";
import ReCAPTCHA from "react-google-recaptcha";

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    teamName: "",
    fullName1: "",
    emailId1: "",
    phoneNumber1: "",
    hackerrankProfile1: "",
    branch1: "",
    year1: "",

    gender1: "",
    hosteller1: "",
    studentNumber1: "",
    rollNumber1: "",
    fullName2: "",
    emailId2: "",
    phoneNumber2: "",
    hackerrankProfile2: "",
    branch2: "",
    year2: "",
    gender2: "",
    hosteller2: "",
    studentNumber2: "",
    rollNumber2: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [errors, setErrors] = useState({});
  const [captchaValue, setCaptchaValue] = useState(null);
  const recaptchaRef = useRef();

  const validateForm = () => {
    let tempErrors = {};
    let isValid = true;
    const {
      fullName1,
      emailId1,
      phoneNumber1,
      rollNumber1,
      branch1,
      year1,
      hackerrankProfile1,
      hosteller1,
      fullName2,
      emailId2,
      phoneNumber2,
      rollNumber2,
      branch2,
      year2,
      hackerrankProfile2,
      hosteller2,
    } = formData;

    if (!fullName1.trim() || !/^[a-zA-Z\s]+$/.test(fullName1)) {
      tempErrors.fullName1 = "Please enter Member 1's valid name.";
      isValid = false;
    }
    if (!emailId1.endsWith("@akgec.ac.in")) {
      tempErrors.emailId1 = "Member 1's Email must end with @akgec.ac.in";
      isValid = false;
    }
    if (!/^[6-9]\d{9}$/.test(phoneNumber1)) {
      tempErrors.phoneNumber1 =
        "Member 1's Phone must be a valid 10-digit number.";
      isValid = false;
    }
    if (!rollNumber1.trim()) {
      tempErrors.rollNumber1 = "Member 1's Roll No is required.";
      isValid = false;
    }
    if (!branch1) {
      tempErrors.branch1 = "Please select Member 1's Branch.";
      isValid = false;
    }
    if (!year1) {
      tempErrors.year1 = "Please select Member 1's year.";
      isValid = false;
    }
    if (!hackerrankProfile1.trim()) {
      tempErrors.hackerrankProfile1 = "Member 1's HackerRank ID is required.";
      isValid = false;
    }
    if (hosteller1 === "") {
      tempErrors.hosteller1 = "Please specify if Member 1 is a hosteller.";
      isValid = false;
    }

    if (!fullName2.trim() || !/^[a-zA-Z\s]+$/.test(fullName2)) {
      tempErrors.fullName2 = "Please enter Member 2's valid name.";
      isValid = false;
    }
    if (!emailId2.endsWith("@akgec.ac.in")) {
      tempErrors.emailId2 = "Member 2's Email must end with @akgec.ac.in";
      isValid = false;
    }
    if (!/^[6-9]\d{9}$/.test(phoneNumber2)) {
      tempErrors.phoneNumber2 =
        "Member 2's Phone must be a valid 10-digit number.";
      isValid = false;
    }
    if (!rollNumber2.trim()) {
      tempErrors.rollNumber2 = "Member 2's Roll No is required.";
      isValid = false;
    }
    if (!branch2) {
      tempErrors.branch2 = "Please select Member 2's Branch.";
      isValid = false;
    }
    if (!year2) {
      tempErrors.year2 = "Please select Member 2's year.";
      isValid = false;
    }
    if (!hackerrankProfile2.trim()) {
      tempErrors.hackerrankProfile2 = "Member 2's HackerRank ID is required.";
      isValid = false;
    }
    if (hosteller2 === "") {
      tempErrors.hosteller2 = "Please specify if Member 2 is a hosteller.";
      isValid = false;
    }

    if (emailId1 && emailId1 === emailId2) {
      tempErrors.emailId1 = "Emails must be different.";
      tempErrors.emailId2 = "Emails must be different.";
      isValid = false;
    }
    if (phoneNumber1 && phoneNumber1 === phoneNumber2) {
      tempErrors.phoneNumber1 = "Phone numbers must be different.";
      tempErrors.phoneNumber2 = "Phone numbers must be different.";
      isValid = false;
    }
    if (rollNumber1 && rollNumber1 === rollNumber2) {
      tempErrors.rollNumber1 = "Roll numbers must be different.";
      tempErrors.rollNumber2 = "Roll numbers must be different.";
      isValid = false;
    }

    if (!captchaValue) {
      tempErrors.captcha = "Please verify you are not a robot.";
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;
    if (name === "hosteller1" || name === "hosteller2") {
      processedValue = value === "yes" ? true : value === "no" ? false : "";
    }
    setFormData((prevState) => ({ ...prevState, [name]: processedValue }));
    if (errors[name]) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsError(false);
    if (!validateForm()) return;
    setLoading(true);
    setErrors({});
    const payload = { ...formData, recaptchaToken: captchaValue };
    try {
      const response = await axios.post(
        "https://api.programmingclub.live/api/registration/team",
        payload
      );
      console.log("Server response:", response.data);
      setLoading(false);
      setMessage("Registration successful! ✅");
      setIsError(false);
      setFormData({
        teamName: "",
        fullName1: "",
        emailId1: "",
        phoneNumber1: "",
        hackerrankProfile1: "",
        branch1: "",
        year1: "",
        /*section1 removed*/ gender1: "",
        hosteller1: "",
        studentNumber1: "",
        rollNumber1: "",
        fullName2: "",
        emailId2: "",
        phoneNumber2: "",
        hackerrankProfile2: "",
        branch2: "",
        year2: "",
        /*section2 removed*/ gender2: "",
        hosteller2: "",
        studentNumber2: "",
        rollNumber2: "",
      });
      recaptchaRef.current.reset();
      setCaptchaValue(null);
    } catch (error) {
      setLoading(false);
      const apiErrorMessage =
        error.response?.data?.message || "Please try again.";
      setMessage(`Registration failed. ${apiErrorMessage} ❌`);
      setIsError(true);
      console.error("API Error:", error.response?.data || error.message);
      recaptchaRef.current.reset();
      setCaptchaValue(null);
    }
  };

  return (
    <div className={styles.formContainer}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2>CODE++ Registration</h2>
        <p className={styles.description}>
          Organized by Programming Club, AKGEC
        </p>
        <div className={styles.formGrid}>
          <div className={styles.formGroup} style={{ gridColumn: "1 / -1" }}>
            <label htmlFor="teamName" className={styles.label}>
              Team Name:<span>*</span>
            </label>
            <input
              type="text"
              id="teamName"
              name="teamName"
              value={formData.teamName}
              onChange={handleChange}
              required
              className={styles.input}
            />
          </div>

          <h3 className={styles.gridHeading}>Member 1 Details</h3>
          <div className={styles.formGroup}>
            <label htmlFor="fullName1" className={styles.label}>
              Full Name (Member 1):<span>*</span>
            </label>
            <input
              type="text"
              id="fullName1"
              name="fullName1"
              value={formData.fullName1}
              onChange={handleChange}
              required
              className={styles.input}
            />
            {errors.fullName1 && (
              <p className={styles.errorText}>{errors.fullName1}</p>
            )}
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="emailId1" className={styles.label}>
              Email (Member 1):<span>*</span>
            </label>
            <input
              type="email"
              id="emailId1"
              name="emailId1"
              value={formData.emailId1}
              onChange={handleChange}
              required
              className={styles.input}
            />
            {errors.emailId1 && (
              <p className={styles.errorText}>{errors.emailId1}</p>
            )}
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="phoneNumber1" className={styles.label}>
              Phone Number (Member 1):<span>*</span>
            </label>
            <input
              type="tel"
              id="phoneNumber1"
              name="phoneNumber1"
              value={formData.phoneNumber1}
              onChange={handleChange}
              required
              className={styles.input}
            />
            {errors.phoneNumber1 && (
              <p className={styles.errorText}>{errors.phoneNumber1}</p>
            )}
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="rollNumber1" className={styles.label}>
              Roll Number (Member 1):<span>*</span>
            </label>
            <input
              type="text"
              id="rollNumber1"
              name="rollNumber1"
              value={formData.rollNumber1}
              onChange={handleChange}
              required
              className={styles.input}
            />
            {errors.rollNumber1 && (
              <p className={styles.errorText}>{errors.rollNumber1}</p>
            )}
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="branch1" className={styles.label}>
              Branch (Member 1):<span>*</span>
            </label>
            <select
              id="branch1"
              name="branch1"
              value={formData.branch1}
              onChange={handleChange}
              required
              className={styles.select}
            >
              <option value="">Select Branch</option>
              <option value="CSE">CSE</option>
              <option value="CS IT">CS & IT</option>
              <option value="CS">CS</option>
              <option value="IT">IT</option>
              <option value="CSE(AIML)">CSE (AIML)</option>
              <option value="AIML">AIML</option>
              <option value="CSE(DS)">CSE (DS)</option>
              <option value="CSE(Hindi)">CSE (Hindi)</option>
              <option value="ECE">ECE</option>
              <option value="EE">EE</option>
              <option value="ME">ME</option>
              <option value="CE">CE</option>
            </select>
            {errors.branch1 && (
              <p className={styles.errorText}>{errors.branch1}</p>
            )}
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="studentNumber1" className={styles.label}>
              Student Number (Member 1):<span>*</span>
            </label>
            <input
              type="text"
              id="studentNumber1"
              name="studentNumber1"
              value={formData.studentNumber1}
              onChange={handleChange}
              required
              className={styles.input}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="year1" className={styles.label}>
              Year (Member 1):<span>*</span>
            </label>
            <select
              id="year1"
              name="year1"
              value={formData.year1}
              onChange={handleChange}
              required
              className={styles.select}
            >
              <option value="">Select Year</option>
              <option value="2">2nd Year</option>
              <option value="3">3rd Year</option>
            </select>
            {errors.year1 && <p className={styles.errorText}>{errors.year1}</p>}
          </div>
          {/* Section 1 field removed */}
          <div className={styles.formGroup}>
            <label htmlFor="gender1" className={styles.label}>
              Gender (Member 1):<span>*</span>
            </label>
            <select
              id="gender1"
              name="gender1"
              value={formData.gender1}
              onChange={handleChange}
              required
              className={styles.select}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="hosteller1" className={styles.label}>
              Hosteller (Member 1):<span>*</span>
            </label>
            <select
              id="hosteller1"
              name="hosteller1"
              value={
                formData.hosteller1 === true
                  ? "yes"
                  : formData.hosteller1 === false
                  ? "no"
                  : ""
              }
              onChange={handleChange}
              required
              className={styles.select}
            >
              <option value="">Are you a hosteller?</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
            {errors.hosteller1 && (
              <p className={styles.errorText}>{errors.hosteller1}</p>
            )}
          </div>
          <div className={styles.formGroup} style={{ gridColumn: "1 / -1" }}>
            <label htmlFor="hackerrankProfile1" className={styles.label}>
              HackerRank ID (Member 1):<span>*</span>
            </label>
            <input
              type="text"
              id="hackerrankProfile1"
              name="hackerrankProfile1"
              value={formData.hackerrankProfile1}
              onChange={handleChange}
              required
              className={styles.input}
            />
            {errors.hackerrankProfile1 && (
              <p className={styles.errorText}>{errors.hackerrankProfile1}</p>
            )}
          </div>

          <h3 className={styles.gridHeading}>Member 2 Details</h3>
          <div className={styles.formGroup}>
            <label htmlFor="fullName2" className={styles.label}>
              Full Name (Member 2):<span>*</span>
            </label>
            <input
              type="text"
              id="fullName2"
              name="fullName2"
              value={formData.fullName2}
              onChange={handleChange}
              required
              className={styles.input}
            />
            {errors.fullName2 && (
              <p className={styles.errorText}>{errors.fullName2}</p>
            )}
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="emailId2" className={styles.label}>
              Email (Member 2):<span>*</span>
            </label>
            <input
              type="email"
              id="emailId2"
              name="emailId2"
              value={formData.emailId2}
              onChange={handleChange}
              required
              className={styles.input}
            />
            {errors.emailId2 && (
              <p className={styles.errorText}>{errors.emailId2}</p>
            )}
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="phoneNumber2" className={styles.label}>
              Phone Number (Member 2):<span>*</span>
            </label>
            <input
              type="tel"
              id="phoneNumber2"
              name="phoneNumber2"
              value={formData.phoneNumber2}
              onChange={handleChange}
              required
              className={styles.input}
            />
            {errors.phoneNumber2 && (
              <p className={styles.errorText}>{errors.phoneNumber2}</p>
            )}
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="rollNumber2" className={styles.label}>
              Roll Number (Member 2):<span>*</span>
            </label>
            <input
              type="text"
              id="rollNumber2"
              name="rollNumber2"
              value={formData.rollNumber2}
              onChange={handleChange}
              required
              className={styles.input}
            />
            {errors.rollNumber2 && (
              <p className={styles.errorText}>{errors.rollNumber2}</p>
            )}
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="branch2" className={styles.label}>
              Branch (Member 2):<span>*</span>
            </label>
            <select
              id="branch2"
              name="branch2"
              value={formData.branch2}
              onChange={handleChange}
              required
              className={styles.select}
            >
              <option value="">Select Branch</option>
              <option value="CSE">CSE</option>
              <option value="CS IT">CS & IT</option>
              <option value="CS">CS</option>
              <option value="IT">IT</option>
              <option value="CSE(AIML)">CSE (AIML)</option>
              <option value="AIML">AIML</option>
              <option value="CSE(DS)">CSE (DS)</option>
              <option value="CSE(Hindi)">CSE (Hindi)</option>
              <option value="ECE">ECE</option>
              <option value="EE">EE</option>
              <option value="ME">ME</option>
              <option value="CE">CE</option>
            </select>
            {errors.branch2 && (
              <p className={styles.errorText}>{errors.branch2}</p>
            )}
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="studentNumber2" className={styles.label}>
              Student Number (Member 2):<span>*</span>
            </label>
            <input
              type="text"
              id="studentNumber2"
              name="studentNumber2"
              value={formData.studentNumber2}
              onChange={handleChange}
              required
              className={styles.input}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="year2" className={styles.label}>
              Year (Member 2):<span>*</span>
            </label>
            <select
              id="year2"
              name="year2"
              value={formData.year2}
              onChange={handleChange}
              required
              className={styles.select}
            >
              <option value="">Select Year</option>
              <option value="2">2nd Year</option>
              <option value="3">3rd Year</option>
            </select>
            {errors.year2 && <p className={styles.errorText}>{errors.year2}</p>}
          </div>
          {/* Section 2 field removed */}
          <div className={styles.formGroup}>
            <label htmlFor="gender2" className={styles.label}>
              Gender (Member 2):<span>*</span>
            </label>
            <select
              id="gender2"
              name="gender2"
              value={formData.gender2}
              onChange={handleChange}
              required
              className={styles.select}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="hosteller2" className={styles.label}>
              Hosteller (Member 2):<span>*</span>
            </label>
            <select
              id="hosteller2"
              name="hosteller2"
              value={
                formData.hosteller2 === true
                  ? "yes"
                  : formData.hosteller2 === false
                  ? "no"
                  : ""
              }
              onChange={handleChange}
              required
              className={styles.select}
            >
              <option value="">Are you a hosteller?</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
            {errors.hosteller2 && (
              <p className={styles.errorText}>{errors.hosteller2}</p>
            )}
          </div>
          <div className={styles.formGroup} style={{ gridColumn: "1 / -1" }}>
            <label htmlFor="hackerrankProfile2" className={styles.label}>
              HackerRank ID (Member 2):<span>*</span>
            </label>
            <input
              type="text"
              id="hackerrankProfile2"
              name="hackerrankProfile2"
              value={formData.hackerrankProfile2}
              onChange={handleChange}
              required
              className={styles.input}
            />
            {errors.hackerrankProfile2 && (
              <p className={styles.errorText}>{errors.hackerrankProfile2}</p>
            )}
          </div>
        </div>

        <div
          className={styles.formGroup}
          style={{
            gridColumn: "1 / -1",
            marginBottom: "20px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div>
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey="6LcnA_grAAAAAKa9HEJZvW-7ie-Yl3Efitd2NCew"
              onChange={(value) => setCaptchaValue(value)}
              theme="dark"
            />
            {errors.captcha && (
              <p className={styles.errorText} style={{ textAlign: "center" }}>
                {errors.captcha}
              </p>
            )}
          </div>
        </div>

        <button type="submit" disabled={loading} className={styles.button}>
          {loading ? "Submitting..." : "Register"}
        </button>

        {message && (
          <p
            className={`${styles.message} ${
              isError ? styles.error : styles.success
            }`}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

export default RegistrationForm;
