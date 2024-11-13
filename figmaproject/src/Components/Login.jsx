import React, { useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleLogin = () => {
    setError(""); // Reset error message
    if (!email || !password) {
      setError("Please fill in both email and password.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // Mock login success
      alert("Logged in successfully!");
      // After successful login, navigate to the Products page
      navigate("/products");
    }, 1500);
  };

  return (
    <div className="container">
      <div className="login-box">
        <h1>Login Form</h1>
        <div className="inputs-field">
          <input
            type="text"
            placeholder="Email id"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="password-field">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="show-password-btn"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && <p className="error-message">{error}</p>}

        {/* Button with Loading State */}
        <div className="button-field">
          <button onClick={handleLogin} disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
