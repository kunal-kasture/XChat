import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
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
      const response = await login(
        formData.email.trim().toLowerCase(),
        formData.password
      );

      if (response && response.success) {
        navigate("/");
      }
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Login failed. Please check your credentials.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-container" id="login-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-icon">
            <i className="bi bi-chat-dots-fill"></i>
          </div>
          <h2>Welcome Back</h2>
          <p>Sign in to continue to ChatApp</p>
        </div>

        {error && (
          <div className="auth-error" id="login-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form" noValidate={false}>
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
            <label htmlFor="password-input">Password</label>
            <div className="input-with-icon">
              <i className="bi bi-lock"></i>
              <input
                id="password-input"
                name="password"
                type="password"
                required
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <button
            id="login-button"
            type="submit"
            className="auth-button"
            disabled={submitting}
          >
            {submitting ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="auth-footer">
          <span>Don't have an account? </span>
          <Link to="/register">Sign up</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
