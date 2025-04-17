"use client";

import React, { useState } from "react";

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    email: "",
    username: "",
    password: "",
    languages: "",
    level: "",
    newsletter: false,
  });

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(form);
    // Submit logic here
  };

  return (
    <section id="auth-main" className="register-auth">
      <div className="container">
        <div className="main-align-register">
          <div className="auth-text register-text">
            <h2>Registration</h2>
            <p>Register to continue and save your results.</p>
          </div>
          <div className="auth-align">
            <form onSubmit={handleSubmit}>
              <div className="auth-fields">
                <label htmlFor="email">E-mail address</label>
                <div className="input-field-align">
                  <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="example@example.com"
                    value={form.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="auth-fields">
                <label htmlFor="username">User Name</label>
                <div className="input-field-align">
                  <input
                    type="text"
                    name="username"
                    id="username"
                    value={form.username}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="auth-fields">
                <label htmlFor="password">Password</label>
                <div className="input-field-align">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    id="password"
                    placeholder="Enter password"
                    value={form.password}
                    onChange={handleChange}
                  />
                  <div className="icon-eye" onClick={togglePasswordVisibility} style={{ cursor: "pointer" }}>
                    {showPassword ? (
                      <span>🙈</span>
                    ) : (
                      <span>👁️</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="auth-fields">
                <label htmlFor="languages">What languages do you know?</label>
                <div className="input-field-align">
                  <input
                    type="text"
                    name="languages"
                    id="languages"
                    value={form.languages}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="auth-fields">
                <label htmlFor="level">Your level:</label>
                <div className="input-field-align">
                  <input
                    type="text"
                    name="level"
                    id="level"
                    value={form.level}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="checkbox-register">
                <input
                  type="checkbox"
                  name="newsletter"
                  id="newsletter"
                  checked={form.newsletter}
                  onChange={handleChange}
                />
                <label htmlFor="newsletter">
                  I would like to receive a newsletter with new exercises, products and other offers.
                </label>
              </div>

              <div className="submit-btn">
                <button type="submit">Register</button>
              </div>
            </form>

            <div className="agreement-text">
              <p>
                By registering, you accept our <a href="#">Terms and Conditions</a>
              </p>
              <p>
                Information on data protection can be found in our{" "}
                <a href="#">Privacy Policy</a>
              </p>
            </div>

            <div className="already-account">
              <p>Or</p>
              <p>If you already have an account,</p>
            </div>
            <div className="register-btn">
              <button type="button" className="btn btn-outline">
                Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
