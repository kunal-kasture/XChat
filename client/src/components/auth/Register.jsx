import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const response = await register({
        fullName: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        username: formData.username.trim().toLowerCase(),
        password: formData.password,
      });

      if (response && response.success) {
        navigate("/login");
      }
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Registration failed. Please try again.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-container" id="register-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-icon">
            <i className="bi bi-chat-dots-fill"></i>
          </div>
          <h2>Create Account</h2>
          <p>Join our community and start chatting</p>
        </div>

        {error && (
          <div className="auth-error" id="register-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form" noValidate={false}>
          <div className="form-group">
            <label htmlFor="fullname-input">Full Name</label>
            <div className="input-with-icon">
              <i className="bi bi-person"></i>
              <input
                id="fullname-input"
                name="fullName"
                type="text"
                required
                placeholder="Your full name"
                value={formData.fullName}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email-input">Email address</label>
            <div className="input-with-icon">
              <i className="bi bi-envelope"></i>
              <input
                id="email-input"
                name="email"
                type="email"
                required
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="username-input">Username</label>
            <div className="input-with-icon">
              <i className="bi bi-at"></i>
              <input
                id="username-input"
                name="username"
                type="text"
                required
                placeholder="Choose a username"
                value={formData.username}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password-input">Password</label>
            <div className="input-with-icon">
              <i className="bi bi-lock"></i>
              <input
                id="password-input"
                name="password"
                type="password"
                required
                placeholder="Choose a strong password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <button
            id="register-button"
            type="submit"
            className="auth-button"
            disabled={submitting}
          >
            {submitting ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div className="auth-footer">
          <span>Already have an account? </span>
          <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
