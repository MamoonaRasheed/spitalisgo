"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from '@/utils/axios';
export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [form, setForm] = useState({
    email: "",
    name: "",
    password: "",
    password_confirmation: "",
    newsletter: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Directly pass the form data to the axios.post method
      const response = await axios.post("/register", form, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Axios will throw an error for non-2xx status codes, so no need for checking `response.ok`
      if (response.status === 200) {
        setSuccess("Registration successful!");
        setForm({
          email: "",
          name: "",
          password: "",
          password_confirmation: "",
          newsletter: false,
        });
        router.push("/signin");
      } else {
        // Handle any non-success status if needed
        throw new Error("Registration failed.");
      }
    } catch (err: unknown) {
      // Handle errors based on the type of the error
      if (err instanceof Error) {
        setError(err.message || "Something went wrong, please try again.");
      } else {
        setError("Something went wrong, please try again.");
      }
    } finally {
      setLoading(false);
    }


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
            <div className="auth-fields">
              <form >
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
                  <label htmlFor="name">User Name</label>
                  <div className="input-field-align">
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={form.name}
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
                        // Eye open SVG
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      ) : (
                        // Eye closed SVG
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.964 9.964 0 012.254-3.592m3.791-2.404A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.542 7a9.958 9.958 0 01-4.126 5.184M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3l18 18" />
                        </svg>
                      )}
                    </div>
                  </div>
                </div>

                <div className="auth-fields">
                  <label htmlFor="password_confirmation">Confirm Password</label>
                  <div className="input-field-align">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="password_confirmation"
                      id="password_confirmation"
                      placeholder="Confirm password"
                      value={form.password_confirmation}
                      onChange={handleChange}
                    />
                    <div className="icon-eye" onClick={toggleConfirmPasswordVisibility} style={{ cursor: "pointer" }}>
                      {showConfirmPassword ? (
                        // Eye open SVG
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      ) : (
                        // Eye closed SVG
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.964 9.964 0 012.254-3.592m3.791-2.404A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.542 7a9.958 9.958 0 01-4.126 5.184M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3l18 18" />
                        </svg>
                      )}
                    </div>
                  </div>
                </div>





                {error && <p className="error-message">{error}</p>}
                {success && <p className="success-message">{success}</p>}


              </form>
              <div className="submit-btn register-btn-submit" onClick={handleSubmit}>
                <button type="submit" disabled={loading}>
                  {loading ? "Registering..." : "Register"}
                </button>
              </div>

              <div className="already-account">
                <p>Or</p>
                <p>If you already have an account,</p>
              </div>

              <div className="register-btn">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => router.push("/signin")}
                >
                  Login
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
